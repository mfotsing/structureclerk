-- Migration: Add AI Features to StructureClerk
-- Date: 2025-10-18
-- Description: Adds AI-powered document processing, subscription management, and export features

-- ============================================================================
-- 1. ADD AI FIELDS TO DOCUMENTS TABLE
-- ============================================================================

ALTER TABLE documents
  ADD COLUMN type_detecte TEXT, -- Type détecté par l'IA: 'contrat', 'facture', 'devis', 'appel_offres', 'licence', 'autre'
  ADD COLUMN contenu_textuel TEXT, -- Texte extrait du document (OCR ou parsing)
  ADD COLUMN ai_summary TEXT, -- Résumé généré par l'IA
  ADD COLUMN ai_metadata JSONB DEFAULT '{}', -- Données extraites par l'IA (champs structurés)
  ADD COLUMN ai_confidence DECIMAL(3, 2), -- Score de confiance de la classification (0.00 à 1.00)
  ADD COLUMN processing_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  ADD COLUMN processing_error TEXT, -- Message d'erreur si le traitement échoue
  ADD COLUMN processed_at TIMESTAMPTZ; -- Date de fin de traitement

-- Index pour recherche full-text sur le contenu
CREATE INDEX idx_documents_contenu_textuel_gin ON documents USING GIN (to_tsvector('french', contenu_textuel));

-- Index pour recherche dans les métadonnées IA
CREATE INDEX idx_documents_ai_metadata_gin ON documents USING GIN (ai_metadata);

-- Index pour filtrage par type détecté
CREATE INDEX idx_documents_type_detecte ON documents(type_detecte);

-- Index pour filtrage par statut de traitement
CREATE INDEX idx_documents_processing_status ON documents(processing_status);

COMMENT ON COLUMN documents.type_detecte IS 'Type de document détecté automatiquement par l''IA';
COMMENT ON COLUMN documents.contenu_textuel IS 'Texte extrait du document (OCR, PDF parsing, etc.)';
COMMENT ON COLUMN documents.ai_summary IS 'Résumé intelligent généré par Claude';
COMMENT ON COLUMN documents.ai_metadata IS 'Métadonnées structurées extraites par l''IA (JSON)';
COMMENT ON COLUMN documents.ai_confidence IS 'Score de confiance de la classification (0.00-1.00)';

-- ============================================================================
-- 2. ADD SUBSCRIPTION FIELDS TO PROFILES/ORGANIZATIONS
-- ============================================================================

ALTER TABLE profiles
  ADD COLUMN subscription_status TEXT DEFAULT 'trial', -- 'trial', 'active', 'expired', 'canceled'
  ADD COLUMN trial_started_at TIMESTAMPTZ,
  ADD COLUMN trial_ends_at TIMESTAMPTZ,
  ADD COLUMN subscription_started_at TIMESTAMPTZ;

ALTER TABLE subscriptions
  ADD COLUMN trial_ends_at TIMESTAMPTZ,
  ADD COLUMN monthly_price DECIMAL(10, 2) DEFAULT 99.00,
  ADD COLUMN ai_tokens_used INTEGER DEFAULT 0,
  ADD COLUMN ai_tokens_limit INTEGER DEFAULT 1000000; -- Limite mensuelle de tokens

COMMENT ON COLUMN profiles.subscription_status IS 'Statut d''abonnement: trial (30 jours), active (99$/mois), expired, canceled';
COMMENT ON COLUMN subscriptions.ai_tokens_used IS 'Nombre de tokens IA consommés ce mois';
COMMENT ON COLUMN subscriptions.ai_tokens_limit IS 'Limite mensuelle de tokens IA';

-- ============================================================================
-- 3. CREATE UPLOAD_JOBS TABLE FOR ASYNC PROCESSING
-- ============================================================================

CREATE TABLE upload_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  stage TEXT, -- 'upload', 'extraction', 'classification', 'analysis', 'completed'
  progress INTEGER DEFAULT 0, -- 0-100
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE upload_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their organization's upload jobs"
  ON upload_jobs FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert upload jobs in their organization"
  ON upload_jobs FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their organization's upload jobs"
  ON upload_jobs FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

-- Indexes
CREATE INDEX idx_upload_jobs_organization ON upload_jobs(organization_id);
CREATE INDEX idx_upload_jobs_user ON upload_jobs(user_id);
CREATE INDEX idx_upload_jobs_status ON upload_jobs(status);
CREATE INDEX idx_upload_jobs_document ON upload_jobs(document_id);

-- Trigger for updated_at
CREATE TRIGGER update_upload_jobs_updated_at BEFORE UPDATE ON upload_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. CREATE TENDER_RESPONSES TABLE (Réponses aux Appels d'Offres)
-- ============================================================================

CREATE TABLE tender_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  source_document_id UUID REFERENCES documents(id) ON DELETE SET NULL, -- Document de l'appel d'offres
  title TEXT NOT NULL,
  tender_reference TEXT, -- Référence de l'appel d'offres
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'in_review', 'submitted', 'won', 'lost'
  generated_content TEXT, -- Contenu généré par l'IA
  edited_content TEXT, -- Contenu après édition manuelle
  company_profile JSONB DEFAULT '{}', -- Profil d'entreprise utilisé pour la génération
  ai_metadata JSONB DEFAULT '{}', -- Métadonnées de génération
  submitted_at TIMESTAMPTZ,
  result TEXT, -- 'won', 'lost', 'pending'
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tender_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view tender responses in their organization"
  ON tender_responses FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert tender responses in their organization"
  ON tender_responses FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update tender responses in their organization"
  ON tender_responses FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can delete tender responses in their organization"
  ON tender_responses FOR DELETE
  USING (organization_id IN (
    SELECT organization_id FROM profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Indexes
CREATE INDEX idx_tender_responses_organization ON tender_responses(organization_id);
CREATE INDEX idx_tender_responses_project ON tender_responses(project_id);
CREATE INDEX idx_tender_responses_status ON tender_responses(status);

-- Trigger for updated_at
CREATE TRIGGER update_tender_responses_updated_at BEFORE UPDATE ON tender_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. CREATE EXPORT_JOBS TABLE (Export de données)
-- ============================================================================

CREATE TABLE export_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  export_type TEXT NOT NULL, -- 'full_backup', 'documents_only', 'invoices_only', etc.
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'expired'
  file_path TEXT, -- Chemin du fichier ZIP généré
  file_size INTEGER,
  download_url TEXT, -- URL signée temporaire
  expires_at TIMESTAMPTZ, -- URL expire après 24h
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE export_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own export jobs"
  ON export_jobs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own export jobs"
  ON export_jobs FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_export_jobs_user ON export_jobs(user_id);
CREATE INDEX idx_export_jobs_status ON export_jobs(status);
CREATE INDEX idx_export_jobs_expires_at ON export_jobs(expires_at);

-- ============================================================================
-- 6. CREATE ACCOUNT_DELETIONS TABLE (Audit des suppressions de compte)
-- ============================================================================

CREATE TABLE account_deletions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID NOT NULL, -- Pas de FK car l'org sera supprimée
  user_id UUID NOT NULL, -- Pas de FK car le user sera supprimé
  user_email TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  reason TEXT,
  data_exported BOOLEAN DEFAULT FALSE,
  export_job_id UUID REFERENCES export_jobs(id),
  deleted_by UUID, -- ID de l'utilisateur qui a effectué la suppression
  metadata JSONB DEFAULT '{}', -- Stats: nb clients, projets, factures, documents, etc.
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Pas de RLS car cette table est pour l'audit admin seulement
-- Accessible uniquement par des fonctions sécurisées

-- Indexes
CREATE INDEX idx_account_deletions_user_email ON account_deletions(user_email);
CREATE INDEX idx_account_deletions_requested_at ON account_deletions(requested_at);

-- ============================================================================
-- 7. CREATE AI_USAGE_LOGS TABLE (Suivi de l'utilisation de l'IA)
-- ============================================================================

CREATE TABLE ai_usage_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  operation TEXT NOT NULL, -- 'classification', 'extraction', 'summarization', 'generation', etc.
  model TEXT NOT NULL, -- 'claude-3-5-sonnet-20241022'
  tokens_input INTEGER NOT NULL DEFAULT 0,
  tokens_output INTEGER NOT NULL DEFAULT 0,
  tokens_total INTEGER NOT NULL DEFAULT 0,
  cost_estimate DECIMAL(10, 4), -- Estimation du coût en USD
  success BOOLEAN DEFAULT TRUE,
  cached BOOLEAN DEFAULT FALSE,
  execution_time_ms INTEGER, -- Temps d'exécution en millisecondes
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view AI usage logs for their organization"
  ON ai_usage_logs FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Indexes
CREATE INDEX idx_ai_usage_logs_organization ON ai_usage_logs(organization_id);
CREATE INDEX idx_ai_usage_logs_user ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
CREATE INDEX idx_ai_usage_logs_operation ON ai_usage_logs(operation);

-- ============================================================================
-- 8. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Fonction pour vérifier si l'abonnement est actif
CREATE OR REPLACE FUNCTION is_subscription_active(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_status TEXT;
  trial_end TIMESTAMPTZ;
BEGIN
  SELECT subscription_status, trial_ends_at INTO profile_status, trial_end
  FROM profiles
  WHERE id = user_uuid;

  -- Si en trial et pas expiré
  IF profile_status = 'trial' AND trial_end > NOW() THEN
    RETURN TRUE;
  END IF;

  -- Si abonnement actif
  IF profile_status = 'active' THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour initialiser le trial à la création du profil
CREATE OR REPLACE FUNCTION initialize_trial()
RETURNS TRIGGER AS $$
BEGIN
  NEW.subscription_status = 'trial';
  NEW.trial_started_at = NOW();
  NEW.trial_ends_at = NOW() + INTERVAL '30 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour initialiser le trial
CREATE TRIGGER set_trial_on_profile_creation
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_trial();

-- Fonction pour logger l'utilisation de l'IA
CREATE OR REPLACE FUNCTION log_ai_usage(
  p_organization_id UUID,
  p_user_id UUID,
  p_operation TEXT,
  p_tokens_input INTEGER,
  p_tokens_output INTEGER,
  p_cached BOOLEAN DEFAULT FALSE,
  p_execution_time_ms INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_total_tokens INTEGER;
  v_cost_estimate DECIMAL(10, 4);
BEGIN
  v_total_tokens := p_tokens_input + p_tokens_output;

  -- Estimation du coût (Claude 3.5 Sonnet: ~$3/M input tokens, ~$15/M output tokens)
  v_cost_estimate := (p_tokens_input::DECIMAL / 1000000 * 3.0) +
                     (p_tokens_output::DECIMAL / 1000000 * 15.0);

  INSERT INTO ai_usage_logs (
    organization_id,
    user_id,
    operation,
    model,
    tokens_input,
    tokens_output,
    tokens_total,
    cost_estimate,
    cached,
    execution_time_ms
  ) VALUES (
    p_organization_id,
    p_user_id,
    p_operation,
    'claude-3-5-sonnet-20241022',
    p_tokens_input,
    p_tokens_output,
    v_total_tokens,
    v_cost_estimate,
    p_cached,
    p_execution_time_ms
  ) RETURNING id INTO v_log_id;

  -- Incrémenter le compteur de tokens dans subscriptions
  IF NOT p_cached THEN
    UPDATE subscriptions
    SET ai_tokens_used = ai_tokens_used + v_total_tokens
    WHERE organization_id = p_organization_id;
  END IF;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. CREATE VIEW FOR DASHBOARD STATISTICS
-- ============================================================================

CREATE OR REPLACE VIEW dashboard_ai_stats AS
SELECT
  o.id AS organization_id,
  COUNT(DISTINCT d.id) FILTER (WHERE d.processing_status = 'completed') AS documents_processed,
  COUNT(DISTINCT d.id) FILTER (WHERE d.type_detecte = 'facture') AS factures_detected,
  COUNT(DISTINCT d.id) FILTER (WHERE d.type_detecte = 'contrat') AS contrats_detected,
  COUNT(DISTINCT d.id) FILTER (WHERE d.type_detecte = 'devis') AS devis_detected,
  COUNT(DISTINCT d.id) FILTER (WHERE d.ai_summary IS NOT NULL) AS documents_summarized,
  COUNT(DISTINCT tr.id) AS tender_responses_generated,
  COALESCE(SUM(ai.tokens_total), 0) AS total_tokens_used,
  COALESCE(SUM(ai.cost_estimate), 0) AS total_cost_estimate
FROM organizations o
LEFT JOIN documents d ON d.organization_id = o.id
LEFT JOIN tender_responses tr ON tr.organization_id = o.id
LEFT JOIN ai_usage_logs ai ON ai.organization_id = o.id
  AND ai.created_at >= date_trunc('month', NOW())
GROUP BY o.id;

-- Permissions sur la vue
GRANT SELECT ON dashboard_ai_stats TO authenticated;

-- ============================================================================
-- 10. SAMPLE DATA FOR TESTING (Comment out in production)
-- ============================================================================

-- Uncomment for testing only:
/*
-- Mise à jour d'un exemple de subscription avec le nouveau schéma
UPDATE subscriptions
SET
  trial_ends_at = NOW() + INTERVAL '30 days',
  ai_tokens_used = 5000,
  ai_tokens_limit = 1000000
WHERE id IN (SELECT id FROM subscriptions LIMIT 1);
*/

-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE upload_jobs IS 'File de traitement asynchrone des documents uploadés';
COMMENT ON TABLE tender_responses IS 'Réponses aux appels d''offres générées par l''IA';
COMMENT ON TABLE export_jobs IS 'Jobs d''export de données (ZIP) avec URLs temporaires';
COMMENT ON TABLE account_deletions IS 'Audit trail des suppressions de comptes (RGPD)';
COMMENT ON TABLE ai_usage_logs IS 'Logs d''utilisation de l''IA pour facturation et analytics';

COMMENT ON FUNCTION is_subscription_active IS 'Vérifie si l''utilisateur a un abonnement actif ou un trial valide';
COMMENT ON FUNCTION log_ai_usage IS 'Enregistre l''utilisation de l''IA et met à jour les compteurs';
COMMENT ON VIEW dashboard_ai_stats IS 'Statistiques agrégées pour le dashboard IA';
