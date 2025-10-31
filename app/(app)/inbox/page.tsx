'use client'

import { useState, useEffect } from 'react'

export default function InboxPage() {
  const [emails, setEmails] = useState<any[]>([])
  const [connections, setConnections] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    important: 0,
    invoices: 0,
    contracts: 0,
  })
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  // Fetch inbox data
  useEffect(() => {
    const fetchInboxData = async () => {
      try {
        // Simulate API calls for now
        setConnections([
          { id: 'gmail', name: 'Gmail', status: 'connected' }
        ])
        setStats({
          total: 1247,
          unread: 23,
          important: 8,
          invoices: 15,
          contracts: 5,
        })
        setEmails([
          {
            id: '1',
            subject: 'Invoice #2024-001 from ABC Corp',
            sender: 'billing@abc-corp.com',
            preview: 'Your invoice for $5,750 is attached. Payment due in 30 days.',
            category: 'invoice',
            date: '2024-01-15',
            read: false,
            important: true
          },
          {
            id: '2',
            subject: 'Contract Review - Project Alpha',
            sender: 'legal@tech-company.com',
            preview: 'Please review the attached contract for Project Alpha. We need your signature...',
            category: 'contract',
            date: '2024-01-14',
            read: true,
            important: true
          }
        ])
      } catch (error) {
        console.error('Failed to fetch inbox data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInboxData()
  }, [])

  // Handle email connection
  const handleConnectEmail = async (provider: string) => {
    setIsConnecting(true)
    try {
      // Simulate connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      setConnections([...connections, { id: provider, name: provider.charAt(0).toUpperCase() + provider.slice(1), status: 'connected' }])
    } catch (error) {
      console.error('Failed to connect email:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  // Handle email action
  const handleEmailAction = async (emailId: string, action: string) => {
    try {
      setEmails(emails.map(email =>
        email.id === emailId
          ? { ...email, status: action === 'archive' ? 'archived' : action === 'delete' ? 'deleted' : email.status }
          : email
      ))
    } catch (error) {
      console.error('Failed to perform email action:', error)
    }
  }

  // Filter emails
  const filteredEmails = emails.filter(email => {
    const matchesFilter = filter === 'all' || email.category === filter
    const matchesSearch = searchQuery === '' ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const emailProviders = [
    { id: 'gmail', name: 'Gmail', icon: '📧', description: 'Connect your Gmail account' },
    { id: 'outlook', name: 'Outlook', icon: '📨', description: 'Connect your Outlook/Office 365 account' },
    { id: 'yahoo', name: 'Yahoo Mail', icon: '📭', description: 'Connect your Yahoo Mail account' },
    { id: 'icloud', name: 'iCloud Mail', icon: '☁️', description: 'Connect your iCloud Mail account' },
    { id: 'proton', name: 'ProtonMail', icon: '🔒', description: 'Connect your ProtonMail account' },
    { id: 'imap', name: 'Custom IMAP', icon: '⚙️', description: 'Connect any IMAP email server' },
  ]

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
            background: 'linear-gradient(135deg, #fff, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Smart Inbox AI
          </h1>
          <p style={{ color: '#9ca3af' }}>
            AI-powered email processing for invoices, contracts, and important communications
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{
            padding: '0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem'
          }}>
            ⚙️
          </div>
          <button style={{
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
          }}>
            ➕
            <span>Connect Email</span>
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
            <span style={{ fontSize: '1.5rem' }}>📧</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Total Emails</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#fbbf24' }}>⚠️</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.unread}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Unread</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#a78bfa' }}>⭐</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.important}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Important</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#34d399' }}>💰</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.invoices}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Invoices</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#fb923c' }}>📄</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.contracts}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Contracts</div>
        </div>
      </div>

      {/* No Email Connections */}
      {connections.length === 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1.5rem',
          padding: '3rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2rem'
          }}>
            📥
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Connect Your Email Accounts
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            Securely connect your email accounts to let AI detect invoices, contracts, and important business communications automatically.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {emailProviders.map((provider, index) => (
              <button
                key={provider.id}
                onClick={() => handleConnectEmail(provider.id)}
                disabled={isConnecting}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: isConnecting ? 0.5 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontSize: '2rem' }}>{provider.icon}</div>
                <h3 style={{ fontWeight: '600' }}>{provider.name}</h3>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{provider.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      {connections.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1rem', color: '#9ca3af' }}>🔍</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'invoice', 'contract', 'important', 'unread'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    background: filter === filterOption
                      ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1rem',
              color: '#9ca3af'
            }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails..."
              style={{
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '0.875rem',
                width: '100%',
                outline: 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* Email List */}
      {connections.length > 0 && filteredEmails.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredEmails.map((email, index) => (
            <div
              key={email.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: selectedEmail?.id === email.id ? 0.8 : 1,
                borderLeft: email.important ? '4px solid #a78bfa' : '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => setSelectedEmail(email)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '0.25rem',
                    color: email.read ? '#9ca3af' : '#fff'
                  }}>
                    {email.subject}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                    From: {email.sender}
                  </div>
                  <p style={{ color: '#d1d5db', lineHeight: 1.5 }}>
                    {email.preview}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.25rem'
                  }}>
                    {email.date}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    background: email.category === 'invoice' ? 'rgba(52, 211, 153, 0.2)' :
                               email.category === 'contract' ? 'rgba(251, 146, 60, 0.2)' :
                               email.important ? 'rgba(167, 139, 250, 0.2)' :
                               'rgba(156, 163, 175, 0.2)',
                    color: email.category === 'invoice' ? '#34d399' :
                          email.category === 'contract' ? '#fb923c' :
                          email.important ? '#a78bfa' :
                          '#9ca3af'
                  }}>
                    {email.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : connections.length > 0 ? (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1.5rem',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            No emails found
          </h3>
          <p style={{ color: '#9ca3af' }}>
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : 'Your inbox is empty or emails are still being processed.'
            }
          </p>
        </div>
      ) : null}
    </div>
  )
}