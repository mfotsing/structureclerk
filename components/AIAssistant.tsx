'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: string;
    icon: string;
  }>;
}

interface SuggestionChip {
  label: string;
  icon: string;
  action: string;
  category: 'search' | 'create' | 'analyze' | 'schedule' | 'help';
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hi! I\'m your AI assistant. I can help you search documents, create invoices, schedule meetings, analyze data, and much more. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'Search for recent invoices',
        'Create a new document',
        'Schedule a meeting',
        'Analyze my usage stats'
      ],
      actions: [
        { label: '📄 Upload Document', action: 'upload-document', icon: '📄' },
        { label: '💰 Create Invoice', action: 'create-invoice', icon: '💰' },
        { label: '📅 Schedule Meeting', action: 'schedule-meeting', icon: '📅' },
        { label: '🔍 Global Search', action: 'global-search', icon: '🔍' }
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickSuggestions: SuggestionChip[] = [
    { label: 'Find recent invoices', icon: '💰', action: 'find-invoices', category: 'search' },
    { label: 'Upload document', icon: '📄', action: 'upload-doc', category: 'create' },
    { label: 'Create invoice', icon: '💰', action: 'create-invoice', category: 'create' },
    { label: 'Schedule meeting', icon: '📅', action: 'schedule-meeting', category: 'schedule' },
    { label: 'Analyze data', icon: '📊', action: 'analyze-data', category: 'analyze' },
    { label: 'Help & tutorials', icon: '❓', action: 'help', category: 'help' }
  ]

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()

    // Invoice related queries
    if (lowerMessage.includes('invoice') || lowerMessage.includes('bill')) {
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'I found 156 invoices in your system. Here are the recent ones:\n\n💰 **INV-2024-001** - TechCorp LLC - $15,750 (Paid)\n💰 **INV-2024-002** - ABC Consulting - $8,250 (Paid)\n💰 **INV-2024-003** - StartupXYZ - $22,500 (Overdue)\n\nWould you like me to create a new invoice or search for specific ones?',
        timestamp: new Date(),
        suggestions: [
          'Create new invoice',
          'Search for TechCorp invoices',
          'Show overdue invoices',
          'Export invoice report'
        ],
        actions: [
          { label: '➕ Create Invoice', action: 'create-invoice', icon: '💰' },
          { label: '📊 View Reports', action: 'view-reports', icon: '📊' }
        ]
      }
    }

    // Document related queries
    if (lowerMessage.includes('document') || lowerMessage.includes('file')) {
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'I can help you manage documents! You have 1,247 documents processed. Here\'s what I can do:\n\n📄 Search across all your documents\n📄 Extract data from new uploads\n📄 Categorize and tag automatically\n📄 Generate summaries\n\nWhat would you like to do with your documents?',
        timestamp: new Date(),
        suggestions: [
          'Upload new document',
          'Search for contracts',
          'Extract data from PDFs',
          'Generate document summary'
        ],
        actions: [
          { label: '📤 Upload Document', action: 'upload-document', icon: '📄' },
          { label: '🔍 Search Documents', action: 'search-docs', icon: '🔍' }
        ]
      }
    }

    // Meeting related queries
    if (lowerMessage.includes('meeting') || lowerMessage.includes('schedule') || lowerMessage.includes('call')) {
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'I can help you manage your schedule! You have 4 meetings today and 12 upcoming meetings.\n\n📅 **Today\'s Schedule:**\n• 9:00 AM - Team Standup\n• 10:00 AM - Client Meeting - Q1 Review\n• 2:00 PM - Project Review\n• 4:00 PM - Sales Call\n\nWould you like me to schedule a new meeting or review your calendar?',
        timestamp: new Date(),
        suggestions: [
          'Schedule new meeting',
          'Review tomorrow\'s schedule',
          'Send meeting reminders',
          'Find available time slots'
        ],
        actions: [
          { label: '📅 Schedule Meeting', action: 'schedule-meeting', icon: '📅' },
          { label: '📅 View Calendar', action: 'view-calendar', icon: '📅' }
        ]
      }
    }

    // Audio/Transcription related queries
    if (lowerMessage.includes('audio') || lowerMessage.includes('transcript') || lowerMessage.includes('record')) {
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'I can help you with audio processing! You have 89 recordings (76 transcribed) totaling 456 minutes.\n\n🎙️ **Recent Recordings:**\n• Client Meeting - Q1 Planning (45 min) - Transcribed\n• Team Standup - Project Alpha (5 min) - Transcribed\n• Sales Call - New Prospect (40 min) - Transcribed\n\nNeed help transcribing, summarizing, or analyzing audio?',
        timestamp: new Date(),
        suggestions: [
          'Start new recording',
          'Transcribe existing audio',
          'Generate meeting summary',
          'Extract action items'
        ],
        actions: [
          { label: '🎙️ Start Recording', action: 'start-recording', icon: '🎙️' },
          { label: '📝 View Transcripts', action: 'view-transcripts', icon: '📝' }
        ]
      }
    }

    // Help/How to queries
    if (lowerMessage.includes('help') || lowerMessage.includes('how to') || lowerMessage.includes('tutorial')) {
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'I\'m here to help! Here\'s what I can assist you with:\n\n📊 **Dashboard** - View your activity stats and usage\n📄 **Documents** - Upload, process, and search documents\n🎙️ **Audio** - Record and transcribe meetings\n💰 **Invoices** - Create and manage invoices\n📧 **Inbox** - Process emails with AI\n⚡ **Automations** - Set up intelligent workflows\n📅 **Calendar** - Manage your schedule\n⚙️ **Settings** - Configure your preferences\n\nWhat specific feature would you like to learn about?',
        timestamp: new Date(),
        suggestions: [
          'How to upload documents',
          'Setting up automations',
          'Connecting email accounts',
          'Creating invoices'
        ],
        actions: [
          { label: '📖 View Tutorials', action: 'tutorials', icon: '📖' },
          { label: '🎮 Interactive Tour', action: 'tour', icon: '🎮' }
        ]
      }
    }

    // Default response
    return {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: 'I understand you\'re asking about: "' + userMessage + '".\n\nI can help you with:\n🔍 Searching across documents, emails, invoices\n📄 Processing and analyzing documents\n💰 Creating and managing invoices\n📅 Scheduling meetings and managing calendar\n🎙️ Recording and transcribing audio\n⚡ Setting up automations\n📊 Analyzing your data and usage\n\nCould you be more specific about what you\'d like to do?',
      timestamp: new Date(),
      suggestions: [
        'Search for something specific',
        'Create new content',
        'Analyze my data',
        'Get help with features'
      ],
      actions: [
        { label: '🔍 Global Search', action: 'global-search', icon: '🔍' },
        { label: '📊 View Dashboard', action: 'dashboard', icon: '📊' }
      ]
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleActionClick = (action: string) => {
    switch (action) {
      case 'upload-document':
        window.location.href = '/documents'
        break
      case 'create-invoice':
        window.location.href = '/invoices'
        break
      case 'schedule-meeting':
        window.location.href = '/calendar'
        break
      case 'global-search':
        // Trigger global search
        const event = new KeyboardEvent('keydown', { metaKey: true, key: 'k' })
        document.dispatchEvent(event)
        break
      case 'view-calendar':
        window.location.href = '/calendar'
        break
      case 'dashboard':
        window.location.href = '/app'
        break
      default:
        handleSendMessage(action)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '4rem',
          height: '4rem',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          border: 'none',
          borderRadius: '50%',
          color: '#fff',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
          transition: 'all 0.2s',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        🤖
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: isMinimized ? '4rem' : '400px',
      height: isMinimized ? '4rem' : '600px',
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🤖</span>
          <span style={{ fontWeight: '600', fontSize: '1rem' }}>
            AI Assistant
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            {isMinimized ? '🔼' : '🔽'}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  maxWidth: '100%'
                }}
              >
                {message.role === 'assistant' && (
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    🤖
                  </div>
                )}
                <div style={{
                  flex: 1,
                  background: message.role === 'assistant'
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: message.role === 'assistant'
                    ? '1px solid rgba(59, 130, 246, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {message.content}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: '0.5rem'
                  }}>
                    {formatTime(message.timestamp)}
                  </div>

                  {/* Action Buttons */}
                  {message.actions && (
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action.action)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(59, 130, 246, 0.2)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '0.5rem',
                            color: '#3b82f6',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '9999px',
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    👤
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  🤖
                </div>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      background: '#3b82f6',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out both'
                    }} />
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      background: '#3b82f6',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '0.16s'
                    }} />
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      background: '#3b82f6',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '0.32s'
                    }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div style={{
            padding: '0 1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              padding: '0.75rem 0',
              overflow: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px',
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{suggestion.icon}</span>
                  <span>{suggestion.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center'
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                style={{
                  padding: '0.75rem',
                  background: inputValue.trim() && !isTyping
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: inputValue.trim() && !isTyping ? '#fff' : '#6b7280',
                  cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                📤
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}