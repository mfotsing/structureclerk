/**
 * API Route: POST /api/documents/[id]/summarize
 *
 * Génère un résumé intelligent d'un document (contrat, rapport, etc.)
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { summarizeContract } from '@/lib/ai/services'
import { logTokenUsage } from '@/lib/ai/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params
    const supabase = createRouteHandlerClient({ cookies })

    // Vérifier l'authentification
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 403 })
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

    // Récupérer le document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('organization_id', profile.organization_id)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    }

    // Vérifier qu'on a du contenu textuel
    if (!document.contenu_textuel) {
      return NextResponse.json(
        { error: 'Le document n\'a pas de contenu textuel extrait' },
        { status: 400 }
      )
    }

    // Vérifier si un résumé existe déjà
    const body = await request.json().catch(() => ({}))
    const forceRegenerate = body.force || false

    if (document.ai_summary && !forceRegenerate) {
      return NextResponse.json({
        success: true,
        cached: true,
        summary: {
          summary: document.ai_summary,
          parties: (document.ai_metadata as any)?.parties || [],
          duree: (document.ai_metadata as any)?.duree,
          montants: (document.ai_metadata as any)?.montants || [],
          clauses_risque: (document.ai_metadata as any)?.clauses_risque || [],
        },
      })
    }

    // Générer le résumé
    const startTime = Date.now()
    const result = await summarizeContract(document.contenu_textuel)
    const executionTime = Date.now() - startTime

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors de la génération du résumé' },
        { status: 500 }
      )
    }

    // Sauvegarder le résumé dans le document
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        ai_summary: result.data.summary,
        ai_metadata: {
          ...(document.ai_metadata as object),
          parties: result.data.parties,
          duree: result.data.duree,
          montants: result.data.montants,
          clauses_risque: result.data.clauses_risque,
        },
      })
      .eq('id', documentId)

    if (updateError) {
      console.error('Erreur mise à jour résumé:', updateError)
    }

    // Logger l'utilisation de l'IA
    if (result.tokensUsed) {
      await supabase.rpc('log_ai_usage', {
        p_organization_id: profile.organization_id,
        p_user_id: session.user.id,
        p_operation: 'summarization',
        p_tokens_input: Math.floor(result.tokensUsed * 0.7), // Estimation 70% input
        p_tokens_output: Math.floor(result.tokensUsed * 0.3), // Estimation 30% output
        p_cached: result.cached || false,
        p_execution_time_ms: executionTime,
      })
    }

    // Logger l'activité
    await supabase.from('activities').insert({
      organization_id: profile.organization_id,
      user_id: session.user.id,
      action: 'document_summarized',
      description: `Résumé généré pour "${document.name}"`,
      metadata: {
        document_id: documentId,
        tokens_used: result.tokensUsed,
      },
    })

    return NextResponse.json({
      success: true,
      cached: false,
      summary: result.data,
      tokens_used: result.tokensUsed,
      execution_time_ms: executionTime,
    })
  } catch (error: any) {
    console.error('Erreur génération résumé:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    )
  }
}
