import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/approvals - Get all pending approvals for current user
 */
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

    // Get user's pending approval steps
    const { data: steps, error } = await supabase
      .from('approval_steps')
      .select(`
        *,
        workflow:approval_workflows(
          *,
          creator:created_by(email, full_name)
        )
      `)
      .eq('approver_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      approvals: steps || [],
      count: steps?.length || 0,
    })
  } catch (error: any) {
    console.error('Get approvals error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des approbations' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/approvals - Create a new approval workflow
 */
export async function POST(request: NextRequest) {
  try {
    const {
      resource_type,
      resource_id,
      name,
      description,
      approver_ids,
      required_approvers = 1,
      approval_order = 'any',
    } = await request.json()

    if (!resource_type || !resource_id || !approver_ids || approver_ids.length === 0) {
      return NextResponse.json(
        { error: 'Paramètres manquants: resource_type, resource_id, approver_ids requis' },
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

    // Get organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'Organisation introuvable' }, { status: 404 })
    }

    // Check if user is admin/owner
    if (!['admin', 'owner'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Seuls les admins peuvent créer des workflows d\'approbation' },
        { status: 403 }
      )
    }

    // Use RPC to create workflow with steps
    const { data: workflowId, error } = await supabase.rpc('create_approval_workflow', {
      p_organization_id: profile.organization_id,
      p_resource_type: resource_type,
      p_resource_id: resource_id,
      p_name: name || `Approbation ${resource_type}`,
      p_description: description,
      p_approver_ids: approver_ids,
      p_required_approvers: required_approvers,
      p_approval_order: approval_order,
      p_created_by: user.id,
    })

    if (error) throw error

    // Log activity
    await supabase.from('activities').insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      action: 'approval_workflow_created',
      description: `Workflow d'approbation créé: ${name || resource_type}`,
      metadata: {
        workflow_id: workflowId,
        resource_type,
        resource_id,
        approver_count: approver_ids.length,
      },
    })

    return NextResponse.json({
      success: true,
      workflow_id: workflowId,
      message: 'Workflow d\'approbation créé avec succès',
    })
  } catch (error: any) {
    console.error('Create approval workflow error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du workflow' },
      { status: 500 }
    )
  }
}
