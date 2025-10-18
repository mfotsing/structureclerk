import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditClientForm from './EditClientForm'

export default async function EditClientPage({ params }: { params: { id: string } }) {
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

  // Get client
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .eq('organization_id', orgId || '')
    .single()

  if (!client) {
    notFound()
  }

  return <EditClientForm client={client} />
}
