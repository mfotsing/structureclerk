'use client'

import { useState, useEffect } from 'react'

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  runsCount: number;
  successRate: number;
  settings: any;
}

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  trigger: string;
  action: string;
  popular: boolean;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [templates, setTemplates] = useState<AutomationTemplate[]>([])
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [stats, setStats] = useState({
    active: 0,
    total: 0,
    runsToday: 0,
    successRate: 0
  })

  // Fetch automations data
  useEffect(() => {
    const fetchAutomationsData = async () => {
      try {
        // Simulate API calls
        setStats({
          active: 12,
          total: 18,
          runsToday: 156,
          successRate: 97.5
        })

        setAutomations([
          {
            id: '1',
            name: 'Invoice Follow-up',
            description: 'Send automatic follow-up emails for overdue invoices',
            trigger: 'Invoice becomes overdue',
            action: 'Send follow-up email',
            isActive: true,
            lastRun: new Date('2024-01-15T08:00:00'),
            nextRun: new Date('2024-01-16T08:00:00'),
            runsCount: 247,
            successRate: 98.4,
            settings: {
              followUpDays: [7, 14, 21],
              template: 'invoice-followup',
              ccManager: true
            }
          },
          {
            id: '2',
            name: 'Document Processing',
            description: 'Automatically process and categorize new documents',
            trigger: 'New document uploaded',
            action: 'Extract data and categorize',
            isActive: true,
            lastRun: new Date('2024-01-15T10:30:00'),
            runsCount: 1247,
            successRate: 99.2,
            settings: {
              autoTag: true,
              extractFields: ['amount', 'date', 'client'],
              notifications: true
            }
          },
          {
            id: '3',
            name: 'Meeting Notes Summary',
            description: 'Generate summaries and action items from meeting recordings',
            trigger: 'New audio recording',
            action: 'Transcribe and summarize',
            isActive: true,
            lastRun: new Date('2024-01-15T14:15:00'),
            runsCount: 89,
            successRate: 96.6,
            settings: {
              language: 'en',
              extractActionItems: true,
              sendToTeam: true
            }
          },
          {
            id: '4',
            name: 'Email Invoice Detection',
            description: 'Detect and extract invoice information from emails',
            trigger: 'New email received',
            action: 'Extract invoice data',
            isActive: false,
            runsCount: 0,
            successRate: 0,
            settings: {
              keywords: ['invoice', 'bill', 'payment'],
              autoCreate: false,
              notifications: true
            }
          },
          {
            id: '5',
            name: 'Weekly Reports',
            description: 'Generate and send weekly productivity reports',
            trigger: 'Every Friday at 5 PM',
            action: 'Generate and email report',
            isActive: true,
            lastRun: new Date('2024-01-12T17:00:00'),
            nextRun: new Date('2024-01-19T17:00:00'),
            runsCount: 24,
            successRate: 100,
            settings: {
              recipients: ['manager@company.com'],
              metrics: ['documents', 'invoices', 'meetings'],
              format: 'pdf'
            }
          }
        ])

        setTemplates([
          {
            id: '1',
            name: 'Invoice Follow-up',
            description: 'Automatically follow up on unpaid invoices',
            category: 'Finance',
            icon: '💰',
            trigger: 'Invoice status changes',
            action: 'Send email reminders',
            popular: true
          },
          {
            id: '2',
            name: 'Welcome Email',
            description: 'Send welcome emails to new clients',
            category: 'Communication',
            icon: '📧',
            trigger: 'New client added',
            action: 'Send welcome sequence',
            popular: true
          },
          {
            id: '3',
            name: 'Document Backup',
            description: 'Backup important documents to cloud storage',
            category: 'Data Management',
            icon: '☁️',
            trigger: 'New document uploaded',
            action: 'Upload to cloud storage',
            popular: false
          },
          {
            id: '4',
            name: 'Meeting Preparation',
            description: 'Prepare agenda and documents for meetings',
            category: 'Productivity',
            icon: '📅',
            trigger: 'Meeting scheduled',
            action: 'Generate meeting prep',
            popular: true
          },
          {
            id: '5',
            name: 'Contract Renewal',
            description: 'Notify about upcoming contract renewals',
            category: 'Legal',
            icon: '📄',
            trigger: 'Contract expiry date',
            action: 'Send renewal reminder',
            popular: false
          },
          {
            id: '6',
            name: 'Social Media Posts',
            description: 'Share achievements and updates',
            category: 'Marketing',
            icon: '📱',
            trigger: 'New milestone',
            action: 'Post to social media',
            popular: false
          }
        ])
      } catch (error) {
        console.error('Failed to fetch automations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAutomationsData()
  }, [])

  // Handle automation toggle
  const handleToggleAutomation = async (automationId: string) => {
    setAutomations(automations.map(automation =>
      automation.id === automationId
        ? { ...automation, isActive: !automation.isActive }
        : automation
    ))
  }

  // Handle creating automation
  const handleCreateAutomation = async (template: AutomationTemplate) => {
    setIsCreating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newAutomation: Automation = {
        id: `new-${Date.now()}`,
        name: template.name,
        description: template.description,
        trigger: template.trigger,
        action: template.action,
        isActive: false,
        runsCount: 0,
        successRate: 0,
        settings: {}
      }

      setAutomations([...automations, newAutomation])
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create automation:', error)
    } finally {
      setIsCreating(false)
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Finance': return { background: 'rgba(52, 211, 153, 0.2)', color: '#34d399' };
      case 'Communication': return { background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' };
      case 'Data Management': return { background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa' };
      case 'Productivity': return { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
      case 'Legal': return { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
      case 'Marketing': return { background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' };
      default: return { background: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' };
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            height: '2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            width: '33%'
          }} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem'
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                padding: '1.5rem'
              }}>
                <div style={{
                  height: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.25rem',
                  width: '66%',
                  marginBottom: '1rem'
                }} />
                <div style={{
                  height: '2rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.25rem',
                  width: '50%'
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #fff, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Automation AI
          </h1>
          <p style={{ color: '#9ca3af' }}>
            AI-powered workflows and intelligent automation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              color: '#fff',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ⚡
            <span>Create Automation</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Total Automations</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#22c55e' }}>🟢</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.active}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Active</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#3b82f6' }}>🔄</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.runsToday}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Runs Today</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#34d399' }}>✅</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.successRate}%</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Success Rate</div>
        </div>
      </div>

      {/* Create Automation Modal */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Choose Automation Template
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleCreateAutomation(template)}
                  disabled={isCreating}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    opacity: isCreating ? 0.5 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {template.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {template.name}
                      </h3>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        ...getCategoryColor(template.category)
                      }}>
                        {template.category}
                      </span>
                      {template.popular && (
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#f59e0b',
                          marginLeft: '0.5rem'
                        }}>
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
                    {template.description}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    <div><strong>Trigger:</strong> {template.trigger}</div>
                    <div><strong>Action:</strong> {template.action}</div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Automations */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🤖 Active Automations
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
          gap: '1rem'
        }}>
          {automations.map((automation) => (
            <div
              key={automation.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '1.5rem',
                borderLeft: automation.isActive ? '4px solid #22c55e' : '4px solid #6b7280'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '0.25rem'
                  }}>
                    {automation.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                    {automation.description}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleAutomation(automation.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    background: automation.isActive
                      ? 'rgba(34, 197, 94, 0.2)'
                      : 'rgba(107, 114, 128, 0.2)',
                    color: automation.isActive ? '#22c55e' : '#6b7280',
                    transition: 'all 0.2s'
                  }}
                >
                  {automation.isActive ? '🟢 Active' : '⏸️ Paused'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Trigger</div>
                  <div>{automation.trigger}</div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Action</div>
                  <div>{automation.action}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Runs</div>
                  <div>{automation.runsCount}</div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Success Rate</div>
                  <div>{automation.successRate}%</div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Last Run</div>
                  <div>{automation.lastRun ? automation.lastRun.toLocaleDateString() : 'Never'}</div>
                </div>
              </div>

              {automation.nextRun && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#3b82f6'
                }}>
                  ⏰ Next run: {automation.nextRun.toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}