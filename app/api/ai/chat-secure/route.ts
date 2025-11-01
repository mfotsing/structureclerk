import { NextRequest, NextResponse } from 'next/server'
import AIService from '@/lib/ai-service'

// POST /api/ai/chat-secure - Secure AI chat with business context
export async function POST(request: NextRequest) {
  try {
    // Verify request origin (basic security)
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://structureclerk.vercel.app',
      'https://structureclerk.ca'
    ]

    if (!allowedOrigins.includes(origin || '')) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { message, conversationHistory, businessContext } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Validate message length
    if (message.length > 10000) {
      return NextResponse.json(
        { error: 'Message too long' },
        { status: 400 }
      )
    }

    const aiService = AIService.getInstance()

    // Format conversation history
    const formattedHistory = conversationHistory?.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      context: msg.context
    })) || []

    // Validate conversation history size
    if (formattedHistory.length > 50) {
      return NextResponse.json(
        { error: 'Conversation history too long' },
        { status: 400 }
      )
    }

    const response = await aiService.processChat({
      message,
      conversationHistory: formattedHistory,
      businessContext: {
        province: businessContext?.province || 'ON',
        currency: businessContext?.currency || 'CAD',
        industry: businessContext?.industry || 'Unknown',
        companySize: businessContext?.companySize || 'Unknown'
      }
    })

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('AI Chat Secure API error:', error)

    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}