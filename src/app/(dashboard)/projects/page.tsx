'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  Users, 
  Building, 
  Plus, 
  Calendar, 
  MapPin, 
  DollarSign, 
  ChevronRight,
  Search,
  Filter
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  province?: string
  created_at: string
}

interface Project {
  id: string
  name: string
  description?: string
  status: string
  address?: string
  city?: string
  province?: string
  budget?: number
  client_id: string
  created_at: string
  clients?: Client
}

export default function ProjectsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  const loadClients = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', profile?.organization_id || '')
        .order('name', { ascending: true })

      setClients(clientsData || [])
      
      // Auto-select first client if available
      if (clientsData && clientsData.length > 0) {
        setSelectedClient(clientsData[0])
      }
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const loadProjects = useCallback(async (clientId: string) => {
    try {
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*, clients(*)')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      setProjects(projectsData || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }, [supabase])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  useEffect(() => {
    if (selectedClient) {
      loadProjects(selectedClient.id)
    }
  }, [selectedClient, loadProjects])

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          colors[status as keyof typeof colors] || colors.planning
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">Projets & Clients</h1>
          <p className="text-ui-text-muted mt-1">Gérez vos clients et leurs projets</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Link href="/clients/new">
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Nouveau client
            </Button>
          </Link>
          {selectedClient && (
            <Link href={`/projects/new?client_id=${selectedClient.id}`}>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau projet
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search */}
      <Card variant="default" padding="lg">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des clients ou projets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients List */}
        <div className="lg:col-span-1">
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Clients
              </CardTitle>
              <CardDescription>
                {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredClients.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'Aucun client trouvé' : 'Aucun client'}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {searchTerm ? 'Essayez une autre recherche' : 'Commencez par ajouter votre premier client'}
                  </p>
                  {!searchTerm && (
                    <Link href="/clients/new">
                      <Button variant="primary" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau client
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedClient?.id === client.id
                          ? 'border-brand-orange bg-brand-orange/5'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {client.name}
                          </h4>
                          {client.email && (
                            <p className="text-sm text-gray-500 truncate">
                              {client.email}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <>
              <Card variant="default" padding="lg" className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Projets de {selectedClient.name}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Link href={`/projects/new?client_id=${selectedClient.id}`}>
                      <Button variant="primary" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau projet
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {filteredProjects.length === 0 ? (
                <Card variant="default" padding="lg">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🏗️</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchTerm ? 'Aucun projet trouvé' : 'Aucun projet'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {searchTerm 
                          ? 'Aucun projet ne correspond à votre recherche' 
                          : `Ce client n'a pas encore de projet. Créez le premier projet pour ${selectedClient.name}.`
                        }
                      </p>
                      <Link href={`/projects/new?client_id=${selectedClient.id}`}>
                        <Button variant="primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Nouveau projet
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="group"
                    >
                      <Card variant="default" padding="lg" className="hover:shadow-md transition-all duration-200">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-orange transition-colors">
                              {project.name}
                            </h3>
                            <StatusBadge status={project.status} />
                          </div>

                          {project.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {project.description}
                            </p>
                          )}

                          <div className="space-y-2 text-sm">
                            {project.address && (
                              <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span className="truncate">
                                  {project.city ? `${project.city}, ${project.province}` : project.address}
                                </span>
                              </div>
                            )}

                            {project.budget && (
                              <div className="flex items-center text-gray-600">
                                <DollarSign className="w-4 h-4 mr-2" />
                                <span>{formatCurrency(Number(project.budget))}</span>
                              </div>
                            )}

                            <div className="flex items-center text-gray-500 text-xs pt-2 border-t border-gray-100">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>Créé le {formatDate(project.created_at)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card variant="default" padding="lg">
              <CardContent className="pt-6">
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sélectionnez un client
                  </h3>
                  <p className="text-gray-600">
                    Choisissez un client dans la liste à gauche pour voir ses projets
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
