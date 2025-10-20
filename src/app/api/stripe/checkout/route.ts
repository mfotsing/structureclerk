import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { PLANS } from '@/lib/stripe/plans'

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json()

    if (!planId || !PLANS[planId]) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    const plan = PLANS[planId]

    if (!plan.stripe_price_id) {
      return NextResponse.json(
        { error: 'Plan non disponible pour achat' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get profile and organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id, email')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json(
        { error: 'Organisation introuvable' },
        { status: 404 }
      )
    }

    // Check if already has subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('organization_id', profile.organization_id)
      .single()

    let customerId = existingSub?.stripe_customer_id

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || profile.email,
        metadata: {
          organization_id: profile.organization_id,
          user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID
      await supabase
        .from('subscriptions')
        .upsert({
          organization_id: profile.organization_id,
          stripe_customer_id: customerId,
          plan_name: 'free',
          status: 'incomplete',
        })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/plans`,
      metadata: {
        organization_id: profile.organization_id,
        user_id: user.id,
        plan_id: planId,
      },
      subscription_data: {
        metadata: {
          organization_id: profile.organization_id,
          plan_id: planId,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    )
  }
}
