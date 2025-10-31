import { useState, useCallback } from 'react';
import type { SearchResult, SearchResponse } from '@/types/search';

export class ClerkSearchEngine {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL || '');
    this.apiKey = apiKey;
  }

  /**
   * Perform a semantic search across all content types
   */
  async search(query: string, options: {
    userId: string;
    filters?: Record<string, any>;
    limit?: number;
    offset?: number;
    language?: 'en' | 'fr';
  }): Promise<SearchResponse> {
    const response = await fetch(`${this.baseUrl}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify({
        query,
        userId: options.userId,
        filters: options.filters || {},
        limit: options.limit || 10,
        offset: options.offset || 0,
        language: options.language || 'en',
      }),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(partialQuery: string, userId: string, language: 'en' | 'fr' = 'en'): Promise<string[]> {
    try {
      const response = await this.search(partialQuery, {
        userId,
        limit: 5,
        language,
      });
      return response.suggestions || [];
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  /**
   * Quick search with predefined filters for common use cases
   */
  async quickSearch(query: string, userId: string, type?: 'document' | 'email' | 'invoice' | 'audio' | 'project' | 'client'): Promise<SearchResponse> {
    const filters = type ? { type } : {};
    return this.search(query, { userId, filters });
  }

  /**
   * Natural language date parsing (e.g., "last month", "2023 Q4")
   */
  parseDateQuery(dateString: string): { start?: Date; end?: Date } | null {
    const now = new Date();
    const lower = dateString.toLowerCase();

    // Common date patterns
    if (lower.includes('aujourd\'hui') || lower.includes('today')) {
      return { start: new Date(now.setHours(0, 0, 0, 0)), end: new Date(now.setHours(23, 59, 59, 999)) };
    }

    if (lower.includes('hier') || lower.includes('yesterday')) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: new Date(yesterday.setHours(0, 0, 0, 0)), end: new Date(yesterday.setHours(23, 59, 59, 999)) };
    }

    if (lower.includes('cette semaine') || lower.includes('this week')) {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return { start: startOfWeek, end: now };
    }

    if (lower.includes('ce mois-ci') || lower.includes('this month')) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: startOfMonth, end: now };
    }

    if (lower.includes('l\'année dernière') || lower.includes('last year')) {
      const lastYear = now.getFullYear() - 1;
      return {
        start: new Date(lastYear, 0, 1),
        end: new Date(lastYear, 11, 31, 23, 59, 59, 999)
      };
    }

    // Quarter parsing
    const quarterMatch = lower.match(/(\d{4})\s*q([1-4])/);
    if (quarterMatch) {
      const year = parseInt(quarterMatch[1]);
      const quarter = parseInt(quarterMatch[2]);
      const startMonth = (quarter - 1) * 3;
      const endMonth = quarter * 3 - 1;

      return {
        start: new Date(year, startMonth, 1),
        end: new Date(year, endMonth, 31, 23, 59, 59, 999)
      };
    }

    // Month parsing (French and English)
    const months = {
      'janvier': 0, 'january': 0,
      'février': 1, 'february': 1,
      'mars': 2, 'march': 2,
      'avril': 3, 'april': 3,
      'mai': 4, 'may': 4,
      'juin': 5, 'june': 5,
      'juillet': 6, 'july': 6,
      'août': 7, 'august': 7,
      'septembre': 8, 'september': 8,
      'octobre': 9, 'october': 9,
      'novembre': 10, 'november': 10,
      'décembre': 11, 'december': 11,
    };

    for (const [monthName, monthIndex] of Object.entries(months)) {
      if (lower.includes(monthName)) {
        const yearMatch = lower.match(/\b(20\d{2})\b/);
        const year = yearMatch ? parseInt(yearMatch[1]) : now.getFullYear();

        return {
          start: new Date(year, monthIndex, 1),
          end: new Date(year, monthIndex + 1, 0, 23, 59, 59, 999)
        };
      }
    }

    return null;
  }

  /**
   * Extract monetary amounts from queries
   */
  extractMonetaryAmounts(query: string): number[] {
    const patterns = [
      /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/g,  // $1,234.56
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*\$/g,  // 1,234.56$
      /(\d+(?:\.\d{2})?)\s*(?:dollars?|euros?|cad|usd|eur)/gi,  // 1234 dollars
    ];

    const amounts: number[] = [];

    patterns.forEach(pattern => {
      const matches = query.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const number = parseFloat(match.replace(/[^0-9.]/g, ''));
          if (!isNaN(number)) {
            amounts.push(number);
          }
        });
      }
    });

    return amounts;
  }

  /**
   * Detect search intent from query
   */
  detectIntent(query: string): {
    type: 'find_document' | 'find_invoice' | 'find_email' | 'find_client' | 'find_project' | 'general_search';
    confidence: number;
    entities: Record<string, any>;
  } {
    const lower = query.toLowerCase();
    const entities: Record<string, any> = {};

    // Document-related keywords
    if (lower.includes('document') || lower.includes('fichier') || lower.includes('file')) {
      return { type: 'find_document', confidence: 0.8, entities };
    }

    // Invoice-related keywords
    if (lower.includes('facture') || lower.includes('invoice') || lower.includes('paiement') || lower.includes('payment')) {
      entities.amounts = this.extractMonetaryAmounts(query);
      return { type: 'find_invoice', confidence: 0.9, entities };
    }

    // Email-related keywords
    if (lower.includes('email') || lower.includes('courriel') || lower.includes('mail')) {
      return { type: 'find_email', confidence: 0.8, entities };
    }

    // Client-related keywords
    if (lower.includes('client') || lower.includes('customer') || lower.includes('contact')) {
      return { type: 'find_client', confidence: 0.8, entities };
    }

    // Project-related keywords
    if (lower.includes('projet') || lower.includes('project')) {
      return { type: 'find_project', confidence: 0.8, entities };
    }

    return { type: 'general_search', confidence: 0.5, entities };
  }

  /**
   * Format search results for display
   */
  formatResult(result: SearchResult, language: 'en' | 'fr' = 'en'): {
    icon: string;
    color: string;
    badge: string;
    description: string;
    actions: Array<{ label: string; action: string; icon: string }>;
  } {
    const typeConfig = {
      document: {
        icon: '📄',
        color: 'blue',
        badge: language === 'fr' ? 'Document' : 'Document',
        actions: [
          { label: language === 'fr' ? 'Ouvrir' : 'Open', action: 'open', icon: '👁️' },
          { label: language === 'fr' ? 'Résumer' : 'Summarize', action: 'summarize', icon: '📝' },
          { label: language === 'fr' ? 'Partager' : 'Share', action: 'share', icon: '📤' },
        ]
      },
      email: {
        icon: '📧',
        color: 'purple',
        badge: language === 'fr' ? 'Email' : 'Email',
        actions: [
          { label: language === 'fr' ? 'Lire' : 'Read', action: 'open', icon: '📨' },
          { label: language === 'fr' ? 'Répondre' : 'Reply', action: 'reply', icon: '↩️' },
          { label: language === 'fr' ? 'Attacher au client' : 'Attach to client', action: 'attach', icon: '🔗' },
        ]
      },
      invoice: {
        icon: '🧾',
        color: 'green',
        badge: language === 'fr' ? 'Facture' : 'Invoice',
        actions: [
          { label: language === 'fr' ? 'Voir' : 'View', action: 'open', icon: '👁️' },
          { label: language === 'fr' ? 'Exporter' : 'Export', action: 'export', icon: '📊' },
          { label: language === 'fr' ? 'Envoyer' : 'Send', action: 'send', icon: '📤' },
        ]
      },
      audio: {
        icon: '🎙️',
        color: 'red',
        badge: language === 'fr' ? 'Audio' : 'Audio',
        actions: [
          { label: language === 'fr' ? 'Écouter' : 'Listen', action: 'play', icon: '▶️' },
          { label: language === 'fr' ? 'Transcrire' : 'Transcribe', action: 'transcribe', icon: '📝' },
          { label: language === 'fr' ? 'Résumer' : 'Summarize', action: 'summarize', icon: '📋' },
        ]
      },
      project: {
        icon: '📁',
        color: 'orange',
        badge: language === 'fr' ? 'Projet' : 'Project',
        actions: [
          { label: language === 'fr' ? 'Ouvrir' : 'Open', action: 'open', icon: '📂' },
          { label: language === 'fr' ? 'Voir les tâches' : 'View tasks', action: 'tasks', icon: '✅' },
          { label: language === 'fr' ? 'Collaborer' : 'Collaborate', action: 'collaborate', icon: '👥' },
        ]
      },
      client: {
        icon: '👤',
        color: 'indigo',
        badge: language === 'fr' ? 'Client' : 'Client',
        actions: [
          { label: language === 'fr' ? 'Voir le profil' : 'View profile', action: 'open', icon: '👤' },
          { label: language === 'fr' ? 'Envoyer un email' : 'Send email', action: 'email', icon: '📧' },
          { label: language === 'fr' ? 'Voir l\'historique' : 'View history', action: 'history', icon: '📈' },
        ]
      },
    };

    const config = typeConfig[result.type] || typeConfig.document;

    // Generate description based on result type and metadata
    let description = result.content.substring(0, 150) + '...';

    if (result.type === 'invoice' && result.metadata) {
      const client = result.metadata.client_name || 'Unknown';
      const total = result.metadata.total || '0';
      description = language === 'fr'
        ? `Facture pour ${client} - Montant: $${total}`
        : `Invoice for ${client} - Amount: $${total}`;
    }

    if (result.type === 'email' && result.metadata?.sender) {
      description = language === 'fr'
        ? `De: ${result.metadata.sender}`
        : `From: ${result.metadata.sender}`;
    }

    return {
      ...config,
      description,
    };
  }
}

// Singleton instance
export const clerkSearch = new ClerkSearchEngine();

// React hook for search functionality
export function useClerkSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, userId: string, options?: {
    filters?: Record<string, any>;
    limit?: number;
    language?: 'en' | 'fr';
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await clerkSearch.search(query, {
        userId,
        ...options,
      });
      setResults(response.results);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    search,
    clearResults,
    isLoading,
    results,
    error,
  };
}