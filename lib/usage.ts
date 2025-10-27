import { prisma } from '@/lib/db/prisma';

export interface UsageLimit {
  current: number;
  limit: number;
  percentage: number;
  isNearLimit: boolean;
  isAtLimit: boolean;
}

export interface UsageCheckResult {
  success: boolean;
  message?: string;
  current?: number;
  limit?: number;
  remaining?: number;
  usage?: UsageLimit;
}

// Plan limits (CAD pricing)
const PLAN_LIMITS = {
  FREE: {
    documentsPerMonth: 10,
    audioMinutesPerMonth: 30,
    storageGB: 1,
    aiRequestsPerMonth: 50
  },
  PRO: {
    documentsPerMonth: 100,
    audioMinutesPerMonth: 180,
    storageGB: 20,
    aiRequestsPerMonth: 500
  },
  BUSINESS: {
    documentsPerMonth: 500,
    audioMinutesPerMonth: 600,
    storageGB: 100,
    aiRequestsPerMonth: 2000
  },
  TEAMS: {
    documentsPerMonth: 2000,
    audioMinutesPerMonth: 2000,
    storageGB: 500,
    aiRequestsPerMonth: 5000
  },
  ENTERPRISE: {
    documentsPerMonth: 10000,
    audioMinutesPerMonth: 10000,
    storageGB: 1000,
    aiRequestsPerMonth: 20000
  }
};

/**
 * Get or create usage counter for a user for the current month
 */
async function getOrCreateUsageCounter(userId: string): Promise<any> {
  const currentMonth = new Date().toISOString().slice(0, 7); // Format: "2024-01"

  let usage = await prisma.usageCounters.findUnique({
    where: { userId }
  });

  // If no usage record exists or it's from a different month, create/update it
  if (!usage || usage.month !== currentMonth) {
    const userPlan = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (usage && usage.month !== currentMonth) {
      // Archive old month and create new one
      usage = await prisma.usageCounters.update({
        where: { userId },
        data: {
          month: currentMonth,
          docsCount: 0,
          audioMinutes: 0,
          storageBytes: BigInt(0),
          aiRequests: 0,
          plan: userPlan?.plan || 'FREE',
          lastReset: new Date()
        }
      });
    } else {
      // Create new usage record
      usage = await prisma.usageCounters.create({
        data: {
          userId,
          month: currentMonth,
          docsCount: 0,
          audioMinutes: 0,
          storageBytes: BigInt(0),
          aiRequests: 0,
          plan: userPlan?.plan || 'FREE'
        }
      });
    }
  }

  return usage;
}

/**
 * Get current usage for a specific metric
 */
export async function getCurrentUsage(userId: string): Promise<Record<string, UsageLimit>> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const usage = await getOrCreateUsageCounter(userId);
  const limits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS];

  const storageGB = Number(usage.storageBytes) / (1024 * 1024 * 1024);

  return {
    documents: {
      current: usage.docsCount,
      limit: limits.documentsPerMonth,
      percentage: (usage.docsCount / limits.documentsPerMonth) * 100,
      isNearLimit: usage.docsCount >= limits.documentsPerMonth * 0.8,
      isAtLimit: usage.docsCount >= limits.documentsPerMonth
    },
    audioMinutes: {
      current: usage.audioMinutes,
      limit: limits.audioMinutesPerMonth,
      percentage: (usage.audioMinutes / limits.audioMinutesPerMonth) * 100,
      isNearLimit: usage.audioMinutes >= limits.audioMinutesPerMonth * 0.8,
      isAtLimit: usage.audioMinutes >= limits.audioMinutesPerMonth
    },
    storage: {
      current: storageGB,
      limit: limits.storageGB,
      percentage: (storageGB / limits.storageGB) * 100,
      isNearLimit: storageGB >= limits.storageGB * 0.8,
      isAtLimit: storageGB >= limits.storageGB
    },
    aiRequests: {
      current: usage.aiRequests,
      limit: limits.aiRequestsPerMonth,
      percentage: (usage.aiRequests / limits.aiRequestsPerMonth) * 100,
      isNearLimit: usage.aiRequests >= limits.aiRequestsPerMonth * 0.8,
      isAtLimit: usage.aiRequests >= limits.aiRequestsPerMonth
    }
  };
}

/**
 * Increment usage for a specific metric
 */
export async function incrementUsage(
  userId: string,
  metric: 'docsCount' | 'audioMinutes' | 'storageBytes' | 'aiRequests',
  amount: number
): Promise<UsageCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true }
  });

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  const usage = await getOrCreateUsageCounter(userId);
  const limits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS];

  let currentUsage: number;
  let limit: number;
  let metricName: string;

  switch (metric) {
    case 'docsCount':
      currentUsage = usage.docsCount;
      limit = limits.documentsPerMonth;
      metricName = 'documents';
      break;
    case 'audioMinutes':
      currentUsage = usage.audioMinutes;
      limit = limits.audioMinutesPerMonth;
      metricName = 'audio minutes';
      break;
    case 'storageBytes':
      currentUsage = Number(usage.storageBytes);
      limit = limits.storageGB * 1024 * 1024 * 1024; // Convert GB to bytes
      metricName = 'storage';
      break;
    case 'aiRequests':
      currentUsage = usage.aiRequests;
      limit = limits.aiRequestsPerMonth;
      metricName = 'AI requests';
      break;
    default:
      return {
        success: false,
        message: 'Invalid usage metric'
      };
  }

  // Check if increment would exceed limit
  if (currentUsage + amount > limit) {
    const remaining = limit - currentUsage;
    return {
      success: false,
      message: `You've reached your ${user.plan} plan limit for ${metricName}. Upgrade to Pro for higher limits.`,
      current: currentUsage,
      limit,
      remaining: Math.max(0, remaining)
    };
  }

  // Update usage
  const updateData: any = { [metric]: { increment: amount } };

  await prisma.usageCounters.update({
    where: { userId },
    data: updateData
  });

  // Log usage increment
  console.log(`Usage incremented for user ${userId}: ${metric} +${amount}`);

  return {
    success: true,
    current: currentUsage + amount,
    limit,
    remaining: limit - (currentUsage + amount)
  };
}

/**
 * Check if user can perform an action based on their plan limits
 */
export async function checkUsageLimit(
  userId: string,
  metric: 'docsCount' | 'audioMinutes' | 'storageBytes' | 'aiRequests',
  requiredAmount: number = 1
): Promise<UsageCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true }
  });

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  const usage = await getOrCreateUsageCounter(userId);
  const limits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS];

  let currentUsage: number;
  let limit: number;
  let metricName: string;

  switch (metric) {
    case 'docsCount':
      currentUsage = usage.docsCount;
      limit = limits.documentsPerMonth;
      metricName = 'documents';
      break;
    case 'audioMinutes':
      currentUsage = usage.audioMinutes;
      limit = limits.audioMinutesPerMonth;
      metricName = 'audio minutes';
      break;
    case 'storageBytes':
      currentUsage = Number(usage.storageBytes);
      limit = limits.storageGB * 1024 * 1024 * 1024;
      metricName = 'storage';
      break;
    case 'aiRequests':
      currentUsage = usage.aiRequests;
      limit = limits.aiRequestsPerMonth;
      metricName = 'AI requests';
      break;
    default:
      return {
        success: false,
        message: 'Invalid usage metric'
      };
  }

  const remaining = limit - currentUsage;

  if (currentUsage >= limit * 0.8 && currentUsage < limit) {
    return {
      success: true,
      message: `You're approaching your ${metricName} limit (${Math.round((currentUsage / limit) * 100)}% used). Consider upgrading soon.`,
      current: currentUsage,
      limit,
      remaining
    };
  }

  if (currentUsage + requiredAmount > limit) {
    return {
      success: false,
      message: `Insufficient ${metricName} remaining. Upgrade to ${user.plan === 'FREE' ? 'Pro' : 'Business'} for higher limits.`,
      current: currentUsage,
      limit,
      remaining: Math.max(0, remaining)
    };
  }

  return {
    success: true,
    current: currentUsage,
    limit,
    remaining
  };
}

/**
 * Get usage statistics for dashboard
 */
export async function getUsageStats(userId: string): Promise<any> {
  const currentUsage = await getCurrentUsage(userId);

  // Get recent activity
  const recentDocuments = await prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { name: true, type: true, createdAt: true }
  });

  const recentAudio = await prisma.noteAudio.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { name: true, duration: true, createdAt: true }
  });

  const pendingTasks = await prisma.task.count({
    where: {
      userId,
      status: { in: ['open', 'in_progress'] }
    }
  });

  return {
    usage: currentUsage,
    activity: {
      recentDocuments,
      recentAudio,
      pendingTasks
    }
  };
}

/**
 * Reset usage for a user (admin function)
 */
export async function resetUsage(userId: string): Promise<boolean> {
  try {
    await prisma.usageCounters.update({
      where: { userId },
      data: {
        docsCount: 0,
        audioMinutes: 0,
        storageBytes: BigInt(0),
        aiRequests: 0,
        lastReset: new Date()
      }
    });

    console.log(`Usage reset for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error resetting usage:', error);
    return false;
  }
}