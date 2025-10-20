-- ============================================================================
-- Migration 007: Invoice Auto-Extraction System
-- ============================================================================
-- Description: Add tables and functions for AI-powered invoice extraction
-- Features:
--   - extraction_jobs table to track extraction progress
--   - extracted_invoices table to store AI-extracted data before conversion
--   - Functions to convert extracted data to actual invoices
--   - Enhanced upload workflow
-- ============================================================================

-- ============================================================================
-- 1. EXTRACTION JOBS TABLE
-- ============================================================================
-- Tracks the extraction process for uploaded invoice documents

CREATE TABLE IF NOT EXISTS public.extraction_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,

  -- Job metadata
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  job_type TEXT NOT NULL DEFAULT 'invoice' CHECK (job_type IN ('invoice', 'quote', 'receipt', 'contract')),

  -- File info
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  storage_path TEXT,

  -- Extraction results
  extracted_data JSONB,
  confidence_score NUMERIC(3, 2), -- 0.00 to 1.00

  -- AI usage
  ai_model TEXT DEFAULT 'claude-3-5-sonnet-20241022',
  tokens_used JSONB, -- { input: number, output: number }
  processing_time_ms INT,

  -- Error tracking
  error_message TEXT,
  error_details JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Indexes
  CONSTRAINT valid_confidence CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1))
);

-- Indexes for extraction_jobs
CREATE INDEX IF NOT EXISTS idx_extraction_jobs_organization ON public.extraction_jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_extraction_jobs_user ON public.extraction_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_extraction_jobs_status ON public.extraction_jobs(status);
CREATE INDEX IF NOT EXISTS idx_extraction_jobs_created ON public.extraction_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_extraction_jobs_document ON public.extraction_jobs(document_id);

-- ============================================================================
-- 2. EXTRACTED INVOICES TABLE
-- ============================================================================
-- Stores extracted invoice data before user review and conversion

CREATE TABLE IF NOT EXISTS public.extracted_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extraction_job_id UUID NOT NULL REFERENCES public.extraction_jobs(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Invoice basic info
  invoice_number TEXT,
  invoice_date DATE,
  due_date DATE,

  -- Vendor/Supplier info (for incoming invoices)
  vendor_name TEXT,
  vendor_email TEXT,
  vendor_phone TEXT,
  vendor_address TEXT,
  vendor_tps TEXT, -- TPS number
  vendor_tvq TEXT, -- TVQ number

  -- Customer info (for outgoing invoices - if applicable)
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,

  -- Associated entities (optional)
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,

  -- Financial details
  subtotal NUMERIC(12, 2),
  tps_amount NUMERIC(12, 2),
  tvq_amount NUMERIC(12, 2),
  total NUMERIC(12, 2),

  -- Line items (JSONB array)
  line_items JSONB, -- [{ description, quantity, unit_price, amount }]

  -- Payment info
  payment_terms TEXT,
  payment_method TEXT,

  -- Additional data
  notes TEXT,
  tags TEXT[],

  -- Extraction metadata
  confidence_score NUMERIC(3, 2),
  field_confidence JSONB, -- { invoice_number: 0.95, total: 0.99, ... }
  needs_review BOOLEAN DEFAULT TRUE,
  review_notes TEXT,

  -- Conversion status
  converted_to_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  converted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  CONSTRAINT valid_confidence CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1))
);

-- Indexes for extracted_invoices
CREATE INDEX IF NOT EXISTS idx_extracted_invoices_organization ON public.extracted_invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_extracted_invoices_user ON public.extracted_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_extracted_invoices_job ON public.extracted_invoices(extraction_job_id);
CREATE INDEX IF NOT EXISTS idx_extracted_invoices_needs_review ON public.extracted_invoices(needs_review);
CREATE INDEX IF NOT EXISTS idx_extracted_invoices_converted ON public.extracted_invoices(converted_to_invoice_id);
CREATE INDEX IF NOT EXISTS idx_extracted_invoices_created ON public.extracted_invoices(created_at DESC);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE public.extraction_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_invoices ENABLE ROW LEVEL SECURITY;

-- Extraction Jobs Policies
CREATE POLICY "Users can view own org extraction jobs"
  ON public.extraction_jobs FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1
    )
  );

CREATE POLICY "Users can create extraction jobs"
  ON public.extraction_jobs FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1
    )
  );

CREATE POLICY "Users can update own org extraction jobs"
  ON public.extraction_jobs FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1
    )
  );

CREATE POLICY "Users can delete own org extraction jobs"
  ON public.extraction_jobs FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1
    )
  );

-- Extracted Invoices Policies
CREATE POLICY "Users can view own org extracted invoices"
  ON public.extracted_invoices FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1
    )
  );

CREATE POLICY "Users can create extracted invoices"
  ON public.extracted_invoices FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1
    )
  );

CREATE POLICY "Users can update own org extracted invoices"
  ON public.extracted_invoices FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1
    )
  );

CREATE POLICY "Users can delete own org extracted invoices"
  ON public.extracted_invoices FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1
    )
  );

-- ============================================================================
-- 4. HELPER FUNCTIONS
-- ============================================================================

-- Function to update extraction job status
CREATE OR REPLACE FUNCTION update_extraction_job_status(
  p_job_id UUID,
  p_status TEXT,
  p_extracted_data JSONB DEFAULT NULL,
  p_confidence_score NUMERIC DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL,
  p_tokens_used JSONB DEFAULT NULL,
  p_processing_time_ms INT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.extraction_jobs
  SET
    status = p_status,
    extracted_data = COALESCE(p_extracted_data, extracted_data),
    confidence_score = COALESCE(p_confidence_score, confidence_score),
    error_message = p_error_message,
    tokens_used = COALESCE(p_tokens_used, tokens_used),
    processing_time_ms = COALESCE(p_processing_time_ms, processing_time_ms),
    started_at = CASE WHEN p_status = 'processing' AND started_at IS NULL THEN NOW() ELSE started_at END,
    completed_at = CASE WHEN p_status IN ('completed', 'failed', 'cancelled') THEN NOW() ELSE completed_at END
  WHERE id = p_job_id;
END;
$$;

-- Function to convert extracted invoice to actual invoice
CREATE OR REPLACE FUNCTION convert_extracted_invoice_to_invoice(
  p_extracted_invoice_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_extracted RECORD;
  v_new_invoice_id UUID;
  v_line_item JSONB;
  v_item_order INT := 0;
BEGIN
  -- Get extracted invoice data
  SELECT * INTO v_extracted
  FROM public.extracted_invoices
  WHERE id = p_extracted_invoice_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Extracted invoice not found: %', p_extracted_invoice_id;
  END IF;

  -- Check if already converted
  IF v_extracted.converted_to_invoice_id IS NOT NULL THEN
    RAISE EXCEPTION 'Invoice already converted: %', v_extracted.converted_to_invoice_id;
  END IF;

  -- Create new invoice
  INSERT INTO public.invoices (
    organization_id,
    client_id,
    project_id,
    invoice_number,
    issue_date,
    due_date,
    status,
    subtotal,
    tax_tps,
    tax_tvq,
    total,
    notes,
    created_by
  )
  VALUES (
    v_extracted.organization_id,
    v_extracted.client_id,
    v_extracted.project_id,
    COALESCE(v_extracted.invoice_number, 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD-HH24MISS')),
    COALESCE(v_extracted.invoice_date, CURRENT_DATE),
    v_extracted.due_date,
    'draft', -- Always start as draft for review
    v_extracted.subtotal,
    v_extracted.tps_amount,
    v_extracted.tvq_amount,
    v_extracted.total,
    v_extracted.notes,
    v_extracted.user_id
  )
  RETURNING id INTO v_new_invoice_id;

  -- Create invoice items from line_items JSONB
  IF v_extracted.line_items IS NOT NULL THEN
    FOR v_line_item IN SELECT * FROM jsonb_array_elements(v_extracted.line_items)
    LOOP
      v_item_order := v_item_order + 1;

      INSERT INTO public.invoice_items (
        invoice_id,
        description,
        quantity,
        unit_price,
        amount,
        item_order
      )
      VALUES (
        v_new_invoice_id,
        v_line_item->>'description',
        COALESCE((v_line_item->>'quantity')::NUMERIC, 1),
        COALESCE((v_line_item->>'unit_price')::NUMERIC, 0),
        COALESCE((v_line_item->>'amount')::NUMERIC, 0),
        v_item_order
      );
    END LOOP;
  END IF;

  -- Mark extracted invoice as converted
  UPDATE public.extracted_invoices
  SET
    converted_to_invoice_id = v_new_invoice_id,
    converted_at = NOW(),
    needs_review = FALSE
  WHERE id = p_extracted_invoice_id;

  -- Log activity
  INSERT INTO public.activities (
    organization_id,
    user_id,
    action,
    description,
    metadata
  )
  VALUES (
    v_extracted.organization_id,
    v_extracted.user_id,
    'invoice_created_from_extraction',
    'Facture créée depuis extraction IA: ' || COALESCE(v_extracted.invoice_number, v_new_invoice_id::TEXT),
    jsonb_build_object(
      'invoice_id', v_new_invoice_id,
      'extracted_invoice_id', p_extracted_invoice_id,
      'confidence_score', v_extracted.confidence_score
    )
  );

  RETURN v_new_invoice_id;
END;
$$;

-- ============================================================================
-- 5. AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Trigger to auto-update updated_at on extracted_invoices
CREATE OR REPLACE FUNCTION update_extracted_invoice_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_extracted_invoice_timestamp
  BEFORE UPDATE ON public.extracted_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_extracted_invoice_timestamp();

-- ============================================================================
-- 6. STATS VIEW
-- ============================================================================

-- View for extraction statistics
CREATE OR REPLACE VIEW extraction_stats AS
SELECT
  ej.organization_id,
  COUNT(*) AS total_extractions,
  COUNT(*) FILTER (WHERE ej.status = 'completed') AS completed_extractions,
  COUNT(*) FILTER (WHERE ej.status = 'failed') AS failed_extractions,
  AVG(ej.confidence_score) FILTER (WHERE ej.status = 'completed') AS avg_confidence,
  AVG(ej.processing_time_ms) FILTER (WHERE ej.status = 'completed') AS avg_processing_time_ms,
  SUM((ej.tokens_used->>'input')::BIGINT) FILTER (WHERE ej.status = 'completed') AS total_input_tokens,
  SUM((ej.tokens_used->>'output')::BIGINT) FILTER (WHERE ej.status = 'completed') AS total_output_tokens,
  COUNT(ei.id) FILTER (WHERE ei.converted_to_invoice_id IS NOT NULL) AS converted_count,
  COUNT(ei.id) FILTER (WHERE ei.needs_review = TRUE) AS pending_review_count
FROM public.extraction_jobs ej
LEFT JOIN public.extracted_invoices ei ON ej.id = ei.extraction_job_id
GROUP BY ej.organization_id;

-- ============================================================================
-- END OF MIGRATION 007
-- ============================================================================
