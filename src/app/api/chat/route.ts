import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chat } from '@/lib/ai/chat/agent'

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_id } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'Organisation introuvable' }, { status: 404 })
    }

    // Create or get conversation
    let convId = conversation_id

    if (!convId) {
      const { data: newConv } = await supabase
        .from('chat_conversations')
        .insert({ organization_id: profile.organization_id, user_id: user.id })
        .select()
        .single()
      convId = newConv?.id
    }

    // Get history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })
      .limit(20)

    // Save user message
    await supabase.from('chat_messages').insert({
      conversation_id: convId,
      role: 'user',
      content: message,
    })

    // Get AI response
    const { response, tokens } = await chat(profile.organization_id, message, messages || [])

    // Save assistant message
    await supabase.from('chat_messages').insert({
      conversation_id: convId,
      role: 'assistant',
      content: response,
      metadata: { tokens, model: 'claude-3-5-sonnet-20241022' },
    })

    // Log AI usage
    await supabase.rpc('log_ai_usage', {
      p_organization_id: profile.organization_id,
      p_user_id: user.id,
      p_operation: 'chat',
      p_tokens_input: tokens.input,
      p_tokens_output: tokens.output,
      p_model: 'claude-3-5-sonnet-20241022',
    })

    return NextResponse.json({ conversation_id: convId, response, tokens })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Erreur chat' }, { status: 500 })
  }
}
