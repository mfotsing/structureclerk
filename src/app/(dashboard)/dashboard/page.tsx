'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign,
  FileText,
  Users,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Calendar,
  BarChart3,
  Target
} from 'lucide-react'

interface ApprovalItem {
  id: string
  document_name: string
  project_name: string
  type: string
  amount?: number
  urgency: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
}

interface ProjectMetrics {
  id: string
  name: string
  budget_variance: number
  performance_index: number
  status: 'on_track' | 'at_risk' | 'behind'
  completion_percentage: number
}

interface SystemMetrics {
  pending_approvals: number
  documents_processed_today: number
  average_processing_time: number
  system_health: 'good' | 'warning' | 'critical'
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>([])
  const [projectMetrics, setProjectMetrics] = useState<ProjectMetrics[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    pending_approvals: 0,
    documents_processed_today: 0,
    average_processing_time: 0,
    system_health: 'good'
  })
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [selectedApprovals, setSelectedApprovals] = useState<ApprovalItem[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
    
    // Set up real-time updates
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'documents' 
      }, () => {
        loadDashboardData()
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (!profile?.organization_id) return

      // Load pending approvals
      const { data: approvals } = await supabase
        .from('documents')
        .select('*, projects(name)')
        .eq('organization_id', profile.organization_id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10)

      // Load project metrics
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .limit(5)

      // Calculate system metrics
      const { data: todayDocs } = await supabase
        .from('documents')
        .select('created_at')
        .eq('organization_id', profile.organization_id)
        .gte('created_at', new Date().toISOString().split('T')[0])

      setPendingApprovals(approvals || [])
      
      // Mock project metrics for now
      setProjectMetrics([
        {
          id: '1',
          name: 'Centre Commercial Sainte-Foy',
          budget_variance: -5.2,
          performance_index: 0.95,
          status: 'on_track',
          completion_percentage: 75
        },
        {
          id: '2',
          name: 'Résidence des Pins',
          budget_variance: 12.8,
          performance_index: 0.87,
          status: 'at_risk',
          completion_percentage: 45
        },
        {
          id: '3',
          name: 'Bureau TechCorp',
          budget_variance: -2.1,
          performance_index: 1.02,
          status: 'on_track',
          completion_percentage: 90
        }
      ])
      
      setSystemMetrics({
        pending_approvals: approvals?.length || 0,
        documents_processed_today: todayDocs?.length || 0,
        average_processing_time: 2.3, // Mock data
        system_health: (approvals?.length || 0) > 10 ? 'warning' : 'good'
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickApproval = () => {
    setSelectedApprovals(pendingApprovals.slice(0, 5))
    setShowApprovalModal(true)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-600'
      case 'at_risk': return 'text-yellow-600'
      case 'behind': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getPerformanceColor = (index: number) => {
    if (index >= 1.0) return 'text-green-600'
    if (index >= 0.9) return 'text-yellow-600'
    return 'text-red-600'
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
          <h1 className="text-3xl font-bold text-ui-text">Tableau de bord</h1>
          <p className="text-ui-text-muted mt-1">Centre de Commandement IAC - Prise de Décision Proactive</p>
        </div>
      </div>

      {/* Critical Alert Widget */}
      {systemMetrics.pending_approvals > 0 && (
        <Card variant="default" padding="lg" className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    {systemMetrics.pending_approvals} document{systemMetrics.pending_approvals > 1 ? 's' : ''} en attente d'approbation
                  </h3>
                  <p className="text-red-600">
                    Action requise pour maintenir les projets en cours
                  </p>
                </div>
              </div>
              <Button 
                variant="primary" 
                onClick={handleQuickApproval}
                className="bg-red-600 hover:bg-red-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-ui-text-muted">VDI (Vitesse)</p>
                <p className="text-2xl font-bold text-ui-text mt-2">
                  {'<'} {systemMetrics.average_processing_time}s
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">15% plus rapide</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-ui-text-muted">Documents traités</p>
                <p className="text-2xl font-bold text-ui-text mt-2">
                  {systemMetrics.documents_processed_today}
                </p>
                <div className="flex items-center mt-2">
                  <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">Aujourd'hui</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-ui-text-muted">IPC (Performance)</p>
                <p className="text-2xl font-bold text-ui-text mt-2">0.94</p>
                <div className="flex items-center mt-2">
                  <Target className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">Objectif atteint</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-ui-text-muted">Santé système</p>
                <p className="text-2xl font-bold text-ui-text mt-2">
                  {systemMetrics.system_health === 'good' ? 'Bonne' : 
                   systemMetrics.system_health === 'warning' ? 'Attention' : 'Critique'}
                </p>
                <div className="flex items-center mt-2">
                  {systemMetrics.system_health === 'good' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  ) : systemMetrics.system_health === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    systemMetrics.system_health === 'good' ? 'text-green-500' :
                    systemMetrics.system_health === 'warning' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {systemMetrics.system_health === 'good' ? 'Optimal' : 
                     systemMetrics.system_health === 'warning' ? 'Surveiller' : 'Action requise'}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                systemMetrics.system_health === 'good' ? 'bg-green-100' :
                systemMetrics.system_health === 'warning' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <Activity className={`w-6 h-6 ${
                  systemMetrics.system_health === 'good' ? 'text-green-600' :
                  systemMetrics.system_health === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Performance */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Performance des Projets
              </CardTitle>
              <CardDescription>
                Indicateurs de performance clés (IPC) et écarts de budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectMetrics.map((project) => (
                  <div key={project.id} className="border-b border-ui-border pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-ui-text">{project.name}</h4>
                      <span className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                        {project.status === 'on_track' ? 'Sur la bonne voie' :
                         project.status === 'at_risk' ? 'À risque' : 'En retard'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Écart budget</span>
                          <span className={`text-xs font-medium ${
                            project.budget_variance < 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {project.budget_variance > 0 ? '+' : ''}{project.budget_variance}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              project.budget_variance < 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.abs(project.budget_variance) > 20 ? 100 : Math.abs(project.budget_variance) * 5}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">IPC</span>
                          <span className={`text-xs font-medium ${getPerformanceColor(project.performance_index)}`}>
                            {project.performance_index}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              project.performance_index >= 1.0 ? 'bg-green-500' :
                              project.performance_index >= 0.9 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${project.performance_index * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Avancement</span>
                          <span className="text-xs font-medium">{project.completion_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${project.completion_percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Activité Récente
              </CardTitle>
              <CardDescription>
                Dernières actions dans vos projets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.slice(0, 5).map((approval) => (
                  <div key={approval.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-ui-background-secondary rounded-full flex items-center justify-center text-sm">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ui-text">{approval.document_name}</p>
                      <p className="text-sm text-ui-text-muted">{approval.project_name}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-ui-text-muted">
                          {new Date(approval.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(approval.urgency)}`}>
                          {approval.urgency === 'critical' ? 'Urgent' :
                           approval.urgency === 'high' ? 'Élevé' :
                           approval.urgency === 'medium' ? 'Moyen' : 'Faible'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {pendingApprovals.length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucune approbation en attente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approval Modal (Simplified) */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Approbations Rapides</h3>
            <div className="space-y-3 mb-6">
              {selectedApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{approval.document_name}</p>
                    <p className="text-xs text-gray-500">{approval.project_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="primary" size="sm">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={() => setShowApprovalModal(false)}>
                Approuver tout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
