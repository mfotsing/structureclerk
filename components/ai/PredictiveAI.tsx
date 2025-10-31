'use client'

import { useState, useEffect } from 'react'

interface Prediction {
  id: string
  type: 'revenue' | 'expense' | 'cashflow' | 'project' | 'resource'
  title: string
  description: string
  confidence: number
  timeframe: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  value: number
  currency: string
  factors: string[]
  recommendations: string[]
  createdAt: Date
  status: 'pending' | 'acknowledged' | 'addressed'
}

interface Alert {
  id: string
  type: 'budget' | 'deadline' | 'opportunity' | 'risk' | 'compliance'
  severity: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  actionable: boolean
  actions: Array<{
    id: string
    label: string
    description: string
    type: 'navigate' | 'create' | 'approve' | 'review'
    target?: string
  }>
  source: string
  timestamp: Date
  read: boolean
}

interface AIInsight {
  id: string
  category: 'efficiency' | 'cost' | 'revenue' | 'productivity' | 'trend'
  title: string
  description: string
  data: {
    current: number
    previous: number
    change: number
    changePercent: number
    trend: 'up' | 'down' | 'stable'
  }
  visualization: 'chart' | 'metric' | 'comparison'
  timeframe: string
  insights: string[]
}

export default function PredictiveAI() {
  const [activeTab, setActiveTab] = useState<'predictions' | 'alerts' | 'insights'>('predictions')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '6m' | '1y'>('90d')

  useEffect(() => {
    loadPredictiveData()
  }, [selectedTimeframe])

  const loadPredictiveData = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockPredictions: Prediction[] = [
      {
        id: '1',
        type: 'revenue',
        title: 'Augmentation des revenus Q1 2025',
        description: 'Basé sur les tendances actuelles et les contrats signés, prévoyons une augmentation de 23% des revenus',
        confidence: 87,
        timeframe: 'Q1 2025',
        impact: 'high',
        value: 154750,
        currency: 'CAD',
        factors: [
          'Nouveaux contrats signés: +3 clients',
          'Taux de rétention: 95%',
          'Saisonnalité historique positive',
          'Expansion services existants'
        ],
        recommendations: [
          'Investir dans équipe support pour gérer croissance',
          'Optimiser processus pour maintenir marges',
          'Prévoir campagne marketing pour Q2'
        ],
        createdAt: new Date(),
        status: 'pending'
      },
      {
        id: '2',
        type: 'expense',
        title: 'Pression sur coûts logiciels',
        description: 'Les dépenses logiciels devraient augmenter de 35% avec nouveaux outils IA',
        confidence: 92,
        timeframe: 'Prochains 3 mois',
        impact: 'medium',
        value: 8450,
        currency: 'CAD',
        factors: [
          'Nouveaux outils IA nécessaires',
          'Mises à niveau licences existantes',
          'Formation équipe sur nouveaux outils',
          'Support technique additionnel'
        ],
        recommendations: [
          'Négocier contrats annuels pour rabais',
          'Évaluer alternatives open-source',
          'Planifier formation progressive',
          'Allouer budget dédié'
        ],
        createdAt: new Date(),
        status: 'pending'
      },
      {
        id: '3',
        type: 'cashflow',
        title: 'Risque de trésorerie Mars 2025',
        description: 'Flux de trésorerie pourrait être négatif si investissements majeurs non retardés',
        confidence: 78,
        timeframe: 'Mars 2025',
        impact: 'critical',
        value: -25600,
        currency: 'CAD',
        factors: [
          'Gros investissements prévus',
          'Paiement impôts Q4 2024',
          'Saisonnalité basse revenus',
          'Décalage paiements clients'
        ],
        recommendations: [
          'Négocier termes paiement avec fournisseurs',
          'Accélérer facturation clients',
          'Ligne de crédit préventive',
          'Reporter investissements non critiques'
        ],
        createdAt: new Date(),
        status: 'pending'
      }
    ]

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'budget',
        severity: 'warning',
        title: 'Budget marketing dépassé de 15%',
        message: 'Les dépenses marketing ont dépassé le budget alloué pour ce trimestre',
        actionable: true,
        actions: [
          {
            id: 'review',
            label: 'Réviser budget',
            description: 'Analyser et ajuster le budget marketing',
            type: 'navigate',
            target: '/reports'
          },
          {
            id: 'optimize',
            label: 'Optimiser campagnes',
            description: 'Identifier campagnes sous-performantes',
            type: 'review',
            target: '/automations'
          }
        ],
        source: 'AI Budget Monitor',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        type: 'opportunity',
        severity: 'info',
        title: 'Upselling potentiel détecté',
        message: 'Client ABC Corp présente un potentiel d\'upselling de $45,000 basé sur usage patterns',
        actionable: true,
        actions: [
          {
            id: 'create',
            label: 'Créer proposition',
            description: 'Préparer proposition upselling',
            type: 'create',
            target: '/invoices'
          },
          {
            id: 'schedule',
            label: 'Planifier rencontre',
            description: 'Prendre rendez-vous avec client',
            type: 'navigate',
            target: '/calendar'
          }
        ],
        source: 'AI Opportunity Detector',
        timestamp: new Date(),
        read: false
      },
      {
        id: '3',
        type: 'risk',
        severity: 'error',
        title: 'Compte client en retard critique',
        message: 'Client XYZ a 45 jours de retard - risque de perte important',
        actionable: true,
        actions: [
          {
            id: 'contact',
            label: 'Contacter client',
            description: 'Appeler client immédiatement',
            type: 'navigate',
            target: '/inbox'
          },
          {
            id: 'escalate',
            label: 'Escalader management',
            description: 'Notifier management du risque',
            type: 'create',
            target: '/automations'
          }
        ],
        source: 'AI Risk Monitor',
        timestamp: new Date(),
        read: false
      }
    ]

    const mockInsights: AIInsight[] = [
      {
        id: '1',
        category: 'productivity',
        title: 'Efficacité IA en augmentation',
        description: 'L\'IA a permis d\'économiser 156h ce mois, en hausse de 24%',
        data: {
          current: 156,
          previous: 126,
          change: 30,
          changePercent: 24,
          trend: 'up'
        },
        visualization: 'metric',
        timeframe: '30 jours',
        insights: [
          'Document processing 40% plus rapide',
          'Réponse emails 60% plus rapide',
          'Création rapports 75% automatisée'
        ]
      },
      {
        id: '2',
        category: 'revenue',
        title: 'Panier moyen client en hausse',
        description: 'Les clients dépensent en moyenne 18% de plus par projet',
        data: {
          current: 12750,
          previous: 10800,
          change: 1950,
          changePercent: 18,
          trend: 'up'
        },
        visualization: 'chart',
        timeframe: '90 jours',
        insights: [
          'Services premium plus populaires',
          'Cross-selling efficace',
          'Satisfaction client élevée'
        ]
      },
      {
        id: '3',
        category: 'cost',
        title: 'Optimisation coûts opérationnels',
        description: 'Réduction de 12% des coûts opérationnels grâce à automatisation',
        data: {
          current: 28400,
          previous: 32300,
          change: -3900,
          changePercent: -12,
          trend: 'down'
        },
        visualization: 'comparison',
        timeframe: '6 mois',
        insights: [
          'Automatisation facturation',
          'Réduction erreurs humaines',
          'Processus optimisés'
        ]
      }
    ]

    setPredictions(mockPredictions)
    setAlerts(mockAlerts)
    setInsights(mockInsights)
    setIsAnalyzing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#10b981'
    if (confidence >= 75) return '#3b82f6'
    if (confidence >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getImpactColor = (impact: string) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#f97316',
      critical: '#ef4444'
    }
    return colors[impact as keyof typeof colors] || colors.medium
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: '#3b82f6',
      warning: '#f59e0b',
      error: '#ef4444',
      critical: '#dc2626'
    }
    return colors[severity as keyof typeof colors] || colors.info
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, read: true } : alert
    ))
  }

  const acknowledgePrediction = (predictionId: string) => {
    setPredictions(prev => prev.map(prediction =>
      prediction.id === predictionId ? { ...prediction, status: 'acknowledged' } : prediction
    ))
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#fff',
            margin: '0 0 0.5rem 0'
          }}>
            🤖 IA Prédictive
          </h1>
          <p style={{
            color: '#9ca3af',
            margin: 0
          }}>
            Prévisions, alertes intelligentes et analyses prédictives
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: '0.875rem'
            }}
          >
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="6m">6 mois</option>
            <option value="1y">1 an</option>
          </select>
          <button
            onClick={loadPredictiveData}
            disabled={isAnalyzing}
            style={{
              padding: '0.75rem 1.5rem',
              background: isAnalyzing
                ? 'rgba(156, 163, 175, 0.2)'
                : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#fff',
              fontWeight: '600',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isAnalyzing ? (
              <>
                <div style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid #fff',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Analyse...
              </>
            ) : (
              <>
                🔄 Actualiser
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '0.25rem',
        borderRadius: '0.5rem'
      }}>
        {[
          { id: 'predictions', label: 'Prédictions', count: predictions.filter(p => p.status === 'pending').length },
          { id: 'alerts', label: 'Alertes Actives', count: alerts.filter(a => !a.read).length },
          { id: 'insights', label: 'Insights IA', count: insights.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab.id
                ? 'rgba(139, 92, 246, 0.2)'
                : 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              color: activeTab === tab.id ? '#8b5cf6' : '#9ca3af',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.id ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span style={{
                background: activeTab === tab.id ? '#8b5cf6' : '#ef4444',
                color: '#fff',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {predictions.map((prediction) => (
            <div key={prediction.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${getImpactColor(prediction.impact)}40`,
              borderRadius: '1rem',
              padding: '1.5rem',
              position: 'relative'
            }}>
              {prediction.status === 'pending' && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '0.5rem',
                  height: '0.5rem',
                  background: getImpactColor(prediction.impact),
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#fff',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {prediction.title}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    margin: 0,
                    lineHeight: 1.4
                  }}>
                    {prediction.description}
                  </p>
                </div>
                <div style={{
                  textAlign: 'right',
                  marginLeft: '1rem'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: prediction.value >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {prediction.value >= 0 ? '+' : ''}{formatCurrency(prediction.value)}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    {prediction.timeframe}
                  </div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Confiance IA
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: getConfidenceColor(prediction.confidence),
                    fontWeight: '600'
                  }}>
                    {prediction.confidence}%
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: getConfidenceColor(prediction.confidence),
                    width: `${prediction.confidence}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Factors */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  margin: '0 0 0.5rem 0'
                }}>
                  Facteurs Clés
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                  {prediction.factors.map((factor, index) => (
                    <li key={index} style={{
                      fontSize: '0.75rem',
                      color: '#d1d5db',
                      marginBottom: '0.25rem'
                    }}>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  margin: '0 0 0.5rem 0'
                }}>
                  Recommandations
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                  {prediction.recommendations.slice(0, 2).map((rec, index) => (
                    <li key={index} style={{
                      fontSize: '0.75rem',
                      color: '#a78bfa',
                      marginBottom: '0.25rem'
                    }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => acknowledgePrediction(prediction.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '0.375rem',
                    color: '#8b5cf6',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Acknowledge
                </button>
                <button style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {alerts.map((alert) => (
            <div key={alert.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${getSeverityColor(alert.severity)}40`,
              borderRadius: '0.75rem',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {!alert.read && (
                <div style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  background: getSeverityColor(alert.severity),
                  borderRadius: '50%',
                  flexShrink: 0
                }} />
              )}

              <div style={{
                width: '3rem',
                height: '3rem',
                background: `${getSeverityColor(alert.severity)}20`,
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                {alert.type === 'budget' && '💰'}
                {alert.type === 'deadline' && '⏰'}
                {alert.type === 'opportunity' && '💡'}
                {alert.type === 'risk' && '⚠️'}
                {alert.type === 'compliance' && '📋'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#fff',
                    margin: 0
                  }}>
                    {alert.title}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: `${getSeverityColor(alert.severity)}20`,
                    color: getSeverityColor(alert.severity),
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#d1d5db',
                  margin: '0 0 1rem 0',
                  lineHeight: 1.4
                }}>
                  {alert.message}
                </p>

                {alert.actionable && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {alert.actions.map((action) => (
                      <button
                        key={action.id}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(59, 130, 246, 0.2)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '0.375rem',
                          color: '#3b82f6',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Source: {alert.source}</span>
                  <span>{alert.timestamp.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => acknowledgeAlert(alert.id)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                {alert.read ? 'Read' : 'Mark as read'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {insights.map((insight) => (
            <div key={insight.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'rgba(139, 92, 246, 0.2)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {insight.category === 'productivity' && '⚡'}
                  {insight.category === 'revenue' && '💰'}
                  {insight.category === 'cost' && '📉'}
                  {insight.category === 'efficiency' && '🚀'}
                  {insight.category === 'trend' && '📈'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#fff',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {insight.title}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    margin: 0
                  }}>
                    {insight.description}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: insight.data.trend === 'up' ? '#10b981' :
                           insight.data.trend === 'down' ? '#ef4444' : '#fff'
                  }}>
                    {insight.data.trend === 'up' && '+'}
                    {insight.data.changePercent > 0 ? '+' : ''}{insight.data.changePercent}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {insight.timeframe}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#fff'
                  }}>
                    {formatCurrency(insight.data.current)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    vs {formatCurrency(insight.data.previous)}
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '0.5rem',
                padding: '1rem'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#a78bfa',
                  margin: '0 0 0.5rem 0'
                }}>
                  Insights Clés
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                  {insight.insights.map((insight, index) => (
                    <li key={index} style={{
                      fontSize: '0.75rem',
                      color: '#d1d5db',
                      marginBottom: '0.25rem'
                    }}>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}