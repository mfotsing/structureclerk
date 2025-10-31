// Search result interface
export interface SearchResult {
  id: string;
  type: 'document' | 'email' | 'invoice' | 'audio' | 'project' | 'client';
  title: string;
  content: string;
  url?: string;
  metadata?: Record<string, any>;
  confidence_score: number;
  highlights: string[];
  created_at: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total_count: number;
  search_time: number;
  suggestions?: string[];
}