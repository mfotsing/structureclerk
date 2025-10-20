# 🦄 ROADMAP LICORNE - PART 2

**Suite du Plan d'Implémentation (Phases 2-4 + Migrations + Coûts)**

---

## 🚀 PHASE 2 - INTELLIGENCE & ANALYTICS (4-5 semaines)

### 2.1 Dashboard Admin & Analytics (2 semaines)

**Effort:** 🟡 Moyen (35-40h)
**Impact Business:** 🔥🔥 CRITIQUE (décisions data-driven)

#### A. Métriques Business Clés (KPIs)

```typescript
// src/lib/analytics/kpis.ts
export interface BusinessMetrics {
  // Revenus
  mrr: number // Monthly Recurring Revenue
  arr: number // Annual Recurring Revenue
  revenue_growth: number // % vs mois précédent

  // Utilisateurs
  total_users: number
  active_users: number // Actifs 30 derniers jours
  new_users_this_month: number
  churn_rate: number // % utilisateurs perdus

  // Abonnements
  trial_users: number
  paid_users: number
  conversion_rate: number // trial → paid
  avg_subscription_value: number

  // Utilisation
  total_documents_processed: number
  ai_operations_this_month: number
  ai_tokens_used: number
  avg_ai_cost_per_user: number

  // Health
  error_rate: number
  avg_response_time_ms: number
  uptime_percentage: number
}

export async function calculateBusinessMetrics(): Promise<BusinessMetrics> {
  const supabase = await createClient()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // MRR Calculation
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('monthly_price, status')
    .in('status', ['active', 'trialing'])

  const mrr = subscriptions?.reduce((sum, sub) => sum + (sub.monthly_price || 0), 0) || 0
  const arr = mrr * 12

  // Revenue Growth
  const { data: lastMonthSubs } = await supabase
    .from('subscriptions')
    .select('monthly_price')
    .in('status', ['active'])
    .lte('created_at', endOfLastMonth.toISOString())

  const lastMonthMRR =
    lastMonthSubs?.reduce((sum, sub) => sum + (sub.monthly_price || 0), 0) || 0
  const revenueGrowth =
    lastMonthMRR > 0 ? ((mrr - lastMonthMRR) / lastMonthMRR) * 100 : 0

  // Users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const { count: activeUsers } = await supabase
    .from('activities')
    .select('user_id', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())

  const { count: newUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())

  // Churn (users who canceled/expired this month)
  const { count: churnedUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'canceled')
    .gte('updated_at', startOfMonth.toISOString())

  const churnRate = totalUsers ? (churnedUsers / totalUsers) * 100 : 0

  // Subscriptions
  const { count: trialUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'trial')

  const { count: paidUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  const conversionRate = trialUsers ? (paidUsers / (trialUsers + paidUsers)) * 100 : 0

  const avgSubscriptionValue = paidUsers > 0 ? mrr / paidUsers : 0

  // AI Usage
  const { count: totalDocuments } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })

  const { count: aiOperations } = await supabase
    .from('ai_usage_logs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())

  const { data: tokenUsage } = await supabase
    .from('ai_usage_logs')
    .select('tokens_total')
    .gte('created_at', startOfMonth.toISOString())

  const aiTokensUsed =
    tokenUsage?.reduce((sum, log) => sum + (log.tokens_total || 0), 0) || 0

  const avgAICostPerUser = totalUsers > 0 ? (aiTokensUsed * 0.003) / totalUsers : 0

  // Health (simplified - would need APM tool for real metrics)
  const errorRate = 0 // TODO: Integrate error tracking
  const avgResponseTime = 0 // TODO: Integrate APM
  const uptime = 99.9 // TODO: Integrate uptime monitoring

  return {
    mrr,
    arr,
    revenue_growth: revenueGrowth,
    total_users: totalUsers || 0,
    active_users: activeUsers || 0,
    new_users_this_month: newUsers || 0,
    churn_rate: churnRate,
    trial_users: trialUsers || 0,
    paid_users: paidUsers || 0,
    conversion_rate: conversionRate,
    avg_subscription_value: avgSubscriptionValue,
    total_documents_processed: totalDocuments || 0,
    ai_operations_this_month: aiOperations || 0,
    ai_tokens_used: aiTokensUsed,
    avg_ai_cost_per_user: avgAICostPerUser,
    error_rate: errorRate,
    avg_response_time_ms: avgResponseTime,
    uptime_percentage: uptime,
  }
}
```

#### B. Page Dashboard Admin

```tsx
// src/app/(dashboard)/admin/page.tsx
import { calculateBusinessMetrics } from '@/lib/analytics/kpis'
import {
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  Zap,
  AlertCircle
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const metrics = await calculateBusinessMetrics()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-navy mb-2">
          Dashboard Admin
        </h1>
        <p className="text-gray-600">
          Métriques business et performance de la plateforme
        </p>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="MRR (Monthly Recurring Revenue)"
          value={`${metrics.mrr.toFixed(0)} $ CAD`}
          change={metrics.revenue_growth}
          icon={<DollarSign className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="ARR (Annual Recurring Revenue)"
          value={`${metrics.arr.toFixed(0)} $ CAD`}
          icon={<DollarSign className="w-6 h-6" />}
        />
        <MetricCard
          title="Valeur Moyenne Abonnement"
          value={`${metrics.avg_subscription_value.toFixed(2)} $ CAD`}
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Utilisateurs Totaux"
          value={metrics.total_users.toString()}
          icon={<Users className="w-6 h-6" />}
        />
        <MetricCard
          title="Utilisateurs Actifs (30j)"
          value={metrics.active_users.toString()}
          icon={<Activity className="w-6 h-6" />}
        />
        <MetricCard
          title="Nouveaux ce Mois"
          value={metrics.new_users_this_month.toString()}
          icon={<TrendingUp className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Taux de Churn"
          value={`${metrics.churn_rate.toFixed(1)}%`}
          icon={<AlertCircle className="w-6 h-6" />}
          trend={metrics.churn_rate > 5 ? 'down' : undefined}
        />
      </div>

      {/* Subscription Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Essais Gratuits"
          value={metrics.trial_users.toString()}
          icon={<Users className="w-6 h-6" />}
        />
        <MetricCard
          title="Abonnements Payants"
          value={metrics.paid_users.toString()}
          icon={<DollarSign className="w-6 h-6" />}
        />
        <MetricCard
          title="Taux de Conversion"
          value={`${metrics.conversion_rate.toFixed(1)}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={metrics.conversion_rate > 20 ? 'up' : 'down'}
        />
      </div>

      {/* AI Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Documents Traités"
          value={metrics.total_documents_processed.toString()}
          icon={<Zap className="w-6 h-6" />}
        />
        <MetricCard
          title="Opérations IA ce Mois"
          value={metrics.ai_operations_this_month.toString()}
          icon={<Activity className="w-6 h-6" />}
        />
        <MetricCard
          title="Tokens IA Utilisés"
          value={formatNumber(metrics.ai_tokens_used)}
          icon={<Zap className="w-6 h-6" />}
        />
        <MetricCard
          title="Coût IA Moyen/User"
          value={`${metrics.avg_ai_cost_per_user.toFixed(2)} $`}
          icon={<DollarSign className="w-6 h-6" />}
        />
      </div>

      {/* Charts (would use recharts or similar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Revenus Mensuels (6 mois)</h3>
          {/* TODO: Add chart component */}
          <p className="text-gray-500 text-sm">Graphique à implémenter</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Nouveaux Utilisateurs (6 mois)</h3>
          {/* TODO: Add chart component */}
          <p className="text-gray-500 text-sm">Graphique à implémenter</p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="text-brand-navy">{icon}</div>
        {change !== undefined && (
          <span
            className={`text-sm font-semibold ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? '+' : ''}
            {change.toFixed(1)}%
          </span>
        )}
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-brand-navy">{value}</p>
      {trend && (
        <div className="mt-2">
          <TrendingUp
            className={`w-4 h-4 inline mr-1 ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          />
          <span className="text-xs text-gray-500">vs mois précédent</span>
        </div>
      )}
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}
```

---

### 2.2 Prévisions Financières IA (1.5 semaines)

**Effort:** 🟡 Moyen (25-30h)
**Impact:** 🔥🔥 HAUTE (valeur ajoutée unique)

#### A. Prompt Claude pour Prévisions

```typescript
// src/lib/ai/financial-forecasting.ts
import { callClaude, parseJSONResponse } from './client'
import { createClient } from '@/lib/supabase/server'

interface FinancialForecast {
  current_month: {
    revenue: number
    expenses: number
    net_cashflow: number
  }
  forecasts: {
    '30_days': {
      revenue: number
      expenses: number
      net_cashflow: number
      confidence: number
    }
    '60_days': {
      revenue: number
      expenses: number
      net_cashflow: number
      confidence: number
    }
    '90_days': {
      revenue: number
      expenses: number
      net_cashflow: number
      confidence: number
    }
  }
  insights: string[]
  alerts: Array<{
    type: 'warning' | 'danger' | 'info'
    message: string
  }>
  recommendations: string[]
}

const FORECASTING_PROMPT = `Tu es un expert en analyse financière pour entreprises de construction au Québec.

# TÂCHE
Analyse l'historique financier fourni et génère des prévisions de trésorerie pour 30, 60 et 90 jours.

# CONTEXTE
- Secteur: Construction au Québec
- Taxes: TPS 5% + TVQ 9.975%
- Saisonnalité: Construction ralentit en hiver (nov-mars)

# ANALYSE REQUISE
1. **Tendances**: Identifier patterns dans revenus/dépenses
2. **Saisonnalité**: Ajuster pour la saison actuelle
3. **Anomalies**: Détecter dépenses inhabituelles
4. **Risques**: Identifier risques de trésorerie
5. **Opportunités**: Suggérer optimisations

# FORMAT DE SORTIE (JSON)
{
  "current_month": {
    "revenue": 50000,
    "expenses": 35000,
    "net_cashflow": 15000
  },
  "forecasts": {
    "30_days": {
      "revenue": 52000,
      "expenses": 36000,
      "net_cashflow": 16000,
      "confidence": 0.85
    },
    "60_days": { ... },
    "90_days": { ... }
  },
  "insights": [
    "Revenus en croissance de 15% vs mois précédent",
    "Dépenses matériaux en hausse de 20% (attention)",
    "Factures impayées: 3 clients, total 12,500$"
  ],
  "alerts": [
    {
      "type": "warning",
      "message": "3 factures en retard (12,500$) - Relancer clients"
    },
    {
      "type": "danger",
      "message": "Trésorerie négative prévue dans 60 jours sans action"
    }
  ],
  "recommendations": [
    "Relancer les 3 clients avec factures en retard",
    "Négocier délais paiement fournisseur X",
    "Réduire achats matériaux de 10% si possible"
  ]
}

# RÈGLES
- Confidence diminue avec le temps (30j=0.85, 60j=0.70, 90j=0.55)
- Ajuster pour saisonnalité (hiver = -20% revenus construction)
- Alerts: warning si cashflow < 10k, danger si < 0
- Recommendations: max 5, actionnables
- Insights: max 10, basés sur données réelles

Réponds UNIQUEMENT avec le JSON, aucun texte avant/après.`

export async function generateFinancialForecast(
  organizationId: string
): Promise<FinancialForecast> {
  const supabase = await createClient()

  // Get historical data (last 12 months)
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  // Revenue (paid invoices)
  const { data: invoices } = await supabase
    .from('invoices')
    .select('total, paid_date, issue_date, status, due_date, client_id')
    .eq('organization_id', organizationId)
    .gte('issue_date', twelveMonthsAgo.toISOString())
    .order('issue_date', { ascending: true })

  // Calculate monthly revenue
  const monthlyRevenue = invoices
    ?.filter(i => i.status === 'paid' && i.paid_date)
    .reduce((acc: any, inv: any) => {
      const month = new Date(inv.paid_date).toISOString().slice(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + inv.total
      return acc
    }, {})

  // Unpaid invoices
  const unpaidInvoices = invoices?.filter(i =>
    ['sent', 'overdue'].includes(i.status)
  ) || []

  // Expenses (documents marked as invoices from suppliers)
  const { data: supplierInvoices } = await supabase
    .from('documents')
    .select('ai_metadata, created_at')
    .eq('organization_id', organizationId)
    .eq('type_detecte', 'facture')
    .gte('created_at', twelveMonthsAgo.toISOString())

  const monthlyExpenses = supplierInvoices
    ?.reduce((acc: any, doc: any) => {
      const metadata = doc.ai_metadata as any
      if (metadata?.montant) {
        const month = new Date(doc.created_at).toISOString().slice(0, 7)
        acc[month] = (acc[month] || 0) + metadata.montant
      }
      return acc
    }, {})

  // Current month
  const currentMonth = new Date().toISOString().slice(0, 7)
  const currentRevenue = monthlyRevenue?.[currentMonth] || 0
  const currentExpenses = monthlyExpenses?.[currentMonth] || 0

  // Build context for Claude
  const context = `
# Données Financières - 12 Derniers Mois

## Revenus Mensuels
${Object.entries(monthlyRevenue || {})
  .map(([month, revenue]) => `- ${month}: ${revenue} CAD`)
  .join('\n')}

## Dépenses Mensuelles
${Object.entries(monthlyExpenses || {})
  .map(([month, expenses]) => `- ${month}: ${expenses} CAD`)
  .join('\n')}

## Mois Actuel (${currentMonth})
- Revenus: ${currentRevenue} CAD
- Dépenses: ${currentExpenses} CAD
- Cashflow Net: ${currentRevenue - currentExpenses} CAD

## Factures Impayées
- Nombre: ${unpaidInvoices.length}
- Total: ${unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0)} CAD
- Plus ancienne: ${unpaidInvoices[0]?.due_date || 'N/A'}

## Contexte Temporel
- Date actuelle: ${new Date().toISOString().slice(0, 10)}
- Saison: ${getSeason(new Date())}
  `.trim()

  const prompt = `${FORECASTING_PROMPT}

${context}

JSON:`

  const response = await callClaude(prompt, {
    maxTokens: 3000,
    temperature: 0.3,
  })

  const forecast = parseJSONResponse<FinancialForecast>(response)

  return forecast
}

function getSeason(date: Date): string {
  const month = date.getMonth() + 1
  if (month >= 11 || month <= 3) return 'Hiver (construction ralentie)'
  if (month >= 4 && month <= 5) return 'Printemps (reprise)'
  if (month >= 6 && month <= 8) return 'Été (haute saison)'
  return 'Automne (dernière ligne droite)'
}
```

#### B. Page Analytics avec Graphiques

```tsx
// src/app/(dashboard)/analytics/page.tsx
import { generateFinancialForecast } from '@/lib/ai/financial-forecasting'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react'

export default async function AnalyticsPage() {
  // Get organization ID from session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user!.id)
    .single()

  const forecast = await generateFinancialForecast(profile!.organization_id)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-navy mb-2 flex items-center gap-2">
          <Zap className="w-8 h-8 text-brand-orange" />
          Analytics & Prévisions IA
        </h1>
        <p className="text-gray-600">
          Prévisions de trésorerie et insights financiers générés par IA
        </p>
      </div>

      {/* Current Month */}
      <div className="bg-gradient-to-br from-brand-navy to-blue-900 text-white p-8 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-6">Mois Actuel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-blue-200 text-sm mb-2">Revenus</p>
            <p className="text-3xl font-bold">
              {forecast.current_month.revenue.toLocaleString('fr-CA', {
                style: 'currency',
                currency: 'CAD',
              })}
            </p>
          </div>
          <div>
            <p className="text-blue-200 text-sm mb-2">Dépenses</p>
            <p className="text-3xl font-bold">
              {forecast.current_month.expenses.toLocaleString('fr-CA', {
                style: 'currency',
                currency: 'CAD',
              })}
            </p>
          </div>
          <div>
            <p className="text-blue-200 text-sm mb-2">Cashflow Net</p>
            <p
              className={`text-3xl font-bold ${
                forecast.current_month.net_cashflow >= 0
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}
            >
              {forecast.current_month.net_cashflow.toLocaleString('fr-CA', {
                style: 'currency',
                currency: 'CAD',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Forecasts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ForecastCard
          title="Prévision 30 Jours"
          forecast={forecast.forecasts['30_days']}
        />
        <ForecastCard
          title="Prévision 60 Jours"
          forecast={forecast.forecasts['60_days']}
        />
        <ForecastCard
          title="Prévision 90 Jours"
          forecast={forecast.forecasts['90_days']}
        />
      </div>

      {/* Alerts */}
      {forecast.alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-brand-navy mb-4">
            Alertes & Risques
          </h2>
          <div className="space-y-3">
            {forecast.alerts.map((alert, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'danger'
                    ? 'bg-red-50 border-red-500'
                    : alert.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      alert.type === 'danger'
                        ? 'text-red-600'
                        : alert.type === 'warning'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      alert.type === 'danger'
                        ? 'text-red-800'
                        : alert.type === 'warning'
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                    }`}
                  >
                    {alert.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-brand-navy mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Insights Clés
          </h2>
          <ul className="space-y-3">
            {forecast.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-orange mt-1">•</span>
                <span className="text-sm text-gray-700">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-brand-navy mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recommandations
          </h2>
          <ul className="space-y-3">
            {forecast.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-brand-navy mb-4">
          Évolution Prévue de la Trésorerie
        </h2>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-500">
            Graphique à implémenter (Recharts ou Chart.js)
          </p>
        </div>
      </div>
    </div>
  )
}

function ForecastCard({ title, forecast }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Revenus Prévus</p>
          <p className="text-lg font-bold text-gray-900">
            {forecast.revenue.toLocaleString('fr-CA', {
              style: 'currency',
              currency: 'CAD',
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Dépenses Prévues</p>
          <p className="text-lg font-bold text-gray-900">
            {forecast.expenses.toLocaleString('fr-CA', {
              style: 'currency',
              currency: 'CAD',
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div className="pt-3 border-t">
          <p className="text-xs text-gray-500 mb-1">Cashflow Net</p>
          <p
            className={`text-xl font-bold ${
              forecast.net_cashflow >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {forecast.net_cashflow.toLocaleString('fr-CA', {
              style: 'currency',
              currency: 'CAD',
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-orange h-full"
              style={{ width: `${forecast.confidence * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">
            {(forecast.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <p className="text-xs text-gray-500">Niveau de confiance</p>
      </div>
    </div>
  )
}
```

---

### 2.3 Workflow Approbations Multi-Niveaux (1 semaine)

**Effort:** 🟢 Facile-Moyen (20-25h)
**Impact Retention:** 🔥🔥 HAUTE (teams > 3 personnes)

#### A. Tables Approbations

```sql
-- 008_add_approval_workflows.sql
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'canceled');

CREATE TABLE IF NOT EXISTS public.approval_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,

  -- Resource being approved
  resource_type TEXT NOT NULL CHECK (resource_type IN ('invoice', 'quote', 'project', 'document', 'expense')),
  resource_id UUID NOT NULL,

  -- Workflow config
  name TEXT NOT NULL,
  description TEXT,
  required_approvers INT DEFAULT 1, -- Minimum approvals needed
  approval_order TEXT DEFAULT 'any' CHECK (approval_order IN ('any', 'sequential')), -- any = parallel, sequential = one by one

  -- Status
  status approval_status NOT NULL DEFAULT 'pending',

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.approval_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.approval_workflows(id) ON DELETE CASCADE,

  -- Approver
  approver_id UUID NOT NULL REFERENCES public.profiles(id),
  approver_role TEXT, -- 'manager', 'owner', 'admin'
  step_order INT NOT NULL DEFAULT 1, -- For sequential workflows

  -- Decision
  status approval_status NOT NULL DEFAULT 'pending',
  decision_date TIMESTAMPTZ,
  comments TEXT,

  -- Notifications
  notified_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.approval_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.approval_workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_approval_workflows_organization ON public.approval_workflows(organization_id);
CREATE INDEX idx_approval_workflows_resource ON public.approval_workflows(resource_type, resource_id);
CREATE INDEX idx_approval_workflows_status ON public.approval_workflows(status);
CREATE INDEX idx_approval_steps_workflow ON public.approval_steps(workflow_id);
CREATE INDEX idx_approval_steps_approver ON public.approval_steps(approver_id, status);

-- RLS
ALTER TABLE public.approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflows in org"
  ON public.approval_workflows FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create workflows if admin"
  ON public.approval_workflows FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND organization_id = approval_workflows.organization_id
        AND role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Approvers can view their steps"
  ON public.approval_steps FOR SELECT
  USING (
    approver_id = auth.uid()
    OR workflow_id IN (
      SELECT id FROM public.approval_workflows
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner')
      )
    )
  );

CREATE POLICY "Approvers can update their steps"
  ON public.approval_steps FOR UPDATE
  USING (approver_id = auth.uid())
  WITH CHECK (approver_id = auth.uid());

-- Function to check if workflow is complete
CREATE OR REPLACE FUNCTION check_workflow_complete()
RETURNS TRIGGER AS $$
DECLARE
  v_required INT;
  v_approved INT;
  v_rejected INT;
  v_workflow_id UUID;
BEGIN
  v_workflow_id := NEW.workflow_id;

  -- Get required approvers
  SELECT required_approvers INTO v_required
  FROM public.approval_workflows
  WHERE id = v_workflow_id;

  -- Count approved/rejected
  SELECT
    COUNT(*) FILTER (WHERE status = 'approved'),
    COUNT(*) FILTER (WHERE status = 'rejected')
  INTO v_approved, v_rejected
  FROM public.approval_steps
  WHERE workflow_id = v_workflow_id;

  -- Update workflow status
  IF v_approved >= v_required THEN
    UPDATE public.approval_workflows
    SET status = 'approved', completed_at = NOW()
    WHERE id = v_workflow_id;
  ELSIF v_rejected > 0 THEN
    UPDATE public.approval_workflows
    SET status = 'rejected', completed_at = NOW()
    WHERE id = v_workflow_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_workflow_complete
  AFTER UPDATE OF status ON public.approval_steps
  FOR EACH ROW
  EXECUTE FUNCTION check_workflow_complete();
```

#### B. API Approbations

```typescript
// src/app/api/approvals/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { comments } = await request.json()
    const stepId = params.id

    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get step
    const { data: step } = await supabase
      .from('approval_steps')
      .select('*, workflow:approval_workflows(*)')
      .eq('id', stepId)
      .single()

    if (!step) {
      return NextResponse.json({ error: 'Étape introuvable' }, { status: 404 })
    }

    // Verify user is the approver
    if (step.approver_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Update step
    await supabase
      .from('approval_steps')
      .update({
        status: 'approved',
        decision_date: new Date().toISOString(),
        comments,
      })
      .eq('id', stepId)

    // Add comment if provided
    if (comments) {
      await supabase.from('approval_comments').insert({
        workflow_id: step.workflow_id,
        user_id: user.id,
        comment: comments,
      })
    }

    // Log activity
    await supabase.from('activities').insert({
      organization_id: (step.workflow as any).organization_id,
      user_id: user.id,
      action: 'approval_approved',
      description: `Approbation accordée: ${(step.workflow as any).name}`,
      metadata: {
        workflow_id: step.workflow_id,
        step_id: stepId,
      },
    })

    // TODO: Send notification to creator

    return NextResponse.json({
      success: true,
      message: 'Approbation enregistrée',
    })
  } catch (error: any) {
    console.error('Approval error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'approbation' },
      { status: 500 }
    )
  }
}
```

---

## 🚀 PHASE 3 - COMPLIANCE & SUPPLIERS (3-4 semaines)

### 3.1 Vérification RBQ/CCQ (1 semaine)

```typescript
// src/lib/compliance/rbq-verification.ts

interface RBQLicense {
  license_number: string
  company_name: string
  status: 'active' | 'suspended' | 'expired' | 'revoked'
  categories: string[]
  expiry_date: string
  last_verified: string
}

// NOTE: RBQ n'a pas d'API publique officielle
// Options:
// 1. Scraping (légal mais fragile)
// 2. Service tiers (ex: API québécoise si disponible)
// 3. Verification manuelle avec cache

export async function verifyRBQLicense(
  licenseNumber: string
): Promise<RBQLicense | null> {
  // TODO: Implémenter vérification réelle
  // Pour l'instant, validation format seulement

  const rbqRegex = /^\d{4}-\d{4}-\d{2}$/
  if (!rbqRegex.test(licenseNumber)) {
    throw new Error('Format RBQ invalide (format: 1234-5678-90)')
  }

  // Mock response for now
  return {
    license_number: licenseNumber,
    company_name: 'À vérifier manuellement',
    status: 'active',
    categories: [],
    expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    last_verified: new Date().toISOString(),
  }
}

// Alert if license expires in < 30 days
export async function checkLicenseExpiry(
  organizationId: string
): Promise<{ alerts: string[] }> {
  const supabase = await createClient()

  const { data: org } = await supabase
    .from('organizations')
    .select('rbq_license, rbq_expiry')
    .eq('id', organizationId)
    .single()

  const alerts: string[] = []

  if (org?.rbq_expiry) {
    const expiryDate = new Date(org.rbq_expiry)
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    )

    if (daysUntilExpiry < 0) {
      alerts.push(`⚠️ URGENT: Licence RBQ EXPIRÉE depuis ${Math.abs(daysUntilExpiry)} jours`)
    } else if (daysUntilExpiry < 30) {
      alerts.push(`⚠️ Licence RBQ expire dans ${daysUntilExpiry} jours - Renouveler!`)
    } else if (daysUntilExpiry < 60) {
      alerts.push(`Licence RBQ expire dans ${daysUntilExpiry} jours`)
    }
  } else {
    alerts.push('Aucune licence RBQ enregistrée')
  }

  return { alerts }
}
```

---

### 3.2 Gestion Fournisseurs Avancée (1.5 semaines)

```sql
-- 009_add_suppliers.sql
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,

  -- Basic info
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,

  -- Address
  address TEXT,
  city TEXT,
  province TEXT DEFAULT 'QC',
  postal_code TEXT,

  -- Business info
  tax_number TEXT, -- NEQ
  rbq_license TEXT,
  rbq_verified BOOLEAN DEFAULT FALSE,
  rbq_last_check TIMESTAMPTZ,

  -- Categories
  categories TEXT[], -- ['Matériaux', 'Sous-traitant', 'Location équipement']
  specialties TEXT[], -- ['Électricité', 'Plomberie', etc.]

  -- Performance tracking
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  total_orders INT DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  avg_delivery_days INT,
  on_time_delivery_rate DECIMAL(5,2), -- Percentage

  -- Payment terms
  payment_terms TEXT, -- 'Net 30', 'Net 60', etc.
  credit_limit DECIMAL(12,2),

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  blocked_reason TEXT,

  -- Notes
  notes TEXT,

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link documents to suppliers
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL;

-- Supplier invoices (expenses)
CREATE TABLE IF NOT EXISTS public.supplier_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,

  -- Invoice info
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,
  paid_date DATE,

  -- Amounts
  subtotal DECIMAL(12,2) NOT NULL,
  tps DECIMAL(12,2) NOT NULL DEFAULT 0,
  tvq DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  amount_paid DECIMAL(12,2) DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'disputed')),

  -- Items
  items JSONB,

  -- Performance tracking
  delivery_date DATE,
  expected_delivery_date DATE,
  on_time BOOLEAN,
  quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),

  -- Notes
  notes TEXT,

  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(organization_id, supplier_id, invoice_number)
);

-- Supplier reviews/ratings
CREATE TABLE IF NOT EXISTS public.supplier_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.supplier_invoices(id) ON DELETE SET NULL,

  -- Ratings (1-5)
  quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
  price_rating INT CHECK (price_rating >= 1 AND price_rating <= 5),
  delivery_rating INT CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),

  -- Overall
  overall_rating DECIMAL(3,2),

  -- Comments
  comments TEXT,

  -- Metadata
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-calculate supplier stats
CREATE OR REPLACE FUNCTION update_supplier_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.suppliers
  SET
    total_orders = (
      SELECT COUNT(*) FROM public.supplier_invoices WHERE supplier_id = NEW.supplier_id
    ),
    total_spent = (
      SELECT COALESCE(SUM(total), 0) FROM public.supplier_invoices
      WHERE supplier_id = NEW.supplier_id AND status = 'paid'
    ),
    avg_delivery_days = (
      SELECT AVG(EXTRACT(day FROM delivery_date - invoice_date))::INT
      FROM public.supplier_invoices
      WHERE supplier_id = NEW.supplier_id AND delivery_date IS NOT NULL
    ),
    on_time_delivery_rate = (
      SELECT (COUNT(*) FILTER (WHERE on_time = true)::DECIMAL / COUNT(*) * 100)
      FROM public.supplier_invoices
      WHERE supplier_id = NEW.supplier_id AND on_time IS NOT NULL
    ),
    rating = (
      SELECT AVG(overall_rating) FROM public.supplier_reviews WHERE supplier_id = NEW.supplier_id
    ),
    updated_at = NOW()
  WHERE id = NEW.supplier_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_supplier_stats_invoice
  AFTER INSERT OR UPDATE ON public.supplier_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_supplier_stats();

CREATE TRIGGER trigger_update_supplier_stats_review
  AFTER INSERT OR UPDATE ON public.supplier_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_supplier_stats();

-- Indexes
CREATE INDEX idx_suppliers_organization ON public.suppliers(organization_id);
CREATE INDEX idx_suppliers_status ON public.suppliers(status);
CREATE INDEX idx_suppliers_rating ON public.suppliers(rating DESC);
CREATE INDEX idx_supplier_invoices_organization ON public.supplier_invoices(organization_id);
CREATE INDEX idx_supplier_invoices_supplier ON public.supplier_invoices(supplier_id);
CREATE INDEX idx_supplier_invoices_status ON public.supplier_invoices(status);
CREATE INDEX idx_supplier_invoices_due_date ON public.supplier_invoices(due_date);

-- RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view suppliers in org"
  ON public.suppliers FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can manage suppliers in org"
  ON public.suppliers FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );
```

---

## 📊 MIGRATIONS SQL COMPLÈTES

Je vais créer un document séparé avec toutes les migrations SQL numérotées et prêtes à l'emploi.

---

## 💰 ESTIMATION DES COÛTS MENSUELS

### A. Coûts API Claude (Anthropic)

**Modèle:** claude-3-5-sonnet-20241022
**Prix:**
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens

**Estimation Usage par Feature:**

| Feature | Tokens Input/Op | Tokens Output/Op | Ops/User/Month | Total Tokens/User |
|---------|----------------|------------------|----------------|-------------------|
| Document Classification | 500 | 100 | 20 | 12,000 |
| Invoice Extraction | 1,000 | 300 | 10 | 13,000 |
| Contract Summary | 2,000 | 500 | 5 | 12,500 |
| Chat Assistant | 800 | 400 | 50 | 60,000 |
| Financial Forecast | 3,000 | 1,500 | 4 | 18,000 |
| **TOTAL** | - | - | - | **115,500 tokens** |

**Coût par utilisateur actif:** 115,500 tokens × $0.003/1K = **~$0.35/mois**

**Avec caching (50% réduction):** **~$0.18/mois**

**Scénario 100 utilisateurs actifs:** $18/mois
**Scénario 1000 utilisateurs actifs:** $180/mois

### B. Coûts Supabase

**Plan Pro:** $25/mois
- 8 GB database
- 100 GB bandwidth
- 100 GB file storage
- Email auth inclus

**Scalabilité:**
- 0-1000 users: Plan Pro suffit
- 1000-10000 users: ~$100/mois (additional storage/bandwidth)

### C. Coûts Stripe

**Frais transaction:** 2.9% + $0.30 par transaction

**Revenus 99$/mois × 100 utilisateurs:** $9,900/mois
**Frais Stripe:** ~$317/mois (3.2%)

### D. Coûts Resend

**Plan Gratuit:** 3,000 emails/mois
**Plan Pro ($20/mois):** 50,000 emails/mois

**Emails par utilisateur/mois:**
- Signup: 1
- Password reset: 0.2
- Notifications: 4
- Contact form: 0.5
**Total:** ~6 emails/user/mois

**100 users:** 600 emails → Plan gratuit OK
**1000 users:** 6,000 emails → Plan Pro ($20/mois)

### E. Autres Coûts

- **Vercel/Hosting:** $20-100/mois (selon trafic)
- **Redis/Upstash (cache):** $10/mois (optionnel Phase 4)
- **Monitoring (Sentry):** $26/mois (optionnel)
- **Analytics (PostHog):** $0-50/mois (optionnel)

### F. TOTAL MENSUEL

**Scénario Démarrage (100 users, 20 payants):**
- MRR: $1,980 (20 × 99$)
- Claude API: $18
- Supabase: $25
- Stripe fees: $63
- Resend: $0
- Hosting: $20
**Total Coûts:** $126
**Profit Brut:** $1,854 (93.6% margin) 🎉

**Scénario Croissance (1000 users, 200 payants):**
- MRR: $19,800
- Claude API: $180
- Supabase: $100
- Stripe fees: $633
- Resend: $20
- Hosting: $100
- Redis: $10
**Total Coûts:** $1,043
**Profit Brut:** $18,757 (94.7% margin) 🚀

---

## ⏱️ TIMELINE COMPLET

### Phase 1 - MVP Licorne (4-6 semaines)
**Semaines 1-2:**
- ✅ Stripe checkout complet
- ✅ Webhooks Stripe
- ✅ Enforcement limites

**Semaines 3-4:**
- ✅ Assistant IA conversationnel
- ✅ Tables chat + API
- ✅ UI composant chat

**Semaines 5-6:**
- ✅ Extraction factures auto
- ✅ Page upload avec drag & drop
- ✅ Review extraction UI

**Déploiement Phase 1:** Fin semaine 6

### Phase 2 - Intelligence & Analytics (4-5 semaines)
**Semaines 7-8:**
- ✅ Dashboard admin
- ✅ KPIs business
- ✅ Métriques utilisateur

**Semaines 9-10:**
- ✅ Prévisions financières IA
- ✅ Analytics page
- ✅ Graphiques (recharts)

**Semaine 11:**
- ✅ Workflow approbations
- ✅ Notifications email

**Déploiement Phase 2:** Fin semaine 11

### Phase 3 - Compliance & Suppliers (3-4 semaines)
**Semaines 12-13:**
- ✅ Vérification RBQ/CCQ
- ✅ Gestion fournisseurs
- ✅ Supplier invoices

**Semaine 14:**
- ✅ Ratings fournisseurs
- ✅ Comparaisons
- ✅ Rapports PDF IA

**Déploiement Phase 3:** Fin semaine 14

### Phase 4 - Intégrations & Optimisation (4-5 semaines)
**Semaines 15-17:**
- ✅ API REST publique
- ✅ Webhooks sortants
- ✅ Documentation Swagger

**Semaines 18-19:**
- ✅ Intégrations QuickBooks/Acomba
- ✅ Redis caching
- ✅ Optimisations performance

**Déploiement Final:** Fin semaine 19

**TOTAL: 19 semaines (~5 mois)**

---

## 🎯 PRIORISATION FINALE & NEXT STEPS

### Ordre d'Implémentation Recommandé:

1. **CRITIQUE (2 semaines):** Stripe Checkout Complet
   - Sans revenus, pas de business viable
   - Bloque la croissance

2. **HAUTE VALEUR (2 semaines):** Assistant IA Conversationnel
   - Différenciation unique
   - Augmente engagement drastiquement
   - "Wow factor" pour marketing

3. **HAUTE VALEUR (1-2 semaines):** Extraction Factures Auto
   - Pain point réel des entrepreneurs
   - Feature table stakes vs concurrents
   - ROI clair pour utilisateurs

4. **MOYENNE (1-2 semaines):** Dashboard Admin + Analytics
   - Essentiel pour décisions business
   - Monitoring santé produit

5. **MOYENNE (1-2 semaines):** Prévisions Financières IA
   - Valeur ajoutée premium
   - Justifie prix élevé (99$/mois)

6. **MOYENNE (1 semaine):** Workflow Approbations
   - Nécessaire pour teams
   - Élargit TAM (pas que solo entrepreneurs)

7. **BASSE (2-3 semaines):** Compliance RBQ + Suppliers
   - Spécifique Québec (bon pour niche)
   - Pas différenciateur majeur

8. **BASSE (3-4 semaines):** Intégrations Tierces
   - Important à terme
   - Peut attendre PMF (Product-Market Fit)

---

## 🚀 RECOMMANDATION FINALE

**Focus Prioritaire (6 semaines):**
1. ✅ Stripe checkout (2 semaines) → **REVENUS**
2. ✅ Chat assistant (2 semaines) → **DIFFÉRENCIATION**
3. ✅ Invoice extraction (2 semaines) → **VALEUR UTILISATEUR**

**= MVP Licorne prêt en 6 semaines**

Après ces 6 semaines, tu as:
- ✅ Monétisation fonctionnelle
- ✅ Feature unique killer (chat IA)
- ✅ Résolution pain point majeur (factures)
- ✅ Base solide pour marketing

**ROI Projeté (12 mois):**
- Investissement: 6 semaines dev solo (~240h × $50/h = $12,000 coût opportunité)
- MRR Année 1: Conservateur 50 users payants = $4,950/mois
- Année 1 Revenue: $59,400
- **ROI: 395%** 🚀

Veux-tu que je crée maintenant:
1. Les fichiers de migration SQL complets et numérotés?
2. Un template de code prêt à l'emploi pour une feature spécifique?
3. Un plan de marketing/go-to-market pour accompagner le lancement?
4. Un guide de tests utilisateurs pour valider le PMF?
