-- Migration: Add Approval Workflows System
-- Description: Multi-level approval workflows for invoices, quotes, projects, expenses
-- Date: 2025-01-20

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'canceled');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Approval Workflows
CREATE TABLE IF NOT EXISTS public.approval_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,

  -- Resource being approved
  resource_type TEXT NOT NULL CHECK (resource_type IN ('invoice', 'quote', 'project', 'document', 'expense')),
  resource_id UUID NOT NULL,

  -- Workflow config
  name TEXT NOT NULL,
  description TEXT,
  required_approvers INT DEFAULT 1, -- Minimum approvals needed
  approval_order TEXT DEFAULT 'any' CHECK (approval_order IN ('any', 'sequential')), -- any = parallel, sequential = one by one

  -- Status
  status approval_status NOT NULL DEFAULT 'pending',

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Approval Steps (individual approver actions)
CREATE TABLE IF NOT EXISTS public.approval_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.approval_workflows(id) ON DELETE CASCADE,

  -- Approver
  approver_id UUID NOT NULL REFERENCES public.profiles(id),
  approver_role TEXT, -- 'manager', 'owner', 'admin'
  step_order INT NOT NULL DEFAULT 1, -- For sequential workflows

  -- Decision
  status approval_status NOT NULL DEFAULT 'pending',
  decision_date TIMESTAMPTZ,
  comments TEXT,

  -- Notifications
  notified_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Approval Comments/Discussion
CREATE TABLE IF NOT EXISTS public.approval_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.approval_workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_approval_workflows_organization ON public.approval_workflows(organization_id);
CREATE INDEX idx_approval_workflows_resource ON public.approval_workflows(resource_type, resource_id);
CREATE INDEX idx_approval_workflows_status ON public.approval_workflows(status);
CREATE INDEX idx_approval_workflows_created_by ON public.approval_workflows(created_by);

CREATE INDEX idx_approval_steps_workflow ON public.approval_steps(workflow_id);
CREATE INDEX idx_approval_steps_approver ON public.approval_steps(approver_id, status);
CREATE INDEX idx_approval_steps_order ON public.approval_steps(workflow_id, step_order);

CREATE INDEX idx_approval_comments_workflow ON public.approval_comments(workflow_id);
CREATE INDEX idx_approval_comments_user ON public.approval_comments(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_comments ENABLE ROW LEVEL SECURITY;

-- Workflows: Users can view workflows in their organization
CREATE POLICY "Users can view workflows in org"
  ON public.approval_workflows FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Workflows: Admins/owners can create workflows
CREATE POLICY "Admins can create workflows"
  ON public.approval_workflows FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND organization_id = approval_workflows.organization_id
        AND role IN ('admin', 'owner')
    )
  );

-- Workflows: Admins/owners can update workflows
CREATE POLICY "Admins can update workflows"
  ON public.approval_workflows FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND organization_id = approval_workflows.organization_id
        AND role IN ('admin', 'owner')
    )
  );

-- Steps: Approvers can view their steps + admins can view all
CREATE POLICY "Approvers can view their steps"
  ON public.approval_steps FOR SELECT
  USING (
    approver_id = auth.uid()
    OR workflow_id IN (
      SELECT id FROM public.approval_workflows
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner')
      )
    )
  );

-- Steps: Admins can create steps
CREATE POLICY "Admins can create steps"
  ON public.approval_steps FOR INSERT
  WITH CHECK (
    workflow_id IN (
      SELECT id FROM public.approval_workflows
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner')
      )
    )
  );

-- Steps: Approvers can update their own steps
CREATE POLICY "Approvers can update their steps"
  ON public.approval_steps FOR UPDATE
  USING (approver_id = auth.uid())
  WITH CHECK (approver_id = auth.uid());

-- Comments: Users in org can view comments
CREATE POLICY "Users can view comments in org"
  ON public.approval_comments FOR SELECT
  USING (
    workflow_id IN (
      SELECT id FROM public.approval_workflows
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

-- Comments: Users can create comments on workflows they can see
CREATE POLICY "Users can create comments"
  ON public.approval_comments FOR INSERT
  WITH CHECK (
    workflow_id IN (
      SELECT id FROM public.approval_workflows
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to automatically update workflow status when steps are updated
CREATE OR REPLACE FUNCTION check_workflow_complete()
RETURNS TRIGGER AS $$
DECLARE
  v_required INT;
  v_approved INT;
  v_rejected INT;
  v_workflow_id UUID;
  v_order TEXT;
BEGIN
  v_workflow_id := NEW.workflow_id;

  -- Get workflow config
  SELECT required_approvers, approval_order INTO v_required, v_order
  FROM public.approval_workflows
  WHERE id = v_workflow_id;

  -- Count approved/rejected
  SELECT
    COUNT(*) FILTER (WHERE status = 'approved'),
    COUNT(*) FILTER (WHERE status = 'rejected')
  INTO v_approved, v_rejected
  FROM public.approval_steps
  WHERE workflow_id = v_workflow_id;

  -- Update workflow status based on results
  IF v_approved >= v_required THEN
    UPDATE public.approval_workflows
    SET status = 'approved', completed_at = NOW()
    WHERE id = v_workflow_id AND status = 'pending';
  ELSIF v_rejected > 0 THEN
    -- Any rejection = workflow rejected
    UPDATE public.approval_workflows
    SET status = 'rejected', completed_at = NOW()
    WHERE id = v_workflow_id AND status = 'pending';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check workflow completion after step updates
CREATE TRIGGER trigger_check_workflow_complete
  AFTER UPDATE OF status ON public.approval_steps
  FOR EACH ROW
  WHEN (NEW.status IN ('approved', 'rejected'))
  EXECUTE FUNCTION check_workflow_complete();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to create approval workflow for a resource
CREATE OR REPLACE FUNCTION create_approval_workflow(
  p_organization_id UUID,
  p_resource_type TEXT,
  p_resource_id UUID,
  p_name TEXT,
  p_description TEXT,
  p_approver_ids UUID[],
  p_required_approvers INT DEFAULT 1,
  p_approval_order TEXT DEFAULT 'any',
  p_created_by UUID DEFAULT auth.uid()
)
RETURNS UUID AS $$
DECLARE
  v_workflow_id UUID;
  v_approver_id UUID;
  v_step_order INT := 1;
BEGIN
  -- Create workflow
  INSERT INTO public.approval_workflows (
    organization_id,
    resource_type,
    resource_id,
    name,
    description,
    required_approvers,
    approval_order,
    created_by
  ) VALUES (
    p_organization_id,
    p_resource_type,
    p_resource_id,
    p_name,
    p_description,
    p_required_approvers,
    p_approval_order,
    p_created_by
  ) RETURNING id INTO v_workflow_id;

  -- Create steps for each approver
  FOREACH v_approver_id IN ARRAY p_approver_ids
  LOOP
    INSERT INTO public.approval_steps (
      workflow_id,
      approver_id,
      step_order
    ) VALUES (
      v_workflow_id,
      v_approver_id,
      v_step_order
    );

    v_step_order := v_step_order + 1;
  END LOOP;

  RETURN v_workflow_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.approval_workflows IS 'Multi-level approval workflows for various resources';
COMMENT ON TABLE public.approval_steps IS 'Individual approval steps/decisions within a workflow';
COMMENT ON TABLE public.approval_comments IS 'Discussion/comments on approval workflows';
COMMENT ON FUNCTION check_workflow_complete() IS 'Automatically updates workflow status when approval steps change';
COMMENT ON FUNCTION create_approval_workflow IS 'Helper function to create a complete approval workflow with steps';
