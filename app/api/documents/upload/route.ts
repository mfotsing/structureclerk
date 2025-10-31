import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Mock AI functions - in real app, these would call actual AI services
async function extractTextFromFile(file: File): Promise<string> {
  // Simulate OCR/Vision extraction
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock extracted text based on file type
  if (file.type.includes('image')) {
    return `INVOICE

TechCorp LLC
123 Business Ave
Toronto, ON M5V 2T6
Canada

BILL TO:
ABC Consulting Inc
456 Client Street
Vancouver, BC V6B 1A1

INVOICE #2024-001
DATE: January 15, 2024
DUE DATE: February 15, 2024

DESCRIPTION              QTY   RATE    AMOUNT
AI Consulting Services    40   $350.00  $14,000.00
Documentation Review     5    $350.00  $1,750.00

SUBTOTAL                              $15,750.00
HST (13%)                             $2,047.50
TOTAL                                 $17,797.50

Payment Terms: Net 30
Please make checks payable to TechCorp LLC
For questions: billing@techcorp.com`
  }

  if (file.name.includes('pdf')) {
    return `SERVICE AGREEMENT

This Service Agreement ("Agreement") is made between TechCorp LLC ("Provider")
and ABC Consulting Inc ("Client") effective January 15, 2024.

SERVICES
Provider agrees to provide AI consulting services including:
- Document processing and analysis
- Workflow automation setup
- AI integration and training

COMPENSATION
Client agrees to pay Provider $15,750 for services rendered.
Payment due within 30 days of invoice.

TERM
This Agreement shall remain in effect for 12 months from effective date.

Signed:
John Smith - TechCorp LLC
Sarah Johnson - ABC Consulting Inc`
  }

  return `Document content extracted from ${file.name}`
}

async function classifyDocument(text: string): Promise<{
  type: 'invoice' | 'receipt' | 'contract' | 'identity' | 'bank_statement' | 'tax_file' | 'handwritten' | 'general'
  confidence: number
  language: 'en' | 'fr' | 'unknown'
}> {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const lowerText = text.toLowerCase()

  // Invoice detection
  if (lowerText.includes('invoice') || lowerText.includes('bill to') || lowerText.includes('total')) {
    return { type: 'invoice', confidence: 95, language: 'en' }
  }

  // Contract detection
  if (lowerText.includes('agreement') || lowerText.includes('contract') || lowerText.includes('signed')) {
    return { type: 'contract', confidence: 92, language: 'en' }
  }

  // Receipt detection
  if (lowerText.includes('receipt') || lowerText.includes('transaction') || lowerText.includes('amount paid')) {
    return { type: 'receipt', confidence: 88, language: 'en' }
  }

  // Bank statement detection
  if (lowerText.includes('bank statement') || lowerText.includes('account balance') || lowerText.includes('transaction history')) {
    return { type: 'bank_statement', confidence: 90, language: 'en' }
  }

  // Tax document detection
  if (lowerText.includes('tax') || lowerText.includes('irs') || lowerText.includes('cra') || lowerText.includes('t4') || lowerText.includes('t5')) {
    return { type: 'tax_file', confidence: 85, language: 'en' }
  }

  // Identity document detection
  if (lowerText.includes('driver') || lowerText.includes('passport') || lowerText.includes('identity') || lowerText.includes('license')) {
    return { type: 'identity', confidence: 87, language: 'en' }
  }

  // Language detection
  const frenchWords = ['facture', 'contrat', 'reçu', 'total', 'montant', 'taxe', 'canada']
  const frenchScore = frenchWords.reduce((score, word) => score + (lowerText.includes(word) ? 1 : 0), 0)

  if (frenchScore > 2) {
    return { type: 'general', confidence: 75, language: 'fr' }
  }

  return { type: 'general', confidence: 70, language: 'en' }
}

async function extractStructuredData(text: string, documentType: string): Promise<{
  vendor?: string
  client?: string
  amount?: number
  currency?: string
  date?: Date
  dueDate?: Date
  invoiceNumber?: string
  purchaseOrder?: string
  taxAmount?: number
  paymentMethod?: string
  accountNumber?: string
}> {
  await new Promise(resolve => setTimeout(resolve, 1500))

  const data: any = {}

  // Extract amounts
  const amountMatches = text.match(/\$[\d,]+\.\d{2}/g)
  if (amountMatches && amountMatches.length > 0) {
    const totalMatch = text.match(/TOTAL[:\s]*\$([\d,]+\.\d{2})/i)
    if (totalMatch) {
      data.amount = parseFloat(totalMatch[1].replace(',', ''))
    } else {
      data.amount = parseFloat(amountMatches[amountMatches.length - 1].replace('$', '').replace(',', ''))
    }
  }

  // Extract dates
  const dateMatches = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/g)
  if (dateMatches && dateMatches.length > 0) {
    data.date = new Date(dateMatches[0])

    // Look for due date
    const dueMatch = text.match(/DUE[:\s]*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/i)
    if (dueMatch) {
      data.dueDate = new Date(dueMatch[0].replace(/DUE[:\s]*/i, ''))
    }
  }

  // Extract invoice number
  const invoiceMatch = text.match(/INVOICE[:\s]*#?([A-Z0-9\-]+)/i)
  if (invoiceMatch) {
    data.invoiceNumber = invoiceMatch[1]
  }

  // Extract vendor/client names
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Look for company names (usually capitalized)
    if (line.length > 5 && line === line.toUpperCase() && !line.includes(':') && !line.includes('$')) {
      if (!data.vendor && line.length < 50) {
        data.vendor = line
      } else if (!data.client && line.length < 50) {
        data.client = line
      }
    }

    // Look for "BILL TO:" section
    if (line.includes('BILL TO:') && i < lines.length - 1) {
      const nextLine = lines[i + 1].trim()
      if (nextLine && nextLine.length < 50) {
        data.client = nextLine
      }
    }
  }

  // Extract tax amount
  const taxMatch = text.match(/(?:TAX|HST|GST|VAT)[:\s]*\$([\d,]+\.\d{2})/i)
  if (taxMatch) {
    data.taxAmount = parseFloat(taxMatch[1].replace(',', ''))
  }

  return data
}

function generateSuggestions(documentType: string, extractedData: any): string[] {
  const suggestions = []

  switch (documentType) {
    case 'invoice':
      if (extractedData.amount && extractedData.amount > 1000) {
        suggestions.push('High-value invoice - consider expediting payment')
      }
      if (extractedData.dueDate) {
        const daysUntilDue = Math.ceil((extractedData.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        if (daysUntilDue < 7) {
          suggestions.push('Payment due soon - follow up recommended')
        }
      }
      suggestions.push('Create expense entry in accounting system')
      break

    case 'contract':
      suggestions.push('Review key terms and obligations')
      suggestions.push('Set calendar reminders for important dates')
      suggestions.push('Share with legal team if necessary')
      break

    case 'receipt':
      suggestions.push('Add to expense report')
      suggestions.push('Categorize for tax purposes')
      break

    case 'bank_statement':
      suggestions.push('Reconcile with accounting records')
      suggestions.push('Monitor for unusual transactions')
      break

    case 'tax_file':
      suggestions.push('File with tax documentation')
      suggestions.push('Set reminder for tax deadline')
      break
  }

  return suggestions
}

function generateActionItems(documentType: string, extractedData: any): Array<{
  id: string
  title: string
  description: string
  icon: string
  priority: 'high' | 'medium' | 'low'
  action: string
}> {
  const actions = []

  switch (documentType) {
    case 'invoice':
      actions.push({
        id: 'pay-invoice',
        title: 'Schedule Payment',
        description: extractedData.dueDate
          ? `Pay $${extractedData.amount?.toLocaleString()} by ${extractedData.dueDate.toLocaleDateString()}`
          : `Pay invoice for $${extractedData.amount?.toLocaleString()}`,
        icon: '💰',
        priority: (extractedData.dueDate && new Date() > new Date(extractedData.dueDate.getTime() - 7 * 24 * 60 * 60 * 1000)) ? 'high' as const : 'medium' as const,
        action: 'create-payment-task'
      })

      actions.push({
        id: 'record-expense',
        title: 'Record Expense',
        description: 'Add this invoice to your accounting system',
        icon: '📊',
        priority: 'medium' as const,
        action: 'create-expense-entry'
      })
      break

    case 'contract':
      actions.push({
        id: 'review-contract',
        title: 'Review Key Terms',
        description: 'AI identified important clauses that need attention',
        icon: '📋',
        priority: 'high' as const,
        action: 'review-contract'
      })

      actions.push({
        id: 'set-reminders',
        title: 'Set Calendar Reminders',
        description: 'Add important dates from contract to calendar',
        icon: '📅',
        priority: 'medium' as const,
        action: 'set-calendar-reminders'
      })
      break

    case 'receipt':
      actions.push({
        id: 'expense-report',
        title: 'Add to Expense Report',
        description: 'Include this receipt in monthly expense reporting',
        icon: '🧾',
        priority: 'medium' as const,
        action: 'add-expense-report'
      })
      break
  }

  // Always add organization action
  actions.push({
    id: 'organize-document',
    title: 'Organize Document',
    description: 'Assign to client, project, and add tags',
    icon: '📁',
    priority: 'low' as const,
    action: 'organize-document'
  })

  return actions
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const results = []

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    for (const file of files) {
      try {
        // Generate unique filename
        const fileId = uuidv4()
        const fileExtension = file.name.split('.').pop()
        const fileName = `${fileId}.${fileExtension}`
        const filePath = join(uploadDir, fileName)

        // Save file to disk
        const buffer = await file.arrayBuffer()
        await writeFile(filePath, Buffer.from(buffer))

        // Step 1: Extract text using OCR/Vision
        const extractedText = await extractTextFromFile(file)

        // Step 2: Classify document
        const classification = await classifyDocument(extractedText)

        // Step 3: Extract structured data
        const structuredData = await extractStructuredData(extractedText, classification.type)

        // Step 4: Generate AI suggestions
        const suggestions = generateSuggestions(classification.type, structuredData)

        // Step 5: Generate action items
        const actionItems = generateActionItems(classification.type, structuredData)

        const result = {
          id: fileId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          filePath: `/uploads/${fileName}`,
          extractedData: {
            documentType: classification.type,
            confidence: classification.confidence,
            extractedText,
            language: classification.language,
            keyFields: structuredData,
            suggestions,
            actionItems
          },
          processedAt: new Date().toISOString()
        }

        results.push(result)
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        results.push({
          fileName: file.name,
          error: 'Failed to process file',
          errorDetails: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      processedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Upload processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}