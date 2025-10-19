/**
 * API Route: POST /api/export
 *
 * Exporte toutes les données de l'utilisateur au format ZIP (RGPD compliant)
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import archiver from 'archiver'
import { Readable } from 'stream'

interface ExportRequestBody {
  export_type?: 'full_backup' | 'documents_only' | 'invoices_only' | 'data_only'
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
      .select('*, organizations(*)')
      .eq('id', session.user.id)
      .single()

    if (!profile || !profile.organization_id) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 403 })
    }

    // Parser le body
    const body: ExportRequestBody = await request.json().catch(() => ({}))
    const exportType = body.export_type || 'full_backup'

    // Créer un job d'export
    const { data: exportJob, error: jobError } = await supabase
      .from('export_jobs')
      .insert({
        organization_id: profile.organization_id,
        user_id: session.user.id,
        export_type: exportType,
        status: 'processing',
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (jobError || !exportJob) {
      console.error('Erreur création export_job:', jobError)
      return NextResponse.json(
        { error: 'Erreur lors de la création du job d\'export' },
        { status: 500 }
      )
    }

    // Récupérer toutes les données selon le type d'export
    const exportData: any = {
      organization: profile.organizations,
      profile: {
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        created_at: profile.created_at,
      },
      exported_at: new Date().toISOString(),
    }

    if (exportType === 'full_backup' || exportType === 'data_only') {
      // Clients
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', profile.organization_id)

      exportData.clients = clients || []

      // Projets
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', profile.organization_id)

      exportData.projects = projects || []

      // Factures
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*, invoice_items(*)')
        .eq('organization_id', profile.organization_id)

      exportData.invoices = invoices || []

      // Devis
      const { data: quotes } = await supabase
        .from('quotes')
        .select('*, quote_items(*)')
        .eq('organization_id', profile.organization_id)

      exportData.quotes = quotes || []
    }

    if (exportType === 'full_backup' || exportType === 'invoices_only') {
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*, invoice_items(*)')
        .eq('organization_id', profile.organization_id)

      exportData.invoices = invoices || []
    }

    if (exportType === 'full_backup' || exportType === 'documents_only') {
      // Liste des documents
      const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('organization_id', profile.organization_id)

      exportData.documents_metadata = documents || []
    }

    // Créer un fichier JSON avec toutes les données
    const jsonData = JSON.stringify(exportData, null, 2)
    const jsonFileName = `structureclerk-export-${Date.now()}.json`

    // Uploader le JSON
    const storagePath = `exports/${profile.organization_id}/${jsonFileName}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, jsonData, {
        contentType: 'application/json',
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Erreur upload export:', uploadError)
      await supabase
        .from('export_jobs')
        .update({
          status: 'failed',
          error_message: `Erreur d'upload: ${uploadError.message}`,
        })
        .eq('id', exportJob.id)

      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'export' },
        { status: 500 }
      )
    }

    // Générer une URL signée temporaire (valide 24h)
    const { data: signedUrl } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 86400) // 24 heures

    if (!signedUrl) {
      return NextResponse.json(
        { error: 'Erreur lors de la génération de l\'URL de téléchargement' },
        { status: 500 }
      )
    }

    // Mettre à jour le job
    const expiresAt = new Date(Date.now() + 86400 * 1000).toISOString()

    await supabase
      .from('export_jobs')
      .update({
        status: 'completed',
        file_path: storagePath,
        file_size: Buffer.byteLength(jsonData, 'utf-8'),
        download_url: signedUrl.signedUrl,
        expires_at: expiresAt,
        completed_at: new Date().toISOString(),
        metadata: {
          export_type: exportType,
          total_clients: exportData.clients?.length || 0,
          total_projects: exportData.projects?.length || 0,
          total_invoices: exportData.invoices?.length || 0,
          total_quotes: exportData.quotes?.length || 0,
          total_documents: exportData.documents_metadata?.length || 0,
        },
      })
      .eq('id', exportJob.id)

    // Logger l'activité
    await supabase.from('activities').insert({
      organization_id: profile.organization_id,
      user_id: session.user.id,
      action: 'data_exported',
      description: `Export de données (${exportType}) créé`,
      metadata: {
        export_job_id: exportJob.id,
        export_type: exportType,
      },
    })

    return NextResponse.json({
      success: true,
      export_job_id: exportJob.id,
      download_url: signedUrl.signedUrl,
      expires_at: expiresAt,
      file_size: Buffer.byteLength(jsonData, 'utf-8'),
      export_type: exportType,
      stats: {
        clients: exportData.clients?.length || 0,
        projects: exportData.projects?.length || 0,
        invoices: exportData.invoices?.length || 0,
        quotes: exportData.quotes?.length || 0,
        documents: exportData.documents_metadata?.length || 0,
      },
    })
  } catch (error: any) {
    console.error('Erreur export données:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/export?job_id=xxx
 *
 * Récupère le statut d'un job d'export
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
      .from('export_jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', session.user.id)
      .single()

    if (error || !job) {
      return NextResponse.json({ error: 'Job non trouvé' }, { status: 404 })
    }

    // Vérifier si l'URL n'a pas expiré
    const isExpired = job.expires_at ? new Date(job.expires_at) < new Date() : false

    return NextResponse.json({
      job_id: job.id,
      status: isExpired ? 'expired' : job.status,
      export_type: job.export_type,
      download_url: !isExpired ? job.download_url : null,
      expires_at: job.expires_at,
      file_size: job.file_size,
      metadata: job.metadata,
      created_at: job.created_at,
      completed_at: job.completed_at,
    })
  } catch (error: any) {
    console.error('Erreur récupération job export:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
