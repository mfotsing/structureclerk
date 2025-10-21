'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<any[]>([])
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [clientLoading, setClientLoading] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const preselectedClientId = searchParams.get('client')

  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: 'QC',
    postal_code: '',
  })

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_id: preselectedClientId || '',
    status: 'planning',
    address: '',
    city: '',
    province: 'QC',
    postal_code: '',
    start_date: '',
    end_date: '',
    budget: '',
  })

  useEffect(() => {
    async function fetchClients() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      const { data } = await supabase
        .from('clients')
        .select('id, name')
        .eq('organization_id', profile?.organization_id || '')
        .order('name')

      setClients(data || [])
    }
    fetchClients()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (!profile?.organization_id) {
        throw new Error('Aucune organisation trouvée')
      }

      const { error: insertError } = await supabase.from('projects').insert({
        organization_id: profile.organization_id,
        created_by: user.id,
        ...formData,
        client_id: formData.client_id || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      })

      if (insertError) throw insertError

      router.push('/projects')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNewClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setNewClientData({
      ...newClientData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setClientError(null)
    setClientLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (!profile?.organization_id) {
        throw new Error('Aucune organisation trouvée')
      }

      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert({
          organization_id: profile.organization_id,
          created_by: user.id,
          ...newClientData,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Ajouter le nouveau client à la liste
      setClients([...clients, newClient])
      
      // Sélectionner automatiquement le nouveau client
      setFormData({
        ...formData,
        client_id: newClient.id,
      })

      // Réinitialiser le formulaire et le fermer
      setNewClientData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: 'QC',
        postal_code: '',
      })
      setShowNewClientForm(false)
    } catch (error: any) {
      setClientError(error.message || 'Une erreur est survenue lors de la création du client')
    } finally {
      setClientLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/projects"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
        >
          ← Retour aux projets
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nouveau projet</h1>
        <p className="text-gray-600 mt-2">Créez un nouveau projet ou chantier</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du projet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Rénovation résidence Tremblay"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Description du projet..."
              />
            </div>

            <div>
              <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-2">
                Client
              </label>
              <div className="space-y-2">
                <select
                  id="client_id"
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Sélectionner un client (optionnel)</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewClientForm(!showNewClientForm)}
                  className="w-full text-left px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
                >
                  + Créer un nouveau client
                </button>
              </div>

              {showNewClientForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Nouveau client</h4>
                  
                  {clientError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-3">
                      {clientError}
                    </div>
                  )}

                  <form onSubmit={handleCreateClient} className="space-y-3">
                    <div>
                      <label htmlFor="client_name" className="block text-xs font-medium text-gray-700 mb-1">
                        Nom du client <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="client_name"
                        name="name"
                        required
                        value={newClientData.name}
                        onChange={handleNewClientChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        placeholder="Nom de l'entreprise ou du client"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="client_email" className="block text-xs font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="client_email"
                          name="email"
                          value={newClientData.email}
                          onChange={handleNewClientChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          placeholder="email@exemple.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="client_phone" className="block text-xs font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="client_phone"
                          name="phone"
                          value={newClientData.phone}
                          onChange={handleNewClientChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          placeholder="(418) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="client_address" className="block text-xs font-medium text-gray-700 mb-1">
                        Adresse
                      </label>
                      <input
                        type="text"
                        id="client_address"
                        name="address"
                        value={newClientData.address}
                        onChange={handleNewClientChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        placeholder="123 rue Principale"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="client_city" className="block text-xs font-medium text-gray-700 mb-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          id="client_city"
                          name="city"
                          value={newClientData.city}
                          onChange={handleNewClientChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          placeholder="Québec"
                        />
                      </div>

                      <div>
                        <label htmlFor="client_province" className="block text-xs font-medium text-gray-700 mb-1">
                          Province
                        </label>
                        <select
                          id="client_province"
                          name="province"
                          value={newClientData.province}
                          onChange={handleNewClientChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        >
                          <option value="QC">QC</option>
                          <option value="ON">ON</option>
                          <option value="AB">AB</option>
                          <option value="BC">BC</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="client_postal_code" className="block text-xs font-medium text-gray-700 mb-1">
                          Code postal
                        </label>
                        <input
                          type="text"
                          id="client_postal_code"
                          name="postal_code"
                          value={newClientData.postal_code}
                          onChange={handleNewClientChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          placeholder="G1R 1A1"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={clientLoading}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {clientLoading ? 'Création...' : 'Créer le client'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewClientForm(false)
                          setClientError(null)
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="planning">Planification</option>
                <option value="active">Actif</option>
                <option value="on_hold">En pause</option>
                <option value="completed">Complété</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse du chantier
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="123 rue Principale"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Montréal"
              />
            </div>

            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                Province
              </label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="QC">Québec</option>
                <option value="ON">Ontario</option>
                <option value="AB">Alberta</option>
                <option value="BC">Colombie-Britannique</option>
              </select>
            </div>

            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                Code postal
              </label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="H1A 1A1"
              />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin prévue
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget (CAD)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                step="0.01"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="50000.00"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer le projet'}
            </button>
            <Link
              href="/projects"
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
