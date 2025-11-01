-- Analytics Schema for StructureClerk Investor Landing
-- This file contains the database schema for tracking user behavior and conversion metrics

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR(255) NOT NULL,
  event_params JSONB,
  user_properties JSONB,
  client_timestamp TIMESTAMP WITH TIME ZONE,
  server_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),
  user_id VARCHAR(255),
  page_path TEXT,
  referrer TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investor Sessions Table
CREATE TABLE IF NOT EXISTS investor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id VARCHAR(255),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page_views INTEGER DEFAULT 1,
  time_on_site INTEGER DEFAULT 0, -- in seconds
  scroll_depth INTEGER DEFAULT 0, -- max percentage scrolled
  device_type VARCHAR(50), -- mobile, tablet, desktop
  browser VARCHAR(100),
  os VARCHAR(100),
  country VARCHAR(2), -- ISO country code
  city VARCHAR(100),
  converted BOOLEAN DEFAULT FALSE,
  conversion_type VARCHAR(100), -- demo_request, contact_form, investor_deck_download
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CTA Performance Table
CREATE TABLE IF NOT EXISTS cta_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cta_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL, -- hero, pricing, footer, etc.
  variant VARCHAR(100), -- A/B test variant
  session_id VARCHAR(255),
  user_id VARCHAR(255),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE,
  conversion_delay INTEGER, -- seconds from click to conversion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Demo Interactions Table
CREATE TABLE IF NOT EXISTS demo_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  user_id VARCHAR(255),
  action VARCHAR(255) NOT NULL, -- upload, process_step1, process_step2, complete
  step INTEGER,
  document_type VARCHAR(100), -- invoice, receipt, contract
  processing_time FLOAT, -- in seconds
  confidence_score FLOAT, -- AI confidence percentage
  errors JSONB, -- any processing errors
  interaction_data JSONB, -- additional interaction details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversion Funnel Table
CREATE TABLE IF NOT EXISTS conversion_funnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  landed_at TIMESTAMP WITH TIME ZONE,
  viewed_hero BOOLEAN DEFAULT FALSE,
  viewed_metrics BOOLEAN DEFAULT FALSE,
  viewed_pricing BOOLEAN DEFAULT FALSE,
  viewed_demo BOOLEAN DEFAULT FALSE,
  started_demo BOOLEAN DEFAULT FALSE,
  completed_demo BOOLEAN DEFAULT FALSE,
  clicked_cta BOOLEAN DEFAULT FALSE,
  submitted_contact BOOLEAN DEFAULT FALSE,
  downloaded_deck BOOLEAN DEFAULT FALSE,
  scheduled_meeting BOOLEAN DEFAULT FALSE,
  funnel_stage VARCHAR(100), -- aware, interested, considering, ready, converted
  total_time_on_site INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B Test Results Table
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name VARCHAR(255) NOT NULL,
  variant VARCHAR(100) NOT NULL,
  session_id VARCHAR(255),
  user_id VARCHAR(255),
  metric_type VARCHAR(100) NOT NULL, -- conversion_rate, click_through_rate, time_on_page
  metric_value FLOAT NOT NULL,
  test_group VARCHAR(50), -- control, treatment
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geographic Performance Table
CREATE TABLE IF NOT EXISTS geographic_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country VARCHAR(2) NOT NULL, -- ISO country code
  province VARCHAR(100), -- for Canadian provinces
  city VARCHAR(100),
  metric_date DATE NOT NULL,
  sessions INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate FLOAT DEFAULT 0,
  avg_session_duration FLOAT DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investor Lead Quality Table
CREATE TABLE IF NOT EXISTS investor_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  full_name VARCHAR(255),
  company VARCHAR(255),
  investment_firm VARCHAR(255),
  investment_range VARCHAR(100), -- seed, series-a, growth, etc.
  lead_score INTEGER DEFAULT 0, -- 0-100 quality score
  lead_source VARCHAR(100), -- organic, referral, paid, etc.
  qualification_factors JSONB, -- factors that contributed to score
  status VARCHAR(100) DEFAULT 'new', -- new, contacted, qualified, converted, closed
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  bounce_rate FLOAT DEFAULT 0,
  avg_session_duration FLOAT DEFAULT 0,
  conversion_rate FLOAT DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  cost_per_acquisition DECIMAL(10,2) DEFAULT 0,
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(server_timestamp);
CREATE INDEX IF NOT EXISTS idx_investor_sessions_session_id ON investor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_cta_performance_cta_name ON cta_performance(cta_name);
CREATE INDEX IF NOT EXISTS idx_demo_interactions_session_id ON demo_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnel_session_id ON conversion_funnel(session_id);
CREATE INDEX IF NOT EXISTS idx_geographic_performance_date ON geographic_performance(metric_date);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_date ON performance_metrics(metric_date);

-- Row Level Security Policies (if using Supabase)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_funnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographic_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for analytics tracking
CREATE POLICY "Allow anonymous insert on analytics_events" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on investor_sessions" ON investor_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on cta_performance" ON cta_performance
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on demo_interactions" ON demo_interactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on conversion_funnel" ON conversion_funnel
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read their own data
CREATE POLICY "Users can view own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own sessions" ON investor_sessions
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own CTA performance" ON cta_performance
  FOR SELECT USING (auth.uid()::text = user_id);

-- Functions for automatic calculations
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE investor_sessions
  SET last_activity = NOW(),
      page_views = page_views + 1
  WHERE session_id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_activity
  AFTER INSERT ON analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();

-- Function to calculate conversion funnel updates
CREATE OR REPLACE FUNCTION update_conversion_funnel()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO conversion_funnel (session_id, landed_at)
  VALUES (NEW.session_id, NEW.server_timestamp)
  ON CONFLICT (session_id) DO NOTHING;

  -- Update funnel stages based on events
  IF NEW.event_name = 'page_view' AND NEW.event_params->>'page_path' = '/investors' THEN
    UPDATE conversion_funnel SET viewed_hero = TRUE WHERE session_id = NEW.session_id;
  END IF;

  IF NEW.event_name = 'cta_click' THEN
    UPDATE conversion_funnel SET clicked_cta = TRUE WHERE session_id = NEW.session_id;
  END IF;

  IF NEW.event_name = 'demo_interaction' AND NEW.event_params->>'action' = 'complete' THEN
    UPDATE conversion_funnel SET completed_demo = TRUE WHERE session_id = NEW.session_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversion_funnel
  AFTER INSERT ON analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION update_conversion_funnel();

-- Function to aggregate daily metrics
CREATE OR REPLACE FUNCTION aggregate_daily_metrics()
RETURNS void AS $$
BEGIN
  INSERT INTO performance_metrics (
    metric_date,
    total_sessions,
    unique_visitors,
    page_views,
    conversion_rate,
    total_conversions
  )
  SELECT
    CURRENT_DATE - INTERVAL '1 day' as metric_date,
    COUNT(DISTINCT session_id) as total_sessions,
    COUNT(DISTINCT user_id) as unique_visitors,
    COUNT(*) as page_views,
    CASE
      WHEN COUNT(*) > 0 THEN
        (SELECT COUNT(*) FROM analytics_events ae2
         WHERE ae2.event_name = 'conversion'
         AND DATE(ae2.server_timestamp) = CURRENT_DATE - INTERVAL '1 day')::FLOAT / COUNT(*)
      ELSE 0
    END as conversion_rate,
    (SELECT COUNT(*) FROM analytics_events ae2
     WHERE ae2.event_name = 'conversion'
     AND DATE(ae2.server_timestamp) = CURRENT_DATE - INTERVAL '1 day') as total_conversions
  FROM analytics_events
  WHERE DATE(server_timestamp) = CURRENT_DATE - INTERVAL '1 day'
  ON CONFLICT (metric_date) DO UPDATE SET
    total_sessions = EXCLUDED.total_sessions,
    unique_visitors = EXCLUDED.unique_visitors,
    page_views = EXCLUDED.page_views,
    conversion_rate = EXCLUDED.conversion_rate,
    total_conversions = EXCLUDED.total_conversions;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE analytics_events IS 'Tracks all user interactions and events on the investor landing page';
COMMENT ON TABLE investor_sessions IS 'Contains session-level data for investor visitors';
COMMENT ON TABLE cta_performance IS 'Tracks performance of call-to-action buttons and links';
COMMENT ON TABLE demo_interactions IS 'Records user interactions with the AI demo modal';
COMMENT ON TABLE conversion_funnel IS 'Tracks user progression through the conversion funnel';
COMMENT ON TABLE ab_test_results IS 'Stores results from A/B testing experiments';
COMMENT ON TABLE geographic_performance IS 'Tracks performance by geographic location';
COMMENT ON TABLE investor_leads IS 'Manages qualified investor leads and their quality scores';
COMMENT ON TABLE performance_metrics IS 'Aggregated daily performance metrics';