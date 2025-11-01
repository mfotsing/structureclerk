// AI Service - Real AI Integration
// Supports Anthropic Claude and OpenAI for production use

import { z } from 'zod'

// AI Provider types
export type AIProvider = 'anthropic' | 'openai'

// AI Response schemas
export const AIResponseSchema = z.object({
  content: z.string(),
  confidence: z.number().min(0).max(100),
  reasoning: z.array(z.object({
    step: z.number(),
    description: z.string(),
    evidence: z.array(z.string()),
    confidence: z.number().min(0).max(100)
  })),
  actions: z.array(z.string()).optional(),
  relatedQueries: z.array(z.string()).optional(),
  alternative: z.string().optional(),
  metadata: z.object({
    model: z.string(),
    provider: z.string(),
    tokensUsed: z.number(),
    processingTime: z.number()
  })
})

export type AIResponse = z.infer<typeof AIResponseSchema>

export interface DocumentAnalysisRequest {
  documentId: string
  content: string
  documentType?: string
  businessContext?: {
    industry?: string
    province?: string
    currency?: string
    language?: string
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  context?: {
    documentIds?: string[]
    previousMessages?: ChatMessage[]
    businessContext?: any
  }
}

export interface ChatRequest {
  message: string
  conversationHistory: ChatMessage[]
  businessContext?: {
    province?: string
    currency?: string
    industry?: string
    companySize?: string
  }
}

export interface TaxInquiryRequest {
  province: string
  amount: number
  transactionType: 'income' | 'expense' | 'purchase'
  category: string
  description: string
}

class AIService {
  private static instance: AIService
  private apiKey: string
  private provider: AIProvider
  private baseURL: string

  private constructor() {
    // Initialize with environment variables
    this.apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || ''
    this.provider = (process.env.AI_PROVIDER as AIProvider) || 'anthropic'
    this.baseURL = this.getBaseURL()
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  private getBaseURL(): string {
    switch (this.provider) {
      case 'anthropic':
        return 'https://api.anthropic.com'
      case 'openai':
        return 'https://api.openai.com/v1'
      default:
        return 'https://api.anthropic.com'
    }
  }

  // Analyze document with real AI
  async analyzeDocument(request: DocumentAnalysisRequest): Promise<AIResponse> {
    const prompt = this.buildDocumentAnalysisPrompt(request)

    try {
      const response = await this.callAI(prompt, 'document_analysis')
      return this.parseAIResponse(response, request)
    } catch (error) {
      console.error('Document analysis failed:', error)
      throw new Error('Failed to analyze document')
    }
  }

  // Process chat with business context
  async processChat(request: ChatRequest): Promise<AIResponse> {
    const prompt = this.buildChatPrompt(request)

    try {
      const response = await this.callAI(prompt, 'chat')
      return this.parseAIResponse(response, { ...request, businessContext: request.businessContext })
    } catch (error) {
      console.error('Chat processing failed:', error)
      throw new Error('Failed to process chat message')
    }
  }

  // Get tax advice for Canadian businesses
  async getTaxAdvice(request: TaxInquiryRequest): Promise<AIResponse> {
    const prompt = this.buildTaxPrompt(request)

    try {
      const response = await this.callAI(prompt, 'tax_advice')
      return this.parseAIResponse(response, request)
    } catch (error) {
      console.error('Tax advice failed:', error)
      throw new Error('Failed to get tax advice')
    }
  }

  // Generate business insights
  async generateBusinessInsights(metrics: {
    revenue: number
    expenses: number
    profit: number
    documentsProcessed: number
    province: string
    industry: string
  }): Promise<AIResponse> {
    const prompt = this.buildInsightsPrompt(metrics)

    try {
      const response = await this.callAI(prompt, 'insights')
      return this.parseAIResponse(response, metrics)
    } catch (error) {
      console.error('Insights generation failed:', error)
      throw new Error('Failed to generate insights')
    }
  }

  private buildDocumentAnalysisPrompt(request: DocumentAnalysisRequest): string {
    const { content, documentType, businessContext } = request

    const businessContextText = businessContext
      ? `- Industry: ${businessContext.industry || 'Unknown'}
- Province: ${businessContext.province || 'Unknown'}
- Currency: ${businessContext.currency || 'CAD'}
- Language: ${businessContext.language || 'English'}`
      : 'Not provided'

    return `You are StructureClerk AI, a specialized assistant for Canadian small businesses. Analyze this document and provide detailed insights.

Document Content:
${content}

Document Type: ${documentType || 'Unknown'}
Business Context:
${businessContextText}

Provide analysis with:
1. Document classification with confidence level
2. Key information extraction
3. Business relevance and action items
4. Compliance considerations for ${businessContext?.province || 'Canada'}
5. Recommendations for the business owner

Format your response as JSON with these fields:
{
  "content": "Main analysis and recommendations",
  "confidence": 0-100,
  "reasoning": [
    {
      "step": 1,
      "description": "Analysis step description",
      "evidence": ["Evidence from document"],
      "confidence": 0-100
    }
  ],
  "actions": ["Recommended actions"],
  "relatedQueries": ["Suggested follow-up questions"]
}`
  }

  private buildChatPrompt(request: ChatRequest): string {
    const { message, conversationHistory, businessContext } = request

    const historyText = conversationHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')

    const businessContextText = businessContext
      ? `- Province: ${businessContext.province || 'Unknown'}
- Currency: ${businessContext.currency || 'CAD'}
- Industry: ${businessContext.industry || 'Unknown'}
- Company Size: ${businessContext.companySize || 'Unknown'}`
      : 'Not provided'

    return `You are StructureClerk AI, specializing in Canadian small business management.

Business Context:
${businessContextText}

Recent Conversation:
${historyText}

Current Question: ${message}

Provide helpful, actionable advice for Canadian small businesses. Consider:
- Provincial regulations and taxes
- Canadian business practices
- Industry-specific guidance
- Practical, implementable suggestions

Format your response as JSON:
{
  "content": "Your helpful response",
  "confidence": 0-100,
  "reasoning": [
    {
      "step": 1,
      "description": "How you arrived at this advice",
      "evidence": ["Key considerations"],
      "confidence": 0-100
    }
  ],
  "actions": ["Actionable steps"],
  "relatedQueries": ["Follow-up questions they might have"]
}`
  }

  private buildTaxPrompt(request: TaxInquiryRequest): string {
    const { province, amount, transactionType, category, description } = request

    return `You are StructureClerk AI, specializing in Canadian tax regulations for small businesses.

Tax Inquiry:
- Province: ${province}
- Amount: $${amount}
- Transaction Type: ${transactionType}
- Category: ${category}
- Description: ${description}

Provide tax advice including:
1. Tax implications and deductibility
2. Required documentation
3. Filing requirements
4. Deadlines and timing
5. Optimization opportunities
6. Compliance considerations

Format your response as JSON:
{
  "content": "Detailed tax advice",
  "confidence": 0-100,
  "reasoning": [
    {
      "step": 1,
      "description": "Tax analysis process",
      "evidence": ["Tax rules considered"],
      "confidence": 0-100
    }
  ],
  "actions": ["Required tax actions"],
  "relatedQueries": ["Additional tax questions to consider"]
}`
  }

  private buildInsightsPrompt(metrics: any): string {
    const { revenue, expenses, profit, documentsProcessed, province, industry } = metrics

    return `You are StructureClerk AI, analyzing business performance for Canadian small businesses.

Current Metrics:
- Revenue: $${revenue}
- Expenses: $${expenses}
- Profit: $${profit}
- Documents Processed: ${documentsProcessed}
- Province: ${province}
- Industry: ${industry}

Provide business insights including:
1. Performance analysis
2. Trends and patterns
3. Optimization opportunities
4. Risk assessment
5. Growth recommendations
6. Compliance considerations

Format your response as JSON:
{
  "content": "Business insights and recommendations",
  "confidence": 0-100,
  "reasoning": [
    {
      "step": 1,
      "description": "Business analysis approach",
      "evidence": ["Key metrics analyzed"],
      "confidence": 0-100
    }
  ],
  "actions": ["Recommended business actions"],
  "relatedQueries": ["Strategic questions to explore"]
}`
  }

  private async callAI(prompt: string, useCase: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('AI API key not configured')
    }

    switch (this.provider) {
      case 'anthropic':
        return this.callAnthropic(prompt)
      case 'openai':
        return this.callOpenAI(prompt)
      default:
        throw new Error(`Unsupported AI provider: ${this.provider}`)
    }
  }

  private async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.content[0].text
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for Canadian small businesses. Always provide responses in JSON format as requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  private parseAIResponse(response: string, context: any): AIResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      const jsonResponse = JSON.parse(jsonMatch[0])
      const validated = AIResponseSchema.parse(jsonResponse)

      return {
        ...validated,
        metadata: {
          model: this.provider === 'anthropic' ? 'claude-3-sonnet' : 'gpt-4-turbo',
          provider: this.provider,
          tokensUsed: 0, // Would be calculated from API response
          processingTime: Date.now()
        }
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)

      // Fallback response
      return {
        content: response,
        confidence: 75,
        reasoning: [{
          step: 1,
          description: 'AI response generated',
          evidence: ['AI processing completed'],
          confidence: 75
        }],
        actions: ['Review AI response'],
        relatedQueries: ['Ask for clarification if needed'],
        metadata: {
          model: 'fallback',
          provider: this.provider,
          tokensUsed: 0,
          processingTime: Date.now()
        }
      }
    }
  }

  // Health check for AI service
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; provider: AIProvider; message?: string }> {
    try {
      const response = await this.callAI('Respond with "OK"', 'health_check')
      return {
        status: response.includes('OK') ? 'healthy' : 'unhealthy',
        provider: this.provider
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        provider: this.provider,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export default AIService