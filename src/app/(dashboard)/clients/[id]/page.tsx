import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import DeleteClientButton from './DeleteClientButton'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  const orgId = profile?.organization_id

  // Get client details
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .eq('organization_id', orgId || '')
    .single()

  if (!client) {
    notFound()
  }

  // Get related projects
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, status, created_at')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  // Get related invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('id, invoice_number, title, status, total, issue_date')
    .eq('client_id', client.id)
    .order('issue_date', { ascending: false })

  // Get related quotes
  const { data: quotes } = await supabase
    .from('quotes')
    .select('id, quote_number, title, status, total, issue_date')
    .eq('client_id', client.id)
    .order('issue_date', { ascending: false })

  const totalInvoiced = invoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0
  const unpaidInvoices = invoices?.filter(inv => inv.status !== 'paid').length || 0

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/clients"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
        >
          ← Retour aux clients
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600 mt-2">Détails du client</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/clients/${client.id}/edit`}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Modifier
            </Link>
            <DeleteClientButton clientId={client.id} clientName={client.name} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Client Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{client.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Téléphone</label>
                <p className="text-gray-900">{client.phone || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Adresse</label>
                <p className="text-gray-900">
                  {client.address && (
                    <>
                      {client.address}
                      <br />
                    </>
                  )}
                  {client.city && client.province && `${client.city}, ${client.province}`}
                  {client.postal_code && ` ${client.postal_code}`}
                  {!client.address && !client.city && '-'}
                </p>
              </div>
              {client.notes && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Projets</h2>
              <Link
                href={`/projects/new?client=${client.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                + Nouveau projet
              </Link>
            </div>
            {!projects || projects.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun projet</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-500">{formatDate(project.created_at)}</p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Factures</h2>
              <Link
                href={`/invoices/new?client=${client.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                + Nouvelle facture
              </Link>
            </div>
            {!invoices || invoices.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune facture</p>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/invoices/${invoice.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {invoice.invoice_number} - {invoice.title}
                        </h3>
                        <p className="text-sm text-gray-500">{formatDate(invoice.issue_date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {Number(invoice.total).toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD',
                          })}
                        </p>
                        <InvoiceStatusBadge status={invoice.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Statistics */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Projets actifs</label>
                <p className="text-2xl font-bold text-gray-900">
                  {projects?.filter((p) => p.status === 'active').length || 0}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total facturé</label>
                <p className="text-2xl font-bold text-gray-900">
                  {totalInvoiced.toLocaleString('fr-CA', {
                    style: 'currency',
                    currency: 'CAD',
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Factures impayées</label>
                <p className="text-2xl font-bold text-orange-600">{unpaidInvoices}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Soumissions</label>
                <p className="text-2xl font-bold text-gray-900">{quotes?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-gray-500">Créé le</label>
                <p className="text-gray-900">{formatDate(client.created_at)}</p>
              </div>
              <div>
                <label className="text-gray-500">Dernière modification</label>
                <p className="text-gray-900">{formatDate(client.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    planning: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    on_hold: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const labels = {
    planning: 'Planification',
    active: 'Actif',
    on_hold: 'En pause',
    completed: 'Complété',
    cancelled: 'Annulé',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.planning}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}

function InvoiceStatusBadge({ status }: { status: string }) {
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
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors[status as keyof typeof colors] || colors.draft}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}
