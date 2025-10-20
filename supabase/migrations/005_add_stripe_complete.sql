-- Migration 005: Complete Stripe Integration
-- Purpose: Add all necessary fields and functions for Stripe subscription management
-- Date: 2025-01-20

-- ============================================================================
-- PART 1: Update subscriptions table with Stripe fields
-- ============================================================================

-- Add Stripe-specific fields to subscriptions table
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
  ADD COLUMN IF NOT EXISTS cancel_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ;

-- Add plan limits fields
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS plan_limits JSONB DEFAULT '{
    "projects": null,
    "invoices_per_month": null,
    "documents": null,
    "ai_tokens": 1000000,
    "users": 5
  }'::jsonb;

-- Update existing subscriptions with default limits
UPDATE public.subscriptions
SET plan_limits = '{
  "projects": null,
  "invoices_per_month": null,
  "documents": null,
  "ai_tokens": 1000000,
  "users": 5
}'::jsonb
WHERE plan_limits IS NULL;

-- ============================================================================
-- PART 2: Create usage tracking tables
-- ============================================================================

-- Track monthly usage for enforcement
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,

  -- Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Usage counts
  invoices_created INT DEFAULT 0,
  documents_uploaded INT DEFAULT 0,
  ai_operations INT DEFAULT 0,
  ai_tokens_used BIGINT DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(organization_id, period_start)
);

-- Create index for fast lookups
CREATE INDEX idx_usage_tracking_org_period ON public.usage_tracking(organization_id, period_start);

-- Enable RLS
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org usage"
  ON public.usage_tracking FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- PART 3: Create Stripe events log table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.stripe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stripe event data
  stripe_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,

  -- Processing
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Related entities
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_stripe_events_event_id ON public.stripe_events(stripe_event_id);
CREATE INDEX idx_stripe_events_type ON public.stripe_events(event_type);
CREATE INDEX idx_stripe_events_processed ON public.stripe_events(processed);
CREATE INDEX idx_stripe_events_created_at ON public.stripe_events(created_at DESC);

-- Enable RLS (admin only)
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view stripe events"
  ON public.stripe_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- ============================================================================
-- PART 4: Functions for subscription management
-- ============================================================================

-- Function to check if user has reached limit
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_organization_id UUID,
  p_resource_type TEXT
) RETURNS JSONB AS $$
DECLARE
  v_subscription RECORD;
  v_current_count INT;
  v_limit INT;
  v_period_start DATE;
BEGIN
  -- Get subscription and limits
  SELECT
    s.plan_limits,
    s.status,
    p.subscription_status
  INTO v_subscription
  FROM public.subscriptions s
  JOIN public.profiles p ON p.organization_id = s.organization_id
  WHERE s.organization_id = p_organization_id
  LIMIT 1;

  -- If no subscription found or trial/active, check limits
  IF v_subscription IS NULL THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'error', 'No subscription found',
      'current', 0,
      'limit', 0
    );
  END IF;

  -- Get limit for resource
  v_limit := (v_subscription.plan_limits->p_resource_type)::INT;

  -- If limit is NULL, it's unlimited
  IF v_limit IS NULL THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'unlimited', true,
      'current', 0,
      'limit', NULL
    );
  END IF;

  -- Get current count based on resource type
  v_period_start := DATE_TRUNC('month', NOW())::DATE;

  CASE p_resource_type
    WHEN 'projects' THEN
      SELECT COUNT(*) INTO v_current_count
      FROM public.projects
      WHERE organization_id = p_organization_id;

    WHEN 'invoices_per_month' THEN
      SELECT COUNT(*) INTO v_current_count
      FROM public.invoices
      WHERE organization_id = p_organization_id
        AND created_at >= v_period_start;

    WHEN 'documents' THEN
      SELECT COUNT(*) INTO v_current_count
      FROM public.documents
      WHERE organization_id = p_organization_id;

    WHEN 'ai_tokens' THEN
      SELECT COALESCE(ai_tokens_used, 0) INTO v_current_count
      FROM public.subscriptions
      WHERE organization_id = p_organization_id;

    ELSE
      v_current_count := 0;
  END CASE;

  -- Check if limit exceeded
  RETURN jsonb_build_object(
    'allowed', v_current_count < v_limit,
    'current', v_current_count,
    'limit', v_limit,
    'remaining', GREATEST(0, v_limit - v_current_count)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update usage tracking
CREATE OR REPLACE FUNCTION update_usage_tracking()
RETURNS TRIGGER AS $$
DECLARE
  v_period_start DATE;
  v_period_end DATE;
BEGIN
  v_period_start := DATE_TRUNC('month', NOW())::DATE;
  v_period_end := (DATE_TRUNC('month', NOW()) + INTERVAL '1 month - 1 day')::DATE;

  -- Insert or update usage tracking
  INSERT INTO public.usage_tracking (
    organization_id,
    period_start,
    period_end,
    invoices_created,
    documents_uploaded,
    ai_operations
  )
  VALUES (
    CASE TG_TABLE_NAME
      WHEN 'invoices' THEN NEW.organization_id
      WHEN 'documents' THEN NEW.organization_id
      WHEN 'ai_usage_logs' THEN NEW.organization_id
      ELSE NULL
    END,
    v_period_start,
    v_period_end,
    CASE TG_TABLE_NAME WHEN 'invoices' THEN 1 ELSE 0 END,
    CASE TG_TABLE_NAME WHEN 'documents' THEN 1 ELSE 0 END,
    CASE TG_TABLE_NAME WHEN 'ai_usage_logs' THEN 1 ELSE 0 END
  )
  ON CONFLICT (organization_id, period_start) DO UPDATE
  SET
    invoices_created = usage_tracking.invoices_created + CASE TG_TABLE_NAME WHEN 'invoices' THEN 1 ELSE 0 END,
    documents_uploaded = usage_tracking.documents_uploaded + CASE TG_TABLE_NAME WHEN 'documents' THEN 1 ELSE 0 END,
    ai_operations = usage_tracking.ai_operations + CASE TG_TABLE_NAME WHEN 'ai_usage_logs' THEN 1 ELSE 0 END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers for usage tracking
CREATE TRIGGER trigger_track_invoice_usage
  AFTER INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_usage_tracking();

CREATE TRIGGER trigger_track_document_usage
  AFTER INSERT ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION update_usage_tracking();

CREATE TRIGGER trigger_track_ai_usage
  AFTER INSERT ON public.ai_usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_usage_tracking();

-- ============================================================================
-- PART 5: Helper views
-- ============================================================================

-- View for current subscription status with limits
CREATE OR REPLACE VIEW subscription_status AS
SELECT
  p.id AS profile_id,
  p.organization_id,
  p.subscription_status,
  p.trial_ends_at,
  s.id AS subscription_id,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.status AS stripe_status,
  s.plan_name,
  s.monthly_price,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.plan_limits,
  s.ai_tokens_used,
  s.ai_tokens_limit,
  CASE
    WHEN p.subscription_status = 'trial' AND p.trial_ends_at > NOW() THEN true
    WHEN p.subscription_status = 'active' THEN true
    ELSE false
  END AS is_active,
  CASE
    WHEN p.subscription_status = 'trial' THEN
      EXTRACT(DAY FROM p.trial_ends_at - NOW())::INT
    ELSE NULL
  END AS trial_days_remaining
FROM public.profiles p
LEFT JOIN public.subscriptions s ON s.organization_id = p.organization_id;

-- Grant access to view
GRANT SELECT ON subscription_status TO authenticated;

-- ============================================================================
-- PART 6: Indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
  ON public.subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription
  ON public.subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON public.subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_period
  ON public.subscriptions(current_period_start, current_period_end);

-- ============================================================================
-- PART 7: Comments for documentation
-- ============================================================================

COMMENT ON TABLE public.usage_tracking IS
  'Tracks monthly usage per organization for limit enforcement';

COMMENT ON TABLE public.stripe_events IS
  'Logs all Stripe webhook events for debugging and audit';

COMMENT ON FUNCTION check_usage_limit IS
  'Check if organization has reached usage limit for a resource type';

COMMENT ON VIEW subscription_status IS
  'Consolidated view of subscription status with trial info and limits';

-- ============================================================================
-- PART 8: Data migration for existing records
-- ============================================================================

-- Update existing subscriptions to have plan_name if null
UPDATE public.subscriptions
SET plan_name = 'free'
WHERE plan_name IS NULL OR plan_name = '';

-- Set trial dates for existing trial users
UPDATE public.profiles
SET
  trial_started_at = COALESCE(trial_started_at, created_at),
  trial_ends_at = COALESCE(trial_ends_at, created_at + INTERVAL '30 days')
WHERE subscription_status = 'trial' AND trial_ends_at IS NULL;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 005 completed successfully!';
  RAISE NOTICE '📊 Added Stripe integration tables and functions';
  RAISE NOTICE '🔒 Usage limits enforcement ready';
  RAISE NOTICE '📈 Usage tracking enabled';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Configure Stripe products and prices';
  RAISE NOTICE '2. Update environment variables with Stripe keys';
  RAISE NOTICE '3. Setup webhook endpoint in Stripe Dashboard';
  RAISE NOTICE '4. Test checkout flow end-to-end';
END $$;
