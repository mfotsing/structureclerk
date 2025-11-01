'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  aiResponse?: {
    confidence: number
    reasoning: Array<{
      step: number
      description: string
      evidence: string[]
      confidence: number
    }>
    actions: string[]
    relatedQueries: string[]
    metadata: {
      model: string
      provider: string
      tokensUsed: number
      processingTime: number
    }
  }
}

interface QuickQuery {
  id: string
  text: string
  icon: string
  category: 'financial' | 'operational' | 'strategic' | 'compliance'
}

interface BusinessContext {
  province: string
  currency: 'CAD' | 'USD'
  industry: string
  companySize: string
}

export default function ConversationalAIReal() {
  const t = useTranslations('ai.chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [businessContext, setBusinessContext] = useState<BusinessContext>({
    province: 'ON',
    currency: 'CAD',
    industry: 'Unknown',
    companySize: 'Unknown'
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickQueries: QuickQuery[] = [
    {
      id: 'revenue-trend',
      text: t('quickQueries.revenueTrend'),
      icon: '📈',
      category: 'financial'
    },
    {
      id: 'unpaid-invoices',
      text: t('quickQueries.unpaidInvoices'),
      icon: '💰',
      category: 'financial'
    },
    {
      id: 'recent-documents',
      text: t('quickQueries.recentDocuments'),
      icon: '📄',
      category: 'operational'
    },
    {
      id: 'meeting-summary',
      text: t('quickQueries.meetingSummary'),
      icon: '🎙️',
      category: 'operational'
    },
    {
      id: 'tax-deadlines',
      text: t('quickQueries.taxDeadlines'),
      icon: '📅',
      category: 'compliance'
    },
    {
      id: 'cost-optimization',
      text: t('quickQueries.costOptimization'),
      icon: '💡',
      category: 'strategic'
    }
  ]

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'system',
      content: t('welcome'),
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [t])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Call real AI API
  const callRealAI = async (message: string): Promise<Message> => {
    try {
      const response = await fetch('/api/ai/chat-secure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: messages.map(msg => ({
            role: msg.type === 'system' ? 'system' : msg.type,
            content: msg.content,
            timestamp: msg.timestamp.toISOString()
          })),
          businessContext
        })
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'AI service error')
      }

      const aiData = data.data

      return {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: aiData.content,
        timestamp: new Date(),
        aiResponse: {
          confidence: aiData.confidence,
          reasoning: aiData.reasoning,
          actions: aiData.actions || [],
          relatedQueries: aiData.relatedQueries || [],
          metadata: aiData.metadata
        }
      }
    } catch (error) {
      console.error('AI API call failed:', error)

      // Fallback response
      return {
        id: `ai-fallback-${Date.now()}`,
        type: 'assistant',
        content: t('fallbackMessage') || "I apologize, but I'm having trouble connecting to my AI services right now. Please try again in a moment.",
        timestamp: new Date(),
        aiResponse: {
          confidence: 50,
          reasoning: [{
            step: 1,
            description: 'Error handling',
            evidence: ['API connection failed'],
            confidence: 50
          }],
          actions: ['Try again later'],
          relatedQueries: ['Check connection'],
          metadata: {
            model: 'fallback',
            provider: 'none',
            tokensUsed: 0,
            processingTime: Date.now()
          }
        }
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const aiResponse = await callRealAI(inputValue)
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }

    // Focus back to input
    inputRef.current?.focus()
  }

  const handleQuickQuery = (query: QuickQuery) => {
    setInputValue(query.text)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('fr-CA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#10b981'
    if (confidence >= 75) return '#3b82f6'
    if (confidence >= 60) return '#f59e0b'
    return '#ef4444'
  }

  if (!isExpanded) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 2000
      }}>
        <button
          onClick={() => {
            setIsExpanded(true)
            setTimeout(() => inputRef.current?.focus(), 100)
          }}
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          💬
        </button>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '32rem',
      height: '42rem',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))',
        borderRadius: '1rem 1rem 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            background: 'rgba(139, 92, 246, 0.2)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem'
          }}>
            🤖
          </div>
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#fff',
              margin: 0
            }}>
              {t('assistant')}
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: '#a78bfa',
              margin: '0.25rem 0 0 0'
            }}>
              🍁 {t('canadianAssistant') || 'Canadian AI Assistant'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            width: '1.5rem',
            height: '1.5rem',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '1rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          −
        </button>
      </div>

      {/* Business Context */}
      <div style={{
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        gap: '1rem',
        fontSize: '0.75rem',
        color: '#9ca3af'
      }}>
        <div>
          📍 {businessContext.province}
        </div>
        <div>
          💱 {businessContext.currency}
        </div>
        <div>
          🏢 {businessContext.industry}
        </div>
      </div>

      {/* Quick Queries */}
      {messages.length <= 1 && (
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            margin: '0 0 0.75rem 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {t('quickQueries.title')}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem'
          }}>
            {quickQueries.map((query) => (
              <button
                key={query.id}
                onClick={() => handleQuickQuery(query)}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.375rem',
                  color: '#d1d5db',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                  e.currentTarget.style.color = '#a78bfa'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.color = '#d1d5db'
                }}
              >
                <span>{query.icon}</span>
                <span style={{
                  fontSize: '0.7rem',
                  lineHeight: 1.2
                }}>
                  {query.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '0.75rem 1rem',
              borderRadius: message.type === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
              background: message.type === 'user'
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                : message.type === 'system'
                ? 'rgba(139, 92, 246, 0.1)'
                : 'rgba(255, 255, 255, 0.05)',
              border: message.type !== 'user' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              color: message.type === 'user' ? '#fff' : '#d1d5db'
            }}>
              <div style={{
                fontSize: '0.875rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {message.content}
              </div>

              {/* AI Response specific content */}
              {message.aiResponse && (
                <div style={{ marginTop: '0.75rem' }}>
                  {/* Confidence Score */}
                  {message.aiResponse.confidence && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.5rem',
                      fontSize: '0.75rem'
                    }}>
                      <span style={{
                        color: '#9ca3af'
                      }}>
                        {t('confidence')}:
                      </span>
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: getConfidenceColor(message.aiResponse.confidence)
                      }}>
                        {message.aiResponse.confidence}%
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  {message.aiResponse.actions && message.aiResponse.actions.length > 0 && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '0.375rem'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#10b981',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        ✅ {t('actions') || 'Actions'}:
                      </div>
                      {message.aiResponse.actions.map((action, idx) => (
                        <div key={idx} style={{
                          fontSize: '0.7rem',
                          color: '#d1d5db',
                          marginLeft: '0.5rem'
                        }}>
                          • {action}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Related Queries */}
                  {message.aiResponse.relatedQueries && message.aiResponse.relatedQueries.length > 0 && (
                    <div style={{
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#9ca3af'
                    }}>
                      {t('relatedQueries') || 'Related queries'}: {message.aiResponse.relatedQueries.join(', ')}
                    </div>
                  )}

                  {/* AI Metadata */}
                  {message.aiResponse.metadata && (
                    <div style={{
                      marginTop: '0.5rem',
                      fontSize: '0.625rem',
                      color: '#6b7280',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{formatTimestamp(message.timestamp)}</span>
                      <span style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '9999px',
                        fontSize: '0.625rem'
                      }}>
                        {message.aiResponse.metadata.provider}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div style={{
                fontSize: '0.625rem',
                color: '#6b7280',
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{formatTimestamp(message.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start'
          }}>
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '1rem 1rem 1rem 0.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                gap: '0.25rem',
                alignItems: 'center'
              }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      borderRadius: '50%',
                      background: '#a78bfa',
                      animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.02)'
      }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('placeholder')}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            style={{
              padding: '0.75rem 1rem',
              background: inputValue.trim() && !isTyping
                ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '0.5rem',
              color: inputValue.trim() && !isTyping ? '#fff' : '#6b7280',
              fontSize: '0.875rem',
              cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {t('send')}
            <span>→</span>
          </button>
        </div>
        <p style={{
          fontSize: '0.625rem',
          color: '#6b7280',
          margin: '0.5rem 0 0 0',
          textAlign: 'center'
        }}>
          🍁 {t('canadianAI') || 'Powered by Canadian AI'} • {t('disclaimer') || 'AI may make errors. Verify important information.'}
        </p>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.5);
          }
        }
      `}</style>
    </div>
  )
}