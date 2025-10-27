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
    pro: {
      id: 'pro',
      name: 'Pro',
      price: 1200, // $12.00 CAD
      currency: 'cad',
      interval: 'month',
      annualPrice: 10000, // $100.00 CAD/year ($8.33/month)
    },
    business: {
      id: 'business',
      name: 'Business',
      price: 2400, // $24.00 CAD
      currency: 'cad',
      interval: 'month',
      annualPrice: 20000, // $200.00 CAD/year ($16.67/month)
    },
    teams: {
      id: 'teams',
      name: 'Teams',
      basePrice: 4900, // $49.00 CAD base
      perUserPrice: 900, // $9.00 CAD per user
      currency: 'cad',
      interval: 'month',
      annualBasePrice: 45000, // $450.00 CAD/year base
      annualPerUserPrice: 9000, // $90.00 CAD/year per user
    },
  },
  addOns: {
    audioMinutes: {
      id: 'audio_minutes',
      name: 'Extra Audio Minutes',
      price: 500, // $5.00 CAD
      currency: 'cad',
      interval: 'month',
      minutes: 200,
    },
    storage: {
      id: 'storage',
      name: 'Extra Storage',
      price: 400, // $4.00 CAD
      currency: 'cad',
      interval: 'month',
      gigabytes: 50,
    },
    branding: {
      id: 'branding',
      name: 'Branding Pro',
      price: 500, // $5.00 CAD
      currency: 'cad',
      interval: 'month',
    },
    automation: {
      id: 'automation',
      name: 'Automation Power Pack',
      price: 900, // $9.00 CAD
      currency: 'cad',
      interval: 'month',
    },
    signatures: {
      id: 'signatures',
      name: 'Digital Signatures',
      price: 600, // $6.00 CAD
      currency: 'cad',
      interval: 'month',
    },
  },
} as const;

// Stripe product and price IDs (to be set from Stripe dashboard)
export const STRIPE_PRODUCTS = {
  // Monthly prices
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY,
  BUSINESS_MONTHLY: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
  TEAMS_BASE_MONTHLY: process.env.STRIPE_PRICE_TEAMS_BASE_MONTHLY,
  TEAMS_USER_MONTHLY: process.env.STRIPE_PRICE_TEAMS_USER_MONTHLY,

  // Annual prices
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
    documents: 10,
    audioMinutes: 30,
    storageGB: 1,
    aiRequests: 50,
    teamMembers: 1,
    features: ['basic_ocr', 'email_support'],
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
    documents: 1000,
    audioMinutes: 600,
    storageGB: 100,
    aiRequests: 2000,
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