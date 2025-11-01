import { NextRequest, NextResponse } from 'next/server'
import AIService from '@/lib/ai-service'

// POST /api/ai/analyze - Real AI document analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, content, documentType, businessContext } = body

    if (!documentId || !content) {
      return NextResponse.json(
        { error: 'Document ID and content are required' },
        { status: 400 }
      )
    }

    // Validate content length
    if (content.length > 50000) {
      return NextResponse.json(
        { error: 'Document content too long' },
        { status: 400 }
      )
    }

    const aiService = AIService.getInstance()

    const response = await aiService.analyzeDocument({
      documentId,
      content,
      documentType: documentType || 'Unknown',
      businessContext: {
        province: businessContext?.province || 'ON',
        currency: businessContext?.currency || 'CAD',
        industry: businessContext?.industry || 'Unknown',
        language: businessContext?.language || 'English'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        documentId,
        analysis: response,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('AI Document Analysis API error:', error)

    return NextResponse.json(
      {
        error: 'Failed to analyze document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}