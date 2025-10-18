import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  const orgId = profile?.organization_id

  // Get stats
  const [clientsCount, projectsCount, invoicesData, quotesData] = await Promise.all([
    supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', orgId || ''),
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', orgId || ''),
    supabase
      .from('invoices')
      .select('total, status')
      .eq('organization_id', orgId || ''),
    supabase
      .from('quotes')
      .select('total, status')
      .eq('organization_id', orgId || ''),
  ])

  const totalInvoiced = invoicesData.data?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0
  const totalQuoted = quotesData.data?.reduce((sum, quote) => sum + Number(quote.total), 0) || 0
  const unpaidInvoices = invoicesData.data?.filter(inv => inv.status !== 'paid').length || 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Clients"
          value={clientsCount.count || 0}
          icon="👥"
          color="blue"
          href="/clients"
        />
        <StatCard
          title="Projets actifs"
          value={projectsCount.count || 0}
          icon="🏗️"
          color="green"
          href="/projects"
        />
        <StatCard
          title="Factures impayées"
          value={unpaidInvoices}
          icon="📄"
          color="yellow"
          href="/invoices"
        />
        <StatCard
          title="Total facturé"
          value={formatCurrency(totalInvoiced)}
          icon="💰"
          color="purple"
          href="/invoices"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton href="/invoices/new" icon="📄">
            Nouvelle facture
          </QuickActionButton>
          <QuickActionButton href="/quotes/new" icon="📝">
            Nouvelle soumission
          </QuickActionButton>
          <QuickActionButton href="/clients/new" icon="👤">
            Ajouter un client
          </QuickActionButton>
          <QuickActionButton href="/projects/new" icon="➕">
            Nouveau projet
          </QuickActionButton>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité récente</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Aucune activité récente</p>
          <p className="text-sm mt-2">Commencez par créer votre première facture ou soumission</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
  href,
}: {
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'yellow' | 'purple'
  href: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </Link>
  )
}

function QuickActionButton({
  href,
  icon,
  children,
}: {
  href: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-gray-700">{children}</span>
    </Link>
  )
}
