import { NextRequest, NextResponse } from 'next/server';
import { extractFromDocument } from '@/lib/ai/anthropic';
import { getCurrentUser } from '@/lib/auth';
import { incrementUsage } from '@/lib/usage';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check usage limits
    const usageCheck = await incrementUsage(user.id, 'docsCount', 1);
    if (!usageCheck.success) {
      return NextResponse.json(
        {
          error: 'Usage limit exceeded',
          message: usageCheck.message,
          limit: usageCheck.limit,
          current: usageCheck.current
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate text length (max 100,000 characters)
    if (text.length > 100000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 100,000 characters allowed.' },
        { status: 400 }
      );
    }

    // Extract information using Claude
    const result = await extractFromDocument(text);

    // Log the usage for analytics
    console.log(`Document extraction completed for user ${user.id}`);

    return NextResponse.json({
      success: true,
      data: result,
      usage: {
        documentsProcessed: usageCheck.current,
        limit: usageCheck.limit
      }
    });

  } catch (error) {
    console.error('Error in AI extract route:', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('Failed to extract information from document')) {
        return NextResponse.json(
          { error: 'AI extraction failed. Please try again.' },
          { status: 500 }
        );
      }

      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'AI service quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}