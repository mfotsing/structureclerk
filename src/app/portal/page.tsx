'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Users,
  FileText,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  MousePointer,
  Eye,
  Target,
  Download,
  Mail,
  AlertCircle,
  DollarSign,
  Calendar,
  Filter,
  Search,
  ChevronRight,
  Settings,
  Database,
  Globe,
  Smartphone,
  Zap
} from 'lucide-react'

interface AnalyticsData {
  visitors: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    uniqueUsers: number
    returningUsers: number
    bounceRate: number
    avgSessionDuration: string
    topPages: Array<{ page: string; views: number; avgDuration: string }>
  }
  scorecard: {
    totalStarted: number
    totalCompleted: number
    completionRate: number
    averageScore: number
    categoryDistribution: {
      rouge: number
      orange: number
      vert: number
    }
    topDropoffs: Array<{ question: string; dropoffs: number; rate: number }>
    dailyStats: Array<{ date: string; started: number; completed: number }>
  }
  leads: {
    total: number
    thisMonth: number
    qualified: number
    hot: number
    warm: number
    cold: number
    conversionRate: number
    sources: Array<{ source: string; count: number; percentage: number }>
    recentLeads: Array<{
      id: string
      name: string
      email: string
      phone?: string
      score: number
      category: string
      adminTime: string
      objective: string
      createdAt: string
    }>
  }
  performance: {
    pageLoadTime: number
    errorRate: number
    uptime: number
    apiResponseTime: number
    mobileTraffic: number
    desktopTraffic: number
  }
}

export default function PortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      // Check if user is authorized
      const authorizedEmails = ['info@structureclerk.ca', 'info@techvibes.ca']
      if (!user.email || !authorizedEmails.includes(user.email)) {
        await supabase.auth.signOut()
        router.push('/portal/login?error=unauthorized')
        return
      }

      setIsAuthenticated(true)
      loadAnalytics()
    }

    checkAuth()
  }, [router])

  const loadAnalytics = async () => {
    try {
      // Simuler les données analytics (à remplacer avec vraies API)
      const mockData: AnalyticsData = {
        visitors: {
          total: 15234,
          today: 287,
          thisWeek: 1923,
          thisMonth: 8456,
          uniqueUsers: 12847,
          returningUsers: 2387,
          bounceRate: 34.2,
          avgSessionDuration: "4:23",
          topPages: [
            { page: '/', views: 5234, avgDuration: "3:45" },
            { page: '/scorecard', views: 2876, avgDuration: "6:12" },
            { page: '/pricing', views: 1234, avgDuration: "2:34" },
            { page: '/demo', views: 987, avgDuration: "1:56" },
            { page: '/qa', views: 765, avgDuration: "2:18" }
          ]
        },
        scorecard: {
          totalStarted: 3421,
          totalCompleted: 2187,
          completionRate: 63.9,
          averageScore: 42.3,
          categoryDistribution: {
            rouge: 892,
            orange: 1234,
            vert: 1061
          },
          topDropoffs: [
            { question: "Q6: Centralisation Documents", dropoffs: 234, rate: 6.8 },
            { question: "Q7: Visibilité Marge Temps Réel", dropoffs: 198, rate: 5.8 },
            { question: "Q8: Automatisation Upload Fournisseurs", dropoffs: 176, rate: 5.1 }
          ],
          dailyStats: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            started: Math.floor(Math.random() * 150) + 50,
            completed: Math.floor(Math.random() * 100) + 30
          }))
        },
        leads: {
          total: 1876,
          thisMonth: 342,
          qualified: 543,
          hot: 87,
          warm: 234,
          cold: 222,
          conversionRate: 28.9,
          sources: [
            { source: "Organic Search", count: 789, percentage: 42.1 },
            { source: "Direct", count: 456, percentage: 24.3 },
            { source: "Social Media", count: 345, percentage: 18.4 },
            { source: "Referral", count: 234, percentage: 12.5 },
            { source: "Email", count: 52, percentage: 2.7 }
          ],
          recentLeads: [
            {
              id: "1",
              name: "Marc Tremblay",
              email: "marc@constructionqc.ca",
              phone: "514-555-0123",
              score: 28,
              category: "rouge_critique",
              adminTime: "10-20 heures",
              objective: "gagner 10+ heures/semaine",
              createdAt: "2025-01-23T14:30:00Z"
            },
            {
              id: "2",
              name: "Sophie Bernard",
              email: "sophie@renovation-mtl.ca",
              score: 67,
              category: "orange_attention",
              adminTime: "5-10 heures",
              objective: "détecter les dépassements plus tôt",
              createdAt: "2025-01-23T13:15:00Z"
            },
            {
              id: "3",
              name: "David Chen",
              email: "dchen@buildpro.ca",
              score: 85,
              category: "vert_ok",
              adminTime: "moins de 5 heures",
              objective: "arrêter de perdre mes soirées",
              createdAt: "2025-01-23T11:45:00Z"
            }
          ]
        },
        performance: {
          pageLoadTime: 1.8,
          errorRate: 0.2,
          uptime: 99.9,
          apiResponseTime: 245,
          mobileTraffic: 62.3,
          desktopTraffic: 37.7
        }
      }

      setAnalytics(mockData)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading analytics:', error)
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Database className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Chargement du portail...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirection handled in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo-icon.svg"
                  alt="StructureClerk"
                  width={40}
                  height={40}
                />
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    <span className="text-blue-900">Structure</span>
                    <span className="text-orange-500">Clerk</span>
                  </span>
                  <span className="text-xs text-gray-500 block">Portail Admin</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Dernière sync: {new Date().toLocaleTimeString('fr-CA')}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Analytics</h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">Dernières 24h</option>
              <option value="7d">Derniers 7 jours</option>
              <option value="30d">Derniers 30 jours</option>
              <option value="90d">Derniers 90 jours</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Visitors */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12.3%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{analytics.visitors.total.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Visiteurs totales</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Aujourd'hui: {analytics.visitors.today}</span>
                <span>Ce mois: {analytics.visitors.thisMonth}</span>
              </div>
            </div>
          </div>

          {/* Scorecard Completions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">{analytics.scorecard.completionRate}%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{analytics.scorecard.totalCompleted.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Scorecards complétés</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Taux: {analytics.scorecard.completionRate}%</span>
                <span>Score moyen: {analytics.scorecard.averageScore}</span>
              </div>
            </div>
          </div>

          {/* Leads Generated */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+28.4%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{analytics.leads.total.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Leads générés</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Qualifiés: {analytics.leads.qualified}</span>
                <span>Conversion: {analytics.leads.conversionRate}%</span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">{analytics.performance.uptime}%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{analytics.performance.pageLoadTime}s</h3>
            <p className="text-sm text-gray-600">Temps de chargement</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Taux d'erreur: {analytics.performance.errorRate}%</span>
                <span>Mobile: {analytics.performance.mobileTraffic}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Leads Récents</h2>
                <Link href="/portal/leads" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Voir tout →
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.leads.recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          lead.category === 'rouge_critique' ? 'bg-red-100 text-red-800' :
                          lead.category === 'orange_attention' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          Score: {lead.score}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(lead.createdAt).toLocaleDateString('fr-CA')}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scorecard Categories */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Distribution Scores</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-red-600">🔴 Critique</span>
                    <span className="text-sm text-gray-600">{analytics.scorecard.categoryDistribution.rouge} leads</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(analytics.scorecard.categoryDistribution.rouge / analytics.scorecard.totalCompleted) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-orange-600">🟠 Attention</span>
                    <span className="text-sm text-gray-600">{analytics.scorecard.categoryDistribution.orange} leads</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(analytics.scorecard.categoryDistribution.orange / analytics.scorecard.totalCompleted) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-green-600">🟢 Optimal</span>
                    <span className="text-sm text-gray-600">{analytics.scorecard.categoryDistribution.vert} leads</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(analytics.scorecard.categoryDistribution.vert / analytics.scorecard.totalCompleted) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pages les Plus Visitées</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vues</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée moyenne</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de conversion</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.visitors.topPages.map((page, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {page.page}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.avgDuration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.page === '/scorecard' ? '15.2%' : page.page === '/pricing' ? '8.7%' : '4.3%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}