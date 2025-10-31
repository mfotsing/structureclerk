'use client'

import { useState, useEffect, useRef } from 'react'

interface SearchResult {
  id: string
  type: 'document' | 'email' | 'invoice' | 'audio' | 'automation' | 'calendar'
  title: string
  description: string
  content?: string
  relevance: number
  date: Date
  url: string
  metadata?: {
    [key: string]: any
  }
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setQuery('')
        setResults([])
      }

      // Arrow navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          if (results[selectedIndex]) {
            window.location.href = results[selectedIndex].url
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  // Search functionality
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const searchTimeout = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      // Simulate AI-powered search across all data sources
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'document',
          title: 'Service Agreement - TechCorp LLC',
          description: 'Contract review with AI analysis',
          content: 'This agreement governs the provision of AI consulting services...',
          relevance: 95,
          date: new Date('2024-01-15'),
          url: '/documents/1',
          metadata: { size: '2.4 MB', status: 'processed' }
        },
        {
          id: '2',
          type: 'email',
          title: 'Invoice #2024-001 from ABC Corp',
          description: 'Invoice discussion and payment terms',
          content: 'Your invoice for $5,750 is attached. Payment due in 30 days...',
          relevance: 88,
          date: new Date('2024-01-14'),
          url: '/inbox/2',
          metadata: { sender: 'billing@abc-corp.com', category: 'invoice' }
        },
        {
          id: '3',
          type: 'audio',
          title: 'Client Meeting - Q1 Planning',
          description: '45-minute transcription with action items',
          content: 'Meeting discussed Q1 objectives, budget allocations, and project timeline...',
          relevance: 82,
          date: new Date('2024-01-15'),
          url: '/audio/1',
          metadata: { duration: '45 min', participants: 4 }
        },
        {
          id: '4',
          type: 'invoice',
          title: 'INV-2024-001 - TechCorp LLC',
          description: 'AI consulting services invoice',
          content: 'Invoice for AI consulting services provided in January 2024...',
          relevance: 79,
          date: new Date('2024-01-10'),
          url: '/invoices/1',
          metadata: { amount: '$15,750', status: 'paid' }
        },
        {
          id: '5',
          type: 'automation',
          title: 'Invoice Follow-up Automation',
          description: 'Automatic follow-up emails for overdue invoices',
          content: 'Sends follow-up emails 7, 14, and 21 days after due date...',
          relevance: 75,
          date: new Date('2024-01-05'),
          url: '/automations/1',
          metadata: { active: true, runs: 247 }
        }
      ]

      // Filter results based on query relevance
      const filteredResults = mockResults
        .filter(result =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.content?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => b.relevance - a.relevance)

      setResults(filteredResults)
      setSelectedIndex(0)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'document': return '📄'
      case 'email': return '📧'
      case 'invoice': return '💰'
      case 'audio': return '🎙️'
      case 'automation': return '⚡'
      case 'calendar': return '📅'
      default: return '📁'
    }
  }

  const getResultColor = (type: string) => {
    switch (type) {
      case 'document': return '#3b82f6'
      case 'email': return '#8b5cf6'
      case 'invoice': return '#34d399'
      case 'audio': return '#10b981'
      case 'automation': return '#f59e0b'
      case 'calendar': return '#ef4444'
      default: return '#6b7280'
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.75rem',
          color: '#9ca3af',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <span style={{ fontSize: '1rem' }}>🔍</span>
        <span>Search anything... (⌘K)</span>
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(20px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '20vh'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '600px',
        background: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{ fontSize: '1.25rem', color: '#9ca3af' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, emails, invoices, audio..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          {isLoading && (
            <div style={{
              width: '1rem',
              height: '1rem',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          )}
          <button
            onClick={() => {
              setIsOpen(false)
              setQuery('')
              setResults([])
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Search Results */}
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          {query.length < 2 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#9ca3af'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                AI-Powered Global Search
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                Search across all your documents, emails, invoices, audio recordings, and more.
              </p>
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginTop: '1.5rem',
                fontSize: '0.75rem',
                color: '#6b7280'
              }}>
                <span>📄 Documents</span>
                <span>📧 Emails</span>
                <span>💰 Invoices</span>
                <span>🎙️ Audio</span>
                <span>⚡ Automations</span>
              </div>
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <a
                key={result.id}
                href={result.url}
                style={{
                  display: 'block',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  background: index === selectedIndex ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  borderLeft: `3px solid ${index === selectedIndex ? '#3b82f6' : 'transparent'}`,
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                    color: getResultColor(result.type)
                  }}>
                    {getResultIcon(result.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        margin: 0,
                        color: '#fff'
                      }}>
                        {result.title}
                      </h4>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.125rem 0.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '9999px',
                        color: getResultColor(result.type)
                      }}>
                        {result.type}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#9ca3af',
                      margin: '0 0 0.25rem 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {result.description}
                    </p>
                    {result.content && (
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {result.content}
                      </p>
                    )}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      <span>{result.date.toLocaleDateString()}</span>
                      {result.metadata && Object.entries(result.metadata).slice(0, 2).map(([key, value]) => (
                        <span key={key}>
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    borderRadius: '0.25rem',
                    fontWeight: '600'
                  }}>
                    {result.relevance}% match
                  </div>
                </div>
              </a>
            ))
          ) : !isLoading ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#9ca3af'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                No results found
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                Try different keywords or check your spelling.
              </p>
            </div>
          ) : null}
        </div>

        {/* Search Footer */}
        <div style={{
          padding: '0.75rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.75rem',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span>⌘K</span> to open • <span>↑↓</span> to navigate • <span>↵</span> to select • <span>ESC</span> to close
          </div>
          {query.length >= 2 && (
            <div>
              {results.length} results found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}