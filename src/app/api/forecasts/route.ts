import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateFinancialForecast } from '@/lib/ai/financial-forecasting'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id, subscription_status')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'Organisation introuvable' }, { status: 404 })
    }

    // Check subscription (forecasts require paid plan)
    if (profile.subscription_status !== 'active') {
      return NextResponse.json(
        {
          error: 'Cette fonctionnalité nécessite un abonnement Pro ou Enterprise',
          upgrade_required: true
        },
        { status: 403 }
      )
    }

    // Generate forecast
    const forecast = await generateFinancialForecast(profile.organization_id)

    return NextResponse.json({
      success: true,
      forecast,
      generated_at: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Forecasts API error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération des prévisions' },
      { status: 500 }
    )
  }
}
