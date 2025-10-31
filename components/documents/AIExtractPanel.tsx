'use client'

import { useState, useEffect } from 'react'

interface ExtractedData {
  documentType: 'invoice' | 'receipt' | 'contract' | 'identity' | 'bank_statement' | 'tax_file' | 'handwritten' | 'general'
  confidence: number
  extractedText: string
  language: 'en' | 'fr' | 'unknown'
  keyFields: {
    vendor?: string
    client?: string
    amount?: number
    currency?: string
    date?: Date
    dueDate?: Date
    invoiceNumber?: string
    purchaseOrder?: string
    taxAmount?: number
    paymentMethod?: string
    accountNumber?: string
    [key: string]: any
  }
  suggestions: string[]
  actionItems: Array<{
    id: string
    title: string
    description: string
    icon: string
    priority: 'high' | 'medium' | 'low'
    action: string
  }>
}

interface AIExtractPanelProps {
  file: File
  extractedData: ExtractedData | null
  isProcessing: boolean
  onConfirm: (data: ExtractedData) => void
  onEdit: (data: ExtractedData) => void
  onRetry: () => void
}

export default function AIExtractPanel({
  file,
  extractedData,
  isProcessing,
  onConfirm,
  onEdit,
  onRetry
}: AIExtractPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<ExtractedData | null>(null)
  const [selectedActions, setSelectedActions] = useState<string[]>([])

  useEffect(() => {
    if (extractedData) {
      setEditedData({ ...extractedData })
    }
  }, [extractedData])

  const handleFieldChange = (field: string, value: any) => {
    if (!editedData) return

    setEditedData({
      ...editedData,
      keyFields: {
        ...editedData.keyFields,
        [field]: value
      }
    })
  }

  const handleSaveEdit = () => {
    if (editedData) {
      onEdit(editedData)
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    if (extractedData) {
      setEditedData({ ...extractedData })
    }
    setIsEditing(false)
  }

  const handleActionToggle = (actionId: string) => {
    setSelectedActions(prev =>
      prev.includes(actionId)
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    )
  }

  const getDocumentTypeInfo = (type: string) => {
    const types = {
      invoice: { icon: '💰', color: '#34d399', label: 'Invoice' },
      receipt: { icon: '🧾', color: '#f59e0b', label: 'Receipt' },
      contract: { icon: '📄', color: '#3b82f6', label: 'Contract' },
      identity: { icon: '🆔', color: '#8b5cf6', label: 'Identity Document' },
      bank_statement: { icon: '🏦', color: '#10b981', label: 'Bank Statement' },
      tax_file: { icon: '📊', color: '#ef4444', label: 'Tax Document' },
      handwritten: { icon: '✍️', color: '#f97316', label: 'Handwritten Note' },
      general: { icon: '📁', color: '#6b7280', label: 'General Document' }
    }
    return types[type as keyof typeof types] || types.general
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#22c55e'
    if (confidence >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  if (isProcessing) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '4rem',
          height: '4rem',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2rem',
          animation: 'pulse 2s infinite'
        }}>
          🤖
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          AI Analyzing Your Document
        </h3>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
          Extracting text, identifying document type, and pulling out key information...
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ color: '#9ca3af' }}>
            <div style={{ marginBottom: '0.25rem' }}>📝 OCR Processing</div>
            <div style={{ color: '#3b82f6' }}>Extracting text...</div>
          </div>
          <div style={{ color: '#9ca3af' }}>
            <div style={{ marginBottom: '0.25rem' }}>🧠 AI Analysis</div>
            <div style={{ color: '#8b5cf6' }}>Classifying...</div>
          </div>
          <div style={{ color: '#9ca3af' }}>
            <div style={{ marginBottom: '0.25rem' }}>🔍 Data Extraction</div>
            <div style={{ color: '#10b981' }}>Identifying fields...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!extractedData) {
    return (
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          AI Analysis Failed
        </h3>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
          I couldn't extract information from this document. Would you like to try again?
        </p>
        <button
          onClick={onRetry}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: 'none',
            color: '#fff',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔄 Try Again
        </button>
      </div>
    )
  }

  const docTypeInfo = getDocumentTypeInfo(extractedData.documentType)

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: `${docTypeInfo.color}20`,
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {docTypeInfo.icon}
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                  color: '#fff'
                }}>
                  ✅ AI Extracted Information
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.75rem',
                    background: `${docTypeInfo.color}20`,
                    color: docTypeInfo.color,
                    borderRadius: '9999px',
                    fontWeight: '600'
                  }}>
                    {docTypeInfo.label}
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px'
                  }}>
                    {extractedData.language.toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px'
                  }}>
                    {extractedData.confidence}% Confidence
                  </span>
                </div>
              </div>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              File: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#3b82f6',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  💾 Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Extracted Data */}
      <div style={{ padding: '1.5rem' }}>
        {/* Key Fields */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#fff' }}>
            📋 Key Information
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(editedData?.keyFields || {}).map(([key, value]) => (
              <div key={key} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0.5rem',
                padding: '1rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                {isEditing ? (
                  <input
                    type={key.includes('date') || key.includes('Date') ? 'date' :
                          key.includes('amount') || key.includes('Amount') ? 'number' : 'text'}
                    value={typeof value === 'object' ? value.toString() : value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.25rem',
                      color: '#fff',
                      fontSize: '0.875rem'
                    }}
                  />
                ) : (
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#fff',
                    fontWeight: '500'
                  }}>
                    {key.includes('amount') && typeof value === 'number' ? formatCurrency(value) :
                     key.includes('date') && value instanceof Date ? value.toLocaleDateString() :
                     String(value)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Extracted Text Preview */}
        {extractedData.extractedText && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#fff' }}>
              📝 Extracted Text Preview
            </h4>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem',
              padding: '1rem',
              maxHeight: '150px',
              overflow: 'auto'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#d1d5db',
                lineHeight: 1.6,
                margin: 0
              }}>
                {extractedData.extractedText}
              </p>
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        {extractedData.suggestions.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#fff' }}>
              💡 AI Suggestions
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {extractedData.suggestions.map((suggestion, index) => (
                <div key={index} style={{
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#a78bfa'
                }}>
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        {extractedData.actionItems.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#fff' }}>
              ⚡ Recommended Actions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {extractedData.actionItems.map((action) => (
                <div
                  key={action.id}
                  style={{
                    background: selectedActions.includes(action.id)
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: selectedActions.includes(action.id)
                      ? '1px solid rgba(59, 130, 246, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => handleActionToggle(action.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      background: action.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' :
                                   action.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' :
                                   'rgba(34, 197, 94, 0.2)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      flexShrink: 0
                    }}>
                      {action.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem',
                        color: '#fff'
                      }}>
                        {action.title}
                      </h5>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                        {action.description}
                      </p>
                    </div>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      background: selectedActions.includes(action.id)
                        ? '#3b82f6'
                        : 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onConfirm(editedData || extractedData)}
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            ✅ Confirm & Save
          </button>
        </div>
      </div>
    </div>
  )
}