import { EmailConnection, Email, EmailStats, EmailSearchFilters, EmailSearchResponse, EmailAction } from './types';

export class EmailClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL || '');
    this.apiKey = apiKey;
  }

  /**
   * Connect a new email account
   */
  async connectEmail(provider: string, config?: any): Promise<{ authUrl?: string; success?: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/email/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify({ provider, config }),
    });

    if (!response.ok) {
      throw new Error(`Failed to connect email: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all email connections
   */
  async getConnections(): Promise<EmailConnection[]> {
    const response = await fetch(`${this.baseUrl}/api/email/connections`, {
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch connections: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Disconnect an email account
   */
  async disconnectEmail(connectionId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/email/connections/${connectionId}`, {
      method: 'DELETE',
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to disconnect email: ${response.statusText}`);
    }
  }

  /**
   * Get emails with optional filters
   */
  async getEmails(filters?: EmailSearchFilters, page: number = 1, limit: number = 50): Promise<EmailSearchResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = JSON.stringify(value);
        }
        return acc;
      }, {} as Record<string, string>)),
    });

    const response = await fetch(`${this.baseUrl}/api/emails?${params}`, {
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch emails: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a single email by ID
   */
  async getEmail(emailId: string): Promise<Email> {
    const response = await fetch(`${this.baseUrl}/api/emails/${emailId}`, {
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch email: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Perform action on an email
   */
  async performEmailAction(emailId: string, action: EmailAction): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/emails/${emailId}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify(action),
    });

    if (!response.ok) {
      throw new Error(`Failed to perform email action: ${response.statusText}`);
    }
  }

  /**
   * Get email statistics
   */
  async getEmailStats(): Promise<EmailStats> {
    const response = await fetch(`${this.baseUrl}/api/emails/stats`, {
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch email stats: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Sync emails from connected accounts
   */
  async syncEmails(connectionId?: string): Promise<{ synced: number; processed: number; errors: string[] }> {
    const params = connectionId ? `?connectionId=${connectionId}` : '';
    const response = await fetch(`${this.baseUrl}/api/email/sync${params}`, {
      method: 'POST',
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to sync emails: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search emails using AI-powered search
   */
  async searchEmails(query: string, filters?: EmailSearchFilters): Promise<Email[]> {
    const response = await fetch(`${this.baseUrl}/api/emails/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify({ query, filters }),
    });

    if (!response.ok) {
      throw new Error(`Failed to search emails: ${response.statusText}`);
    }

    const data = await response.json();
    return data.emails || [];
  }

  /**
   * Get AI insights for an email
   */
  async getEmailInsights(emailId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/emails/${emailId}/insights`, {
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch email insights: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Process email attachments with AI
   */
  async processAttachments(emailId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/emails/${emailId}/process-attachments`, {
      method: 'POST',
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to process attachments: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate AI-powered reply suggestion
   */
  async generateReplySuggestion(emailId: string, tone: 'professional' | 'casual' | 'friendly' = 'professional'): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/emails/${emailId}/reply-suggestion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify({ tone }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate reply suggestion: ${response.statusText}`);
    }

    const data = await response.json();
    return data.suggestion || '';
  }

  /**
   * Extract structured data from email content
   */
  async extractEmailData(emailId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/emails/${emailId}/extract-data`, {
      method: 'POST',
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to extract email data: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Batch categorize emails
   */
  async batchCategorizeEmails(emailIds: string[]): Promise<{ results: Array<{ emailId: string; category: string; confidence: number }> }> {
    const response = await fetch(`${this.baseUrl}/api/emails/batch-categorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify({ emailIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to batch categorize emails: ${response.statusText}`);
    }

    return response.json();
  }
}

// Singleton instance
export const emailClient = new EmailClient();

// React hook for email functionality
import { useState, useCallback } from 'react';

export function useEmailClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectEmail = useCallback(async (provider: string, config?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await emailClient.connectEmail(provider, config);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect email';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getEmails = useCallback(async (filters?: any, page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await emailClient.getEmails(filters, page);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch emails';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const performAction = useCallback(async (emailId: string, action: EmailAction) => {
    setIsLoading(true);
    setError(null);

    try {
      await emailClient.performEmailAction(emailId, action);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform action';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const syncEmails = useCallback(async (connectionId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await emailClient.syncEmails(connectionId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync emails';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    connectEmail,
    getEmails,
    performAction,
    syncEmails,
    isLoading,
    error,
  };
}