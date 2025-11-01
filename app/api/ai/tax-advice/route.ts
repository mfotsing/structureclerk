import { NextRequest, NextResponse } from 'next/server'
import AIService from '@/lib/ai-service'

// POST /api/ai/tax-advice - Canadian tax advice from AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { province, amount, transactionType, category, description } = body

    if (!province || !amount || !transactionType || !category) {
      return NextResponse.json(
        { error: 'Province, amount, transaction type, and category are required' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount < 0 || amount > 10000000) {
      return NextResponse.json(
        { error: 'Amount must be between $0 and $10,000,000' },
        { status: 400 }
      )
    }

    // Validate province
    const validProvinces = [
      'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK', 'NT', 'NU', 'YT'
    ]
    if (!validProvinces.includes(province)) {
      return NextResponse.json(
        { error: 'Invalid Canadian province code' },
        { status: 400 }
      )
    }

    const aiService = AIService.getInstance()

    const response = await aiService.getTaxAdvice({
      province,
      amount,
      transactionType,
      category,
      description: description || ''
    })

    return NextResponse.json({
      success: true,
      data: {
        province,
        amount,
        transactionType,
        category,
        advice: response,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('AI Tax Advice API error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get tax advice',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}