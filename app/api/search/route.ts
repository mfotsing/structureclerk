import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Search result interface
interface SearchResult {
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

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total_count: number;
  search_time: number;
  suggestions?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const startTime = Date.now();
    const body = await req.json();
    const {
      query,
      userId,
      filters = {},
      limit = 10,
      offset = 0,
      language = 'en'
    } = body;

    if (!query || !userId) {
      return NextResponse.json({
        error: 'Query and userId are required'
      }, { status: 400 });
    }

    // Step 1: AI-powered query understanding and expansion
    const queryAnalysis = await analyzeQuery(query, language);

    // Step 2: Multi-source search
    const searchPromises = [
      searchDocuments(userId, queryAnalysis, filters, limit, offset),
      searchEmails(userId, queryAnalysis, filters, limit, offset),
      searchInvoices(userId, queryAnalysis, filters, limit, offset),
      searchAudioTranscripts(userId, queryAnalysis, filters, limit, offset),
      searchProjects(userId, queryAnalysis, filters, limit, offset),
      searchClients(userId, queryAnalysis, filters, limit, offset),
    ];

    const searchResults = await Promise.all(searchPromises);

    // Step 3: AI-powered result ranking and reasoning
    const allResults = searchResults.flat();
    const rankedResults = await rankResults(query, allResults, queryAnalysis);

    // Step 4: Generate highlights and summaries
    const processedResults = await Promise.all(
      rankedResults.slice(0, limit).map(result =>
        processResult(result, query, language)
      )
    );

    const searchTime = Date.now() - startTime;

    // Step 5: Generate search suggestions
    const suggestions = await generateSuggestions(query, processedResults, language);

    const response: SearchResponse = {
      query,
      results: processedResults,
      total_count: allResults.length,
      search_time: searchTime,
      suggestions,
    };

    // Log search analytics (no PII)
    console.log('ClerkSearch AI interaction:', {
      userId: userId.substring(0, 8),
      queryLength: query.length,
      resultCount: processedResults.length,
      searchTime,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('ClerkSearch AI error:', error);

    return NextResponse.json({
      error: 'Search service temporarily unavailable',
      results: [],
      total_count: 0,
      search_time: 0,
    }, { status: 500 });
  }
}

// AI-powered query analysis
async function analyzeQuery(query: string, language: string) {
  const prompt = language === 'fr' ?
    `Analyse cette requête de recherche et extrais les informations clés. Query: "${query}"

Retourne un objet JSON avec:
- intent: l'intention de recherche (find_invoice, find_contract, find_client, general_search, etc.)
- entities: entités extraites (noms, montants, dates, etc.)
- keywords: mots-clés principaux
- time_range: plage de temps si mentionnée
- sentiment: sentiment général (positif, négatif, neutre)
- language: langue de la requête` :
    `Analyze this search query and extract key information. Query: "${query}"

Return a JSON object with:
- intent: search intent (find_invoice, find_contract, find_client, general_search, etc.)
- entities: extracted entities (names, amounts, dates, etc.)
- keywords: main keywords
- time_range: time range if mentioned
- sentiment: general sentiment (positive, negative, neutral)
- language: query language`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    });

    const content = response.content[0];
    const analysisText = content.type === 'text' ? content.text : '{}';

    // Try to parse as JSON, fallback to basic analysis
    try {
      return JSON.parse(analysisText);
    } catch {
      return {
        intent: 'general_search',
        entities: {},
        keywords: query.toLowerCase().split(' '),
        time_range: null,
        sentiment: 'neutral',
        language: language,
      };
    }
  } catch (error) {
    console.error('Query analysis error:', error);
    return {
      intent: 'general_search',
      entities: {},
      keywords: query.toLowerCase().split(' '),
      time_range: null,
      sentiment: 'neutral',
      language: language,
    };
  }
}

// Search functions for different content types
async function searchDocuments(userId: string, queryAnalysis: any, filters: any, limit: number, offset: number): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, content, file_url, metadata, created_at')
      .eq('user_id', userId)
      .or(`title.ilike.%${queryAnalysis.keywords.join('%,%')}%,content.ilike.%${queryAnalysis.keywords.join('%,%')}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (data || []).map(doc => ({
      id: doc.id,
      type: 'document' as const,
      title: doc.title,
      content: doc.content || '',
      url: doc.file_url,
      metadata: doc.metadata,
      confidence_score: calculateConfidenceScore(doc, queryAnalysis),
      highlights: extractHighlights(doc.content || '', queryAnalysis.keywords),
      created_at: doc.created_at,
    }));
  } catch (error) {
    console.error('Document search error:', error);
    return [];
  }
}

async function searchEmails(userId: string, queryAnalysis: any, filters: any, limit: number, offset: number): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('emails')
      .select('id, subject, sender, body, attachments, created_at')
      .eq('user_id', userId)
      .or(`subject.ilike.%${queryAnalysis.keywords.join('%,%')}%,body.ilike.%${queryAnalysis.keywords.join('%,%')}%,sender.ilike.%${queryAnalysis.keywords.join('%,%')}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (data || []).map(email => ({
      id: email.id,
      type: 'email' as const,
      title: email.subject,
      content: email.body || '',
      metadata: {
        sender: email.sender,
        attachments: email.attachments
      },
      confidence_score: calculateConfidenceScore(email, queryAnalysis),
      highlights: extractHighlights(email.body || '', queryAnalysis.keywords),
      created_at: email.created_at,
    }));
  } catch (error) {
    console.error('Email search error:', error);
    return [];
  }
}

async function searchInvoices(userId: string, queryAnalysis: any, filters: any, limit: number, offset: number): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('id, invoice_number, client_name, total, status, created_at')
      .eq('user_id', userId)
      .or(`invoice_number.ilike.%${queryAnalysis.keywords.join('%,%')}%,client_name.ilike.%${queryAnalysis.keywords.join('%,%')}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (data || []).map(invoice => ({
      id: invoice.id,
      type: 'invoice' as const,
      title: `Invoice ${invoice.invoice_number}`,
      content: `Invoice ${invoice.invoice_number} - ${invoice.client_name} - $${invoice.total}`,
      metadata: {
        client_name: invoice.client_name,
        total: invoice.total,
        status: invoice.status
      },
      confidence_score: calculateConfidenceScore(invoice, queryAnalysis),
      highlights: extractHighlights(`${invoice.invoice_number} ${invoice.client_name}`, queryAnalysis.keywords),
      created_at: invoice.created_at,
    }));
  } catch (error) {
    console.error('Invoice search error:', error);
    return [];
  }
}

async function searchAudioTranscripts(userId: string, queryAnalysis: any, filters: any, limit: number, offset: number): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('audio_transcripts')
      .select('id, title, transcript, audio_url, created_at')
      .eq('user_id', userId)
      .or(`title.ilike.%${queryAnalysis.keywords.join('%,%')}%,transcript.ilike.%${queryAnalysis.keywords.join('%,%')}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (data || []).map(audio => ({
      id: audio.id,
      type: 'audio' as const,
      title: audio.title,
      content: audio.transcript || '',
      url: audio.audio_url,
      confidence_score: calculateConfidenceScore(audio, queryAnalysis),
      highlights: extractHighlights(audio.transcript || '', queryAnalysis.keywords),
      created_at: audio.created_at,
    }));
  } catch (error) {
    console.error('Audio search error:', error);
    return [];
  }
}

async function searchProjects(userId: string, queryAnalysis: any, filters: any, limit: number, offset: number): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, description, client_id, created_at')
      .eq('user_id', userId)
      .or(`name.ilike.%${queryAnalysis.keywords.join('%,%')}%,description.ilike.%${queryAnalysis.keywords.join('%,%')}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (data || []).map(project => ({
      id: project.id,
      type: 'project' as const,
      title: project.name,
      content: project.description || '',
      metadata: { client_id: project.client_id },
      confidence_score: calculateConfidenceScore(project, queryAnalysis),
      highlights: extractHighlights(project.description || '', queryAnalysis.keywords),
      created_at: project.created_at,
    }));
  } catch (error) {
    console.error('Project search error:', error);
    return [];
  }
}

async function searchClients(userId: string, queryAnalysis: any, filters: any, limit: number, offset: number): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, email, phone, company, notes, created_at')
      .eq('user_id', userId)
      .or(`name.ilike.%${queryAnalysis.keywords.join('%,%')}%,company.ilike.%${queryAnalysis.keywords.join('%,%')}%,email.ilike.%${queryAnalysis.keywords.join('%,%')}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (data || []).map(client => ({
      id: client.id,
      type: 'client' as const,
      title: client.name,
      content: `${client.name} - ${client.company || ''} - ${client.notes || ''}`,
      metadata: {
        email: client.email,
        phone: client.phone,
        company: client.company
      },
      confidence_score: calculateConfidenceScore(client, queryAnalysis),
      highlights: extractHighlights(`${client.name} ${client.company || ''} ${client.notes || ''}`, queryAnalysis.keywords),
      created_at: client.created_at,
    }));
  } catch (error) {
    console.error('Client search error:', error);
    return [];
  }
}

// AI-powered result ranking
async function rankResults(query: string, results: SearchResult[], queryAnalysis: any): Promise<SearchResult[]> {
  if (results.length === 0) return results;

  // For now, sort by confidence score and recency
  // In a production system, this would use more sophisticated ranking
  return results.sort((a, b) => {
    const scoreA = a.confidence_score * 0.7 + (new Date(a.created_at).getTime() / Date.now()) * 0.3;
    const scoreB = b.confidence_score * 0.7 + (new Date(b.created_at).getTime() / Date.now()) * 0.3;
    return scoreB - scoreA;
  });
}

// Process individual results with AI-powered insights
async function processResult(result: SearchResult, query: string, language: string): Promise<SearchResult> {
  // Add any additional processing here
  // For now, return the result as-is
  return result;
}

// Calculate confidence score based on query matching
function calculateConfidenceScore(item: any, queryAnalysis: any): number {
  let score = 0;
  const keywords = queryAnalysis.keywords || [];

  const searchText = `${item.title || ''} ${item.content || ''} ${item.client_name || ''} ${item.name || ''}`.toLowerCase();

  // Keyword matching
  keywords.forEach((keyword: string) => {
    if (searchText.includes(keyword.toLowerCase())) {
      score += 1 / keywords.length;
    }
  });

  // Entity matching
  if (queryAnalysis.entities) {
    Object.values(queryAnalysis.entities).forEach((entity: any) => {
      if (typeof entity === 'string' && searchText.includes(entity.toLowerCase())) {
        score += 0.2;
      }
    });
  }

  return Math.min(score, 1.0);
}

// Extract text highlights around matches
function extractHighlights(content: string, keywords: string[], contextLength: number = 150): string[] {
  const highlights: string[] = [];
  const lowerContent = content.toLowerCase();

  keywords.forEach(keyword => {
    const index = lowerContent.indexOf(keyword.toLowerCase());
    if (index !== -1) {
      const start = Math.max(0, index - contextLength / 2);
      const end = Math.min(content.length, index + keyword.length + contextLength / 2);
      const highlight = content.substring(start, end);

      if (highlight.length > 20 && !highlights.includes(highlight)) {
        highlights.push(highlight);
      }
    }
  });

  return highlights.slice(0, 3); // Max 3 highlights per result
}

// Generate search suggestions
async function generateSuggestions(query: string, results: SearchResult[], language: string): Promise<string[]> {
  const suggestions: string[] = [];

  // Extract common terms from top results
  const topResults = results.slice(0, 5);
  const commonTerms = new Set<string>();

  topResults.forEach(result => {
    const words = result.content.toLowerCase().split(' ');
    words.forEach(word => {
      if (word.length > 3 && !query.toLowerCase().includes(word)) {
        commonTerms.add(word);
      }
    });
  });

  // Return top suggestions
  return Array.from(commonTerms).slice(0, 5);
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ClerkSearch AI'
  });
}