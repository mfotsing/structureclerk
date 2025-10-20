import { calculateBusinessMetrics, formatCurrency, formatPercentage } from '@/lib/analytics/kpis'
import { MetricCard } from '@/components/analytics/MetricCard'
import {
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  Zap,
  AlertCircle,
  FileText,
  BarChart3,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const metrics = await calculateBusinessMetrics()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-navy mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-brand-orange" />
          Dashboard Admin & Analytics
        </h1>
        <p className="text-gray-600">
          Métriques business et performance de la plateforme StructureClerk
        </p>
      </div>

      {/* Revenue Metrics */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-brand-navy mb-4">Revenus & Croissance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="MRR (Monthly Recurring Revenue)"
            value={formatCurrency(metrics.mrr)}
            change={metrics.revenue_growth}
            icon={<DollarSign className="w-6 h-6" />}
            trend={metrics.revenue_growth >= 0 ? 'up' : 'down'}
          />
          <MetricCard
            title="ARR (Annual Recurring Revenue)"
            value={formatCurrency(metrics.arr)}
            icon={<DollarSign className="w-6 h-6" />}
            subtitle="Revenus annuels projetés"
          />
          <MetricCard
            title="Valeur Moyenne Abonnement"
            value={formatCurrency(metrics.avg_subscription_value)}
            icon={<TrendingUp className="w-6 h-6" />}
            subtitle="Par utilisateur payant"
          />
        </div>
      </div>

      {/* User Metrics */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-brand-navy mb-4">Utilisateurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Utilisateurs Totaux"
            value={metrics.total_users.toString()}
            icon={<Users className="w-6 h-6" />}
          />
          <MetricCard
            title="Utilisateurs Actifs (30j)"
            value={metrics.active_users.toString()}
            icon={<Activity className="w-6 h-6" />}
            subtitle={`${Math.round((metrics.active_users / (metrics.total_users || 1)) * 100)}% du total`}
          />
          <MetricCard
            title="Nouveaux ce Mois"
            value={metrics.new_users_this_month.toString()}
            icon={<TrendingUp className="w-6 h-6" />}
            trend="up"
          />
          <MetricCard
            title="Taux de Churn"
            value={formatPercentage(metrics.churn_rate)}
            icon={<AlertCircle className="w-6 h-6" />}
            trend={metrics.churn_rate > 5 ? 'down' : undefined}
            className={metrics.churn_rate > 10 ? 'border-2 border-red-300' : ''}
          />
        </div>
      </div>

      {/* Subscription Metrics */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-brand-navy mb-4">Abonnements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Essais Gratuits"
            value={metrics.trial_users.toString()}
            icon={<Users className="w-6 h-6" />}
            subtitle="Période d'essai de 30 jours"
          />
          <MetricCard
            title="Abonnements Payants"
            value={metrics.paid_users.toString()}
            icon={<DollarSign className="w-6 h-6" />}
            subtitle="Plans Pro & Enterprise"
          />
          <MetricCard
            title="Taux de Conversion"
            value={formatPercentage(metrics.conversion_rate)}
            icon={<TrendingUp className="w-6 h-6" />}
            trend={metrics.conversion_rate > 20 ? 'up' : 'down'}
            subtitle="Trial → Payant"
          />
        </div>
      </div>

      {/* AI Usage Metrics */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-brand-navy mb-4">Utilisation IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Documents Traités"
            value={metrics.total_documents_processed.toString()}
            icon={<FileText className="w-6 h-6" />}
            subtitle="Tous les temps"
          />
          <MetricCard
            title="Opérations IA ce Mois"
            value={metrics.ai_operations_this_month.toString()}
            icon={<Activity className="w-6 h-6" />}
            subtitle="Extractions, résumés, chat"
          />
          <MetricCard
            title="Tokens IA Utilisés"
            value={formatNumber(metrics.ai_tokens_used)}
            icon={<Zap className="w-6 h-6" />}
            subtitle="Ce mois"
          />
          <MetricCard
            title="Coût IA Moyen/User"
            value={`${metrics.avg_ai_cost_per_user.toFixed(3)} $`}
            icon={<DollarSign className="w-6 h-6" />}
            subtitle="Claude API costs"
          />
        </div>
      </div>

      {/* Health Metrics */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-brand-navy mb-4">Santé du Système</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Uptime"
            value={`${metrics.uptime_percentage}%`}
            icon={<Activity className="w-6 h-6" />}
            subtitle="Disponibilité de la plateforme"
          />
          <MetricCard
            title="Taux d'Erreur"
            value={`${metrics.error_rate.toFixed(2)}%`}
            icon={<AlertCircle className="w-6 h-6" />}
            subtitle="Erreurs sur total requêtes"
          />
          <MetricCard
            title="Temps de Réponse Moyen"
            value={metrics.avg_response_time_ms > 0 ? `${metrics.avg_response_time_ms}ms` : 'N/A'}
            icon={<Zap className="w-6 h-6" />}
            subtitle="Latence API moyenne"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Quick Insights */}
        <div className="bg-gradient-to-br from-brand-navy to-blue-900 text-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Insights Rapides
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-brand-orange mt-1">•</span>
              <span className="text-sm">
                {metrics.paid_users > 0
                  ? `${metrics.paid_users} utilisateurs payants génèrent ${formatCurrency(metrics.mrr)}/mois`
                  : 'Aucun utilisateur payant pour le moment'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-orange mt-1">•</span>
              <span className="text-sm">
                Taux d&apos;engagement: {Math.round((metrics.active_users / (metrics.total_users || 1)) * 100)}%
                {' '}({metrics.active_users}/{metrics.total_users} utilisateurs actifs)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-orange mt-1">•</span>
              <span className="text-sm">
                {metrics.ai_operations_this_month} opérations IA ce mois
                {' '}(moyenne {Math.round(metrics.ai_operations_this_month / (metrics.active_users || 1))} par utilisateur actif)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-orange mt-1">•</span>
              <span className="text-sm">
                {metrics.conversion_rate.toFixed(1)}% de conversion trial → payant
                {metrics.conversion_rate < 15 && ' (objectif: >15%)'}
                {metrics.conversion_rate >= 15 && metrics.conversion_rate < 25 && ' (bon)'}
                {metrics.conversion_rate >= 25 && ' (excellent!)'}
              </span>
            </li>
          </ul>
        </div>

        {/* Alerts & Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-brand-navy mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Alertes & Actions Requises
          </h3>
          <div className="space-y-3">
            {metrics.churn_rate > 10 && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm text-red-800 font-semibold">
                  ⚠️ Churn élevé ({formatPercentage(metrics.churn_rate)})
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Analyser les raisons d&apos;annulation et améliorer rétention
                </p>
              </div>
            )}

            {metrics.conversion_rate < 10 && (
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="text-sm text-yellow-800 font-semibold">
                  ⚠️ Conversion faible ({formatPercentage(metrics.conversion_rate)})
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Optimiser onboarding et démonstration de valeur
                </p>
              </div>
            )}

            {metrics.paid_users === 0 && (
              <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                <p className="text-sm text-orange-800 font-semibold">
                  💡 Aucun utilisateur payant
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Prioriser acquisition et conversion des trials
                </p>
              </div>
            )}

            {metrics.active_users / (metrics.total_users || 1) < 0.3 && (
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm text-blue-800 font-semibold">
                  💡 Engagement faible ({Math.round((metrics.active_users / (metrics.total_users || 1)) * 100)}%)
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Améliorer activation et réengagement utilisateurs
                </p>
              </div>
            )}

            {metrics.churn_rate <= 5 &&
             metrics.conversion_rate >= 15 &&
             metrics.paid_users > 0 &&
             metrics.active_users / (metrics.total_users || 1) >= 0.5 && (
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-sm text-green-800 font-semibold">
                  ✅ Métriques saines
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Continuer sur cette lancée et optimiser la croissance
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-brand-navy mb-4">
          Graphiques & Visualisations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-50 rounded flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            <BarChart3 className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">Revenus Mensuels (6 mois)</p>
            <p className="text-gray-400 text-xs mt-1">À implémenter avec Recharts</p>
          </div>

          <div className="h-64 bg-gray-50 rounded flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            <Users className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">Nouveaux Utilisateurs (6 mois)</p>
            <p className="text-gray-400 text-xs mt-1">À implémenter avec Recharts</p>
          </div>

          <div className="h-64 bg-gray-50 rounded flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            <Zap className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">Utilisation IA (6 mois)</p>
            <p className="text-gray-400 text-xs mt-1">À implémenter avec Recharts</p>
          </div>

          <div className="h-64 bg-gray-50 rounded flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            <TrendingUp className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">Taux de Conversion (6 mois)</p>
            <p className="text-gray-400 text-xs mt-1">À implémenter avec Recharts</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}
