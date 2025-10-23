'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Client } from '@/types/database'

export default function ClientsTable({ initialClients }: { initialClients: Client[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  // Get unique cities for filter
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(initialClients.map((c) => c.city).filter(Boolean))]
    return uniqueCities.sort()
  }, [initialClients])

  // Filter clients
  const filteredClients = useMemo(() => {
    return initialClients.filter((client) => {
      const matchesSearch =
        !searchTerm ||
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCity = !cityFilter || client.city === cityFilter

      return matchesSearch && matchesCity
    })
  }, [initialClients, searchTerm, cityFilter])

  return (
    <>
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="md:w-64">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city || ''}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          {(searchTerm || cityFilter) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setCityFilter('')
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} trouvé
        {filteredClients.length > 1 ? 's' : ''}
        {(searchTerm || cityFilter) && ` sur ${initialClients.length} total`}
      </div>

      {/* Table */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun client trouvé</h3>
          <p className="text-gray-600">
            {searchTerm || cityFilter
              ? 'Essayez de modifier vos critères de recherche'
              : 'Commencez par ajouter votre premier client'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {client.name}
                  </Link>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Actif
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📧</span>
                      <a href={`mailto:${client.email}`} className="hover:text-blue-600">
                        {client.email}
                      </a>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📞</span>
                      <a href={`tel:${client.phone}`} className="hover:text-blue-600">
                        {client.phone}
                      </a>
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📍</span>
                      <span>{client.city}</span>
                    </div>
                  )}
                  {client.created_at && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📅</span>
                      <span>{formatDate(client.created_at)}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/dashboard/clients/${client.id}/edit`}
                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courriel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {client.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {client.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {client.city || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(client.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/clients/${client.id}`}
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
        </>
      )}
    </>
  )
}
