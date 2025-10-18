import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'

export default async function ProjectsPage() {
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

  // Get projects with client information
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      clients (
        id,
        name
      )
    `)
    .eq('organization_id', orgId || '')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600 mt-2">Gérez vos chantiers et projets</p>
        </div>
        <Link
          href="/projects/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Nouveau projet
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏗️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun projet</h3>
          <p className="text-gray-600 mb-6">
            Commencez par créer votre premier projet
          </p>
          <Link
            href="/projects/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Nouveau projet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <StatusBadge status={project.status} />
              </div>

              {project.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
              )}

              <div className="space-y-2 text-sm">
                {project.clients && (
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">👤</span>
                    <span>{project.clients.name}</span>
                  </div>
                )}

                {project.address && (
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📍</span>
                    <span className="truncate">
                      {project.city ? `${project.city}, ${project.province}` : project.address}
                    </span>
                  </div>
                )}

                {project.budget && (
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">💰</span>
                    <span>{formatCurrency(Number(project.budget))}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-500 text-xs pt-2 border-t border-gray-100">
                  <span>Créé le {formatDate(project.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
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
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[status as keyof typeof colors] || colors.planning
      }`}
    >
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}
