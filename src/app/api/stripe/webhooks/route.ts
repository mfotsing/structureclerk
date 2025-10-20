import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const supabase = await createClient()

  // Log event
  await supabase.from('stripe_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
    event_data: event.data as any,
  })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session, supabase)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription, supabase)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription, supabase)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice, supabase)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice, supabase)
        break
      }
    }

    // Mark event as processed
    await supabase
      .from('stripe_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('stripe_event_id', event.id)

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)

    // Log error
    await supabase
      .from('stripe_events')
      .update({
        processed: false,
        error_message: error.message,
      })
      .eq('stripe_event_id', event.id)

    return new Response('Webhook processing failed', { status: 500 })
  }
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  const organizationId = session.metadata?.organization_id
  const planId = session.metadata?.plan_id

  if (!organizationId) return

  // Update subscription
  await supabase.from('subscriptions').upsert({
    organization_id: organizationId,
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: session.subscription as string,
    status: 'active',
    plan_name: planId || 'pro',
    current_period_start: new Date(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  })

  // Update profile
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_started_at: new Date().toISOString(),
    })
    .eq('organization_id', organizationId)

  // Log activity
  await supabase.from('activities').insert({
    organization_id: organizationId,
    action: 'subscription_started',
    description: 'Abonnement activé avec succès',
    metadata: { session_id: session.id },
  })
}

async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  supabase: any
) {
  const organizationId = subscription.metadata?.organization_id

  if (!organizationId) {
    // Find org by stripe subscription ID
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('organization_id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (!sub) return
  }

  const orgId = organizationId || (await supabase
    .from('subscriptions')
    .select('organization_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()).data?.organization_id

  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date((subscription as any).current_period_start * 1000),
      current_period_end: new Date((subscription as any).current_period_end * 1000),
      cancel_at_period_end: (subscription as any).cancel_at_period_end || false,
      cancel_at: (subscription as any).cancel_at
        ? new Date((subscription as any).cancel_at * 1000)
        : null,
    })
    .eq('stripe_subscription_id', subscription.id)

  // Update profile status
  const profileStatus =
    subscription.status === 'active' || subscription.status === 'trialing'
      ? 'active'
      : 'expired'

  await supabase
    .from('profiles')
    .update({ subscription_status: profileStatus })
    .eq('organization_id', orgId)
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any
) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('organization_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (!sub) return

  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date(),
    })
    .eq('stripe_subscription_id', subscription.id)

  await supabase
    .from('profiles')
    .update({ subscription_status: 'expired' })
    .eq('organization_id', sub.organization_id)

  await supabase.from('activities').insert({
    organization_id: sub.organization_id,
    action: 'subscription_canceled',
    description: 'Abonnement annulé',
    metadata: { subscription_id: subscription.id },
  })
}

async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: any
) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('organization_id')
    .eq('stripe_subscription_id', (invoice as any).subscription)
    .single()

  if (!sub) return

  await supabase.from('activities').insert({
    organization_id: sub.organization_id,
    action: 'payment_succeeded',
    description: `Paiement reçu: ${((invoice as any).amount_paid / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`,
    metadata: {
      invoice_id: invoice.id,
      amount: (invoice as any).amount_paid / 100,
      currency: invoice.currency,
    },
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('organization_id')
    .eq('stripe_subscription_id', (invoice as any).subscription)
    .single()

  if (!sub) return

  await supabase.from('activities').insert({
    organization_id: sub.organization_id,
    action: 'payment_failed',
    description: `Échec du paiement: ${((invoice as any).amount_due / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`,
    metadata: {
      invoice_id: invoice.id,
      amount: (invoice as any).amount_due / 100,
      currency: invoice.currency,
      error: invoice.last_finalization_error?.message,
    },
  })
}
