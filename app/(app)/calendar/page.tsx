'use client'

import { useState, useEffect } from 'react'

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'deadline' | 'reminder' | 'call' | 'task';
  status: 'confirmed' | 'tentative' | 'cancelled';
  attendees?: string[];
  location?: string;
  meetingUrl?: string;
  source: 'google' | 'outlook' | 'manual';
  documents?: string[];
  invoices?: string[];
  audioRecordings?: string[];
}

interface CalendarConnection {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple';
  email: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  calendarCount: number;
  color: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [connections, setConnections] = useState<CalendarConnection[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda' | 'today'>('month')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showConnectForm, setShowConnectForm] = useState(false)
  const [stats, setStats] = useState({
    totalEvents: 0,
    todayEvents: 0,
    upcomingMeetings: 0,
    deadlines: 0,
    connectedCalendars: 0
  })

  // Fetch calendar data
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        // Simulate API calls
        setConnections([
          {
            id: '1',
            name: 'Google Calendar',
            type: 'google',
            email: 'john@company.com',
            status: 'connected',
            lastSync: new Date('2024-01-15T10:30:00'),
            calendarCount: 3,
            color: '#4285f4'
          },
          {
            id: '2',
            name: 'Outlook Calendar',
            type: 'outlook',
            email: 'john@company.com',
            status: 'connected',
            lastSync: new Date('2024-01-15T10:25:00'),
            calendarCount: 2,
            color: '#0078d4'
          }
        ])

        setStats({
          totalEvents: 47,
          todayEvents: 4,
          upcomingMeetings: 12,
          deadlines: 3,
          connectedCalendars: 2
        })

        const today = new Date()
        setEvents([
          {
            id: '1',
            title: 'Client Meeting - Q1 Review',
            description: 'Quarterly review with TechCorp to discuss project progress and next steps',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
            type: 'meeting',
            status: 'confirmed',
            attendees: ['john@company.com', 'sarah@techcorp.com', 'mike@techcorp.com'],
            location: 'Zoom',
            meetingUrl: 'https://zoom.us/j/123456789',
            source: 'google',
            documents: ['doc-1', 'doc-2'],
            audioRecordings: ['audio-1']
          },
          {
            id: '2',
            title: 'Invoice #2024-001 Due',
            description: 'Payment due for ABC Consulting services',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 23, 59),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 23, 59),
            type: 'deadline',
            status: 'confirmed',
            source: 'outlook',
            invoices: ['inv-1']
          },
          {
            id: '3',
            title: 'Team Standup',
            description: 'Daily development team standup meeting',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15),
            type: 'meeting',
            status: 'confirmed',
            attendees: ['dev-team@company.com'],
            location: 'Conference Room A',
            source: 'google'
          },
          {
            id: '4',
            title: 'Project Alpha Deadline',
            description: 'Final deliverables due for Project Alpha',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 17, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 17, 0),
            type: 'deadline',
            status: 'confirmed',
            source: 'manual',
            documents: ['doc-3']
          }
        ])
      } catch (error) {
        console.error('Failed to fetch calendar data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCalendarData()
  }, [])

  // Handle calendar connection
  const handleConnectCalendar = async (type: 'google' | 'outlook') => {
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newConnection: CalendarConnection = {
        id: `new-${Date.now()}`,
        name: type === 'google' ? 'Google Calendar' : 'Outlook Calendar',
        type,
        email: 'user@company.com',
        status: 'connected',
        lastSync: new Date(),
        calendarCount: type === 'google' ? 3 : 2,
        color: type === 'google' ? '#4285f4' : '#0078d4'
      }

      setConnections([...connections, newConnection])
      setShowConnectForm(false)
    } catch (error) {
      console.error('Failed to connect calendar:', error)
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get event icon and color
  const getEventStyle = (type: string) => {
    switch (type) {
      case 'meeting': return { background: '#3b82f6', color: '#fff' }
      case 'deadline': return { background: '#ef4444', color: '#fff' }
      case 'reminder': return { background: '#f59e0b', color: '#fff' }
      case 'call': return { background: '#10b981', color: '#fff' }
      case 'task': return { background: '#8b5cf6', color: '#fff' }
      default: return { background: '#6b7280', color: '#fff' }
    }
  }

  // Filter events for selected view
  const getFilteredEvents = () => {
    if (viewMode === 'today') {
      const today = new Date()
      return events.filter(event =>
        event.start.toDateString() === today.toDateString()
      )
    }
    if (viewMode === 'week') {
      const weekStart = new Date(selectedDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      return events.filter(event =>
        event.start >= weekStart && event.start <= weekEnd
      )
    }
    return events
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
            background: 'linear-gradient(135deg, #fff, #ef4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Calendar AI
          </h1>
          <p style={{ color: '#9ca3af' }}>
            Smart calendar integration with AI-powered scheduling
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowConnectForm(true)}
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
            📅
            <span>Connect Calendar</span>
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
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
            ➕
            <span>New Event</span>
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
            <span style={{ fontSize: '1.5rem' }}>📅</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalEvents}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Total Events</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#3b82f6' }}>📆</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.todayEvents}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Today's Events</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#10b981' }}>🤝</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.upcomingMeetings}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Upcoming Meetings</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#ef4444' }}>⏰</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.deadlines}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Deadlines</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#8b5cf6' }}>🔗</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.connectedCalendars}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Connected Calendars</div>
        </div>
      </div>

      {/* View Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['today', 'month', 'week', 'day', 'agenda'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === mode
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                transition: 'all 0.2s'
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => {
              const newDate = new Date(selectedDate)
              newDate.setMonth(newDate.getMonth() - 1)
              setSelectedDate(newDate)
            }}
            style={{
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            ←
          </button>
          <span style={{ fontSize: '1rem', fontWeight: '600', minWidth: '150px', textAlign: 'center' }}>
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => {
              const newDate = new Date(selectedDate)
              newDate.setMonth(newDate.getMonth() + 1)
              setSelectedDate(newDate)
            }}
            style={{
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Connected Calendars */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Connected Calendars
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {connections.map((connection) => (
            <div key={connection.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: connection.color,
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  📅
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    {connection.name}
                  </h4>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                    {connection.email} • {connection.calendarCount} calendars
                  </div>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  background: connection.status === 'connected' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: connection.status === 'connected' ? '#22c55e' : '#ef4444'
                }}>
                  {connection.status}
                </span>
              </div>
              {connection.lastSync && (
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Last sync: {connection.lastSync.toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Upcoming Events
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1rem'
        }}>
          {getFilteredEvents().map((event) => (
            <div key={event.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1.5rem',
              borderLeft: `4px solid ${getEventStyle(event.type).background}`
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  ...getEventStyle(event.type)
                }}>
                  {event.type === 'meeting' && '🤝'}
                  {event.type === 'deadline' && '⏰'}
                  {event.type === 'reminder' && '🔔'}
                  {event.type === 'call' && '📞'}
                  {event.type === 'task' && '✅'}
                </div>
                <div style={{ flex: 1, minWidth: '0' }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '0.25rem'
                  }}>
                    {event.title}
                  </h4>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                    {formatDate(event.start)} • {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                  {event.description && (
                    <p style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                      {event.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '9999px',
                      color: '#9ca3af'
                    }}>
                      {event.source}
                    </span>
                    {event.location && (
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '9999px',
                        color: '#9ca3af'
                      }}>
                        📍 {event.location}
                      </span>
                    )}
                    {event.attendees && (
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '9999px',
                        color: '#9ca3af'
                      }}>
                        👥 {event.attendees.length} attendees
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Linked Content */}
              {(event.documents?.length || event.invoices?.length || event.audioRecordings?.length) && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>🔗 Linked Content:</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {event.documents?.map((doc, i) => (
                      <span key={i} style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6',
                        borderRadius: '0.25rem'
                      }}>
                        📄 Document {i + 1}
                      </span>
                    ))}
                    {event.invoices?.map((inv, i) => (
                      <span key={i} style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(52, 211, 153, 0.2)',
                        color: '#34d399',
                        borderRadius: '0.25rem'
                      }}>
                        💰 Invoice {i + 1}
                      </span>
                    ))}
                    {event.audioRecordings?.map((audio, i) => (
                      <span key={i} style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        borderRadius: '0.25rem'
                      }}>
                        🎙️ Recording {i + 1}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Connect Calendar Modal */}
      {showConnectForm && (
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
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Connect Calendar
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={() => handleConnectCalendar('google')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: '#4285f4',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  📅
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Google Calendar</div>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Connect your Google Calendar account</div>
                </div>
              </button>

              <button
                onClick={() => handleConnectCalendar('outlook')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: '#0078d4',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  📅
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Outlook Calendar</div>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Connect your Outlook Calendar account</div>
                </div>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                onClick={() => setShowConnectForm(false)}
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
    </div>
  )
}