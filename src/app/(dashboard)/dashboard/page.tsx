'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import EmptyState from '@/components/dashboard/EmptyState';
import FeatureRecommendations from '@/components/progressive/FeatureRecommendations';
import SmartHints from '@/components/progressive/SmartHints';
import TrustIndicators from '@/components/social/TrustIndicators';
import AIConfidenceBadge, { CompactAIConfidence } from '@/components/social/AIConfidenceBadge';
import NPSDashboard from '@/components/feedback/NPSDashboard';
import { QuickFeedback } from '@/components/feedback/FeedbackSurvey';
import { SimplifiedText } from '@/contexts/TerminologyContext';
import TerminologyHelper from '@/components/terminology/TerminologyHelper';
import { useFeedback } from '@/contexts/FeedbackContext';
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Target,
  Zap,
  Eye,
  ArrowRight,
  Smartphone,
  Mic,
  Camera,
  Timer,
  AlertTriangle,
  Info,
  Lightbulb
} from 'lucide-react';

interface CriticalAction {
  id: string;
  type: 'approval' | 'quote_response' | 'budget_alert' | 'timesheet_approval';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  action_url: string;
  metadata?: any;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  target?: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  url: string;
  color: string;
}

export default function DashboardPage() {
  const [criticalActions, setCriticalActions] = useState<CriticalAction[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [vdiStats, setVdiStats] = useState({
    documentsProcessed: 0,
    timeSaved: 0,
    accuracy: 0
  });
  const [documents, setDocuments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const supabase = createClient();
  const { recordEvent } = useFeedback();

  // Load critical actions
  const loadCriticalActions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      // Simulate critical actions from different sources
      const mockActions: CriticalAction[] = [
        {
          id: '1',
          type: 'approval',
          title: 'Facture ABC Fournitures en attente',
          description: 'Montant: $1,870.50 - Échéance: 3 jours',
          priority: 'high',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          action_url: '/dashboard/approvals',
          metadata: { amount: 1870.50, vendor: 'ABC Fournitures' }
        },
        {
          id: '2',
          type: 'quote_response',
          title: 'Devis #456 - Rénovation Dupuis',
          description: 'En attente de réponse depuis 2 jours',
          priority: 'medium',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          action_url: '/dashboard/quotes/456',
          metadata: { client: 'Dupuis', amount: 25000 }
        },
        {
          id: '3',
          type: 'budget_alert',
          title: 'Projet Saint-Laurent - Dépassement budget',
          description: '90% du budget utilisé, reste $2,500',
          priority: 'high',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          action_url: '/dashboard/projects/st-laurent',
          metadata: { project: 'Saint-Laurent', budgetUsed: 90, remaining: 2500 }
        },
        {
          id: '4',
          type: 'timesheet_approval',
          title: '5 feuilles de temps à approuver',
          description: 'Total: 42 heures - Coût: $2,730',
          priority: 'medium',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          action_url: '/dashboard/timesheets',
          metadata: { hours: 42, cost: 2730, employees: 3 }
        }
      ];

      setCriticalActions(mockActions);
    } catch (error) {
      console.error('Error loading critical actions:', error);
    }
  }, [supabase]);

  // Load performance metrics
  const loadPerformanceMetrics = useCallback(async () => {
    try {
      // Simulate performance metrics
      const mockMetrics: PerformanceMetric[] = [
        {
          name: 'Marge Nette',
          value: 18.5,
          unit: '%',
          status: 'good',
          trend: 'up',
          target: 15
        },
        {
          name: 'IPC (Indice de Performance des Coûts)',
          value: 0.92,
          unit: '',
          status: 'good',
          trend: 'stable',
          target: 1.0
        },
        {
          name: 'Utilisation Budget',
          value: 76,
          unit: '%',
          status: 'warning',
          trend: 'up',
          target: 80
        },
        {
          name: 'Taux Conversion Devis',
          value: 68,
          unit: '%',
          status: 'warning',
          trend: 'down',
          target: 75
        }
      ];

      setPerformanceMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    }
  }, []);

  // Load quick actions
  const loadQuickActions = useCallback(() => {
    const actions: QuickAction[] = [
      {
        id: '1',
        title: 'Devis Intelligent',
        description: 'Dictée vocale + caméra',
        icon: Mic,
        url: '/dashboard/smart-quotes/create',
        color: 'bg-purple-600'
      },
      {
        id: '2',
        title: 'Saisie Heures Mobile',
        description: 'Chronomètre intelligent',
        icon: Timer,
        url: '/dashboard/timesheets/mobile',
        color: 'bg-blue-600'
      },
      {
        id: '3',
        title: 'Caméra Métrique',
        description: 'Mesures IA automatiques',
        icon: Camera,
        url: '/dashboard/metrology/camera',
        color: 'bg-green-600'
      },
      {
        id: '4',
        title: 'Smart Drop Zone',
        description: 'Extraction IA 10s',
        icon: Zap,
        url: '/dashboard/files',
        color: 'bg-orange-600'
      }
    ];

    setQuickActions(actions);
  }, []);

  // Load VDI stats
  const loadVDIStats = useCallback(async () => {
    try {
      // Simulate VDI stats
      setVdiStats({
        documentsProcessed: 127,
        timeSaved: 635, // minutes
        accuracy: 94
      });

      // Trigger feedback for time saved milestone
      if (127 >= 10) {
        recordEvent('time_saved', { documentsProcessed: 127 });
      }
    } catch (error) {
      console.error('Error loading VDI stats:', error);
    }
  }, [recordEvent]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadCriticalActions(),
        loadPerformanceMetrics(),
        loadQuickActions(),
        loadVDIStats()
      ]);
      setLoading(false);
    };

    loadData();
  }, [loadCriticalActions, loadPerformanceMetrics, loadQuickActions, loadVDIStats]);

  // Handle quick approval
  const handleQuickApproval = async (actionId: string) => {
    try {
      // Simulate approval
      setCriticalActions(prev => prev.filter(action => action.id !== actionId));

      // Trigger feedback for successful approval
      recordEvent('feature_usage', { feature: 'quick_approval', actionType: 'approval' });

      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Action complétée', {
          body: 'L\'action a été traitée avec succès',
          icon: '/favicon.ico'
        });
      }
    } catch (error) {
      console.error('Error handling quick approval:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'border-red-200 bg-red-50',
      medium: 'border-yellow-200 bg-yellow-50',
      low: 'border-blue-200 bg-blue-50'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityIcon = (priority: string) => {
    const icons = {
      high: <AlertTriangle className="w-5 h-5 text-red-600" />,
      medium: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      low: <Info className="w-5 h-5 text-blue-600" />
    };
    return icons[priority as keyof typeof icons] || icons.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      good: 'text-green-600',
      warning: 'text-yellow-600',
      critical: 'text-red-600'
    };
    return colors[status as keyof typeof colors] || colors.good;
  };

  const getTrendIcon = (trend?: string) => {
    const icons = {
      up: <TrendingUp className="w-4 h-4 text-green-600" />,
      down: <TrendingDown className="w-4 h-4 text-red-600" />,
      stable: <div className="w-4 h-4 bg-gray-400 rounded-full" />
    };
    return trend ? icons[trend as keyof typeof icons] : icons.stable;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  // Détecter l'état de l'utilisateur pour afficher le bon empty state
  const hasDocuments = documents.length > 0
  const hasProjects = projects.length > 0
  const hasCriticalActions = criticalActions.length > 0
  const isEmpty = !hasDocuments && !hasProjects && !hasCriticalActions

  return (
    <>
      {/* Onboarding Flow pour nouveaux utilisateurs */}
      <OnboardingFlow />

      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">
            <SimplifiedText text="Centre de Commandement" />
          </h1>
          <p className="text-ui-text-muted mt-1">
            <SimplifiedText text="Qu'est-ce qui me fait perdre de l'argent ou du temps maintenant?" />
          </p>
        </div>
      </div>

      {/* Empty State ou Proof of Value */}
      {isEmpty ? (
        <EmptyState
          type="getting-started"
          onPrimaryAction={() => window.location.href = '/documents?mode=upload'}
          onSecondaryAction={() => window.open('https://www.youtube.com/watch?v=demo', '_blank')}
        />
      ) : (
        <>
          <Card variant="default" padding="lg" className="bg-gradient-to-r from-brand-orange/10 to-brand-orange/5 border-brand-orange/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      <SimplifiedText text="Preuve de Valeur IA" />
                    </h3>
                    <p className="text-sm text-gray-600">
                      <SimplifiedText text={`Depuis le dernier rapport, l'IA a traité ${vdiStats.documentsProcessed} documents, vous économisant ${Math.round(vdiStats.timeSaved / 60)} heures de saisie`} />
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-orange">{vdiStats.accuracy}%</p>
                  <p className="text-xs text-gray-500"><SimplifiedText text="Précision moyenne" /></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Actions Widget */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-brand-orange" />
                  <SimplifiedText text="Actions Critiques" />
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  {criticalActions.length} urgentes
                </span>
              </CardTitle>
              <CardDescription>
                Centralisation des tâches critiques nécessitant votre attention immédiate
              </CardDescription>
            </CardHeader>
            <CardContent>
              {criticalActions.length === 0 ? (
                <EmptyState
                  type="no-actions"
                  onPrimaryAction={() => window.location.href = '/dashboard?mode=history'}
                  onSecondaryAction={() => window.open('https://www.youtube.com/watch?v=features', '_blank')}
                />
              ) : (
                <div className="space-y-4">
                  {criticalActions.map((action) => (
                    <div key={action.id} className={`border rounded-lg p-4 ${getPriorityColor(action.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getPriorityIcon(action.priority)}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{action.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                            <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(action.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {action.type === 'approval' && (
                            <button
                              onClick={() => handleQuickApproval(action.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                            >
                              Approuver
                            </button>
                          )}
                          <Link href={action.action_url}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <SimplifiedText text="Performance Proactive (Ex-Forecasts)" />
              </CardTitle>
              <CardDescription>
                <SimplifiedText text="Protection de votre marge : KPI financiers avec alertes prédictives" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        <TerminologyHelper term={metric.name} />
                      </h4>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="flex items-baseline">
                      <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value}{metric.unit}
                      </p>
                      {metric.target && (
                        <p className="text-xs text-gray-500 ml-2">/ {metric.target}{metric.unit}</p>
                      )}
                    </div>
                    {metric.status === 'warning' && (
                      <div className="mt-2 text-xs text-yellow-600">
                        ⚠️ À surveiller
                      </div>
                    )}
                    {metric.status === 'critical' && (
                      <div className="mt-2 text-xs text-red-600">
                        🚨 Risque critique
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Démarrage Rapide
              </CardTitle>
              <CardDescription>
                Accès direct aux workflows critiques non urgents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.id} href={action.url}>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smart Hints */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Conseils Intelligents
              </CardTitle>
              <CardDescription>
                Astuces adaptées à votre profil et votre activité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SmartHints />
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Confiance & Performance
              </CardTitle>
              <CardDescription>
                Indicateurs de confiance et performance IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrustIndicators variant="compact" />
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Précision IA globale:</span>
                  <AIConfidenceBadge feature="dashboard" confidence={94} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Recommendations */}
          <FeatureRecommendations maxItems={2} />

          {/* NPS Dashboard */}
          <NPSDashboard variant="compact" />

          {/* Recent Activity Summary */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Aperçu de la Semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-gray-600">Documents traités</p>
                  <QuickFeedback feature="dashboard" type="thumbs" className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">$45,750</p>
                  <p className="text-sm text-gray-600">Valeur devis</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600">Projets actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
    </>
  );
}
