'use client'

import { useState, useEffect } from 'react'
import CanadianFinance, {
  CanadianTaxCalculation,
  ExchangeRate,
  Province,
  TaxRates,
  CANADIAN_PROVINCES
} from '@/lib/canadian-finance'

export interface UseCanadianFinanceOptions {
  defaultCurrency?: 'CAD' | 'USD'
  defaultProvince?: string
  autoUpdateRates?: boolean
}

export interface UseCanadianFinanceReturn {
  // Currency management
  currency: 'CAD' | 'USD'
  setCurrency: (currency: 'CAD' | 'USD') => void
  formatCurrency: (amount: number, currency?: 'CAD' | 'USD') => string
  convertCurrency: (amount: number, from: 'CAD' | 'USD', to: 'CAD' | 'USD') => number
  exchangeRate: ExchangeRate | null
  updateExchangeRates: () => Promise<void>

  // Province management
  province: string
  setProvince: (province: string) => void
  provinceInfo: Province | null
  availableProvinces: Record<string, Province>

  // Tax calculations
  calculateTaxes: (amount: number, province?: string, currency?: 'CAD' | 'USD') => CanadianTaxCalculation
  taxRates: TaxRates | null
  taxDescription: string

  // Quick calculations
  calculateWithTax: (amount: number) => { amount: number; tax: number; total: number }
  getTaxRate: () => number

  // Language-aware formatting
  formatTaxDescription: (language?: 'en' | 'fr') => string

  // Status
  isLoading: boolean
  error: string | null
}

export function useCanadianFinance(options: UseCanadianFinanceOptions = {}): UseCanadianFinanceReturn {
  const {
    defaultCurrency = 'CAD',
    defaultProvince = 'ON',
    autoUpdateRates = true
  } = options

  const [currency, setCurrency] = useState<'CAD' | 'USD'>(defaultCurrency)
  const [province, setProvince] = useState<string>(defaultProvince)
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const finance = CanadianFinance.getInstance()
  const availableProvinces: Record<string, Province> = CANADIAN_PROVINCES

  // Initialize exchange rate
  useEffect(() => {
    const initializeExchangeRate = async () => {
      try {
        setIsLoading(true)
        const rate = await finance.getExchangeRate('CAD', 'USD')
        setExchangeRate(rate)
        setError(null)
      } catch (err) {
        setError('Failed to load exchange rates')
        console.error('Exchange rate error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeExchangeRate()
  }, [])

  // Auto-update exchange rates periodically
  useEffect(() => {
    if (!autoUpdateRates) return

    const interval = setInterval(async () => {
      try {
        await finance.updateExchangeRates()
        const rate = await finance.getExchangeRate('CAD', 'USD')
        setExchangeRate(rate)
      } catch (err) {
        console.error('Failed to update exchange rates:', err)
      }
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [autoUpdateRates])

  // Currency formatting
  const formatCurrency = (amount: number, currencyOverride?: 'CAD' | 'USD'): string => {
    return finance.formatCurrency(amount, currencyOverride || currency)
  }

  // Currency conversion
  const convertCurrency = (amount: number, from: 'CAD' | 'USD', to: 'CAD' | 'USD'): number => {
    return finance.convertCurrency(amount, from, to)
  }

  // Update exchange rates
  const updateExchangeRates = async (): Promise<void> => {
    try {
      setIsLoading(true)
      await finance.updateExchangeRates()
      const rate = await finance.getExchangeRate('CAD', 'USD')
      setExchangeRate(rate)
      setError(null)
    } catch (err) {
      setError('Failed to update exchange rates')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Get province info
  const provinceInfo = finance.getProvinceInfo(province)

  // Calculate taxes
  const calculateTaxes = (
    amount: number,
    provinceOverride?: string,
    currencyOverride?: 'CAD' | 'USD'
  ): CanadianTaxCalculation => {
    return finance.calculateTaxes(
      amount,
      provinceOverride || province,
      currencyOverride || currency
    )
  }

  // Get tax rates
  const taxRates = finance.getTaxRates(province)

  // Get tax description
  const taxDescription = finance.getTaxDescription(province)

  // Quick calculation with tax
  const calculateWithTax = (amount: number) => {
    const taxCalc = calculateTaxes(amount)
    return {
      amount,
      tax: taxCalc.totalTax,
      total: taxCalc.total
    }
  }

  // Get total tax rate
  const getTaxRate = (): number => {
    const taxCalc = calculateTaxes(100)
    return (taxCalc.totalTax / 100)
  }

  // Language-aware tax description
  const formatTaxDescription = (language: 'en' | 'fr' = 'en'): string => {
    return finance.getTaxDescription(province, language)
  }

  return {
    // Currency management
    currency,
    setCurrency,
    formatCurrency,
    convertCurrency,
    exchangeRate,
    updateExchangeRates,

    // Province management
    province,
    setProvince,
    provinceInfo,
    availableProvinces,

    // Tax calculations
    calculateTaxes,
    taxRates,
    taxDescription,

    // Quick calculations
    calculateWithTax,
    getTaxRate,

    // Language-aware formatting
    formatTaxDescription,

    // Status
    isLoading,
    error
  }
}

// Hook for currency converter component
export function useCurrencyConverter() {
  const { currency, setCurrency, convertCurrency, exchangeRate, isLoading } = useCanadianFinance()
  const [amount, setAmount] = useState<string>('100')
  const [convertedAmount, setConvertedAmount] = useState<string>('0')

  const handleConvert = (value: string) => {
    setAmount(value)
    const numAmount = parseFloat(value) || 0

    if (currency === 'CAD') {
      setConvertedAmount(convertCurrency(numAmount, 'CAD', 'USD').toFixed(2))
    } else {
      setConvertedAmount(convertCurrency(numAmount, 'USD', 'CAD').toFixed(2))
    }
  }

  return {
    amount,
    setAmount: handleConvert,
    currency,
    setCurrency,
    convertedAmount,
    isLoading,
    exchangeRate
  }
}

// Hook for tax calculator component
export function useTaxCalculator() {
  const { province, setProvince, calculateTaxes, formatCurrency, taxDescription } = useCanadianFinance()
  const [amount, setAmount] = useState<string>('100')
  const [taxCalculation, setTaxCalculation] = useState<CanadianTaxCalculation | null>(null)

  const handleCalculate = (value: string) => {
    setAmount(value)
    const numAmount = parseFloat(value) || 0
    const calc = calculateTaxes(numAmount)
    setTaxCalculation(calc)
  }

  return {
    amount,
    setAmount: handleCalculate,
    province,
    setProvince,
    taxCalculation,
    formatCurrency,
    taxDescription
  }
}

export default useCanadianFinance