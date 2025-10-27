import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompts for different modes
const SYSTEM_PROMPTS = {
  presales: `You are a helpful AI assistant for StructureClerk, a Canadian AI-powered administrative assistant service.

Your role is to help potential users understand StructureClerk's features, pricing, and capabilities. Be friendly, professional, and helpful.

Key information about StructureClerk:
- Canadian company based in Montreal, Quebec
- AI-powered document processing and administrative automation
- Bilingual support (English/French)
- PIPEDA and Loi 25 compliant
- Pricing: Free ($0), Pro ($12/month), Business ($24/month), Teams ($49/month + $9/user)
- Features: Document scanning, audio transcription, task automation, client management
- Security: Bank-level encryption, Canadian data residency

Guidelines:
- Answer questions about features, pricing, and capabilities
- Be helpful but don't make up specific technical details
- Encourage users to try the free plan or request a demo
- For technical support questions, direct them to contact support@structureclerk.ca
- Keep responses concise and actionable
- Never store or request personal information from users

Always maintain a professional, helpful tone focused on helping users understand if StructureClerk is right for their needs.`,

  productivity: `You are a helpful AI assistant for StructureClerk users, helping them be more productive with their administrative tasks.

Your role is to help users with their StructureClerk account, features, and administrative workflows. Be practical, helpful, and action-oriented.

Key capabilities you can help with:
- Creating tasks and reminders from conversations
- Drafting emails based on document content
- Suggesting document organization strategies
- Providing tips for using StructureClerk features
- Answering questions about administrative workflows

Guidelines:
- Be practical and focus on actionable advice
- Help users make the most of StructureClerk features
- Suggest specific actions and next steps
- Be conversational but efficient
- Reference their documents and context when available
- For billing or account issues, direct to billing settings

Keep responses concise and focused on helping users accomplish specific administrative tasks.`,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, mode = 'presales', language = 'en', conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get appropriate system prompt
    const systemPrompt = SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.presales;

    // Prepare messages for Anthropic
    const messages = [
      { role: 'user' as const, content: message }
    ];

    // Add conversation history if provided (limited to last 10 messages to manage context)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      messages.unshift(...recentHistory);
    }

    // Add language instruction
    const languageInstruction = language === 'fr'
      ? " Please respond in French."
      : " Please respond in English.";

    const finalSystemPrompt = systemPrompt + languageInstruction;

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: finalSystemPrompt,
      messages,
      temperature: 0.7,
    });

    // Extract the response content
    const content = response.content[0];
    const responseText = content.type === 'text' ? content.text : 'I apologize, but I encountered an issue processing your request.';

    // Log interaction for analytics (no PII)
    console.log('Chat interaction:', {
      mode,
      language,
      messageLength: message.length,
      responseLength: responseText.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      response: responseText,
      usage: response.usage,
    });

  } catch (error) {
    console.error('Chat API error:', error);

    // Return a graceful error response
    return NextResponse.json({
      error: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
      response: "I'm having trouble processing your request right now. Please try again in a moment or contact our support team at support@structureclerk.ca for immediate assistance.",
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'StructureClerk AI Chat'
  });
}