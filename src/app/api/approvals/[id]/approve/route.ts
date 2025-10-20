import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { comments } = await request.json()
    const params = await context.params
    const stepId = params.id

    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get step with workflow info
    const { data: step, error: stepError } = await supabase
      .from('approval_steps')
      .select(`
        *,
        workflow:approval_workflows(*)
      `)
      .eq('id', stepId)
      .single()

    if (stepError || !step) {
      return NextResponse.json({ error: 'Étape d\'approbation introuvable' }, { status: 404 })
    }

    // Verify user is the approver
    if (step.approver_id !== user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à approuver cette étape' },
        { status: 403 }
      )
    }

    // Verify step is still pending
    if (step.status !== 'pending') {
      return NextResponse.json(
        { error: 'Cette étape a déjà été traitée' },
        { status: 400 }
      )
    }

    // Update step to approved
    const { error: updateError } = await supabase
      .from('approval_steps')
      .update({
        status: 'approved',
        decision_date: new Date().toISOString(),
        comments: comments || null,
      })
      .eq('id', stepId)

    if (updateError) throw updateError

    // Add comment if provided
    if (comments) {
      await supabase.from('approval_comments').insert({
        workflow_id: step.workflow_id,
        user_id: user.id,
        comment: `✅ Approuvé: ${comments}`,
      })
    }

    // Log activity
    const workflow = step.workflow as any
    await supabase.from('activities').insert({
      organization_id: workflow.organization_id,
      user_id: user.id,
      action: 'approval_approved',
      description: `Approbation accordée: ${workflow.name}`,
      metadata: {
        workflow_id: step.workflow_id,
        step_id: stepId,
        resource_type: workflow.resource_type,
        resource_id: workflow.resource_id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Approbation enregistrée avec succès',
    })
  } catch (error: any) {
    console.error('Approve error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'approbation' },
      { status: 500 }
    )
  }
}
