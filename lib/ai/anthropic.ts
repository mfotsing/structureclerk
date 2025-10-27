import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// AI model configuration
const MODEL = 'claude-3-sonnet-20240229';

export interface ExtractionResult {
  invoiceNumber?: string;
  clientName?: string;
  amount?: number;
  dueDate?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  confidence?: number;
}

export interface SummaryResult {
  summary: string;
  actionItems: Array<{
    text: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    assignee?: string;
  }>;
  entities: {
    clients?: string[];
    projects?: string[];
    amounts?: Array<{ amount: number; context: string }>;
    dates?: Array<{ date: string; context: string }>;
  };
}

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
  attachments?: Array<{
    name: string;
    content: string;
  }>;
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
  actions?: Array<{
    type: 'create_task' | 'send_email' | 'create_invoice' | 'schedule_followup';
    title: string;
    description: string;
  }>;
}

/**
 * Extract structured data from document text using Claude
 */
export async function extractFromDocument(text: string): Promise<ExtractionResult> {
  try {
    const prompt = `Extract structured information from this document text. Focus on invoices, contracts, or quotes.

Document text:
${text}

Please extract the following information if present:
- Invoice number
- Client name
- Total amount
- Due date
- Line items (description, quantity, unit price, total)

Return a JSON object with the extracted information and a confidence score (0-1).`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const response = message.content[0];
    if (response.type === 'text') {
      try {
        // Try to parse JSON from the response
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Failed to parse JSON from Claude response:', parseError);
      }
    }

    throw new Error('No valid JSON response from Claude');
  } catch (error) {
    console.error('Error extracting from document:', error);
    throw new Error('Failed to extract information from document');
  }
}

/**
 * Generate summary and action items from meeting transcript
 */
export async function summarizeTranscript(transcript: string): Promise<SummaryResult> {
  try {
    const prompt = `Analyze this meeting transcript and provide a structured summary.

Transcript:
${transcript}

Please provide:
1. A concise summary of the meeting
2. Action items with priority levels (low/medium/high)
3. Key entities mentioned (clients, projects, amounts, dates)

Return a JSON object with the structure:
{
  "summary": "Meeting summary text",
  "actionItems": [
    {
      "text": "Action item description",
      "priority": "high|medium|low",
      "dueDate": "YYYY-MM-DD if mentioned",
      "assignee": "Person name if mentioned"
    }
  ],
  "entities": {
    "clients": ["Client1", "Client2"],
    "projects": ["Project1", "Project2"],
    "amounts": [{"amount": 1000, "context": "Project budget"}],
    "dates": [{"date": "2024-01-15", "context": "Meeting date"}]
  }
}`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const response = message.content[0];
    if (response.type === 'text') {
      try {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Failed to parse JSON from Claude response:', parseError);
      }
    }

    throw new Error('No valid JSON response from Claude');
  } catch (error) {
    console.error('Error summarizing transcript:', error);
    throw new Error('Failed to summarize transcript');
  }
}

/**
 * Draft email based on context and instructions
 */
export async function draftEmail(
  context: string,
  instructions: string,
  tone: 'professional' | 'friendly' | 'formal' = 'professional'
): Promise<EmailDraft> {
  try {
    const prompt = `Draft an email based on the following context and instructions.

Context: ${context}
Instructions: ${instructions}
Tone: ${tone}

Please draft an email with:
- Clear subject line
- Appropriate greeting and closing
- Well-structured body
- Any necessary attachments mentioned

Return a JSON object with:
{
  "to": "recipient@example.com",
  "subject": "Email subject",
  "body": "Full email body with greeting and closing",
  "attachments": [{"name": "filename.pdf", "content": "description"}]
}`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const response = message.content[0];
    if (response.type === 'text') {
      try {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Failed to parse JSON from Claude response:', parseError);
      }
    }

    throw new Error('No valid JSON response from Claude');
  } catch (error) {
    console.error('Error drafting email:', error);
    throw new Error('Failed to draft email');
  }
}

/**
 * Chat with AI assistant for productivity and support
 */
export async function chatWithAI(
  message: string,
  context?: {
    currentPlan?: string;
    usage?: { documents: number; audioMinutes: number };
    recentActivity?: string[];
  }
): Promise<ChatResponse> {
  try {
    let systemPrompt = `You are a helpful AI assistant for StructureClerk, a document management and business automation platform. You help users with:

1. Document processing and management
2. Task creation and automation
3. Email drafting and communication
4. Meeting transcription and summaries
5. Invoice creation and tracking
6. General productivity advice

Tone: Productive, concise, and helpful. Provide direct, actionable responses.

${context ? `
User Context:
- Current Plan: ${context.currentPlan || 'Free'}
- Usage: ${context.usage?.documents || 0} documents, ${context.usage?.audioMinutes || 0} audio minutes
- Recent Activity: ${context.recentActivity?.join(', ') || 'None'}
` : ''}

If suggesting features or upgrades, mention them naturally without being pushy.`;

    const userMessage = `User message: ${message}

Please provide a helpful response and suggest relevant actions the user might want to take next.

Return a JSON object with:
{
  "response": "Your helpful response",
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "actions": [
    {
      "type": "create_task|send_email|create_invoice|schedule_followup",
      "title": "Action title",
      "description": "Brief description of what this does"
    }
  ]
}`;

    const aiMessage = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        { role: 'user' as const, content: userMessage }
      ]
    });

    const response = aiMessage.content[0];
    if (response.type === 'text') {
      try {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Failed to parse JSON from Claude response:', parseError);
        // Fallback to text response
        return {
          response: response.text,
          suggestions: [],
          actions: []
        };
      }
    }

    throw new Error('No valid response from Claude');
  } catch (error) {
    console.error('Error chatting with AI:', error);
    throw new Error('Failed to get AI response');
  }
}

/**
 * Generate automated responses for common business scenarios
 */
export async function generateBusinessResponse(
  scenario: 'follow_up' | 'payment_reminder' | 'project_update' | 'meeting_request',
  details: Record<string, any>
): Promise<string> {
  try {
    const prompts = {
      follow_up: `Generate a polite follow-up email. Client: ${details.clientName}, Topic: ${details.topic}, Days since last contact: ${details.days}`,
      payment_reminder: `Generate a professional payment reminder. Invoice: ${details.invoiceNumber}, Amount: ${details.amount}, Due date: ${details.dueDate}`,
      project_update: `Generate a project status update. Project: ${details.projectName}, Status: ${details.status}, Progress: ${details.progress}%`,
      meeting_request: `Generate a meeting request email. Purpose: ${details.purpose}, Attendees: ${details.attendees}, Duration: ${details.duration}`
    };

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompts[scenario]
      }]
    });

    const response = message.content[0];
    return response.type === 'text' ? response.text : '';
  } catch (error) {
    console.error('Error generating business response:', error);
    throw new Error('Failed to generate response');
  }
}

export default anthropic;