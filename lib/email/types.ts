export interface EmailConnection {
  id: string;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'icloud' | 'proton' | 'imap';
  email: string;
  status: 'connected' | 'disconnected' | 'error';
  createdAt: string;
  lastSync: string;
  settings: {
    syncInterval: number;
    autoCategorize: boolean;
    aiProcessing: boolean;
  };
}

export interface Email {
  id: string;
  connectionId: string;
  messageId: string;
  threadId: string;
  sender: string;
  senderEmail: string;
  recipients: string[];
  subject: string;
  content: string;
  htmlContent?: string;
  date: string;
  status: 'unread' | 'read' | 'processed' | 'archived' | 'deleted';
  priority: 'low' | 'normal' | 'high';
  category: 'invoice' | 'contract' | 'important' | 'urgent' | 'newsletter' | 'personal' | 'other';
  attachments: EmailAttachment[];
  isProcessed: boolean;
  aiInsights?: EmailAIInsights;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url?: string;
  isProcessed: boolean;
  extractedData?: Record<string, any>;
}

export interface EmailAIInsights {
  category: string;
  confidence: number;
  amount?: number;
  currency?: string;
  dueDate?: string;
  actionItems?: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: 'low' | 'medium' | 'high';
  summary: string;
  keyEntities: Array<{
    type: 'person' | 'organization' | 'location' | 'date' | 'money';
    text: string;
    confidence: number;
  }>;
  suggestedActions: Array<{
    type: string;
    label: string;
    icon: string;
    priority: number;
  }>;
  relatedDocuments?: string[];
  extractedData?: {
    invoiceNumber?: string;
    orderNumber?: string;
    clientName?: string;
    projectName?: string;
    paymentTerms?: string;
    deliveryDate?: string;
  };
}

export interface EmailStats {
  total: number;
  unread: number;
  important: number;
  invoices: number;
  contracts: number;
  processed: number;
  lastSync: string;
}

export interface EmailProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  authType: 'oauth2' | 'imap' | 'pop3';
  scopes?: string[];
  imapConfig?: {
    host: string;
    port: number;
    secure: boolean;
  };
}

export interface EmailSearchFilters {
  category?: string;
  status?: string;
  priority?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sender?: string;
  hasAttachments?: boolean;
  isProcessed?: boolean;
}

export interface EmailSearchResponse {
  emails: Email[];
  total: number;
  page: number;
  totalPages: number;
  filters: EmailSearchFilters;
}

export interface EmailAction {
  type: 'reply' | 'forward' | 'archive' | 'delete' | 'mark_read' | 'mark_unread' | 'categorize' | 'extract_data';
  payload?: Record<string, any>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailRule {
  id: string;
  name: string;
  conditions: EmailRuleCondition[];
  actions: EmailRuleAction[];
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailRuleCondition {
  field: 'sender' | 'subject' | 'content' | 'category' | 'priority' | 'has_attachments';
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'regex';
  value: string | boolean;
}

export interface EmailRuleAction {
  type: 'categorize' | 'archive' | 'forward' | 'reply_with_template' | 'extract_data' | 'mark_read';
  value: string | Record<string, any>;
}