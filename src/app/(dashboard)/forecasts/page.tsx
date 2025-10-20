'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Info, DollarSign, Calendar, Target, Loader2, Lock } from 'lucide-react'
import Link from 'next/link'

interface ForecastPeriod {
  revenue: number
  expenses: number
  net_cashflow: number
  confidence: number
}

interface Alert {
  type: 'warning' | 'danger' | 'info'
  message: string
}

interface Forecast {
  current_month: {
    revenue: number
    expenses: number
    net_cashflow: number
  }
  forecasts: {
    '30_days': ForecastPeriod
    '60_days': ForecastPeriod
    '90_days': ForecastPeriod
  }
  insights: string[]
  alerts: Alert[]
  recommendations: string[]
}

export default function ForecastsPage() {
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upgradeRequired, setUpgradeRequired] = useState(false)

  useEffect(() => {
    loadForecast()
  }, [])

  const loadForecast = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/forecasts')
      const data = await response.json()

      if (!response.ok) {
        if (data.upgrade_required) {
          setUpgradeRequired(true)
        }
        throw new Error(data.error || 'Erreur lors du chargement')
      }

      setForecast(data.forecast)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(0)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-orange animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Génération des prévisions financières...</p>
          <p className="text-sm text-gray-500 mt-2">Analyse en cours avec IA</p>
        </div>
      </div>
    )
  }

  if (upgradeRequired) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-brand-navy to-blue-900 rounded-2xl p-12 text-center text-white shadow-2xl">
          <Lock className="w-16 h-16 mx-auto mb-6 text-brand-orange" />
          <h2 className="text-3xl font-bold mb-4">
            Prévisions Financières IA
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Obtenez des prévisions de trésorerie à 30, 60 et 90 jours avec des recommandations personnalisées.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-white/10 p-6 rounded-lg">
              <TrendingUp className="w-8 h-8 text-brand-orange mb-3" />
              <h3 className="font-semibold mb-2">Prévisions Précises</h3>
              <p className="text-sm text-blue-200">Analyse IA de vos données historiques avec ajustement saisonnier</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-brand-orange mb-3" />
              <h3 className="font-semibold mb-2">Alertes Proactives</h3>
              <p className="text-sm text-blue-200">Détection automatique des risques de trésorerie</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <Target className="w-8 h-8 text-brand-orange mb-3" />
              <h3 className="font-semibold mb-2">Recommandations</h3>
              <p className="text-sm text-blue-200">Actions concrètes pour optimiser votre cashflow</p>
            </div>
          </div>
          <Link
            href="/subscription/plans"
            className="inline-block px-10 py-4 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            Passer à Pro →
          </Link>
          <p className="text-sm text-blue-200 mt-6">
            Disponible avec les plans Pro et Enterprise
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Erreur</h3>
              <p className="text-red-800">{error}</p>
              <button
                onClick={loadForecast}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!forecast) return null

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy mb-2">
          Prévisions Financières
        </h1>
        <p className="text-gray-600">
          Analyse IA de votre trésorerie avec prévisions à 30, 60 et 90 jours
        </p>
      </div>

      {/* Alerts */}
      {forecast.alerts.length > 0 && (
        <div className="space-y-3">
          {forecast.alerts.map((alert, index) => (
            <div
              key={index}
              className={`rounded-lg p-4 border-l-4 ${
                alert.type === 'danger'
                  ? 'bg-red-50 border-red-500'
                  : alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 flex-shrink-0 ${
                    alert.type === 'danger'
                      ? 'text-red-600'
                      : alert.type === 'warning'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    alert.type === 'danger'
                      ? 'text-red-900'
                      : alert.type === 'warning'
                      ? 'text-yellow-900'
                      : 'text-blue-900'
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Month Overview */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Mois Actuel
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Revenus</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(forecast.current_month.revenue)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Dépenses</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(forecast.current_month.expenses)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Cashflow Net</p>
            <p
              className={`text-2xl font-bold ${
                forecast.current_month.net_cashflow >= 0
                  ? 'text-brand-navy'
                  : 'text-red-600'
              }`}
            >
              {formatCurrency(forecast.current_month.net_cashflow)}
            </p>
          </div>
        </div>
      </div>

      {/* Forecasts */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* 30 Days */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-navy">Dans 30 jours</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {formatPercent(forecast.forecasts['30_days'].confidence)} confiance
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Revenus prévus</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(forecast.forecasts['30_days'].revenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Dépenses prévues</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(forecast.forecasts['30_days'].expenses)}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Cashflow Net</p>
              <p className={`text-xl font-bold ${
                forecast.forecasts['30_days'].net_cashflow >= 0
                  ? 'text-brand-navy'
                  : 'text-red-600'
              }`}>
                {formatCurrency(forecast.forecasts['30_days'].net_cashflow)}
              </p>
            </div>
          </div>
        </div>

        {/* 60 Days */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-navy">Dans 60 jours</h3>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              {formatPercent(forecast.forecasts['60_days'].confidence)} confiance
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Revenus prévus</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(forecast.forecasts['60_days'].revenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Dépenses prévues</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(forecast.forecasts['60_days'].expenses)}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Cashflow Net</p>
              <p className={`text-xl font-bold ${
                forecast.forecasts['60_days'].net_cashflow >= 0
                  ? 'text-brand-navy'
                  : 'text-red-600'
              }`}>
                {formatCurrency(forecast.forecasts['60_days'].net_cashflow)}
              </p>
            </div>
          </div>
        </div>

        {/* 90 Days */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-navy">Dans 90 jours</h3>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              {formatPercent(forecast.forecasts['90_days'].confidence)} confiance
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Revenus prévus</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(forecast.forecasts['90_days'].revenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Dépenses prévues</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(forecast.forecasts['90_days'].expenses)}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Cashflow Net</p>
              <p className={`text-xl font-bold ${
                forecast.forecasts['90_days'].net_cashflow >= 0
                  ? 'text-brand-navy'
                  : 'text-red-600'
              }`}>
                {formatCurrency(forecast.forecasts['90_days'].net_cashflow)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {forecast.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-brand-orange/10 to-orange-50 rounded-xl border border-brand-orange/30 p-6">
          <h2 className="text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-orange" />
            Recommandations
          </h2>
          <ul className="space-y-3">
            {forecast.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-800">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Insights */}
      {forecast.insights.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Insights Financiers
          </h2>
          <ul className="space-y-2">
            {forecast.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-brand-orange mt-1">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Les prévisions sont générées par IA en analysant vos données historiques.
          <br />
          La confiance diminue avec le temps (30j → 60j → 90j).
        </p>
      </div>
    </div>
  )
}
