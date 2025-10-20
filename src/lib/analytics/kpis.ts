import { createClient } from '@/lib/supabase/server'

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
  const { data: activeUsersList } = await supabase
    .from('activities')
    .select('user_id')
    .gte('created_at', thirtyDaysAgo.toISOString())

  // Get unique active users
  const uniqueActiveUsers = new Set(activeUsersList?.map(a => a.user_id) || [])
  const activeUsers = uniqueActiveUsers.size

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

  const churnRate = totalUsers ? ((churnedUsers || 0) / totalUsers) * 100 : 0

  // Subscriptions
  const { count: trialUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'trial')

  const { count: paidUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  const conversionRate = trialUsers ? ((paidUsers || 0) / ((trialUsers || 0) + (paidUsers || 0))) * 100 : 0

  const avgSubscriptionValue = (paidUsers || 0) > 0 ? mrr / (paidUsers || 1) : 0

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

  const avgAICostPerUser = totalUsers ? (aiTokensUsed * 0.000003) / totalUsers : 0 // $3 per 1M tokens

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

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export function formatCurrency(amount: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}
