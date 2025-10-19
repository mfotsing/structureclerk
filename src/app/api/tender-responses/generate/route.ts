/**
 * API Route: POST /api/tender-responses/generate
 *
 * Génère une réponse professionnelle à un appel d'offres
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { generateTenderResponse } from '@/lib/ai/services'

interface GenerateTenderRequestBody {
  document_id: string // ID du document de l'appel d'offres
  project_id?: string // Projet associé (optionnel)
  company_profile?: {
    name?: string
    specialties?: string[]
    experience_years?: number
    recent_projects?: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Vérifier l'authentification
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil et l'organisation
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, organizations(*)')
      .eq('id', session.user.id)
      .single()

    if (!profile || !profile.organization_id) {
      return NextResponse.json({ error: 'Profil ou organisation non trouvé' }, { status: 403 })
    }

    // Vérifier l'abonnement
    const { data: isActive } = await supabase.rpc('is_subscription_active', {
      user_uuid: session.user.id,
    })

    if (!isActive) {
      return NextResponse.json(
        { error: 'Abonnement expiré. Veuillez renouveler votre abonnement.' },
        { status: 402 }
      )
    }

    // Parser le body
    const body: GenerateTenderRequestBody = await request.json()

    if (!body.document_id) {
      return NextResponse.json({ error: 'document_id requis' }, { status: 400 })
    }

    // Récupérer le document de l'appel d'offres
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', body.document_id)
      .eq('organization_id', profile.organization_id)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    }

    if (!document.contenu_textuel) {
      return NextResponse.json(
        { error: 'Le document n\'a pas de contenu textuel extrait' },
        { status: 400 }
      )
    }

    // Construire le profil de l'entreprise
    const org = profile.organizations as any
    const companyProfile = {
      name: body.company_profile?.name || org?.name || 'Notre entreprise',
      specialties: body.company_profile?.specialties || [
        'Construction résidentielle',
        'Construction commerciale',
        'Rénovation',
      ],
      experience_years: body.company_profile?.experience_years || 10,
      recent_projects: body.company_profile?.recent_projects || [],
    }

    // Générer la réponse
    const startTime = Date.now()
    const result = await generateTenderResponse(document.contenu_textuel, companyProfile)
    const executionTime = Date.now() - startTime

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors de la génération de la réponse' },
        { status: 500 }
      )
    }

    // Créer l'enregistrement de la réponse
    const { data: tenderResponse, error: createError } = await supabase
      .from('tender_responses')
      .insert({
        organization_id: profile.organization_id,
        project_id: body.project_id || null,
        source_document_id: document.id,
        title: `Réponse - ${document.name}`,
        tender_reference: (document.ai_metadata as any)?.reference || null,
        status: 'draft',
        generated_content: result.data,
        company_profile: companyProfile,
        ai_metadata: {
          tokens_used: result.tokensUsed,
          execution_time_ms: executionTime,
          model: 'claude-3-5-sonnet-20241022',
        },
        created_by: session.user.id,
      })
      .select()
      .single()

    if (createError || !tenderResponse) {
      console.error('Erreur création tender_response:', createError)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la réponse' },
        { status: 500 }
      )
    }

    // Logger l'utilisation de l'IA
    if (result.tokensUsed) {
      await supabase.rpc('log_ai_usage', {
        p_organization_id: profile.organization_id,
        p_user_id: session.user.id,
        p_operation: 'tender_response_generation',
        p_tokens_input: Math.floor(result.tokensUsed * 0.6),
        p_tokens_output: Math.floor(result.tokensUsed * 0.4),
        p_cached: result.cached || false,
        p_execution_time_ms: executionTime,
      })
    }

    // Logger l'activité
    await supabase.from('activities').insert({
      organization_id: profile.organization_id,
      project_id: body.project_id,
      user_id: session.user.id,
      action: 'tender_response_generated',
      description: `Réponse générée pour l'appel d'offres "${document.name}"`,
      metadata: {
        tender_response_id: tenderResponse.id,
        document_id: document.id,
        tokens_used: result.tokensUsed,
      },
    })

    return NextResponse.json({
      success: true,
      tender_response: {
        id: tenderResponse.id,
        title: tenderResponse.title,
        generated_content: tenderResponse.generated_content,
        status: tenderResponse.status,
      },
      tokens_used: result.tokensUsed,
      execution_time_ms: executionTime,
    })
  } catch (error: any) {
    console.error('Erreur génération réponse appel d\'offres:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    )
  }
}
