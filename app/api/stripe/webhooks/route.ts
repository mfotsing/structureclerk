import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/config';
import { prisma } from '@/lib/db/prisma';
import { PLAN_LIMITS } from '@/lib/stripe/config';

// Webhook secret from environment
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper function to handle subscription updates
async function handleSubscriptionUpdated(subscription: any) {
  try {
    const customerId = subscription.customer as string;
    const status = subscription.status;
    const priceId = subscription.items.data[0]?.price?.id;

    // Get user ID from subscription metadata
    const userId = subscription.metadata?.userId;
    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    // Determine plan based on price ID
    let planId = 'free';
    if (priceId) {
      if (priceId.includes('pro')) planId = 'pro';
      else if (priceId.includes('business')) planId = 'business';
      else if (priceId.includes('teams')) planId = 'teams';
    }

    // Update user plan in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: planId.toUpperCase() as any, // Convert to enum format
      },
    });

    // Update or create usage counters with new plan limits
    const currentMonth = new Date().toISOString().slice(0, 7);
    const planLimits = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS];

    await prisma.usageCounters.upsert({
      where: {
        userId: userId,
        month: currentMonth,
      },
      update: {
        plan: planId.toUpperCase() as any,
      },
      create: {
        userId: userId,
        month: currentMonth,
        plan: planId.toUpperCase() as any,
        docsCount: 0,
        audioMinutes: 0,
        storageBytes: BigInt(0),
        aiRequests: 0,
      },
    });

    // Log subscription update
    console.log(`Subscription updated: ${userId} -> ${planId} (${status})`);

  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

// Helper function to handle payment success
async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await handleSubscriptionUpdated(subscription);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

// Helper function to handle subscription cancellation
async function handleSubscriptionDeleted(subscription: any) {
  try {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    // Update user plan to free
    await prisma.user.update({
      where: { id: userId },
      data: { plan: 'FREE' },
    });

    // Update usage counters
    const currentMonth = new Date().toISOString().slice(0, 7);
    await prisma.usageCounters.upsert({
      where: {
        userId: userId,
        month: currentMonth,
      },
      update: { plan: 'FREE' },
      create: {
        userId: userId,
        month: currentMonth,
        plan: 'FREE',
        docsCount: 0,
        audioMinutes: 0,
        storageBytes: BigInt(0),
        aiRequests: 0,
      },
    });

    console.log(`Subscription deleted: ${userId} -> FREE`);

  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

// Main webhook handler
export async function POST(req: NextRequest) {
  try {
    // Get raw body and signature
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error('Missing stripe signature or webhook secret');
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    console.log(`Webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      // Subscription events
      case 'checkout.session.completed':
        const checkoutSession = event.data.object as any;
        console.log('Checkout session completed:', checkoutSession.id);
        // Additional processing if needed
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as any;
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as any;
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      // Invoice events
      case 'invoice.payment_succeeded':
        const paidInvoice = event.data.object as any;
        await handleInvoicePaymentSucceeded(paidInvoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as any;
        console.log('Invoice payment failed:', failedInvoice.id);
        // Handle failed payment (notify user, update account status)
        break;

      case 'invoice.finalized':
        const finalizedInvoice = event.data.object as any;
        console.log('Invoice finalized:', finalizedInvoice.id);
        // Handle invoice finalized (send notification)
        break;

      // Customer events
      case 'customer.created':
        const customer = event.data.object as any;
        console.log('Customer created:', customer.id);
        break;

      // Payment intent events
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as any;
        console.log('Payment intent succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as any;
        console.log('Payment intent failed:', failedPaymentIntent.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Health check for webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Stripe Webhook Handler',
    timestamp: new Date().toISOString(),
  });
}