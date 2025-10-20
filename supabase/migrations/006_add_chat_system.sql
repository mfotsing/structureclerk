-- Migration 006: AI Chat Assistant System
-- Purpose: Add tables and functions for conversational AI assistant
-- Date: 2025-01-20

-- ============================================================================
-- PART 1: Chat conversations table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conversation metadata
  title TEXT, -- Auto-generated from first message
  context_snapshot JSONB, -- Snapshot of org data when conversation started

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_chat_conversations_org ON public.chat_conversations(organization_id);
CREATE INDEX idx_chat_conversations_user ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_updated ON public.chat_conversations(updated_at DESC);

-- ============================================================================
-- PART 2: Chat messages table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- AI metadata
  metadata JSONB, -- tokens, model, sources, execution_time

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created ON public.chat_messages(created_at DESC);
CREATE INDEX idx_chat_messages_role ON public.chat_messages(role);

-- ============================================================================
-- PART 3: Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view own conversations"
  ON public.chat_conversations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create own conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations"
  ON public.chat_conversations FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own conversations"
  ON public.chat_conversations FOR DELETE
  USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages in own conversations"
  ON public.chat_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.chat_conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.chat_conversations WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- PART 4: Functions and triggers
-- ============================================================================

-- Function to update conversation timestamps
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_conversations
  SET
    last_message_at = NOW(),
    updated_at = NOW()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on new message
CREATE TRIGGER trigger_update_conversation_timestamp
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Function to auto-generate conversation title
CREATE OR REPLACE FUNCTION auto_generate_conversation_title()
RETURNS TRIGGER AS $$
DECLARE
  v_first_message TEXT;
BEGIN
  -- Only if title is null and this is a user message
  IF NEW.role = 'user' THEN
    SELECT title INTO v_first_message
    FROM public.chat_conversations
    WHERE id = NEW.conversation_id;

    IF v_first_message IS NULL THEN
      UPDATE public.chat_conversations
      SET title = LEFT(NEW.content, 60) || CASE WHEN LENGTH(NEW.content) > 60 THEN '...' ELSE '' END
      WHERE id = NEW.conversation_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-title
CREATE TRIGGER trigger_auto_title_conversation
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_conversation_title();

-- ============================================================================
-- PART 5: Helper views
-- ============================================================================

-- View for recent conversations with message count
CREATE OR REPLACE VIEW recent_chat_conversations AS
SELECT
  c.id,
  c.organization_id,
  c.user_id,
  c.title,
  c.created_at,
  c.updated_at,
  c.last_message_at,
  COUNT(m.id) AS message_count,
  MAX(m.created_at) AS last_message_time
FROM public.chat_conversations c
LEFT JOIN public.chat_messages m ON m.conversation_id = c.id
GROUP BY c.id
ORDER BY c.last_message_at DESC NULLS LAST;

-- Grant access
GRANT SELECT ON recent_chat_conversations TO authenticated;

-- ============================================================================
-- PART 6: Comments for documentation
-- ============================================================================

COMMENT ON TABLE public.chat_conversations IS
  'Stores AI chat conversations for the assistant feature';

COMMENT ON TABLE public.chat_messages IS
  'Stores individual messages in chat conversations';

COMMENT ON VIEW recent_chat_conversations IS
  'Shows recent conversations with message counts';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 006 completed successfully!';
  RAISE NOTICE '💬 Chat system tables created';
  RAISE NOTICE '🔒 RLS policies enabled';
  RAISE NOTICE '⚡ Triggers configured for auto-updates';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Implement context builder for org data';
  RAISE NOTICE '2. Create Claude chat agent';
  RAISE NOTICE '3. Build chat UI component';
  RAISE NOTICE '4. Test with sample queries';
END $$;
