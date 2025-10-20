/**
 * Stripe Plans Configuration
 * Defines all subscription plans with features and limits
 */

export interface PlanLimits {
  projects: number | null // null = unlimited
  invoices_per_month: number | null
  documents: number | null
  ai_tokens: number
  users: number | null
}

export interface Plan {
  id: string
  name: string
  price: number // in CAD cents
  currency: string
  interval: 'month' | 'year'
  stripe_price_id: string | undefined
  features: string[]
  limits: PlanLimits
  popular?: boolean
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'Essai Gratuit',
    price: 0,
    currency: 'CAD',
    interval: 'month',
    stripe_price_id: undefined,
    features: [
      '30 jours d\'essai gratuit',
      '3 projets maximum',
      '10 factures par mois',
      '100 documents',
      '50 000 tokens IA/mois',
      'Support email',
    ],
    limits: {
      projects: 3,
      invoices_per_month: 10,
      documents: 100,
      ai_tokens: 50_000,
      users: 1,
    },
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9900, // $99.00 CAD
    currency: 'CAD',
    interval: 'month',
    stripe_price_id: process.env.STRIPE_PRICE_ID_PRO,
    features: [
      'Projets illimités',
      'Factures illimitées',
      'Documents illimités',
      '1 000 000 tokens IA/mois',
      'Assistant IA conversationnel',
      'Analytics & prévisions',
      'Export comptable',
      'Support prioritaire',
      'Gestion fournisseurs',
      'Workflow d\'approbations',
    ],
    limits: {
      projects: null,
      invoices_per_month: null,
      documents: null,
      ai_tokens: 1_000_000,
      users: 5,
    },
    popular: true,
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29900, // $299.00 CAD
    currency: 'CAD',
    interval: 'month',
    stripe_price_id: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    features: [
      'Tout du plan Pro',
      'Multi-organisations',
      '5 000 000 tokens IA/mois',
      'Utilisateurs illimités',
      'API access',
      'Intégrations personnalisées',
      'Rapports personnalisés',
      'SLA 99.9%',
      'Support dédié',
      'Formation équipe',
    ],
    limits: {
      projects: null,
      invoices_per_month: null,
      documents: null,
      ai_tokens: 5_000_000,
      users: null,
    },
  },
}

/**
 * Get plan by ID with fallback to free
 */
export function getPlan(planId: string): Plan {
  return PLANS[planId] || PLANS.free
}

/**
 * Format price for display
 */
export function formatPrice(cents: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100)
}

/**
 * Check if resource is unlimited
 */
export function isUnlimited(limit: number | null): boolean {
  return limit === null
}

/**
 * Get all available plans for display
 */
export function getAvailablePlans(): Plan[] {
  return [PLANS.pro, PLANS.enterprise]
}
