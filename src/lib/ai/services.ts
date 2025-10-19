/**
 * Services AI - Fonctionnalités IA pour StructureClerk
 *
 * Classification, extraction, résumé, génération de documents
 */

import {
  callClaude,
  parseJSONResponse,
  summarizeLongText,
  type AIResponse,
  type ClassificationResult,
  type ExtractionResult,
  type SummaryResult,
} from './client'
import { cleanText } from './document-processor'

/**
 * CLASSIFICATION DE DOCUMENTS
 *
 * Analyse un document et détermine son type + champs clés
 */
export async function classifyDocument(text: string): Promise<AIResponse<ClassificationResult>> {
  const cleanedText = cleanText(text)
  const sample = cleanedText.substring(0, 4000) // Premier 4000 caractères

  const systemPrompt = `Tu es un expert en classification de documents pour le secteur de la construction au Québec.
Analyse le document et retourne un JSON strict avec:
- type_document: "contrat" | "facture" | "devis" | "appel_offres" | "licence" | "autre"
- confidence: nombre entre 0 et 1
- champs_cles: object avec les champs principaux détectés

Types de documents:
- contrat: accord entre parties, obligations, durée
- facture: montants, TPS/TVQ, numéro de facture
- devis/soumission: estimation de coûts, items, délais
- appel_offres: demande de soumission, exigences, critères
- licence: permis, RBQ, certificat
- autre: tout ce qui ne correspond pas

Retourne UNIQUEMENT le JSON, sans texte avant ou après.`

  const userMessage = `Analyse ce document et classifie-le:\n\n${sample}`

  const response = await callClaude(systemPrompt, userMessage, {
    maxTokens: 1000,
    temperature: 0.1, // Très déterministe pour classification
  })

  if (!response.success || !response.data) {
    return {
      success: false,
      error: response.error || 'Erreur de classification',
    }
  }

  const parsed = parseJSONResponse<ClassificationResult>(response.data)

  if (!parsed) {
    return {
      success: false,
      error: 'Impossible de parser la réponse de classification',
    }
  }

  return {
    success: true,
    data: parsed,
    tokensUsed: response.tokensUsed,
  }
}

/**
 * EXTRACTION DE CHAMPS (FACTURE)
 *
 * Extrait les champs structurés d'une facture québécoise
 */
export async function extractInvoiceFields(text: string): Promise<AIResponse<ExtractionResult>> {
  const cleanedText = cleanText(text)

  const systemPrompt = `Tu es un expert en extraction de données de factures québécoises.
Extrait les champs suivants d'une facture et retourne un JSON strict:
{
  "fields": {
    "fournisseur": "nom complet",
    "numero_facture": "numéro",
    "date_facture": "YYYY-MM-DD",
    "montant_ht": nombre,
    "tps": nombre (5%),
    "tvq": nombre (9.975%),
    "total_ttc": nombre,
    "description": "description brève",
    "date_echeance": "YYYY-MM-DD",
    "client": "nom du client",
    "adresse_fournisseur": "adresse complète",
    "items": [
      {
        "description": "item",
        "quantite": nombre,
        "prix_unitaire": nombre,
        "total": nombre
      }
    ]
  },
  "confidence": 0.95
}

Si un champ n'est pas trouvé, mets null.
Retourne UNIQUEMENT le JSON.`

  const userMessage = `Extrait les champs de cette facture:\n\n${cleanedText}`

  const response = await callClaude(systemPrompt, userMessage, {
    maxTokens: 2000,
    temperature: 0.1,
  })

  if (!response.success || !response.data) {
    return {
      success: false,
      error: response.error || 'Erreur d\'extraction',
    }
  }

  const parsed = parseJSONResponse<ExtractionResult>(response.data)

  if (!parsed) {
    return {
      success: false,
      error: 'Impossible de parser les champs extraits',
    }
  }

  return {
    success: true,
    data: parsed,
    tokensUsed: response.tokensUsed,
  }
}

/**
 * EXTRACTION DE CHAMPS (CONTRAT)
 *
 * Extrait les informations clés d'un contrat
 */
export async function extractContractFields(text: string): Promise<AIResponse<ExtractionResult>> {
  const cleanedText = cleanText(text)
  const sample = cleanedText.substring(0, 8000)

  const systemPrompt = `Tu es un expert en analyse de contrats de construction au Québec.
Extrait les informations clés et retourne un JSON strict:
{
  "fields": {
    "partie_a": "nom",
    "partie_b": "nom",
    "objet": "description brève",
    "date_debut": "YYYY-MM-DD",
    "date_fin": "YYYY-MM-DD",
    "duree": "X mois/ans",
    "montant_total": nombre,
    "modalites_paiement": "description",
    "garanties": ["liste des garanties"],
    "obligations_principales": ["liste des obligations"],
    "clauses_penalite": ["liste des pénalités"],
    "resiliation": "conditions de résiliation"
  },
  "confidence": 0.9
}

Retourne UNIQUEMENT le JSON.`

  const userMessage = `Extrait les informations de ce contrat:\n\n${sample}`

  const response = await callClaude(systemPrompt, userMessage, {
    maxTokens: 2000,
    temperature: 0.1,
  })

  if (!response.success || !response.data) {
    return {
      success: false,
      error: response.error || 'Erreur d\'extraction de contrat',
    }
  }

  const parsed = parseJSONResponse<ExtractionResult>(response.data)

  if (!parsed) {
    return {
      success: false,
      error: 'Impossible de parser les champs du contrat',
    }
  }

  return {
    success: true,
    data: parsed,
    tokensUsed: response.tokensUsed,
  }
}

/**
 * RÉSUMÉ DE CONTRAT
 *
 * Génère un résumé structuré d'un contrat
 */
export async function summarizeContract(text: string): Promise<AIResponse<SummaryResult>> {
  const cleanedText = cleanText(text)

  const systemPrompt = `Tu es un expert juridique spécialisé en contrats de construction au Québec.
Résume ce contrat en français québécois de manière claire et structurée.

Retourne un JSON avec:
{
  "summary": "résumé en 6-10 phrases maximum",
  "parties": ["partie A", "partie B"],
  "duree": "durée du contrat",
  "montants": ["montant total", "modalités"],
  "clauses_risque": ["clauses à surveiller ou clarifier"]
}

Ton résumé doit inclure:
- Parties impliquées
- Objet du contrat
- Durée et dates importantes
- Obligations principales
- Montants et modalités de paiement
- Clauses à risque ou à clarifier

Retourne UNIQUEMENT le JSON.`

  const userMessage = `Résume ce contrat:\n\n${cleanedText}`

  // Utiliser le traitement long texte si nécessaire
  const response = cleanedText.length > 8000
    ? await summarizeLongText(cleanedText)
    : await callClaude(systemPrompt, userMessage, { maxTokens: 1500 })

  if (!response.success || !response.data) {
    return {
      success: false,
      error: response.error || 'Erreur de résumé',
    }
  }

  // Si c'est un résumé long, retourner format simple
  if (cleanedText.length > 8000) {
    return {
      success: true,
      data: {
        summary: response.data,
        parties: [],
        montants: [],
      },
      tokensUsed: response.tokensUsed,
    }
  }

  const parsed = parseJSONResponse<SummaryResult>(response.data)

  if (!parsed) {
    return {
      success: false,
      error: 'Impossible de parser le résumé',
    }
  }

  return {
    success: true,
    data: parsed,
    tokensUsed: response.tokensUsed,
  }
}

/**
 * RÉPONSE APPEL D'OFFRES
 *
 * Génère une ébauche de réponse à un appel d'offres
 */
export async function generateTenderResponse(
  tenderText: string,
  companyProfile: {
    name: string
    specialties: string[]
    experience_years: number
    recent_projects?: string[]
  }
): Promise<AIResponse<string>> {
  const cleanedText = cleanText(tenderText)

  const systemPrompt = `Tu es un expert en rédaction de réponses aux appels d'offres pour le secteur de la construction au Québec.

Analyse le dossier d'appel d'offres et rédige une ébauche de réponse structurée et professionnelle.

La réponse doit inclure:
1. **Résumé des exigences** - Points clés de l'appel d'offres
2. **Présentation de l'entreprise** - Forces et expertises pertinentes
3. **Approche et méthodologie** - Comment nous réaliserons le projet
4. **Livrables proposés** - Ce que nous nous engageons à livrer
5. **Planning sommaire** - Échéancier réaliste
6. **Ressources mobilisées** - Équipe et équipements
7. **Pièces justificatives** - Liste des documents à joindre

Rédige en français québécois professionnel, prêt à être édité.`

  const companyInfo = `
Profil de l'entreprise:
- Nom: ${companyProfile.name}
- Spécialités: ${companyProfile.specialties.join(', ')}
- Années d'expérience: ${companyProfile.experience_years}
${companyProfile.recent_projects ? `- Projets récents: ${companyProfile.recent_projects.join(', ')}` : ''}
`

  const userMessage = `${companyInfo}\n\nAppel d'offres:\n${cleanedText}\n\nRédige une réponse structurée et professionnelle.`

  const response = await callClaude(systemPrompt, userMessage, {
    maxTokens: 3000,
    temperature: 0.7, // Plus créatif pour la rédaction
    useCache: false, // Chaque réponse doit être unique
  })

  return response
}

/**
 * GÉNÉRATION DE DOCUMENT
 *
 * Génère un document (contrat, facture, devis) à partir d'un template et de données
 */
export async function generateDocument(
  templateType: 'contrat' | 'facture' | 'devis',
  data: Record<string, any>
): Promise<AIResponse<string>> {
  const systemPrompt = `Tu es un expert en rédaction de documents contractuels pour le secteur de la construction au Québec.

Tu dois générer un ${templateType} complet, professionnel et conforme aux usages québécois.

Pour une facture:
- Inclure TPS (5%) et TVQ (9.975%)
- Format standard avec coordonnées complètes
- Numéro de facture, dates, échéance
- Items détaillés avec quantités et prix

Pour un contrat:
- Parties impliquées
- Objet et description des travaux
- Durée et échéances
- Modalités de paiement
- Obligations des parties
- Clauses standard (résiliation, garanties, etc.)

Pour un devis:
- Description des travaux
- Items avec quantités estimées
- Prix unitaires et totaux
- Durée de validité
- Conditions

Rédige en français québécois professionnel.`

  const userMessage = `Génère un ${templateType} avec les données suivantes:\n\n${JSON.stringify(data, null, 2)}`

  const response = await callClaude(systemPrompt, userMessage, {
    maxTokens: 3000,
    temperature: 0.3,
    useCache: false,
  })

  return response
}

/**
 * EXTRACTION INTELLIGENTE MULTI-FORMAT
 *
 * Détecte automatiquement le type et extrait les champs
 */
export async function intelligentExtraction(text: string): Promise<{
  classification: ClassificationResult | null
  extraction: ExtractionResult | null
  summary?: SummaryResult | null
}> {
  // 1. Classifier le document
  const classResult = await classifyDocument(text)

  if (!classResult.success || !classResult.data) {
    return { classification: null, extraction: null }
  }

  const classification = classResult.data

  // 2. Extraire selon le type
  let extraction: ExtractionResult | null = null
  let summary: SummaryResult | null = null

  if (classification.type_document === 'facture') {
    const extResult = await extractInvoiceFields(text)
    extraction = extResult.data || null
  } else if (classification.type_document === 'contrat') {
    const extResult = await extractContractFields(text)
    extraction = extResult.data || null

    // Bonus: résumé pour les contrats
    const sumResult = await summarizeContract(text)
    summary = sumResult.data || null
  }

  return {
    classification,
    extraction,
    summary,
  }
}
