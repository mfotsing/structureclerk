'use client'

import { useState, useEffect } from 'react'

interface UserSettings {
  profile: {
    name: string;
    email: string;
    company: string;
    timezone: string;
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    documentProcessed: boolean;
    invoiceOverdue: boolean;
    meetingReminders: boolean;
    weeklyReports: boolean;
  };
  integrations: {
    gmail: boolean;
    outlook: boolean;
    slack: boolean;
    zoom: boolean;
    dropbox: boolean;
    googleDrive: boolean;
  };
  ai: {
    model: string;
    language: string;
    autoProcessing: boolean;
    smartSuggestions: boolean;
    dataExtraction: boolean;
  };
  billing: {
    plan: string;
    status: string;
    nextBillingDate: Date;
    usage: {
      documents: number;
      documentsLimit: number;
      audio: number;
      audioLimit: number;
      api: number;
      apiLimit: number;
    };
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: 'John Doe',
      email: 'john@company.com',
      company: 'TechCorp LLC',
      timezone: 'America/New_York',
      language: 'en'
    },
    notifications: {
      email: true,
      push: true,
      documentProcessed: true,
      invoiceOverdue: true,
      meetingReminders: true,
      weeklyReports: false
    },
    integrations: {
      gmail: true,
      outlook: false,
      slack: true,
      zoom: true,
      dropbox: false,
      googleDrive: true
    },
    ai: {
      model: 'claude-3.5-sonnet',
      language: 'en',
      autoProcessing: true,
      smartSuggestions: true,
      dataExtraction: true
    },
    billing: {
      plan: 'Pro',
      status: 'Active',
      nextBillingDate: new Date('2024-02-15'),
      usage: {
        documents: 847,
        documentsLimit: 1000,
        audio: 234,
        audioLimit: 500,
        api: 12470,
        apiLimit: 20000
      }
    }
  })

  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'ai', label: 'AI Settings', icon: '🤖' },
    { id: 'billing', label: 'Billing', icon: '💰' }
  ]

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveMessage('Settings saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Failed to save settings')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleIntegration = (integration: string) => {
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [integration]: !prev.integrations[integration as keyof typeof prev.integrations]
      }
    }))
  }

  const handleToggleNotification = (notification: string) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [notification]: !prev.notifications[notification as keyof typeof prev.notifications]
      }
    }))
  }

  const handleInputChange = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage > 90) return '#ef4444'
    if (percentage > 70) return '#f59e0b'
    return '#22c55e'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
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
            background: 'linear-gradient(135deg, #fff, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Settings
          </h1>
          <p style={{ color: '#9ca3af' }}>
            Manage your account settings and preferences
          </p>
        </div>

        {saveMessage && (
          <div style={{
            padding: '0.75rem 1.5rem',
            background: saveMessage.includes('success') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${saveMessage.includes('success') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '0.5rem',
            color: saveMessage.includes('success') ? '#22c55e' : '#ef4444',
            fontSize: '0.875rem'
          }}>
            {saveMessage}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              color: activeTab === tab.id ? '#fff' : '#9ca3af',
              borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '2rem'
      }}>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Profile Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Company
                </label>
                <input
                  type="text"
                  value={settings.profile.company}
                  onChange={(e) => handleInputChange('profile', 'company', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Timezone
                </label>
                <select
                  value={settings.profile.timezone}
                  onChange={(e) => handleInputChange('profile', 'timezone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Notification Preferences
            </h2>

            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0.5rem'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                    Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleNotification(key)}
                  style={{
                    width: '3rem',
                    height: '1.5rem',
                    background: value ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '0.125rem',
                    left: value ? '1.5rem' : '0.125rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    background: '#fff',
                    borderRadius: '50%',
                    transition: 'all 0.2s'
                  }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Connected Integrations
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {Object.entries(settings.integrations).map(([key, value]) => (
                <div key={key} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        {key === 'gmail' && '📧'}
                        {key === 'outlook' && '📨'}
                        {key === 'slack' && '💬'}
                        {key === 'zoom' && '📹'}
                        {key === 'dropbox' && '📦'}
                        {key === 'googleDrive' && '☁️'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600' }}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                          {value ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleIntegration(key)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        background: value ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                        color: value ? '#ef4444' : '#22c55e'
                      }}
                    >
                      {value ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Settings Tab */}
        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              AI Configuration
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  AI Model
                </label>
                <select
                  value={settings.ai.model}
                  onChange={(e) => handleInputChange('ai', 'model', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Default Language
                </label>
                <select
                  value={settings.ai.language}
                  onChange={(e) => handleInputChange('ai', 'language', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>

            {Object.entries(settings.ai).filter(([key]) => !['model', 'language'].includes(key)).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0.5rem'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                    Enable {key.replace(/([A-Z])/g, ' $1').toLowerCase()} functionality
                  </div>
                </div>
                <button
                  onClick={() => handleInputChange('ai', key, !value)}
                  style={{
                    width: '3rem',
                    height: '1.5rem',
                    background: value ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '0.125rem',
                    left: value ? '1.5rem' : '0.125rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    background: '#fff',
                    borderRadius: '50%',
                    transition: 'all 0.2s'
                  }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Billing Information
            </h2>

            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '1rem',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {settings.billing.plan} Plan
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                    Status: {settings.billing.status} • Next billing: {settings.billing.nextBillingDate.toLocaleDateString()}
                  </div>
                </div>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Upgrade Plan
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Usage Overview
            </h3>

            {Object.entries(settings.billing.usage).map(([key, value]) => {
              const limit = settings.billing.usage[`${key}Limit` as keyof typeof settings.billing.usage] as number
              const percentage = getUsagePercentage(value, limit)
              const color = getUsageColor(percentage)

              return (
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem' }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <span style={{ fontSize: '0.875rem', color }}>
                      {value.toLocaleString()} / {limit.toLocaleString()}
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${color}, ${color})`,
                      width: `${percentage}%`,
                      transition: 'all 0.3s'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              color: '#fff',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: isLoading ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isLoading ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}