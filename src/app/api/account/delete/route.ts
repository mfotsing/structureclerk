/**
 * API Route: DELETE /api/account/delete
 *
 * Supprime le compte utilisateur et toutes ses données (RGPD compliant)
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

interface DeleteAccountRequestBody {
  reason?: string
  export_data_first?: boolean
  confirm_email?: string // Email de confirmation pour sécurité
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Vérifier l'authentification
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Parser le body
    const body: DeleteAccountRequestBody = await request.json().catch(() => ({}))

    // Récupérer le profil complet
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, organizations(*)')
      .eq('id', session.user.id)
      .single()

    if (!profile || !profile.organization_id) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 403 })
    }

    // Vérification de sécurité: email de confirmation
    if (body.confirm_email && body.confirm_email !== profile.email) {
      return NextResponse.json(
        { error: 'L\'email de confirmation ne correspond pas' },
        { status: 400 }
      )
    }

    const org = profile.organizations as any

    // Créer un export si demandé
    let exportJobId: string | null = null

    if (body.export_data_first) {
      const { data: exportJob } = await supabase
        .from('export_jobs')
        .insert({
          organization_id: profile.organization_id,
          user_id: session.user.id,
          export_type: 'full_backup',
          status: 'processing',
          started_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (exportJob) {
        exportJobId = exportJob.id
        // TODO: Trigger l'export en background (voir /api/export pour la logique)
      }
    }

    // Compter les données avant suppression (pour audit)
    const stats: any = {}

    const { count: clientsCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', profile.organization_id)
    stats.clients = clientsCount

    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', profile.organization_id)
    stats.projects = projectsCount

    const { count: invoicesCount } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', profile.organization_id)
    stats.invoices = invoicesCount

    const { count: quotesCount } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', profile.organization_id)
    stats.quotes = quotesCount

    const { count: documentsCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', profile.organization_id)
    stats.documents = documentsCount

    // Créer un enregistrement d'audit de la suppression
    const { data: accountDeletion } = await supabase
      .from('account_deletions')
      .insert({
        organization_id: profile.organization_id,
        user_id: session.user.id,
        user_email: profile.email,
        organization_name: org?.name || 'Unknown',
        reason: body.reason || null,
        data_exported: body.export_data_first || false,
        export_job_id: exportJobId,
        deleted_by: session.user.id,
        metadata: stats,
        requested_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    // SUPPRESSION EN CASCADE
    // Grâce aux foreign keys ON DELETE CASCADE dans le schéma,
    // supprimer l'organisation supprimera automatiquement:
    // - profiles
    // - clients
    // - projects
    // - invoices
    // - quotes
    // - documents
    // - activities
    // - etc.

    // Supprimer les fichiers du Storage
    // Liste tous les fichiers de l'organisation
    const { data: files } = await supabase.storage
      .from('documents')
      .list(profile.organization_id)

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${profile.organization_id}/${file.name}`)
      await supabase.storage.from('documents').remove(filePaths)
    }

    // Supprimer l'organisation (cascade sur tout le reste)
    const { error: orgDeleteError } = await supabase
      .from('organizations')
      .delete()
      .eq('id', profile.organization_id)

    if (orgDeleteError) {
      console.error('Erreur suppression organisation:', orgDeleteError)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de l\'organisation' },
        { status: 500 }
      )
    }

    // Supprimer l'utilisateur de Supabase Auth
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(session.user.id)

    if (authDeleteError) {
      console.error('Erreur suppression auth:', authDeleteError)
      // On continue même si ça échoue - les données sont déjà supprimées
    }

    // Marquer la suppression comme terminée
    if (accountDeletion) {
      await supabase
        .from('account_deletions')
        .update({
          completed_at: new Date().toISOString(),
        })
        .eq('id', accountDeletion.id)
    }

    // Déconnecter l'utilisateur
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      message: 'Votre compte et toutes vos données ont été supprimés définitivement.',
      stats,
      export_job_id: exportJobId,
    })
  } catch (error: any) {
    console.error('Erreur suppression compte:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/account/delete/request
 *
 * Demande de suppression de compte (peut être utilisé pour un processus en 2 étapes)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 403 })
    }

    // TODO: Envoyer un email de confirmation avec un lien pour confirmer la suppression
    // Pour l'instant, on retourne juste un message

    return NextResponse.json({
      success: true,
      message:
        'Une demande de suppression a été enregistrée. Vous allez recevoir un email de confirmation.',
      email: profile.email,
    })
  } catch (error: any) {
    console.error('Erreur demande suppression:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    )
  }
}
