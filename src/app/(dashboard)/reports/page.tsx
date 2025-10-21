'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  FileText,
  Users,
  AlertCircle
} from 'lucide-react'

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRevenue: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalClients: 0,
    avgProjectDuration: 0
  })

  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single()

        if (!profile?.organization_id) return

        // Fetch projects stats
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('organization_id', profile.organization_id)

        // Fetch clients count
        const { data: clients } = await supabase
          .from('clients')
          .select('id')
          .eq('organization_id', profile.organization_id)

        if (projects) {
          const totalRevenue = projects.reduce((sum, project) => sum + (project.budget || 0), 0)
          const activeProjects = projects.filter(p => p.status === 'active').length
          const completedProjects = projects.filter(p => p.status === 'completed').length
          
          setStats({
            totalProjects: projects.length,
            totalRevenue,
            activeProjects,
            completedProjects,
            totalClients: clients?.length || 0,
            avgProjectDuration: 45 // Placeholder - would calculate from actual dates
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">Rapports & Suivi</h1>
          <p className="text-ui-text-muted mt-1">Analyses et prévisions de vos projets</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy-dark transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-ui-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ui-text-muted">Projets Total</p>
              <p className="text-2xl font-bold text-ui-text mt-1">{stats.totalProjects}</p>
              <p className="text-xs text-ui-success mt-2">+12% ce mois</p>
            </div>
            <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-orange" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-ui-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ui-text-muted">Revenus Totaux</p>
              <p className="text-2xl font-bold text-ui-text mt-1">
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-ui-success mt-2">+8% ce mois</p>
            </div>
            <div className="w-12 h-12 bg-brand-navy/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-brand-navy" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-ui-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ui-text-muted">Projets Actifs</p>
              <p className="text-2xl font-bold text-ui-text mt-1">{stats.activeProjects}</p>
              <p className="text-xs text-ui-text-muted mt-2">
                {stats.completedProjects} complétés
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-ui-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ui-text-muted">Clients</p>
              <p className="text-2xl font-bold text-ui-text mt-1">{stats.totalClients}</p>
              <p className="text-xs text-ui-success mt-2">+3 nouveaux</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-ui-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ui-text-muted">Durée Moyenne</p>
              <p className="text-2xl font-bold text-ui-text mt-1">{stats.avgProjectDuration}j</p>
              <p className="text-xs text-ui-text-muted mt-2">par projet</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-ui-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ui-text-muted">Taux de Succès</p>
              <p className="text-2xl font-bold text-ui-text mt-1">94%</p>
              <p className="text-xs text-ui-success mt-2">+2% ce mois</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-ui-border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-ui-text mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/projects/new" className="flex items-center gap-3 p-4 border border-ui-border rounded-lg hover:border-brand-orange transition-colors">
            <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand-orange" />
            </div>
            <div>
              <p className="font-medium text-ui-text">Nouveau Rapport</p>
              <p className="text-xs text-ui-text-muted">Générer un rapport personnalisé</p>
            </div>
          </Link>

          <Link href="/forecasts" className="flex items-center gap-3 p-4 border border-ui-border rounded-lg hover:border-brand-orange transition-colors">
            <div className="w-10 h-10 bg-brand-navy/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-brand-navy" />
            </div>
            <div>
              <p className="font-medium text-ui-text">Prévisions</p>
              <p className="text-xs text-ui-text-muted">Analyser les tendances futures</p>
            </div>
          </Link>

          <button className="flex items-center gap-3 p-4 border border-ui-border rounded-lg hover:border-brand-orange transition-colors text-left">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-ui-text">Exporter les Données</p>
              <p className="text-xs text-ui-text-muted">Télécharger en CSV ou PDF</p>
            </div>
          </button>
        </div>
      </div>

      {/* Empty State for detailed reports */}
      <div className="bg-white rounded-xl border border-ui-border shadow-sm p-12 text-center">
        <AlertCircle className="w-12 h-12 text-ui-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-ui-text mb-2">Rapports Détaillés</h3>
        <p className="text-ui-text-muted mb-6">
          Les rapports détaillés par projet et par client seront bientôt disponibles.
        </p>
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors"
        >
          Voir les projets
        </Link>
      </div>
    </div>
  )
}
