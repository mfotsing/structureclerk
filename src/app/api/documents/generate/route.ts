/**
 * API Route: POST /api/documents/generate
 *
 * Génère un document (contrat, facture, devis) à partir d'un template et de données
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { generateDocument } from '@/lib/ai/services'

interface GenerateDocumentRequestBody {
  template_type: 'contrat' | 'facture' | 'devis'
  data: Record<string, any>
  save_to_storage?: boolean // Sauvegarder en tant que document
  project_id?: string
  client_id?: string
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

    // Parser le body
    const body: GenerateDocumentRequestBody = await request.json()

    if (!body.template_type || !body.data) {
      return NextResponse.json(
        { error: 'template_type et data requis' },
        { status: 400 }
      )
    }

    const validTemplates = ['contrat', 'facture', 'devis']
    if (!validTemplates.includes(body.template_type)) {
      return NextResponse.json(
        { error: `template_type doit être: ${validTemplates.join(', ')}` },
        { status: 400 }
      )
    }

    // Générer le document
    const startTime = Date.now()
    const result = await generateDocument(body.template_type, body.data)
    const executionTime = Date.now() - startTime

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors de la génération du document' },
        { status: 500 }
      )
    }

    let documentId: string | null = null

    // Sauvegarder en tant que document si demandé
    if (body.save_to_storage) {
      const fileName = `${body.template_type}-${Date.now()}.txt`
      const storagePath = `${profile.organization_id}/generated/${fileName}`

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, result.data, {
          contentType: 'text/plain',
          cacheControl: '3600',
        })

      if (uploadError) {
        console.error('Erreur upload document généré:', uploadError)
      } else {
        // Créer l'entrée dans la table documents
        const { data: doc } = await supabase
          .from('documents')
          .insert({
            organization_id: profile.organization_id,
            project_id: body.project_id || null,
            client_id: body.client_id || null,
            name: fileName,
            file_path: storagePath,
            file_size: Buffer.byteLength(result.data, 'utf-8'),
            mime_type: 'text/plain',
            category: body.template_type,
            type_detecte: body.template_type,
            contenu_textuel: result.data,
            ai_metadata: {
              generated: true,
              template_type: body.template_type,
              input_data: body.data,
            },
            processing_status: 'completed',
            processed_at: new Date().toISOString(),
            uploaded_by: session.user.id,
          })
          .select('id')
          .single()

        if (doc) {
          documentId = doc.id
        }
      }
    }

    // Logger l'utilisation de l'IA
    if (result.tokensUsed) {
      await supabase.rpc('log_ai_usage', {
        p_organization_id: profile.organization_id,
        p_user_id: session.user.id,
        p_operation: 'document_generation',
        p_tokens_input: Math.floor(result.tokensUsed * 0.3),
        p_tokens_output: Math.floor(result.tokensUsed * 0.7),
        p_cached: result.cached || false,
        p_execution_time_ms: executionTime,
      })
    }

    // Logger l'activité
    await supabase.from('activities').insert({
      organization_id: profile.organization_id,
      project_id: body.project_id,
      user_id: session.user.id,
      action: 'document_generated',
      description: `Document ${body.template_type} généré par l'IA`,
      metadata: {
        template_type: body.template_type,
        document_id: documentId,
        tokens_used: result.tokensUsed,
      },
    })

    return NextResponse.json({
      success: true,
      document_id: documentId,
      content: result.data,
      template_type: body.template_type,
      tokens_used: result.tokensUsed,
      execution_time_ms: executionTime,
    })
  } catch (error: any) {
    console.error('Erreur génération document:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    )
  }
}
