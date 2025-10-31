import Anthropic from '@anthropic-ai/sdk';
import { Email, EmailAIInsights } from '@/lib/email/types';

export class EmailIntelligence {
  private anthropic: Anthropic;

  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Analyze email and extract AI insights
   */
  async analyzeEmail(email: Email, language: 'en' | 'fr' = 'en'): Promise<EmailAIInsights> {
    const prompt = this.buildAnalysisPrompt(email, language);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      const content = response.content[0];
      const analysisText = content.type === 'text' ? content.text : '{}';

      // Parse the AI response
      try {
        const insights = JSON.parse(analysisText);
        return this.validateAndNormalizeInsights(insights);
      } catch (parseError) {
        console.error('Failed to parse AI insights:', parseError);
        return this.getDefaultInsights(email);
      }
    } catch (error) {
      console.error('Email analysis failed:', error);
      return this.getDefaultInsights(email);
    }
  }

  /**
   * Categorize email based on content
   */
  async categorizeEmail(subject: string, content: string, language: 'en' | 'fr' = 'en'): Promise<{
    category: string;
    confidence: number;
    reasoning: string;
  }> {
    const prompt = language === 'fr' ?
      `Analyse cet email et catégorise-le. Réponds avec un objet JSON:

Email: "${subject}"
Contenu: "${content.substring(0, 500)}..."

Catégories possibles: invoice, contract, important, urgent, newsletter, personal, other

Retourne:
{
  "category": "catégorie",
  "confidence": 0.85,
  "reasoning": "explication brève"
}` :
      `Analyze this email and categorize it. Respond with a JSON object:

Email: "${subject}"
Content: "${content.substring(0, 500)}..."

Possible categories: invoice, contract, important, urgent, newsletter, personal, other

Return:
{
  "category": "category",
  "confidence": 0.85,
  "reasoning": "brief explanation"
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      const content = response.content[0];
      const resultText = content.type === 'text' ? content.text : '{}';

      try {
        return JSON.parse(resultText);
      } catch {
        return { category: 'other', confidence: 0.5, reasoning: 'Failed to categorize' };
      }
    } catch (error) {
      console.error('Email categorization failed:', error);
      return { category: 'other', confidence: 0.5, reasoning: 'Analysis failed' };
    }
  }

  /**
   * Extract key entities from email
   */
  async extractEntities(content: string, language: 'en' | 'fr' = 'en'): Promise<Array<{
    type: 'person' | 'organization' | 'location' | 'date' | 'money';
    text: string;
    confidence: number;
  }>> {
    const prompt = language === 'fr' ?
      `Extrais les entités clés de ce texte. Réponds avec un tableau JSON:

Texte: "${content.substring(0, 800)}..."

Retourne:
[
  {
    "type": "person|organization|location|date|money",
    "text": "texte extrait",
    "confidence": 0.9
  }
]` :
      `Extract key entities from this text. Respond with a JSON array:

Text: "${content.substring(0, 800)}..."

Return:
[
  {
    "type": "person|organization|location|date|money",
    "text": "extracted text",
    "confidence": 0.9
  }
]`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      const content = response.content[0];
      const resultText = content.type === 'text' ? content.text : '[]';

      try {
        return JSON.parse(resultText);
      } catch {
        return [];
      }
    } catch (error) {
      console.error('Entity extraction failed:', error);
      return [];
    }
  }

  /**
   * Generate action items from email
   */
  async generateActionItems(subject: string, content: string, language: 'en' | 'fr' = 'en'): Promise<string[]> {
    const prompt = language === 'fr' ?
      `Identifie les éléments d'action dans cet email. Sois précis et actionnable.

Sujet: "${subject}"
Contenu: "${content}"

Retourne un tableau JSON d'actions:
["action 1", "action 2", "action 3"]` :
      `Identify action items in this email. Be specific and actionable.

Subject: "${subject}"
Content: "${content}"

Return a JSON array of actions:
["action 1", "action 2", "action 3"]`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      });

      const content = response.content[0];
      const resultText = content.type === 'text' ? content.text : '[]';

      try {
        return JSON.parse(resultText);
      } catch {
        return [];
      }
    } catch (error) {
      console.error('Action item generation failed:', error);
      return [];
    }
  }

  /**
   * Generate suggested actions for email
   */
  async generateSuggestedActions(email: Email, insights: EmailAIInsights, language: 'en' | 'fr' = 'en'): Promise<Array<{
    type: string;
    label: string;
    icon: string;
    priority: number;
  }>> {
    const prompt = language === 'fr' ?
      `Génère des actions suggérées pour cet email. Basé sur le contenu et les insights.

Email: ${email.subject}
Catégorie: ${insights.category}
Montant: ${insights.amount || 'N/A'}
Date d'échéance: ${insights.dueDate || 'N/A'}

Retourne un tableau JSON d'actions suggérées:
[
  {
    "type": "reply|archive|extract_data|create_invoice|schedule_meeting",
    "label": "étiquette d'action",
    "icon": "emoji",
    "priority": 1-5
  }
]` :
      `Generate suggested actions for this email. Based on content and insights.

Email: ${email.subject}
Category: ${insights.category}
Amount: ${insights.amount || 'N/A'}
Due Date: ${insights.dueDate || 'N/A'}

Return a JSON array of suggested actions:
[
  {
    "type": "reply|archive|extract_data|create_invoice|schedule_meeting",
    "label": "action label",
    "icon": "emoji",
    "priority": 1-5
  }
]`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      const content = response.content[0];
      const resultText = content.type === 'text' ? content.text : '[]';

      try {
        return JSON.parse(resultText);
      } catch {
        return this.getDefaultActions(insights);
      }
    } catch (error) {
      console.error('Suggested actions generation failed:', error);
      return this.getDefaultActions(insights);
    }
  }

  /**
   * Generate email summary
   */
  async generateSummary(subject: string, content: string, language: 'en' | 'fr' = 'en'): Promise<string> {
    const prompt = language === 'fr' ?
      `Résume cet email en 2-3 phrases claires et concises.

Sujet: "${subject}"
Contenu: "${content}"

Résumé:` :
      `Summarize this email in 2-3 clear, concise sentences.

Subject: "${subject}"
Content: "${content}"

Summary:`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      const content = response.content[0];
      return content.type === 'text' ? content.text : 'Summary unavailable';
    } catch (error) {
      console.error('Summary generation failed:', error);
      return 'Summary unavailable';
    }
  }

  /**
   * Generate reply suggestion
   */
  async generateReplySuggestion(email: Email, tone: 'professional' | 'casual' | 'friendly' = 'professional', language: 'en' | 'fr' = 'en'): Promise<string> {
    const toneDescriptions = {
      professional: language === 'fr' ? 'professionnel et formel' : 'professional and formal',
      casual: language === 'fr' ? 'décontracté mais poli' : 'casual but polite',
      friendly: language === 'fr' ? 'amical et chaleureux' : 'friendly and warm'
    };

    const prompt = language === 'fr' ?
      `Génère une suggestion de réponse pour cet email. Utilise un ton ${toneDescriptions[tone]}.

De: ${email.sender}
Sujet: ${email.subject}
Contenu: ${email.content}

Génère une réponse appropriée:` :
      `Generate a reply suggestion for this email. Use a ${toneDescriptions[tone]} tone.

From: ${email.sender}
Subject: ${email.subject}
Content: ${email.content}

Generate an appropriate reply:`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      });

      const content = response.content[0];
      return content.type === 'text' ? content.text : 'Reply suggestion unavailable';
    } catch (error) {
      console.error('Reply generation failed:', error);
      return 'Reply suggestion unavailable';
    }
  }

  /**
   * Build analysis prompt for email
   */
  private buildAnalysisPrompt(email: Email, language: 'en' | 'fr'): string {
    const basePrompt = language === 'fr' ?
      `Analyse cet email en détail et extrais des informations structurées.

Email:
- De: ${email.sender} (${email.senderEmail})
- Sujet: ${email.subject}
- Date: ${email.date}
- Contenu: ${email.content}
- Pièces jointes: ${email.attachments.length > 0 ? email.attachments.map(a => a.filename).join(', ') : 'Aucune'}

Retourne un objet JSON avec:
{
  "category": "invoice|contract|important|urgent|newsletter|personal|other",
  "confidence": 0.85,
  "amount": 123.45,
  "currency": "CAD",
  "dueDate": "2024-01-15",
  "actionItems": ["action 1", "action 2"],
  "sentiment": "positive|neutral|negative",
  "urgency": "low|medium|high",
  "summary": "résumé en 2-3 phrases",
  "keyEntities": [
    {
      "type": "person|organization|location|date|money",
      "text": "texte extrait",
      "confidence": 0.9
    }
  ],
  "suggestedActions": [
    {
      "type": "reply|archive|extract_data|create_invoice",
      "label": "étiquette",
      "icon": "emoji",
      "priority": 3
    }
  ],
  "extractedData": {
    "invoiceNumber": "INV-001",
    "clientName": "Nom du client",
    "paymentTerms": "30 jours"
  }
}` :
      `Analyze this email in detail and extract structured information.

Email:
- From: ${email.sender} (${email.senderEmail})
- Subject: ${email.subject}
- Date: ${email.date}
- Content: ${email.content}
- Attachments: ${email.attachments.length > 0 ? email.attachments.map(a => a.filename).join(', ') : 'None'}

Return a JSON object with:
{
  "category": "invoice|contract|important|urgent|newsletter|personal|other",
  "confidence": 0.85,
  "amount": 123.45,
  "currency": "USD",
  "dueDate": "2024-01-15",
  "actionItems": ["action 1", "action 2"],
  "sentiment": "positive|neutral|negative",
  "urgency": "low|medium|high",
  "summary": "2-3 sentence summary",
  "keyEntities": [
    {
      "type": "person|organization|location|date|money",
      "text": "extracted text",
      "confidence": 0.9
    }
  ],
  "suggestedActions": [
    {
      "type": "reply|archive|extract_data|create_invoice",
      "label": "label",
      "icon": "emoji",
      "priority": 3
    }
  ],
  "extractedData": {
    "invoiceNumber": "INV-001",
    "clientName": "Client Name",
    "paymentTerms": "30 days"
  }
}`;

    return basePrompt;
  }

  /**
   * Validate and normalize AI insights
   */
  private validateAndNormalizeInsights(insights: any): EmailAIInsights {
    return {
      category: insights.category || 'other',
      confidence: Math.min(Math.max(insights.confidence || 0.5, 0), 1),
      amount: insights.amount || undefined,
      currency: insights.currency || undefined,
      dueDate: insights.dueDate || undefined,
      actionItems: Array.isArray(insights.actionItems) ? insights.actionItems : [],
      sentiment: insights.sentiment || 'neutral',
      urgency: insights.urgency || 'medium',
      summary: insights.summary || '',
      keyEntities: Array.isArray(insights.keyEntities) ? insights.keyEntities : [],
      suggestedActions: Array.isArray(insights.suggestedActions) ? insights.suggestedActions : [],
      extractedData: insights.extractedData || {},
    };
  }

  /**
   * Get default insights when AI analysis fails
   */
  private getDefaultInsights(email: Email): EmailAIInsights {
    return {
      category: 'other',
      confidence: 0.5,
      sentiment: 'neutral',
      urgency: 'medium',
      summary: email.content.substring(0, 200) + '...',
      keyEntities: [],
      suggestedActions: this.getDefaultActions({ category: 'other' } as EmailAIInsights),
      extractedData: {},
    };
  }

  /**
   * Get default actions based on category
   */
  private getDefaultActions(insights: EmailAIInsights): Array<{
    type: string;
    label: string;
    icon: string;
    priority: number;
  }> {
    const actionMap = {
      invoice: [
        { type: 'extract_data', label: 'Extract Data', icon: '📊', priority: 1 },
        { type: 'create_invoice', label: 'Create Invoice', icon: '🧾', priority: 2 },
        { type: 'archive', label: 'Archive', icon: '📁', priority: 3 },
      ],
      contract: [
        { type: 'extract_data', label: 'Extract Terms', icon: '📄', priority: 1 },
        { type: 'reply', label: 'Review Contract', icon: '✍️', priority: 2 },
        { type: 'archive', label: 'Archive', icon: '📁', priority: 3 },
      ],
      important: [
        { type: 'reply', label: 'Reply Soon', icon: '⚡', priority: 1 },
        { type: 'schedule_meeting', label: 'Schedule Meeting', icon: '📅', priority: 2 },
      ],
      urgent: [
        { type: 'reply', label: 'Reply Urgently', icon: '🚨', priority: 1 },
        { type: 'schedule_meeting', label: 'Emergency Meeting', icon: '🆘', priority: 2 },
      ],
    };

    return actionMap[insights.category as keyof typeof actionMap] || [
      { type: 'reply', label: 'Reply', icon: '✉️', priority: 3 },
      { type: 'archive', label: 'Archive', icon: '📁', priority: 4 },
    ];
  }
}

// Singleton instance
export const emailIntel = new EmailIntelligence();