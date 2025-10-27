import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user from database to find their Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        clerkId: true,
        plan: true,
        usage: {
          select: { plan: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // For now, we'll create a customer portal session without requiring a customer ID
    // In a real implementation, you would store the Stripe customer ID in your database
    // and retrieve it here

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: 'cus_default', // This should be retrieved from your database
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/billing`,
      configuration: 'bpc_1Pm...', // This should be a predefined portal configuration
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });

  } catch (error) {
    console.error('Customer portal session creation error:', error);

    // Provide a fallback URL for development
    return NextResponse.json({
      success: false,
      error: 'Failed to create customer portal session',
      fallbackUrl: '/app/billing',
    });
  }
}

// Get customer subscription status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user subscription info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        usage: {
          select: {
            month: true,
            docsCount: true,
            audioMinutes: true,
            storageBytes: true,
            aiRequests: true,
            plan: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentUsage = user.usage;
    const plan = user.plan.toLowerCase();

    return NextResponse.json({
      success: true,
      plan: user.plan,
      currentUsage: currentUsage ? {
        month: currentUsage.month,
        documents: currentUsage.docsCount,
        audioMinutes: currentUsage.audioMinutes,
        storageGB: Number(currentUsage.storageBytes) / (1024 * 1024 * 1024),
        aiRequests: currentUsage.aiRequests,
      } : null,
      // In a real implementation, you would fetch this from Stripe
      subscription: {
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
      },
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}