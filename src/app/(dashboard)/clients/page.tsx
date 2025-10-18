import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ClientsTable from './ClientsTable'

export default async function ClientsPage() {
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

  // Get clients
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('organization_id', orgId || '')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">Gérez vos clients et leurs informations</p>
        </div>
        <Link
          href="/clients/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Ajouter un client
        </Link>
      </div>

      {!clients || clients.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun client</h3>
          <p className="text-gray-600 mb-6">
            Commencez par ajouter votre premier client
          </p>
          <Link
            href="/clients/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ajouter un client
          </Link>
        </div>
      ) : (
        <ClientsTable initialClients={clients} />
      )}
    </div>
  )
}
