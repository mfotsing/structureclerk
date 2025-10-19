/**
 * Module de Traitement de Documents
 *
 * Extrait le texte de différents formats: PDF, DOCX, Images (OCR)
 */

import mammoth from 'mammoth'
import { createWorker } from 'tesseract.js'

export interface ProcessedDocument {
  text: string
  pageCount?: number
  wordCount: number
  format: string
  metadata?: Record<string, any>
}

/**
 * Extrait le texte d'un buffer PDF
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<ProcessedDocument> {
  try {
    // Dynamic import for pdf-parse (CommonJS module)
    const pdf: any = await import('pdf-parse')
    const pdfParse = pdf.default || pdf
    const data = await pdfParse(buffer)

    return {
      text: data.text,
      pageCount: data.numpages,
      wordCount: data.text.split(/\s+/).length,
      format: 'pdf',
      metadata: {
        info: data.info,
        version: data.version,
      },
    }
  } catch (error: any) {
    throw new Error(`Erreur extraction PDF: ${error.message}`)
  }
}

/**
 * Extrait le texte d'un buffer DOCX
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<ProcessedDocument> {
  try {
    const result = await mammoth.extractRawText({ buffer })

    return {
      text: result.value,
      wordCount: result.value.split(/\s+/).length,
      format: 'docx',
    }
  } catch (error: any) {
    throw new Error(`Erreur extraction DOCX: ${error.message}`)
  }
}

/**
 * Extrait le texte d'une image avec OCR (Tesseract)
 */
export async function extractTextFromImage(buffer: Buffer, lang = 'fra+eng'): Promise<ProcessedDocument> {
  const worker = await createWorker(lang)

  try {
    const { data } = await worker.recognize(buffer)

    await worker.terminate()

    return {
      text: data.text,
      wordCount: data.text.split(/\s+/).length,
      format: 'image-ocr',
      metadata: {
        confidence: data.confidence,
      },
    }
  } catch (error: any) {
    await worker.terminate()
    throw new Error(`Erreur OCR: ${error.message}`)
  }
}

/**
 * Détecte le type de fichier et extrait le texte
 */
export async function processDocument(
  buffer: Buffer,
  mimeType: string
): Promise<ProcessedDocument> {
  console.log(`📄 Traitement document (${mimeType})...`)

  try {
    // PDF
    if (mimeType === 'application/pdf') {
      return await extractTextFromPDF(buffer)
    }

    // DOCX
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      return await extractTextFromDOCX(buffer)
    }

    // Images
    if (mimeType.startsWith('image/')) {
      return await extractTextFromImage(buffer)
    }

    // Texte brut
    if (mimeType.startsWith('text/')) {
      const text = buffer.toString('utf-8')
      return {
        text,
        wordCount: text.split(/\s+/).length,
        format: 'text',
      }
    }

    throw new Error(`Type de fichier non supporté: ${mimeType}`)
  } catch (error: any) {
    console.error(`❌ Erreur traitement document:`, error.message)
    throw error
  }
}

/**
 * Nettoie et normalise le texte extrait
 */
export function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Normaliser les retours à la ligne
    .replace(/\n{3,}/g, '\n\n') // Réduire les lignes vides multiples
    .replace(/\t/g, ' ') // Remplacer tabs par espaces
    .replace(/  +/g, ' ') // Réduire les espaces multiples
    .trim()
}

/**
 * Vérifie si le document est trop volumineux
 */
export function isDocumentTooLarge(doc: ProcessedDocument, maxWords = 10000): boolean {
  return doc.wordCount > maxWords
}

/**
 * Découpe un document en chunks pour traitement
 */
export function chunkDocument(text: string, chunkSize = 8000): string[] {
  const chunks: string[] = []
  const paragraphs = text.split('\n\n')

  let currentChunk = ''

  for (const para of paragraphs) {
    if ((currentChunk + para).length > chunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = ''
      }

      // Si un paragraphe est plus grand que chunkSize, le découper
      if (para.length > chunkSize) {
        for (let i = 0; i < para.length; i += chunkSize) {
          chunks.push(para.substring(i, i + chunkSize).trim())
        }
      } else {
        currentChunk = para
      }
    } else {
      currentChunk += '\n\n' + para
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}
