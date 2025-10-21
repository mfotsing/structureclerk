'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    trend: 'up' | 'down' | 'neutral'
  }
  icon: string
  description?: string
}

function MetricCard({ title, value, change, icon, description }: MetricCardProps) {
  return (
    <Card variant="default" padding="lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-ui-text-muted">{title}</p>
          <p className="text-2xl font-bold text-ui-text mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-sm font-medium flex items-center",
                change.trend === 'up' && "text-ui-success",
                change.trend === 'down' && "text-ui-error",
                change.trend === 'neutral' && "text-ui-text-muted"
              )}>
                {change.trend === 'up' && (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {change.trend === 'down' && (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {change.value}
              </span>
              <span className="text-sm text-ui-text-muted ml-2">vs mois dernier</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-ui-text-muted mt-2">{description}</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  )
}

interface RecentActivityProps {
  activities: Array<{
    id: string
    type: 'document' | 'project' | 'approval' | 'client'
    title: string
    description: string
    time: string
    status?: 'pending' | 'completed' | 'urgent'
  }>
}

function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card variant="default" padding="lg">
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
        <CardDescription>Dernières actions dans vos projets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-ui-background-secondary rounded-full flex items-center justify-center text-sm">
                {activity.type === 'document' && '📄'}
                {activity.type === 'project' && '🏗️'}
                {activity.type === 'approval' && '✅'}
                {activity.type === 'client' && '👤'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ui-text">{activity.title}</p>
                <p className="text-sm text-ui-text-muted">{activity.description}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-xs text-ui-text-muted">{activity.time}</span>
                  {activity.status && (
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      activity.status === 'pending' && "bg-yellow-100 text-yellow-800",
                      activity.status === 'completed' && "bg-green-100 text-green-800",
                      activity.status === 'urgent' && "bg-red-100 text-red-800"
                    )}>
                      {activity.status === 'pending' && 'En attente'}
                      {activity.status === 'completed' && 'Terminé'}
                      {activity.status === 'urgent' && 'Urgent'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickActionsProps {
  actions: Array<{
    id: string
    title: string
    description: string
    icon: string
    href: string
    color: 'orange' | 'blue' | 'navy' | 'green'
  }>
}

function QuickActions({ actions }: QuickActionsProps) {
  const colorClasses = {
    orange: 'bg-brand-orange hover:bg-brand-orange-dark',
    blue: 'bg-brand-blue hover:bg-brand-blue-dark',
    navy: 'bg-brand-navy hover:bg-brand-navy-dark',
    green: 'bg-ui-success hover:bg-green-600'
  }

  return (
    <Card variant="default" padding="lg">
      <CardHeader>
        <CardTitle>Actions Rapides</CardTitle>
        <CardDescription>Tâches fréquentes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="primary"
              size="lg"
              className={cn(
                "h-auto p-4 flex-col items-start text-left",
                colorClasses[action.color]
              )}
            >
              <div className="flex items-center w-full">
                <span className="text-2xl mr-3">{action.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{action.title}</p>
                  <p className="text-xs text-white/80 mt-1">{action.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  // Mock data - à remplacer avec les vraies données
  const metrics = [
    {
      title: 'Projets Actifs',
      value: '12',
      change: { value: '+2', trend: 'up' as const },
      icon: '🏗️',
      description: '3 en attente de validation'
    },
    {
      title: 'Documents Traités',
      value: '247',
      change: { value: '+18%', trend: 'up' as const },
      icon: '📄',
      description: 'Ce mois-ci'
    },
    {
      title: 'Taux de Validation',
      value: '94%',
      change: { value: '+3%', trend: 'up' as const },
      icon: '✅',
      description: 'Temps moyen: 2.3 jours'
    },
    {
      title: 'Économie de Temps',
      value: '42h',
      change: { value: '+8h', trend: 'up' as const },
      icon: '⏱️',
      description: 'Ce mois-ci'
    }
  ]

  const recentActivities = [
    {
      id: '1',
      type: 'document' as const,
      title: 'Facture #2024-087 traitée',
      description: 'Restaurant Le Bistro - Projet Centre Commercial',
      time: 'Il y a 5 minutes',
      status: 'completed' as const
    },
    {
      id: '2',
      type: 'approval' as const,
      title: 'Nouveau document à valider',
      description: 'Devis rénovation - Projet Résidence des Pins',
      time: 'Il y a 1 heure',
      status: 'pending' as const
    },
    {
      id: '3',
      type: 'project' as const,
      title: 'Projet créé',
      description: 'Extension Bureau - Société TechCorp',
      time: 'Il y a 3 heures',
      status: 'completed' as const
    },
    {
      id: '4',
      type: 'client' as const,
      title: 'Nouveau client ajouté',
      description: 'Construction Durand LTÉE',
      time: 'Il y a 1 jour',
      status: 'completed' as const
    }
  ]

  const quickActions = [
    {
      id: '1',
      title: 'Upload Intelligent',
      description: 'Ajouter des documents avec IA',
      icon: '⚡',
      href: '/documents/upload',
      color: 'orange' as const
    },
    {
      id: '2',
      title: 'Nouveau Projet',
      description: 'Créer un projet',
      icon: '➕',
      href: '/projects/new',
      color: 'blue' as const
    },
    {
      id: '3',
      title: 'Approbations',
      description: '3 documents en attente',
      icon: '✅',
      href: '/approvals',
      color: 'navy' as const
    },
    {
      id: '4',
      title: 'Rapport Mensuel',
      description: 'Générer un rapport',
      icon: '📊',
      href: '/reports',
      color: 'green' as const
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">Tableau de bord</h1>
          <p className="text-ui-text-muted mt-1">Vue d&apos;ensemble de vos activités</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <span className="mr-2">📅</span>
            Derniers 30 jours
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-brand-orange to-brand-orange-light text-white p-4 rounded-lg shadow-assembly-md">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">3 documents en attente d&apos;approbation</p>
            <p className="text-sm text-white/90">Traitez-les rapidement pour maintenir vos projets en cours</p>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 border-white">
            Voir maintenant
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickActions actions={quickActions} />
          
          {/* Projects Overview */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Projets Récents</CardTitle>
              <CardDescription>Vos chantiers les plus actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Centre Commercial Sainte-Foy', progress: 75, status: 'En cours', deadline: '15 Déc 2024' },
                  { name: 'Résidence des Pins', progress: 45, status: 'En cours', deadline: '28 Jan 2025' },
                  { name: 'Bureau TechCorp', progress: 90, status: 'Presque terminé', deadline: '30 Nov 2024' }
                ].map((project, index) => (
                  <div key={index} className="border-b border-ui-border pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-ui-text">{project.name}</h4>
                      <span className="text-sm text-ui-text-muted">{project.deadline}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="w-full bg-ui-background-secondary rounded-full h-2">
                          <div 
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              project.progress >= 75 ? "bg-ui-success" : 
                              project.progress >= 50 ? "bg-brand-orange" : "bg-brand-blue"
                            )}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-ui-text">{project.progress}%</span>
                    </div>
                    <p className="text-xs text-ui-text-muted mt-1">{project.status}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  )
}
