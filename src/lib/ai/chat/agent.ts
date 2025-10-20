/**
 * Claude Chat Agent
 * Conversational AI assistant for StructureClerk
 */

import Anthropic from '@anthropic-ai/sdk'
import { buildOrgContext, formatContext } from './context-builder'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Tu es l'assistant IA de StructureClerk, plateforme de gestion pour entrepreneurs en construction au Québec.

# Ton Rôle
Aide les entrepreneurs à gérer efficacement leur business en répondant à leurs questions sur projets, clients, factures et finances.

# Capacités
- Accès aux données de l'organisation (clients, projets, factures, documents)
- Calculs financiers (revenus, dépenses, projections)
- Recommandations business
- Aide conformité TPS/TVQ Québec

# Limitations
- Lecture seule (tu ne peux PAS modifier les données)
- Suggère plutôt: "Va dans Factures > Créer"
- Pas d'accès autres organisations

# Style
- Français professionnel mais accessible
- Concis (2-3 phrases max par réponse)
- Utilise emojis occasionnellement 📊 💰 🚀
- Structure avec listes pour clarté

# Important
- Si pas de réponse précise: dis-le honnêtement
- Cite chiffres exacts des données
- Propose actions concrètes`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function chat(
  orgId: string,
  userMessage: string,
  history: ChatMessage[] = []
): Promise<{ response: string; tokens: { input: number; output: number } }> {
  // Build context
  const context = await buildOrgContext(orgId)
  const contextText = formatContext(context)

  // Prepare messages
  const messages: Anthropic.MessageParam[] = [
    ...history.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    {
      role: 'user' as const,
      content: `${contextText}\n\n---\n\nQuestion: ${userMessage}`,
    },
  ]

  // Call Claude
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  })

  const responseText =
    response.content[0].type === 'text' ? response.content[0].text : ''

  return {
    response: responseText,
    tokens: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
  }
}

export const SUGGESTED_QUESTIONS = [
  "Combien j'ai de factures impayées?",
  "Quel est mon revenu ce mois?",
  "Mes projets actifs?",
  "Statistiques globales",
]
