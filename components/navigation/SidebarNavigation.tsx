'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  color: string
  action: () => void
  shortcut?: string
}

export default function SidebarNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Quick actions based on current page
    const actions: QuickAction[] = [
      {
        id: 'upload-doc',
        title: 'Upload Document',
        description: 'Capture or upload any document',
        icon: '📸',
        color: '#3b82f6',
        action: () => router.push('/documents'),
        shortcut: '⌘+U'
      },
      {
        id: 'create-invoice',
        title: 'New Invoice',
        description: 'Create invoice from document',
        icon: '💰',
        color: '#10b981',
        action: () => router.push('/invoices?action=new'),
        shortcut: '⌘+I'
      },
      {
        id: 'record-audio',
        title: 'Record Meeting',
        description: 'Start audio recording',
        icon: '🎙️',
        color: '#f59e0b',
        action: () => router.push('/audio'),
        shortcut: '⌘+R'
      },
      {
        id: 'ai-chat',
        title: 'AI Assistant',
        description: 'Ask AI anything',
        icon: '🤖',
        color: '#8b5cf6',
        action: () => router.push('/app'),
        shortcut: '⌘+K'
      },
      {
        id: 'search',
        title: 'Global Search',
        description: 'Search everything',
        icon: '🔍',
        color: '#ef4444',
        action: () => {
          const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement
          searchInput?.focus()
        },
        shortcut: '⌘+K'
      }
    ]

    setQuickActions(actions)
  }, [router])

  const navigationItems = [
    { id: 'dashboard', title: 'Dashboard', icon: '📊', path: '/app' },
    { id: 'documents', title: 'Documents', icon: '📁', path: '/documents' },
    { id: 'projects', title: 'Projects', icon: '🏗️', path: '/projects' },
    { id: 'invoices', title: 'Invoices', icon: '💰', path: '/invoices' },
    { id: 'reports', title: 'Reports', icon: '📈', path: '/reports' },
    { id: 'audio', title: 'Audio & Meetings', icon: '🎙️', path: '/audio' },
    { id: 'inbox', title: 'Inbox', icon: '📧', path: '/inbox' },
    { id: 'calendar', title: 'Calendar', icon: '📅', path: '/calendar' },
    { id: 'automations', title: 'Automations', icon: '⚙️', path: '/automations' },
    { id: 'settings', title: 'Settings', icon: '⚙️', path: '/settings' }
  ]

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: isCollapsed ? '4rem' : '20rem',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'width 0.3s ease',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
      className="complex-sidebar"
    >
      {/* Header */}
      <div style={{
        padding: isCollapsed ? '1rem 0.5rem' : '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between'
      }}>
        {!isCollapsed && (
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#fff',
              margin: 0
            }}>
              StructureClerk
            </h2>
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              margin: '0.25rem 0 0 0'
            }}>
              AI Business Assistant
            </p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            padding: '0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.25rem'
          }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#9ca3af',
            margin: '0 0 0.75rem 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Quick Actions
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${action.color}20`
                  e.currentTarget.style.borderColor = action.color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: `${action.color}20`,
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  {action.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.125rem'
                  }}>
                    {action.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af'
                  }}>
                    {action.description}
                  </div>
                </div>
                {action.shortcut && (
                  <div style={{
                    fontSize: '0.625rem',
                    color: '#6b7280',
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem'
                  }}>
                    {action.shortcut}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{
        padding: isCollapsed ? '1rem 0.5rem' : '1rem',
        flex: 1,
        overflowY: 'auto'
      }}>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#9ca3af',
          margin: '0 0 0.75rem 0',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: isCollapsed ? 'none' : 'block'
        }}>
          Navigation
        </h3>
        <nav>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isCollapsed ? '0' : '0.75rem',
                padding: isCollapsed ? '0.75rem 0.5rem' : '0.75rem 1rem',
                marginBottom: '0.25rem',
                background: pathname === item.path
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'transparent',
                border: pathname === item.path
                  ? '1px solid rgba(59, 130, 246, 0.3)'
                  : '1px solid transparent',
                borderRadius: '0.5rem',
                color: pathname === item.path ? '#3b82f6' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                position: 'relative'
              }}
              title={isCollapsed ? item.title : ''}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              {!isCollapsed && (
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: pathname === item.path ? '600' : '400'
                }}>
                  {item.title}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.75rem',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <div>Press ⌘+K for quick search</div>
          <div style={{ marginTop: '0.25rem' }}>v1.0.0</div>
        </div>
      )}
    </div>
  )
}