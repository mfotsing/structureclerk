import Stripe from 'stripe';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

// Canadian pricing in cents
export const PRICING = {
  plans: {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'cad',
      interval: 'month',
    },
    starter: {
      id: 'starter',
      name: 'Starter',
      price: 999, // $9.99 CAD/month
      currency: 'cad',
      interval: 'month',
      annualPrice: 9900, // $99.00 CAD/year ($8.25/month)
    },
    pro: {
      id: 'pro',
      name: 'Professional',
      price: 2900, // $29.00 CAD/month
      currency: 'cad',
      interval: 'month',
      annualPrice: 19000, // $190.00 CAD/year ($15.83/month)
    },
    business: {
      id: 'business',
      name: 'Business',
      price: 7900, // $79.00 CAD/month
      currency: 'cad',
      interval: 'month',
      annualPrice: 59000, // $590.00 CAD/year ($49.17/month)
    },
    teams: {
      id: 'teams',
      name: 'Enterprise',
      basePrice: 14900, // $149.00 CAD base
      perUserPrice: 1900, // $19.00 CAD per user
      currency: 'cad',
      interval: 'month',
      annualBasePrice: 149000, // $1,490.00 CAD/year base
      annualPerUserPrice: 19000, // $190.00 CAD/year per user
    },
  },
  addOns: {
    audioMinutes: {
      id: 'audio_minutes',
      name: 'Audio Minutes',
      price: 6, // $0.06 CAD per minute
      currency: 'cad',
      interval: 'month',
      unit: 'minute',
    },
    storage: {
      id: 'storage',
      name: 'Extra Storage',
      price: 12, // $0.12 CAD per GB/month
      currency: 'cad',
      interval: 'month',
      unit: 'GB',
    },
    branding: {
      id: 'branding',
      name: 'Branding',
      price: 900, // $9.00 CAD/month
      currency: 'cad',
      interval: 'month',
    },
    automation: {
      id: 'automation',
      name: 'Automation',
      price: 1900, // $19.00 CAD/month
      currency: 'cad',
      interval: 'month',
    },
    signatures: {
      id: 'signatures',
      name: 'Digital Signatures',
      price: 90, // $0.90 CAD per signature
      currency: 'cad',
      interval: 'per_use',
    },
  },
} as const;

// Stripe product and price IDs (to be set from Stripe dashboard)
export const STRIPE_PRODUCTS = {
  // Monthly prices
  STARTER_MONTHLY: process.env.STRIPE_PRICE_STARTER_MONTHLY,
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY,
  BUSINESS_MONTHLY: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
  TEAMS_BASE_MONTHLY: process.env.STRIPE_PRICE_TEAMS_BASE_MONTHLY,
  TEAMS_USER_MONTHLY: process.env.STRIPE_PRICE_TEAMS_USER_MONTHLY,

  // Annual prices
  STARTER_ANNUAL: process.env.STRIPE_PRICE_STARTER_ANNUAL,
  PRO_ANNUAL: process.env.STRIPE_PRICE_PRO_ANNUAL,
  BUSINESS_ANNUAL: process.env.STRIPE_PRICE_BUSINESS_ANNUAL,
  TEAMS_BASE_ANNUAL: process.env.STRIPE_PRICE_TEAMS_BASE_ANNUAL,
  TEAMS_USER_ANNUAL: process.env.STRIPE_PRICE_TEAMS_USER_ANNUAL,

  // Add-on prices
  AUDIO_MINUTES: process.env.STRIPE_PRICE_AUDIO_MINUTES,
  STORAGE: process.env.STRIPE_PRICE_STORAGE,
  BRANDING: process.env.STRIPE_PRICE_BRANDING,
  AUTOMATION: process.env.STRIPE_PRICE_AUTOMATION,
  SIGNATURES: process.env.STRIPE_PRICE_SIGNATURES,
} as const;

// Tax configuration for Canada
export const TAX_CONFIG = {
  quebec: {
    gst: 0.05, // 5% GST
    qst: 0.09975, // 9.975% QST
    total: 0.14975, // 14.975% total
  },
  ontario: {
    gst: 0.05, // 5% GST
    hst: 0.08, // 8% HST (Ontario portion)
    total: 0.13, // 13% total HST
  },
  default: {
    gst: 0.05, // 5% GST
    total: 0.05, // Default to GST only
  },
} as const;

// Plan limits and entitlements
export const PLAN_LIMITS = {
  free: {
    documents: 3,
    audioMinutes: 10,
    storageGB: 0.25,
    aiRequests: 10,
    teamMembers: 1,
    features: ['basic_ocr'],
  },
  starter: {
    documents: 10,
    audioMinutes: 30,
    storageGB: 1,
    aiRequests: 50,
    teamMembers: 1,
    features: ['basic_ocr', 'email_support', 'templates'],
  },
  pro: {
    documents: 100,
    audioMinutes: 180,
    storageGB: 20,
    aiRequests: 500,
    teamMembers: 3,
    features: ['advanced_ai', 'templates', 'drive_import', 'priority_support'],
  },
  business: {
    documents: -1, // Unlimited
    audioMinutes: -1, // Unlimited
    storageGB: 100,
    aiRequests: -1, // Unlimited
    teamMembers: 10,
    features: ['advanced_ai', 'templates', 'drive_import', 'automations', 'api_access', 'phone_support'],
  },
  teams: {
    documents: -1, // Unlimited
    audioMinutes: -1, // Unlimited
    storageGB: 500,
    aiRequests: -1, // Unlimited
    teamMembers: -1, // Unlimited
    features: ['all_features', 'custom_training', 'sso', 'dedicated_support'],
  },
} as const;

// Helper functions
export function calculateTax(amount: number, province: string): number {
  const taxRates = TAX_CONFIG[province as keyof typeof TAX_CONFIG] || TAX_CONFIG.default;
  return Math.round(amount * taxRates.total);
}

export function formatPrice(cents: number, currency: string = 'cad'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function getPriceId(planId: string, billingCycle: 'monthly' | 'annual'): string | null {
  const mapping: Record<string, string> = {
    'starter_monthly': STRIPE_PRODUCTS.STARTER_MONTHLY!,
    'starter_annual': STRIPE_PRODUCTS.STARTER_ANNUAL!,
    'pro_monthly': STRIPE_PRODUCTS.PRO_MONTHLY!,
    'pro_annual': STRIPE_PRODUCTS.PRO_ANNUAL!,
    'business_monthly': STRIPE_PRODUCTS.BUSINESS_MONTHLY!,
    'business_annual': STRIPE_PRODUCTS.BUSINESS_ANNUAL!,
    'teams_base_monthly': STRIPE_PRODUCTS.TEAMS_BASE_MONTHLY!,
    'teams_base_annual': STRIPE_PRODUCTS.TEAMS_BASE_ANNUAL!,
    'teams_user_monthly': STRIPE_PRODUCTS.TEAMS_USER_MONTHLY!,
    'teams_user_annual': STRIPE_PRODUCTS.TEAMS_USER_ANNUAL!,
  };

  return mapping[`${planId}_${billingCycle}`] || null;
}

export function getAddOnPriceId(addOnId: string): string | null {
  const mapping: Record<string, string> = {
    audio_minutes: STRIPE_PRODUCTS.AUDIO_MINUTES!,
    storage: STRIPE_PRODUCTS.STORAGE!,
    branding: STRIPE_PRODUCTS.BRANDING!,
    automation: STRIPE_PRODUCTS.AUTOMATION!,
    signatures: STRIPE_PRODUCTS.SIGNATURES!,
  };

  return mapping[addOnId] || null;
}