/**
 * API Route: POST /api/upload
 *
 * Upload universel de documents avec traitement IA asynchrone
 * Accepte: PDF, DOCX, images (PNG, JPG), texte
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { processDocument } from '@/lib/ai/document-processor'
import { intelligentExtraction } from '@/lib/ai/services'
import { logTokenUsage } from '@/lib/ai/client'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

/**
 * POST /api/upload
 *
 * Body: multipart/form-data avec:
 * - file: Le fichier à uploader
 * - project_id (optionnel): Associer à un projet
 * - client_id (optionnel): Associer à un client
 */
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

    // Récupérer le profil utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, organizations(id, name)')
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

    // Parser le FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const projectId = formData.get('project_id') as string | null
    const clientId = formData.get('client_id') as string | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Fichier trop volumineux. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Vérifier le type MIME
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'text/plain',
    ]

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Type de fichier non supporté: ${file.type}` },
        { status: 400 }
      )
    }

    // Créer un job d'upload pour suivi
    const { data: uploadJob, error: jobError } = await supabase
      .from('upload_jobs')
      .insert({
        organization_id: profile.organization_id,
        user_id: session.user.id,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        status: 'processing',
        stage: 'upload',
        progress: 10,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (jobError || !uploadJob) {
      console.error('Erreur création upload_job:', jobError)
      return NextResponse.json({ error: 'Erreur lors de la création du job' }, { status: 500 })
    }

    // Convertir le fichier en buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload vers Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const storagePath = `${profile.organization_id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Erreur upload Supabase Storage:', uploadError)
      await supabase
        .from('upload_jobs')
        .update({
          status: 'failed',
          error_message: `Erreur d'upload: ${uploadError.message}`,
        })
        .eq('id', uploadJob.id)

      return NextResponse.json({ error: 'Erreur lors de l\'upload du fichier' }, { status: 500 })
    }

    // Mettre à jour le progrès
    await supabase
      .from('upload_jobs')
      .update({ stage: 'extraction', progress: 30 })
      .eq('id', uploadJob.id)

    // ÉTAPE 1: Extraction du texte
    let processedDoc
    try {
      processedDoc = await processDocument(buffer, file.type)
    } catch (error: any) {
      console.error('Erreur extraction texte:', error)
      await supabase
        .from('upload_jobs')
        .update({
          status: 'failed',
          error_message: `Erreur d'extraction: ${error.message}`,
        })
        .eq('id', uploadJob.id)

      return NextResponse.json({ error: 'Erreur lors de l\'extraction du texte' }, { status: 500 })
    }

    // Mettre à jour le progrès
    await supabase
      .from('upload_jobs')
      .update({ stage: 'classification', progress: 50 })
      .eq('id', uploadJob.id)

    // ÉTAPE 2: Analyse IA (classification + extraction + résumé)
    let aiResult
    try {
      aiResult = await intelligentExtraction(processedDoc.text)
    } catch (error: any) {
      console.error('Erreur analyse IA:', error)
      // On continue même si l'IA échoue - on aura quand même le texte extrait
      aiResult = {
        classification: null,
        extraction: null,
        summary: null,
      }
    }

    // Mettre à jour le progrès
    await supabase
      .from('upload_jobs')
      .update({ stage: 'analysis', progress: 70 })
      .eq('id', uploadJob.id)

    // ÉTAPE 3: Créer le document dans la DB
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        organization_id: profile.organization_id,
        project_id: projectId,
        client_id: clientId,
        name: file.name,
        file_path: storagePath,
        file_size: file.size,
        mime_type: file.type,
        category: aiResult.classification?.type_document || 'autre',
        type_detecte: aiResult.classification?.type_document || null,
        contenu_textuel: processedDoc.text,
        ai_summary: aiResult.summary?.summary || null,
        ai_metadata: aiResult.extraction?.fields || {},
        ai_confidence: aiResult.classification?.confidence || null,
        processing_status: 'completed',
        processed_at: new Date().toISOString(),
        uploaded_by: session.user.id,
      })
      .select()
      .single()

    if (docError || !document) {
      console.error('Erreur création document:', docError)
      await supabase
        .from('upload_jobs')
        .update({
          status: 'failed',
          error_message: `Erreur de création du document: ${docError?.message}`,
        })
        .eq('id', uploadJob.id)

      return NextResponse.json({ error: 'Erreur lors de la création du document' }, { status: 500 })
    }

    // ÉTAPE 4: Associer automatiquement si nécessaire
    // Si c'est une facture et qu'on a détecté un client/projet, on peut créer l'association
    if (
      aiResult.classification?.type_document === 'facture' &&
      aiResult.extraction?.fields &&
      !clientId &&
      !projectId
    ) {
      // TODO: Logique pour matcher automatiquement un client existant ou en créer un nouveau
      // Basé sur le nom du fournisseur/client extrait
    }

    // Mettre à jour le job comme complété
    await supabase
      .from('upload_jobs')
      .update({
        document_id: document.id,
        status: 'completed',
        stage: 'completed',
        progress: 100,
        completed_at: new Date().toISOString(),
        metadata: {
          classification: aiResult.classification,
          word_count: processedDoc.wordCount,
          format: processedDoc.format,
        },
      })
      .eq('id', uploadJob.id)

    // Logger l'activité
    await supabase.from('activities').insert({
      organization_id: profile.organization_id,
      project_id: projectId,
      user_id: session.user.id,
      action: 'document_uploaded',
      description: `Document "${file.name}" uploadé et analysé par l'IA`,
      metadata: {
        document_id: document.id,
        type_detecte: aiResult.classification?.type_document,
        confidence: aiResult.classification?.confidence,
      },
    })

    // Retourner les résultats
    return NextResponse.json(
      {
        success: true,
        job_id: uploadJob.id,
        document: {
          id: document.id,
          name: document.name,
          type_detecte: document.type_detecte,
          ai_confidence: document.ai_confidence,
          ai_summary: document.ai_summary,
          ai_metadata: document.ai_metadata,
        },
        analysis: {
          classification: aiResult.classification,
          extraction: aiResult.extraction,
          summary: aiResult.summary,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Erreur globale upload:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'upload', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/upload?job_id=xxx
 *
 * Récupère le statut d'un job d'upload
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const jobId = searchParams.get('job_id')

    if (!jobId) {
      return NextResponse.json({ error: 'job_id manquant' }, { status: 400 })
    }

    const { data: job, error } = await supabase
      .from('upload_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error || !job) {
      return NextResponse.json({ error: 'Job non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      job_id: job.id,
      status: job.status,
      stage: job.stage,
      progress: job.progress,
      error_message: job.error_message,
      document_id: job.document_id,
      created_at: job.created_at,
      completed_at: job.completed_at,
    })
  } catch (error: any) {
    console.error('Erreur récupération job:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
