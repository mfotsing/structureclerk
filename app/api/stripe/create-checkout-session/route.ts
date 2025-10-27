import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { getPriceId, getAddOnPriceId } from '@/lib/stripe/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, billingCycle = 'monthly', addOns = [], userId, userEmail } = body;

    // Validate required fields
    if (!planId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, userId, userEmail' },
        { status: 400 }
      );
    }

    // Free plan doesn't need checkout
    if (planId === 'free') {
      return NextResponse.json({
        success: true,
        url: '/app/billing?plan=free&success=true',
      });
    }

    // Get base price ID
    let lineItems = [];

    // Add main plan
    const priceId = getPriceId(planId, billingCycle);
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan or billing cycle' },
        { status: 400 }
      );
    }

    lineItems.push({
      price: priceId,
      quantity: 1,
    });

    // Add add-ons if provided
    for (const addOn of addOns) {
      const addOnPriceId = getAddOnPriceId(addOn.id);
      if (addOnPriceId) {
        lineItems.push({
          price: addOnPriceId,
          quantity: addOn.quantity || 1,
        });
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      billing_address_collection: 'required',
      line_items: lineItems,
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        planId,
        billingCycle,
        addOns: JSON.stringify(addOns),
      },
      automatic_tax: {
        enabled: true,
      },
      tax_id_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      payment_method_types: ['card'],
      locale: 'en', // Could be dynamic based on user preference
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}