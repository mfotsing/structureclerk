// Production configuration validation
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  success: string[];
}

export function validateProductionConfig(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const success: string[] = [];

  // Required environment variables
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_APP_URL',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'ANTHROPIC_API_KEY',
    'NEXT_PUBLIC_HCAPTCHA_SITE_KEY',
    'HCAPTCHA_SECRET_KEY'
  ];

  // Check required variables
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    } else {
      success.push(`✅ ${varName} is configured`);
    }
  });

  // Validate URLs
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (siteUrl && !siteUrl.startsWith('https://')) {
    errors.push('NEXT_PUBLIC_SITE_URL must use HTTPS in production');
  }

  if (appUrl && !appUrl.startsWith('https://')) {
    errors.push('NEXT_PUBLIC_APP_URL must use HTTPS in production');
  }

  if (siteUrl && appUrl && siteUrl !== appUrl) {
    warnings.push('Site URL and App URL are different - this may cause redirect issues');
  }

  // Validate Stripe configuration
  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (stripePublishableKey && !stripePublishableKey.startsWith('pk_live_')) {
    errors.push('STRIPE_PUBLISHABLE_KEY should be a live key for production');
  }

  if (stripeSecretKey && !stripeSecretKey.startsWith('sk_live_')) {
    errors.push('STRIPE_SECRET_KEY should be a live key for production');
  }

  // Validate Clerk configuration
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (clerkPublishableKey && !clerkPublishableKey.startsWith('pk_live_')) {
    errors.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY should be a live key for production');
  }

  if (clerkSecretKey && !clerkSecretKey.startsWith('sk_live_')) {
    errors.push('CLERK_SECRET_KEY should be a live key for production');
  }

  // Validate Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && supabaseUrl.includes('localhost')) {
    errors.push('Supabase URL should not point to localhost in production');
  }

  // Validate pricing IDs
  const requiredStripePrices = [
    'STRIPE_PRICE_PRO_ANNUAL',
    'STRIPE_PRICE_BUSINESS_ANNUAL',
    'STRIPE_PRICE_TEAMS_BASE_ANNUAL',
    'STRIPE_PRICE_TEAMS_USER_ANNUAL',
    'STRIPE_PRICE_AUDIO_MINUTES',
    'STRIPE_PRICE_STORAGE',
    'STRIPE_PRICE_BRANDING',
    'STRIPE_PRICE_AUTOMATION',
    'STRIPE_PRICE_SIGNATURES'
  ];

  requiredStripePrices.forEach(priceVar => {
    if (!process.env[priceVar]) {
      errors.push(`Missing Stripe price ID: ${priceVar}`);
    } else {
      success.push(`✅ ${priceVar} is configured`);
    }
  });

  // Validate hCaptcha
  const hcaptchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
  if (hcaptchaSiteKey && hcaptchaSiteKey.length < 10) {
    errors.push('hCaptcha site key appears to be invalid');
  }

  // Validate email configuration
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;
  if (resendFromEmail && !resendFromEmail.includes('@')) {
    errors.push('RESEND_FROM_EMAIL must be a valid email address');
  }

  // Check for test keys in production
  const testKeyPatterns = ['sk_test_', 'pk_test_', 'test_', 'demo_'];

  Object.entries(process.env).forEach(([key, value]) => {
    if (value && typeof value === 'string') {
      const isTestKey = testKeyPatterns.some(pattern => value.includes(pattern));
      if (isTestKey && (key.includes('STRIPE') || key.includes('CLERK') || key.includes('API_KEY'))) {
        warnings.push(`⚠️ ${key} appears to be using test credentials in production`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    success
  };
}

// Get production pricing summary
export function getProductionPricingSummary() {
  return {
    plans: {
      free: {
        documents: 3,
        audioMinutes: 10,
        storageGB: 0.25,
        price: '$0',
        features: ['Basic document processing', 'Mobile app', 'Basic templates']
      },
      starter: {
        documents: 10,
        audioMinutes: 30,
        storageGB: 1,
        price: '$9.99/month',
        annualPrice: '$99/year',
        savings: 'Save $20/year (17% off)',
        features: ['Advanced document processing', 'Email support', 'Custom templates', 'Advanced mobile features']
      },
      professional: {
        documents: 100,
        audioMinutes: 180,
        storageGB: 20,
        price: '$29/month',
        annualPrice: '$190/year',
        savings: 'Save $158/year (35% off)',
        features: ['Advanced AI processing', 'Priority support', 'Analytics', 'Drive import', 'Enhanced security']
      },
      business: {
        documents: 'Unlimited',
        audioMinutes: 'Unlimited',
        storageGB: 100,
        price: '$79/month',
        annualPrice: '$590/year',
        savings: 'Save $358/year (38% off)',
        features: ['Team collaboration', 'API access', 'Phone support', 'Advanced workflows', 'SSO integration']
      },
      enterprise: {
        documents: 'Unlimited',
        audioMinutes: 'Unlimited',
        storageGB: '500+',
        price: 'Custom',
        features: ['Dedicated support', 'Custom AI training', 'SSO integration', 'Advanced security', 'Custom branding']
      }
    },
    addOns: {
      audioMinutes: '$0.06/minute',
      storage: '$0.12/GB/month',
      branding: '$9/month',
      automation: '$19/month',
      signatures: '$0.90/signature'
    },
    currency: 'CAD',
    taxes: {
      Quebec: 'GST 5% + QST 9.975% = 14.975%',
      Ontario: 'HST 13%',
      Other: 'GST 5%'
    }
  };
}

// Validate pricing configuration matches Stripe IDs
export function validatePricingConfiguration() {
  const pricing = getProductionPricingSummary();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if annual pricing gives good value
  const proMonthlyValue = 29 * 12; // $348/year
  const proAnnualPrice = 190; // $190/year
  const proSavings = ((proMonthlyValue - proAnnualPrice) / proMonthlyValue) * 100;

  if (proSavings < 30) {
    warnings.push('Professional annual plan should offer at least 30% savings');
  }

  const businessMonthlyValue = 79 * 12; // $948/year
  const businessAnnualPrice = 590; // $590/year
  const businessSavings = ((businessMonthlyValue - businessAnnualPrice) / businessMonthlyValue) * 100;

  if (businessSavings < 30) {
    warnings.push('Business annual plan should offer at least 30% savings');
  }

  return {
    pricing,
    errors,
    warnings,
    isValid: errors.length === 0
  };
}