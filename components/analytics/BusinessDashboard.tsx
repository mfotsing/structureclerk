'use client'

import { useState, useEffect } from 'react'

interface BusinessMetrics {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  documentsProcessed: number
  invoicesPaid: number
  invoicesOutstanding: number
  meetingsTranscribed: number
  hoursSaved: number
  accuracyRate: number
  clientCount: number
  projectCount: number
}

interface MetricCard {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  icon: string
  color: string
  size: 'small' | 'large'
}

export default function BusinessDashboard() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading business metrics
    const loadMetrics = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))

      const mockMetrics: BusinessMetrics = {
        totalRevenue: 124750,
        totalExpenses: 45320,
        netProfit: 79430,
        documentsProcessed: 1847,
        invoicesPaid: 47,
        invoicesOutstanding: 12,
        meetingsTranscribed: 89,
        hoursSaved: 156,
        accuracyRate: 94.7,
        clientCount: 23,
        projectCount: 8
      }

      setMetrics(mockMetrics)
      setIsLoading(false)
    }

    loadMetrics()
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-CA').format(num)
  }

  const metricCards: MetricCard[] = metrics ? [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      subtitle: `${metrics.invoicesPaid} invoices paid`,
      trend: { value: 12.5, direction: 'up' },
      icon: '💰',
      color: '#10b981',
      size: 'large'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(metrics.netProfit),
      subtitle: `${((metrics.netProfit / metrics.totalRevenue) * 100).toFixed(1)}% margin`,
      trend: { value: 8.3, direction: 'up' },
      icon: '📈',
      color: '#3b82f6',
      size: 'large'
    },
    {
      title: 'Hours Saved',
      value: metrics.hoursSaved,
      subtitle: 'This month',
      trend: { value: 24.1, direction: 'up' },
      icon: '⏰',
      color: '#8b5cf6',
      size: 'small'
    },
    {
      title: 'Documents Processed',
      value: formatNumber(metrics.documentsProcessed),
      subtitle: `${metrics.accuracyRate}% accuracy`,
      trend: { value: 5.7, direction: 'up' },
      icon: '📄',
      color: '#f59e0b',
      size: 'small'
    },
    {
      title: 'Active Clients',
      value: metrics.clientCount,
      subtitle: `${metrics.projectCount} active projects`,
      trend: { value: 3, direction: 'up' },
      icon: '👥',
      color: '#ef4444',
      size: 'small'
    },
    {
      title: 'Meetings Transcribed',
      value: metrics.meetingsTranscribed,
      subtitle: 'This month',
      trend: { value: 15.2, direction: 'up' },
      icon: '🎙️',
      color: '#06b6d4',
      size: 'small'
    }
  ] : []

  if (isLoading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        padding: '2rem'
      }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            padding: '1.5rem',
            height: '200px'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          </div>
        ))}
      </div>
    )
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
            Business Dashboard
          </h1>
          <p style={{
            color: '#9ca3af',
            margin: 0
          }}>
            Real-time metrics and AI-powered business insights
          </p>
        </div>

        {/* Time Range Selector */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.25rem',
          borderRadius: '0.5rem'
        }}>
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: '1y', label: '1 Year' }
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              style={{
                padding: '0.5rem 1rem',
                background: timeRange === range.value
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                color: timeRange === range.value ? '#3b82f6' : '#9ca3af',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: timeRange === range.value ? '600' : '400'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {metricCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: card.size === 'large' ? '2rem' : '1.5rem',
              gridColumn: card.size === 'large' ? 'span 2' : 'span 1',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background gradient */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '10rem',
              height: '10rem',
              background: `radial-gradient(circle, ${card.color}20 0%, transparent 70%)`,
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    margin: '0 0 0.5rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {card.title}
                  </p>
                  <p style={{
                    fontSize: card.size === 'large' ? '2.5rem' : '2rem',
                    fontWeight: '700',
                    color: '#fff',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {card.value}
                  </p>
                  {card.subtitle && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {card.subtitle}
                    </p>
                  )}
                </div>

                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: `${card.color}20`,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {card.icon}
                </div>
              </div>

              {card.trend && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span style={{
                    color: card.trend.direction === 'up' ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {card.trend.direction === 'up' ? '↑' : '↓'} {Math.abs(card.trend.value)}%
                  </span>
                  <span style={{ color: '#6b7280' }}>
                    vs last period
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights Section */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#fff',
          margin: '0 0 1rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🤖 AI Business Insights
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {[
            {
              title: 'Revenue Growth',
              insight: 'Your revenue increased 15% this month, driven by 3 new clients.',
              action: 'Focus on upselling to existing clients'
            },
            {
              title: 'Expense Alert',
              insight: 'Software subscriptions increased 23% - review SaaS tools.',
              action: 'Audit and optimize recurring expenses'
            },
            {
              title: 'Productivity Win',
              insight: 'AI saved you 156 hours this month - equivalent to 4 full work weeks.',
              action: 'Invest time saved in business development'
            },
            {
              title: 'Cash Flow',
              insight: '12 invoices outstanding worth $24,750 - follow up recommended.',
              action: 'Automate payment reminders'
            }
          ].map((insight, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.75rem',
              padding: '1rem'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#a78bfa',
                margin: '0 0 0.5rem 0'
              }}>
                {insight.title}
              </h4>
              <p style={{
                fontSize: '0.875rem',
                color: '#d1d5db',
                margin: '0 0 0.75rem 0',
                lineHeight: 1.5
              }}>
                {insight.insight}
              </p>
              <div style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                fontStyle: 'italic'
              }}>
                💡 {insight.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        <button style={{
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          border: 'none',
          borderRadius: '0.5rem',
          color: '#fff',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          📊 Export Detailed Report
        </button>
        <button style={{
          padding: '0.75rem 1.5rem',
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.5rem',
          color: '#fff',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          ⚙️ Customize Dashboard
        </button>
      </div>
    </div>
  )
}