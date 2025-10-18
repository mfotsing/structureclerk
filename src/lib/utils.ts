import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency for Quebec (CAD)
export function formatCurrency(amount: number, locale: string = 'fr-CA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CAD',
  }).format(amount)
}

// Calculate Quebec taxes (TPS: 5%, TVQ: 9.975%)
export function calculateQuebecTaxes(subtotal: number) {
  const TPS_RATE = 0.05 // 5%
  const TVQ_RATE = 0.09975 // 9.975%

  const tps = subtotal * TPS_RATE
  const tvq = subtotal * TVQ_RATE
  const total = subtotal + tps + tvq

  return {
    subtotal,
    tps,
    tvq,
    total,
  }
}

// Format date for Quebec
export function formatDate(date: Date | string, locale: string = 'fr-CA'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}
