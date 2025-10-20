/**
 * Organization Context Builder
 * Builds comprehensive context about organization for Claude chat agent
 */

import { createClient } from '@/lib/supabase/server'

export interface OrgContext {
  organization: {
    name: string
    tps_number: string | null
    tvq_number: string | null
  }
  stats: {
    total_clients: number
    total_projects: number
    total_invoices: number
    unpaid_invoices: number
    total_documents: number
    monthly_revenue: number
  }
  recent_activities: any[]
  projects: any[]
  unpaid_invoices: any[]
}

export async function buildOrgContext(orgId: string): Promise<OrgContext> {
  const supabase = await createClient()

  // Organization info
  const { data: org } = await supabase
    .from('organizations')
    .select('name, tps_number, tvq_number')
    .eq('id', orgId)
    .single()

  // Stats - run in parallel
  const [
    { count: clientCount },
    { count: projectCount },
    { count: invoiceCount },
    { count: unpaidCount },
    { count: docCount },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).in('status', ['draft', 'sent', 'overdue']),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
  ])

  // Monthly revenue
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: invoices } = await supabase
    .from('invoices')
    .select('total')
    .eq('organization_id', orgId)
    .eq('status', 'paid')
    .gte('paid_date', startOfMonth.toISOString())

  const monthlyRevenue = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0

  // Recent activities
  const { data: activities } = await supabase
    .from('activities')
    .select('action, description, created_at')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Projects
  const { data: projects } = await supabase
    .from('projects')
    .select('name, status, budget, start_date, end_date')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .limit(5)

  // Unpaid invoices
  const { data: unpaidInvoices } = await supabase
    .from('invoices')
    .select('invoice_number, total, due_date, status')
    .eq('organization_id', orgId)
    .in('status', ['sent', 'overdue'])
    .order('due_date', { ascending: true })
    .limit(10)

  return {
    organization: {
      name: org?.name || '',
      tps_number: org?.tps_number || null,
      tvq_number: org?.tvq_number || null,
    },
    stats: {
      total_clients: clientCount || 0,
      total_projects: projectCount || 0,
      total_invoices: invoiceCount || 0,
      unpaid_invoices: unpaidCount || 0,
      total_documents: docCount || 0,
      monthly_revenue: monthlyRevenue,
    },
    recent_activities: activities || [],
    projects: projects || [],
    unpaid_invoices: unpaidInvoices || [],
  }
}

export function formatContext(ctx: OrgContext): string {
  return `# Contexte - ${ctx.organization.name}

## Statistiques
- Clients: ${ctx.stats.total_clients}
- Projets: ${ctx.stats.total_projects}
- Factures: ${ctx.stats.total_invoices} (dont ${ctx.stats.unpaid_invoices} impayées)
- Documents: ${ctx.stats.total_documents}
- Revenu ce mois: ${ctx.stats.monthly_revenue.toFixed(2)} CAD

## Projets Récents
${ctx.projects.map(p => `- ${p.name} (${p.status}) - ${p.budget || 'N/A'} CAD`).join('\n') || 'Aucun projet'}

## Factures Impayées
${ctx.unpaid_invoices.map(i => `- #${i.invoice_number} - ${i.total} CAD - Échéance: ${i.due_date}`).join('\n') || 'Aucune facture impayée'}

## Activités Récentes
${ctx.recent_activities.slice(0, 5).map(a => `- ${a.description}`).join('\n') || 'Aucune activité'}
`.trim()
}
