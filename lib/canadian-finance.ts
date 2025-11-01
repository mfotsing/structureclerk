// Canadian Finance System
// Support for CAD/USD with proper Canadian tax calculations

export interface Currency {
  code: 'CAD' | 'USD'
  symbol: string
  locale: string
}

export interface Province {
  code: string
  name: string
  taxCode: string
  timezone: string
}

export interface TaxRates {
  gst: number      // Federal Goods and Services Tax (5%)
  hst?: number     // Harmonized Sales Tax (varies by province)
  pst?: number     // Provincial Sales Tax (varies by province)
  qst?: number     // Quebec Sales Tax (9.975%)
}

export interface CanadianTaxCalculation {
  subtotal: number
  federalTax: number
  provincialTax: number
  totalTax: number
  total: number
  breakdown: {
    gst: number
    hst?: number
    pst?: number
    qst?: number
  }
}

// Canadian provinces with tax information
export const CANADIAN_PROVINCES: Record<string, Province> = {
  'AB': { code: 'AB', name: 'Alberta', taxCode: 'AB', timezone: 'America/Edmonton' },
  'BC': { code: 'BC', name: 'British Columbia', taxCode: 'BC', timezone: 'America/Vancouver' },
  'MB': { code: 'MB', name: 'Manitoba', taxCode: 'MB', timezone: 'America/Winnipeg' },
  'NB': { code: 'NB', name: 'New Brunswick', taxCode: 'NB', timezone: 'America/Halifax' },
  'NL': { code: 'NL', name: 'Newfoundland and Labrador', taxCode: 'NL', timezone: 'America/St_Johns' },
  'NS': { code: 'NS', name: 'Nova Scotia', taxCode: 'NS', timezone: 'America/Halifax' },
  'ON': { code: 'ON', name: 'Ontario', taxCode: 'ON', timezone: 'America/Toronto' },
  'PE': { code: 'PE', name: 'Prince Edward Island', taxCode: 'PE', timezone: 'America/Halifax' },
  'QC': { code: 'QC', name: 'Quebec', taxCode: 'QC', timezone: 'America/Montreal' },
  'SK': { code: 'SK', name: 'Saskatchewan', taxCode: 'SK', timezone: 'America/Regina' },
  'NT': { code: 'NT', name: 'Northwest Territories', taxCode: 'NT', timezone: 'America/Yellowknife' },
  'NU': { code: 'NU', name: 'Nunavut', taxCode: 'NU', timezone: 'America/Iqaluit' },
  'YT': { code: 'YT', name: 'Yukon', taxCode: 'YT', timezone: 'America/Whitehorse' }
}

// Tax rates by province (as of 2024)
export const CANADIAN_TAX_RATES: Record<string, TaxRates> = {
  'AB': { gst: 0.05, pst: 0 },                    // Alberta: GST 5% only
  'BC': { gst: 0.05, pst: 0.07 },                 // BC: GST 5% + PST 7%
  'MB': { gst: 0.05, pst: 0.07 },                 // Manitoba: GST 5% + PST 7%
  'NB': { gst: 0.05, hst: 0.15 },                // New Brunswick: HST 15% (includes 5% GST)
  'NL': { gst: 0.05, hst: 0.15 },                // NL: HST 15% (includes 5% GST)
  'NS': { gst: 0.05, hst: 0.15 },                // Nova Scotia: HST 15% (includes 5% GST)
  'ON': { gst: 0.05, hst: 0.13 },                // Ontario: HST 13% (includes 5% GST)
  'PE': { gst: 0.05, hst: 0.15 },                // PEI: HST 15% (includes 5% GST)
  'QC': { gst: 0.05, qst: 0.09975 },            // Quebec: GST 5% + QST 9.975%
  'SK': { gst: 0.05, pst: 0.06 },                 // Saskatchewan: GST 5% + PST 6%
  'NT': { gst: 0.05 },                           // Northwest Territories: GST 5% only
  'NU': { gst: 0.05 },                           // Nunavut: GST 5% only
  'YT': { gst: 0.05 }                            // Yukon: GST 5% only
}

// Currency configuration
export const CANADIAN_CURRENCIES: Record<string, Currency> = {
  CAD: { code: 'CAD', symbol: 'C$', locale: 'en-CA' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US' }
}

// Exchange rate interface
export interface ExchangeRate {
  from: 'CAD' | 'USD'
  to: 'CAD' | 'USD'
  rate: number
  lastUpdated: Date
}

// Mock exchange rates (would come from real API in production)
let mockExchangeRates: Record<string, number> = {
  'CAD_TO_USD': 0.74,
  'USD_TO_CAD': 1.35
}

export class CanadianFinance {
  private static instance: CanadianFinance

  public static getInstance(): CanadianFinance {
    if (!CanadianFinance.instance) {
      CanadianFinance.instance = new CanadianFinance()
    }
    return CanadianFinance.instance
  }

  // Calculate taxes for Canadian provinces
  calculateTaxes(amount: number, provinceCode: string, currency: 'CAD' | 'USD' = 'CAD'): CanadianTaxCalculation {
    const taxRates = CANADIAN_TAX_RATES[provinceCode] || { gst: 0.05 }
    let federalTax = 0
    let provincialTax = 0
    let breakdown: any = {}

    if (taxRates.hst) {
      // HST provinces - single combined tax
      provincialTax = amount * taxRates.hst
      breakdown.hst = provincialTax
    } else {
      // GST + Provincial tax provinces
      if (taxRates.gst) {
        federalTax = amount * taxRates.gst
        breakdown.gst = federalTax
      }

      if (taxRates.pst) {
        provincialTax = amount * taxRates.pst
        breakdown.pst = provincialTax
      } else if (taxRates.qst) {
        provincialTax = amount * taxRates.qst
        breakdown.qst = provincialTax
      }
    }

    const totalTax = federalTax + provincialTax
    const total = amount + totalTax

    return {
      subtotal: amount,
      federalTax,
      provincialTax,
      totalTax,
      total,
      breakdown
    }
  }

  // Format currency with proper Canadian formatting
  formatCurrency(amount: number, currency: 'CAD' | 'USD' = 'CAD'): string {
    const currencyConfig = CANADIAN_CURRENCIES[currency]

    if (currency === 'CAD') {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    }
  }

  // Convert between CAD and USD
  convertCurrency(amount: number, from: 'CAD' | 'USD', to: 'CAD' | 'USD'): number {
    if (from === to) return amount

    const rateKey = `${from}_TO_${to}`
    const rate = mockExchangeRates[rateKey]

    if (!rate) {
      throw new Error(`Exchange rate not available for ${from} to ${to}`)
    }

    return amount * rate
  }

  // Get current exchange rate
  async getExchangeRate(from: 'CAD' | 'USD', to: 'CAD' | 'USD'): Promise<ExchangeRate> {
    // In production, this would call a real API like Bank of Canada or exchange rate service
    const rateKey = `${from}_TO_${to}`
    const rate = mockExchangeRates[rateKey]

    return {
      from,
      to,
      rate: rate || 1,
      lastUpdated: new Date()
    }
  }

  // Update exchange rates (would be called periodically)
  async updateExchangeRates(): Promise<void> {
    // In production, fetch from real API
    // For now, simulate small changes to mock rates
    mockExchangeRates.CAD_TO_USD *= (0.99 + Math.random() * 0.02)
    mockExchangeRates.USD_TO_CAD = 1 / mockExchangeRates.CAD_TO_USD
  }

  // Get province information
  getProvinceInfo(provinceCode: string): Province | null {
    return CANADIAN_PROVINCES[provinceCode] || null
  }

  // Get tax rates for province
  getTaxRates(provinceCode: string): TaxRates | null {
    return CANADIAN_TAX_RATES[provinceCode] || null
  }

  // Check if province uses HST
  isHSTProvince(provinceCode: string): boolean {
    const taxRates = CANADIAN_TAX_RATES[provinceCode]
    return taxRates?.hst !== undefined
  }

  // Get tax breakdown description
  getTaxDescription(provinceCode: string, language: 'en' | 'fr' = 'en'): string {
    const taxRates = CANADIAN_TAX_RATES[provinceCode]
    const province = CANADIAN_PROVINCES[provinceCode]

    if (!taxRates || !province) return ''

    if (language === 'fr') {
      if (taxRates.hst) {
        return `TVH ${(taxRates.hst * 100).toFixed(1)}%`
      } else if (taxRates.qst) {
        return `TPS 5% + TVQ ${(taxRates.qst * 100).toFixed(2)}%`
      } else if (taxRates.pst) {
        return `TPS 5% + TVProvinciale ${(taxRates.pst * 100).toFixed(1)}%`
      } else {
        return `TPS 5%`
      }
    } else {
      if (taxRates.hst) {
        return `HST ${(taxRates.hst * 100).toFixed(1)}%`
      } else if (taxRates.qst) {
        return `GST 5% + QST ${(taxRates.qst * 100).toFixed(2)}%`
      } else if (taxRates.pst) {
        return `GST 5% + PST ${(taxRates.pst * 100).toFixed(1)}%`
      } else {
        return `GST 5%`
      }
    }
  }
}

export default CanadianFinance