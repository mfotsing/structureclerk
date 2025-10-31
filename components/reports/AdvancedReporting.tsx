'use client'

import { useState, useEffect } from 'react'

interface ReportConfig {
  id: string
  name: string
  type: 'financial' | 'project' | 'client' | 'tax' | 'productivity'
  dateRange: {
    start: Date
    end: Date
  }
  filters: {
    clients?: string[]
    projects?: string[]
    documentTypes?: string[]
    status?: string[]
  }
  format: 'pdf' | 'excel' | 'csv'
  includeCharts: boolean
  includeDetails: boolean
}

interface ClientReport {
  clientId: string
  clientName: string
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  projectsCount: number
  documentsProcessed: number
  hoursBilled: number
  averageProjectValue: number
  topServices: Array<{
    service: string
    revenue: number
    count: number
  }>
  monthlyTrend: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
  }>
}

interface ProjectReport {
  projectId: string
  projectName: string
  clientName: string
  budget: number
  actualCost: number
  revenue: number
  profit: number
  status: string
  startDate: Date
  endDate?: Date
  teamSize: number
  milestones: Array<{
    name: string
    completed: boolean
    dueDate: Date
  }>
  expenses: Array<{
    category: string
    amount: number
    date: Date
    description: string
  }>
}

interface TaxReport {
  year: number
  quarter?: number
  totalRevenue: number
  totalExpenses: number
  hstCollected: number
  hstPaid: number
  qstCollected: number
  qstPaid: number
  netHstPayable: number
  netQstPayable: number
  deductibleExpenses: Array<{
    category: string
    amount: number
    description: string
  }>
  gstHstCredits: number
  incomeTaxPayable: number
}

export default function AdvancedReporting() {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate')
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    id: '',
    name: '',
    type: 'financial',
    dateRange: {
      start: new Date(new Date().getFullYear(), 0, 1),
      end: new Date()
    },
    filters: {},
    format: 'pdf',
    includeCharts: true,
    includeDetails: true
  })

  const [generatedReports, setGeneratedReports] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)

  const reportTemplates = [
    {
      id: 'tax-qc-quarterly',
      name: 'Rapport TPS/TVQ Trimestriel (Québec)',
      description: 'Rapport complet pour Revenu Québec avec TPS/TVQ',
      type: 'tax' as const,
      icon: '📊',
      color: '#ef4444'
    },
    {
      id: 'client-performance',
      name: 'Rapport Performance Client',
      description: 'Analyse détaillée par client avec rentabilité',
      type: 'client' as const,
      icon: '👥',
      color: '#3b82f6'
    },
    {
      id: 'project-profitability',
      name: 'Rapport Rentabilité Projets',
      description: 'Analyse des coûts et bénéfices par projet',
      type: 'project' as const,
      icon: '🏗️',
      color: '#10b981'
    },
    {
      id: 'financial-summary',
      name: 'Rapport Financier Annuel',
      description: 'Vue d\'ensemble financière complète',
      type: 'financial' as const,
      icon: '💰',
      color: '#f59e0b'
    },
    {
      id: 'productivity-analysis',
      name: 'Analyse Productivité IA',
      description: 'Rapport sur les gains de productivité avec l\'IA',
      type: 'productivity' as const,
      icon: '🤖',
      color: '#8b5cf6'
    }
  ]

  useEffect(() => {
    // Load mock report data
    const mockReports = [
      {
        id: '1',
        name: 'Rapport TPS/TVQ Q3 2024',
        type: 'tax',
        generatedAt: new Date('2024-10-15'),
        fileSize: '2.4 MB',
        downloadCount: 5
      },
      {
        id: '2',
        name: 'Performance Client ABC Corp',
        type: 'client',
        generatedAt: new Date('2024-10-10'),
        fileSize: '1.8 MB',
        downloadCount: 3
      }
    ]

    setGeneratedReports(mockReports)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount)
  }

  const generateReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockPreviewData = {
      clientReport: {
        totalRevenue: 125750,
        totalExpenses: 32450,
        netProfit: 93300,
        projectsCount: 8,
        documentsProcessed: 247,
        topServices: [
          { service: 'Consulting Marketing', revenue: 67800, count: 4 },
          { service: 'Strategy Digital', revenue: 42950, count: 3 },
          { service: 'Analytics', revenue: 15000, count: 1 }
        ]
      },
      taxReport: {
        totalRevenue: 125750,
        totalExpenses: 32450,
        hstCollected: 16347.50,
        hstPaid: 2271.50,
        qstCollected: 9979.25,
        qstPaid: 1386.25,
        netHstPayable: 14076.00,
        netQstPayable: 8593.00,
        deductibleExpenses: [
          { category: 'Software & Tools', amount: 3450, description: 'Adobe Creative Cloud, Microsoft 365' },
          { category: 'Home Office', amount: 2800, description: 'Portion domicile utilisée pour affaires' },
          { category: 'Marketing', amount: 1200, description: 'Publicité et promotion' }
        ]
      }
    }

    setPreviewData(mockPreviewData)
    setIsGenerating(false)

    // Add to generated reports
    const newReport = {
      id: Date.now().toString(),
      name: reportConfig.name || `${reportConfig.type.charAt(0).toUpperCase() + reportConfig.type.slice(1)} Report`,
      type: reportConfig.type,
      generatedAt: new Date(),
      fileSize: '1.2 MB',
      downloadCount: 0
    }

    setGeneratedReports(prev => [newReport, ...prev])
  }

  const downloadReport = (reportId: string, format: string) => {
    // Simulate download
    console.log(`Downloading report ${reportId} in ${format} format`)
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
            📊 Rapports Avancés
          </h1>
          <p style={{
            color: '#9ca3af',
            margin: 0
          }}>
            Générez des rapports détaillés pour vos clients, projets et impôts
          </p>
        </div>

        <button style={{
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          border: 'none',
          borderRadius: '0.5rem',
          color: '#fff',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📤 Exporter Tout
        </button>
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
          { id: 'generate', label: 'Générer Rapport', count: null },
          { id: 'templates', label: 'Modèles', count: reportTemplates.length },
          { id: 'history', label: 'Historique', count: generatedReports.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab.id
                ? 'rgba(59, 130, 246, 0.2)'
                : 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              color: activeTab === tab.id ? '#3b82f6' : '#9ca3af',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.id ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {tab.label}
            {tab.count !== null && (
              <span style={{
                background: activeTab === tab.id ? '#3b82f6' : 'rgba(156, 163, 175, 0.3)',
                color: activeTab === tab.id ? '#fff' : '#9ca3af',
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

      {/* Generate Report Tab */}
      {activeTab === 'generate' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '2rem'
        }}>
          {/* Configuration Panel */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#fff',
              margin: '0 0 1.5rem 0'
            }}>
              Configuration du Rapport
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Report Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '0.5rem'
                }}>
                  Nom du Rapport
                </label>
                <input
                  type="text"
                  value={reportConfig.name}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Rapport Q3 2024"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              {/* Report Type */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '0.5rem'
                }}>
                  Type de Rapport
                </label>
                <select
                  value={reportConfig.type}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, type: e.target.value as any }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="financial">Financier</option>
                  <option value="client">Client</option>
                  <option value="project">Projet</option>
                  <option value="tax">Fiscal (TPS/TVQ)</option>
                  <option value="productivity">Productivité</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '0.5rem'
                }}>
                  Période
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="date"
                    value={reportConfig.dateRange.start.toISOString().split('T')[0]}
                    onChange={(e) => setReportConfig(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: new Date(e.target.value) }
                    }))}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      fontSize: '0.875rem'
                    }}
                  />
                  <input
                    type="date"
                    value={reportConfig.dateRange.end.toISOString().split('T')[0]}
                    onChange={(e) => setReportConfig(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: new Date(e.target.value) }
                    }))}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              {/* Format */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '0.5rem'
                }}>
                  Format d'Export
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['pdf', 'excel', 'csv'].map((format) => (
                    <button
                      key={format}
                      onClick={() => setReportConfig(prev => ({ ...prev, format: format as any }))}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: reportConfig.format === format
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                        border: reportConfig.format === format
                          ? '1px solid #3b82f6'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.5rem',
                        color: reportConfig.format === format ? '#3b82f6' : '#fff',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '1rem'
                }}>
                  Options
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={reportConfig.includeCharts}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                      style={{ width: '1.25rem', height: '1.25rem' }}
                    />
                    <span style={{ color: '#fff', fontSize: '0.875rem' }}>
                      Inclure graphiques et visuels
                    </span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={reportConfig.includeDetails}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, includeDetails: e.target.checked }))}
                      style={{ width: '1.25rem', height: '1.25rem' }}
                    />
                    <span style={{ color: '#fff', fontSize: '0.875rem' }}>
                      Inclure détails complets
                    </span>
                  </label>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateReport}
                disabled={isGenerating}
                style={{
                  padding: '1rem',
                  background: isGenerating
                    ? 'rgba(156, 163, 175, 0.2)'
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isGenerating ? (
                  <>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid #fff',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    📊 Générer le Rapport
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div>
            {isGenerating ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '3rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  border: '3px solid rgba(59, 130, 246, 0.3)',
                  borderTopColor: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1.5rem'
                }} />
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#fff',
                  margin: '0 0 0.5rem 0'
                }}>
                  Génération du Rapport
                </h3>
                <p style={{ color: '#9ca3af', margin: 0 }}>
                  Analyse des données et création des visuels...
                </p>
              </div>
            ) : previewData ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#fff',
                  margin: '0 0 1.5rem 0'
                }}>
                  Aperçu du Rapport
                </h3>

                {reportConfig.type === 'tax' && previewData.taxReport && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Tax Summary */}
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '0.75rem',
                      padding: '1.5rem'
                    }}>
                      <h4 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#ef4444',
                        margin: '0 0 1rem 0'
                      }}>
                        📊 Résumé TPS/TVQ
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginBottom: '0.25rem' }}>
                            Revenus Totaux
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>
                            {formatCurrency(previewData.taxReport.totalRevenue)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginBottom: '0.25rem' }}>
                            Dépenses Totales
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>
                            {formatCurrency(previewData.taxReport.totalExpenses)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginBottom: '0.25rem' }}>
                            TPS à Payer
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fbbf24' }}>
                            {formatCurrency(previewData.taxReport.netHstPayable)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginBottom: '0.25rem' }}>
                            TVQ à Payer
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fbbf24' }}>
                            {formatCurrency(previewData.taxReport.netQstPayable)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deductible Expenses */}
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#fff',
                        margin: '0 0 1rem 0'
                      }}>
                        Dépenses Déductibles
                      </h4>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '0.5rem',
                        overflow: 'hidden'
                      }}>
                        {previewData.taxReport.deductibleExpenses.map((expense: any, index: number) => (
                          <div key={index} style={{
                            padding: '1rem',
                            borderBottom: index < previewData.taxReport.deductibleExpenses.length - 1
                              ? '1px solid rgba(255, 255, 255, 0.1)'
                              : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ fontWeight: '600', color: '#fff', marginBottom: '0.25rem' }}>
                                {expense.category}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                {expense.description}
                              </div>
                            </div>
                            <div style={{
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#10b981'
                            }}>
                              {formatCurrency(expense.amount)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => downloadReport('preview', reportConfig.format)}
                      style={{
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      📥 Télécharger le Rapport Complet
                    </button>
                  </div>
                )}

                {reportConfig.type === 'client' && previewData.clientReport && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Client Summary */}
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '0.75rem',
                      padding: '1.5rem'
                    }}>
                      <h4 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#3b82f6',
                        margin: '0 0 1rem 0'
                      }}>
                        👥 Performance Client
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#93c5fd', marginBottom: '0.25rem' }}>
                            Revenus Totaux
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>
                            {formatCurrency(previewData.clientReport.totalRevenue)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#93c5fd', marginBottom: '0.25rem' }}>
                            Profit Net
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
                            {formatCurrency(previewData.clientReport.netProfit)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#93c5fd', marginBottom: '0.25rem' }}>
                            Projets
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>
                            {previewData.clientReport.projectsCount}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Services */}
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#fff',
                        margin: '0 0 1rem 0'
                      }}>
                        Services Principaux
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {previewData.clientReport.topServices.map((service: any, index: number) => (
                          <div key={index} style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ fontWeight: '600', color: '#fff', marginBottom: '0.25rem' }}>
                                {service.service}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                {service.count} projets
                              </div>
                            </div>
                            <div style={{
                              fontSize: '1.125rem',
                              fontWeight: '700',
                              color: '#10b981'
                            }}>
                              {formatCurrency(service.revenue)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '3rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '2rem'
                }}>
                  📊
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#fff',
                  margin: '0 0 0.5rem 0'
                }}>
                  Aperçu du Rapport
                </h3>
                <p style={{ color: '#9ca3af', margin: 0 }}>
                  Configurez et générez un rapport pour voir l'aperçu ici
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {reportTemplates.map((template) => (
              <div key={template.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => {
                setReportConfig(prev => ({
                  ...prev,
                  type: template.type,
                  name: template.name
                }))
                setActiveTab('generate')
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
                    background: `${template.color}20`,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {template.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#fff',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {template.name}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#9ca3af',
                      margin: 0
                    }}>
                      {template.description}
                    </p>
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#3b82f6',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Utiliser ce modèle
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#fff',
                margin: 0
              }}>
                Rapports Générés
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Nom</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Type</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Généré le</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Taille</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Téléchargements</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedReports.map((report) => (
                    <tr key={report.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '600', color: '#fff' }}>{report.name}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#3b82f6',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {report.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#d1d5db' }}>
                        {report.generatedAt.toLocaleDateString('fr-CA')}
                      </td>
                      <td style={{ padding: '1rem', color: '#d1d5db' }}>
                        {report.fileSize}
                      </td>
                      <td style={{ padding: '1rem', color: '#d1d5db' }}>
                        {report.downloadCount}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => downloadReport(report.id, 'pdf')}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: 'rgba(59, 130, 246, 0.2)',
                              border: 'none',
                              borderRadius: '0.375rem',
                              color: '#3b82f6',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Télécharger
                          </button>
                          <button style={{
                            padding: '0.375rem 0.75rem',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '0.375rem',
                            color: '#fff',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}>
                            Partager
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}