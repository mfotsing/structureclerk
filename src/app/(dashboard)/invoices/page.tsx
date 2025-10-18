import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'

export default async function InvoicesPage() {
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

  // Get invoices with client information
  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (
        id,
        name
      )
    `)
    .eq('organization_id', orgId || '')
    .order('issue_date', { ascending: false })

  const stats = {
    draft: invoices?.filter((i) => i.status === 'draft').length || 0,
    sent: invoices?.filter((i) => i.status === 'sent').length || 0,
    paid: invoices?.filter((i) => i.status === 'paid').length || 0,
    overdue: invoices?.filter((i) => i.status === 'overdue').length || 0,
    totalAmount: invoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0,
    paidAmount: invoices
      ?.filter((i) => i.status === 'paid')
      .reduce((sum, inv) => sum + Number(inv.total), 0) || 0,
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Factures</h1>
          <p className="text-gray-600 mt-2">Gérez vos factures et paiements</p>
        </div>
        <Link
          href="/invoices/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Nouvelle facture
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Brouillons" value={stats.draft} color="gray" />
        <StatCard title="Envoyées" value={stats.sent} color="blue" />
        <StatCard title="Payées" value={stats.paid} color="green" />
        <StatCard title="En retard" value={stats.overdue} color="red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total facturé</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total encaissé</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
        </div>
      </div>

      {/* Invoices List */}
      {!invoices || invoices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune facture</h3>
          <p className="text-gray-600 mb-6">Commencez par créer votre première facture</p>
          <Link
            href="/invoices/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Nouvelle facture
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Échéance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice: any) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{invoice.invoice_number}</div>
                    <div className="text-sm text-gray-500">{invoice.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {invoice.clients?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(invoice.issue_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                    {formatCurrency(Number(invoice.total))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string
  value: number
  color: 'gray' | 'blue' | 'green' | 'red'
}) {
  const colors = {
    gray: 'bg-gray-50 text-gray-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-700',
  }

  const labels = {
    draft: 'Brouillon',
    sent: 'Envoyée',
    paid: 'Payée',
    overdue: 'En retard',
    cancelled: 'Annulée',
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        colors[status as keyof typeof colors] || colors.draft
      }`}
    >
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}
