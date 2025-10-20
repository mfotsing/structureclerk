/**
 * Stripe Client - Server-side Stripe initialization
 * Uses singleton pattern to avoid multiple instances
 */

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
  appInfo: {
    name: 'StructureClerk',
    version: '1.0.0',
    url: 'https://structureclerk.ca',
  },
})
