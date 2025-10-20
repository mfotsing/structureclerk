/**
 * Invoice Extraction Service
 * AI-powered extraction of invoice data from PDF/images
 * Optimized for Quebec construction industry invoices
 */

import Anthropic from '@anthropic-ai/sdk'
import { processDocument } from './document-processor'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ============================================================================
// EXTRACTION PROMPT - Optimized for Quebec invoices
// ============================================================================

const INVOICE_EXTRACTION_PROMPT = `Tu es un expert en extraction de données de factures québécoises pour le secteur de la construction.

# Ton Objectif
Extraire avec précision TOUTES les informations d'une facture au format JSON structuré.

# Format de Sortie Requis
Retourne UNIQUEMENT un objet JSON valide (pas de markdown, pas de texte additionnel) avec cette structure EXACTE:

{
  "invoice_number": "string ou null",
  "invoice_date": "YYYY-MM-DD ou null",
  "due_date": "YYYY-MM-DD ou null",

  "vendor_name": "string ou null",
  "vendor_email": "string ou null",
  "vendor_phone": "string ou null",
  "vendor_address": "string ou null",
  "vendor_tps": "string ou null (# TPS)",
  "vendor_tvq": "string ou null (# TVQ)",

  "customer_name": "string ou null",
  "customer_email": "string ou null",
  "customer_phone": "string ou null",

  "subtotal": "number ou null (montant avant taxes)",
  "tps_amount": "number ou null (5%)",
  "tvq_amount": "number ou null (9.975%)",
  "total": "number ou null",

  "line_items": [
    {
      "description": "string",
      "quantity": "number",
      "unit_price": "number",
      "amount": "number"
    }
  ],

  "payment_terms": "string ou null (ex: Net 30, Dû à réception)",
  "payment_method": "string ou null",
  "notes": "string ou null",

  "confidence_score": "number entre 0 et 1",
  "field_confidence": {
    "invoice_number": "number 0-1",
    "total": "number 0-1",
    "vendor_name": "number 0-1"
  }
}

# Instructions Importantes

1. **Nombres et Devises**:
   - Extrais SEULEMENT les chiffres (supprime $, CAD, etc.)
   - Utilise des nombres décimaux (99.99, pas "99,99$")
   - Si un montant n'est pas clair, mets null

2. **Dates**:
   - Format ISO: YYYY-MM-DD (2024-03-15)
   - Si format incomplet, essaie d'inférer l'année courante
   - Si impossible, mets null

3. **TPS/TVQ (Québec)**:
   - TPS = 5% (Taxe fédérale)
   - TVQ = 9.975% (Taxe provinciale)
   - Si tu vois "GST" = TPS, "QST" = TVQ
   - Extrais les numéros d'enregistrement (ex: 123456789 RT0001)

4. **Line Items**:
   - Extrais TOUS les items ligne par ligne
   - Calcule amount = quantity × unit_price
   - Si quantity absent, utilise 1

5. **Confidence Score**:
   - 0.9-1.0 = Données claires et complètes
   - 0.7-0.9 = Quelques champs manquants ou ambigus
   - 0.5-0.7 = Plusieurs champs incertains
   - <0.5 = Facture mal scannée ou format non standard

6. **Vendor vs Customer**:
   - Vendor = Fournisseur (celui qui émet la facture)
   - Customer = Client (celui qui doit payer)
   - Cherche "De:", "From:", "Émis par:" pour vendor
   - Cherche "À:", "To:", "Facturé à:" pour customer

7. **Termes de Paiement**:
   - Net 30 = paiement sous 30 jours
   - Dû à réception = paiement immédiat
   - 2/10 Net 30 = 2% rabais si payé en 10 jours, sinon Net 30

# Validation
- Vérifie que subtotal + tps_amount + tvq_amount ≈ total (±0.02 pour arrondissement)
- Si calcul ne match pas, note-le dans "notes"
- Mets confidence plus bas si incohérences

# Exemples de Variations Québécoises
- "Sous-total" = subtotal
- "Montant avant taxes" = subtotal
- "TPS (5%)" ou "GST (5%)" = tps_amount
- "TVQ (9.975%)" ou "QST (9.975%)" = tvq_amount
- "Total à payer" = total
- "# TPS:" ou "GST #:" = vendor_tps
- "# TVQ:" ou "QST #:" = vendor_tvq

Maintenant, extrais les données de la facture suivante et retourne SEULEMENT le JSON (rien d'autre):`

// ============================================================================
// TYPES
// ============================================================================

export interface InvoiceLineItem {
  description: string
  quantity: number
  unit_price: number
  amount: number
}

export interface ExtractedInvoiceData {
  // Basic info
  invoice_number: string | null
  invoice_date: string | null // ISO date YYYY-MM-DD
  due_date: string | null

  // Vendor (supplier)
  vendor_name: string | null
  vendor_email: string | null
  vendor_phone: string | null
  vendor_address: string | null
  vendor_tps: string | null
  vendor_tvq: string | null

  // Customer
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null

  // Financial
  subtotal: number | null
  tps_amount: number | null
  tvq_amount: number | null
  total: number | null

  // Items
  line_items: InvoiceLineItem[]

  // Payment
  payment_terms: string | null
  payment_method: string | null
  notes: string | null

  // Confidence
  confidence_score: number
  field_confidence: Record<string, number>
}

export interface InvoiceExtractionResult {
  success: boolean
  data: ExtractedInvoiceData | null
  raw_text: string
  tokens: {
    input: number
    output: number
  }
  processing_time_ms: number
  error?: string
}

// ============================================================================
// MAIN EXTRACTION FUNCTION
// ============================================================================

export async function extractInvoiceData(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<InvoiceExtractionResult> {
  const startTime = Date.now()

  try {
    // Step 1: Extract text from document (PDF, DOCX, or image)
    console.log(`[Invoice Extraction] Processing ${fileName} (${mimeType})`)
    const processedDoc = await processDocument(fileBuffer, mimeType)
    const extractedText = processedDoc.text

    if (!extractedText || extractedText.length < 50) {
      return {
        success: false,
        data: null,
        raw_text: extractedText,
        tokens: { input: 0, output: 0 },
        processing_time_ms: Date.now() - startTime,
        error: 'Insufficient text extracted from document. Please ensure the file is readable.',
      }
    }

    console.log(`[Invoice Extraction] Extracted ${extractedText.length} characters`)

    // Step 2: Call Claude for AI extraction
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: [
        {
          type: 'text',
          text: INVOICE_EXTRACTION_PROMPT,
          cache_control: { type: 'ephemeral' }, // Cache prompt for 5 minutes
        },
      ],
      messages: [
        {
          role: 'user',
          content: extractedText.substring(0, 100000), // Limit to ~100k chars
        },
      ],
    })

    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : ''

    console.log(`[Invoice Extraction] Claude response length: ${responseText.length}`)

    // Step 3: Parse JSON response
    let extractedData: ExtractedInvoiceData

    try {
      // Remove markdown code blocks if present
      let jsonText = responseText.trim()
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '')
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '')
      }

      extractedData = JSON.parse(jsonText)
    } catch (parseError: any) {
      console.error('[Invoice Extraction] JSON parse error:', parseError.message)
      return {
        success: false,
        data: null,
        raw_text: extractedText,
        tokens: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens,
        },
        processing_time_ms: Date.now() - startTime,
        error: `Failed to parse AI response as JSON: ${parseError.message}`,
      }
    }

    // Step 4: Validate and enhance extracted data
    const validatedData = validateAndEnhanceData(extractedData)

    const processingTime = Date.now() - startTime
    console.log(
      `[Invoice Extraction] Success in ${processingTime}ms (confidence: ${validatedData.confidence_score})`
    )

    return {
      success: true,
      data: validatedData,
      raw_text: extractedText,
      tokens: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
      processing_time_ms: processingTime,
    }
  } catch (error: any) {
    console.error('[Invoice Extraction] Error:', error)
    return {
      success: false,
      data: null,
      raw_text: '',
      tokens: { input: 0, output: 0 },
      processing_time_ms: Date.now() - startTime,
      error: error.message || 'Unknown extraction error',
    }
  }
}

// ============================================================================
// VALIDATION AND ENHANCEMENT
// ============================================================================

function validateAndEnhanceData(data: ExtractedInvoiceData): ExtractedInvoiceData {
  // Ensure confidence score is valid
  if (
    typeof data.confidence_score !== 'number' ||
    data.confidence_score < 0 ||
    data.confidence_score > 1
  ) {
    data.confidence_score = 0.5 // Default medium confidence
  }

  // Validate financial calculations
  if (data.subtotal !== null && data.tps_amount !== null && data.tvq_amount !== null) {
    const calculatedTotal = data.subtotal + data.tps_amount + data.tvq_amount
    if (data.total !== null) {
      const difference = Math.abs(calculatedTotal - data.total)
      if (difference > 0.05) {
        // More than 5 cents difference
        data.notes = (data.notes || '') + `\n[ALERTE] Calcul incohérent: ${data.subtotal} + ${data.tps_amount} + ${data.tvq_amount} = ${calculatedTotal.toFixed(2)} ≠ ${data.total}`
        data.confidence_score = Math.max(0.5, data.confidence_score - 0.2)
      }
    }
  }

  // Validate TPS rate (should be ~5%)
  if (data.subtotal && data.tps_amount) {
    const tpsRate = (data.tps_amount / data.subtotal) * 100
    if (Math.abs(tpsRate - 5.0) > 0.5) {
      // Not within 0.5% of 5%
      data.notes = (data.notes || '') + `\n[INFO] Taux TPS inhabituel: ${tpsRate.toFixed(2)}% (attendu: 5%)`
    }
  }

  // Validate TVQ rate (should be ~9.975%)
  if (data.subtotal && data.tvq_amount) {
    const tvqRate = (data.tvq_amount / data.subtotal) * 100
    if (Math.abs(tvqRate - 9.975) > 0.5) {
      data.notes = (data.notes || '') + `\n[INFO] Taux TVQ inhabituel: ${tvqRate.toFixed(2)}% (attendu: 9.975%)`
    }
  }

  // Validate line items sum to subtotal
  if (data.line_items && data.line_items.length > 0) {
    const itemsTotal = data.line_items.reduce((sum, item) => sum + (item.amount || 0), 0)
    if (data.subtotal !== null && Math.abs(itemsTotal - data.subtotal) > 0.05) {
      data.notes = (data.notes || '') + `\n[INFO] Somme items (${itemsTotal.toFixed(2)}) ≠ sous-total (${data.subtotal})`
    }
  }

  // Ensure field_confidence exists
  if (!data.field_confidence || typeof data.field_confidence !== 'object') {
    data.field_confidence = {}
  }

  // Trim notes
  if (data.notes) {
    data.notes = data.notes.trim()
  }

  return data
}

// ============================================================================
// HELPER: Generate suggested invoice number
// ============================================================================

export function generateInvoiceNumber(orgPrefix = 'INV'): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 9000) + 1000 // 1000-9999

  return `${orgPrefix}-${year}${month}${day}-${random}`
}

// ============================================================================
// HELPER: Validate Quebec tax numbers
// ============================================================================

export function validateTpsNumber(tpsNumber: string): boolean {
  // TPS format: 9 digits + RT + 4 digits (ex: 123456789RT0001)
  const tpsRegex = /^\d{9}RT\d{4}$/
  return tpsRegex.test(tpsNumber.replace(/\s/g, ''))
}

export function validateTvqNumber(tvqNumber: string): boolean {
  // TVQ format: 10 digits + TQ + 4 digits (ex: 1234567890TQ0001)
  const tvqRegex = /^\d{10}TQ\d{4}$/
  return tvqRegex.test(tvqNumber.replace(/\s/g, ''))
}
