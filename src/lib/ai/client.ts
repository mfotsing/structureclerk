/**
 * Module AI Client - Anthropic Claude
 *
 * Client centralisé pour toutes les interactions avec l'API Anthropic Claude.
 * Gère le caching, rate limiting et error handling.
 */

import Anthropic from '@anthropic-ai/sdk'

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!
const MODEL = 'claude-3-5-sonnet-20241022' // Modèle le plus récent et performant
const MAX_TOKENS = 4096

// Vérification de la clé API
if (!ANTHROPIC_API_KEY) {
  console.warn('⚠️  ANTHROPIC_API_KEY manquante - Les fonctionnalités IA seront désactivées')
}

// Instance du client Anthropic
export const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
})

// Types
export interface AIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  tokensUsed?: number
  cached?: boolean
}

export interface ClassificationResult {
  type_document: 'contrat' | 'facture' | 'devis' | 'appel_offres' | 'licence' | 'autre'
  confidence: number
  champs_cles: Record<string, any>
}

export interface ExtractionResult {
  fields: Record<string, any>
  confidence: number
}

export interface SummaryResult {
  summary: string
  parties: string[]
  duree?: string
  montants?: string[]
  clauses_risque?: string[]
}

// Cache en mémoire simple (à remplacer par Redis en production)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 3600000 // 1 heure

/**
 * Génère une clé de cache basée sur le contenu
 */
function getCacheKey(prompt: string, text: string): string {
  const content = `${prompt}:${text.substring(0, 500)}`
  return Buffer.from(content).toString('base64').substring(0, 64)
}

/**
 * Récupère une valeur du cache
 */
function getFromCache(key: string): any | null {
  const cached = cache.get(key)
  if (!cached) return null

  const age = Date.now() - cached.timestamp
  if (age > CACHE_TTL) {
    cache.delete(key)
    return null
  }

  return cached.data
}

/**
 * Sauvegarde dans le cache
 */
function saveToCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })

  // Nettoyage du cache si trop grand (limite: 1000 entrées)
  if (cache.size > 1000) {
    const oldestKey = cache.keys().next().value
    if (oldestKey) {
      cache.delete(oldestKey)
    }
  }
}

/**
 * Appel générique à Claude avec gestion d'erreurs et caching
 */
export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options: {
    useCache?: boolean
    maxTokens?: number
    temperature?: number
  } = {}
): Promise<AIResponse<string>> {
  const { useCache = true, maxTokens = MAX_TOKENS, temperature = 0.2 } = options

  try {
    // Vérifier le cache
    if (useCache) {
      const cacheKey = getCacheKey(systemPrompt, userMessage)
      const cached = getFromCache(cacheKey)
      if (cached) {
        console.log('✅ Cache hit pour AI request')
        return {
          success: true,
          data: cached,
          cached: true,
        }
      }
    }

    // Appel à l'API Anthropic
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Réponse inattendue de Claude')
    }

    const result = content.text

    // Sauvegarder dans le cache
    if (useCache) {
      const cacheKey = getCacheKey(systemPrompt, userMessage)
      saveToCache(cacheKey, result)
    }

    return {
      success: true,
      data: result,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      cached: false,
    }
  } catch (error: any) {
    console.error('❌ Erreur AI:', error.message)
    return {
      success: false,
      error: error.message || 'Erreur lors de l\'appel à Claude',
    }
  }
}

/**
 * Parse une réponse JSON de Claude
 */
export function parseJSONResponse<T>(response: string): T | null {
  try {
    // Extraire le JSON si entouré de markdown
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                     response.match(/```\s*([\s\S]*?)\s*```/)

    const jsonStr = jsonMatch ? jsonMatch[1] : response
    return JSON.parse(jsonStr.trim())
  } catch (error) {
    console.error('❌ Erreur parsing JSON:', error)
    return null
  }
}

/**
 * Résume un long texte en plusieurs parties si nécessaire
 */
export async function summarizeLongText(text: string, maxChunkSize = 8000): Promise<AIResponse<string>> {
  // Si le texte est court, traitement direct
  if (text.length <= maxChunkSize) {
    return callClaude(
      'Tu es un assistant spécialisé dans la résumé de documents pour le secteur de la construction au Québec.',
      `Résume ce texte de manière concise:\n\n${text}`,
      { maxTokens: 1000 }
    )
  }

  // Découper en chunks
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += maxChunkSize) {
    chunks.push(text.substring(i, i + maxChunkSize))
  }

  // Résumer chaque chunk
  const summaries: string[] = []
  for (const chunk of chunks) {
    const result = await callClaude(
      'Tu es un assistant spécialisé dans la résumé de documents.',
      `Résume cette partie de document:\n\n${chunk}`,
      { maxTokens: 500, useCache: false }
    )
    if (result.success && result.data) {
      summaries.push(result.data)
    }
  }

  // Résumer les résumés
  const finalSummary = summaries.join('\n\n')
  return callClaude(
    'Tu es un assistant spécialisé dans la résumé de documents.',
    `Crée un résumé final cohérent à partir de ces résumés partiels:\n\n${finalSummary}`,
    { maxTokens: 1000, useCache: false }
  )
}

/**
 * Fonction utilitaire pour logger l'usage des tokens
 */
export function logTokenUsage(
  operation: string,
  tokensUsed: number,
  userId: string
): void {
  // TODO: Implémenter logging en DB pour suivi des coûts
  console.log(`📊 AI Usage - ${operation}: ${tokensUsed} tokens (user: ${userId})`)
}
