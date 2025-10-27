import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export interface AuthUser {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  plan: string;
  language: string;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    // Get user from database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        plan: true,
        language: true
      }
    });

    // If user doesn't exist in database, create them
    if (!user) {
      const clerkUser = await auth();
      const primaryEmailAddress = clerkUser.sessionClaims?.email as string;

      if (!primaryEmailAddress) {
        throw new Error('No email found in Clerk session');
      }

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: primaryEmailAddress,
          firstName: clerkUser.sessionClaims?.first_name as string || undefined,
          lastName: clerkUser.sessionClaims?.last_name as string || undefined,
          plan: 'FREE',
          language: 'en' // Default to English, will be updated based on preferences
        },
        select: {
          id: true,
          clerkId: true,
          email: true,
          firstName: true,
          lastName: true,
          plan: true,
          language: true
        }
      });

      // Create default usage counter
      await prisma.usageCounters.create({
        data: {
          userId: user.id,
          month: new Date().toISOString().slice(0, 7),
          docsCount: 0,
          audioMinutes: 0,
          storageBytes: BigInt(0),
          aiRequests: 0,
          plan: 'FREE'
        }
      });

      // Create default legal consents
      await prisma.legalConsents.create({
        data: {
          userId: user.id,
          aiProcessing: true, // Default consent for AI processing
          dataRetention: true, // Default consent for data retention
          privacyVersion: '1.0',
          termsVersion: '1.0'
        }
      });

      console.log(`New user created: ${user.email}`);
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user has required plan level
 */
export async function requirePlan(minimumPlan: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const planHierarchy = {
    'FREE': 0,
    'PRO': 1,
    'BUSINESS': 2,
    'TEAMS': 3,
    'ENTERPRISE': 4
  };

  const userLevel = planHierarchy[user.plan as keyof typeof planHierarchy] || 0;
  const requiredLevel = planHierarchy[minimumPlan as keyof typeof planHierarchy] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: {
  firstName?: string;
  lastName?: string;
  language?: string;
}): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    await prisma.user.update({
      where: { id: user.id },
      data
    });

    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

/**
 * Update user plan
 */
export async function updateUserPlan(plan: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    await prisma.user.update({
      where: { id: user.id },
      data: { plan: plan as any } // Type assertion for Plan enum
    });

    // Update usage counter plan
    await prisma.usageCounters.updateMany({
      where: { userId: user.id },
      data: { plan: plan as any } // Type assertion for Plan enum
    });

    console.log(`User ${user.email} plan updated to ${plan}`);
    return true;
  } catch (error) {
    console.error('Error updating user plan:', error);
    return false;
  }
}

/**
 * Get user with full details
 */
export async function getUserWithDetails(userId: string): Promise<any> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        usage: true,
        legalConsents: true,
        integrations: true,
        _count: {
          select: {
            clients: true,
            projects: true,
            documents: true,
            audioNotes: true,
            tasks: true
          }
        }
      }
    });

    return user;
  } catch (error) {
    console.error('Error getting user details:', error);
    return null;
  }
}

/**
 * Delete user account and all associated data
 */
export async function deleteUserAccount(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    // This will cascade delete all related data due to foreign key constraints
    await prisma.user.delete({
      where: { id: user.id }
    });

    console.log(`User account deleted: ${user.email}`);
    return true;
  } catch (error) {
    console.error('Error deleting user account:', error);
    return false;
  }
}