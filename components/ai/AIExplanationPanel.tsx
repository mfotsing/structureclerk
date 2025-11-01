'use client'

import { useState, useEffect } from 'react'

interface AIExplanation {
  id: string
  type: 'classification' | 'extraction' | 'prediction' | 'recommendation'
  documentId?: string
  title: string
  summary: string
  reasoning: {
    step: number
    description: string
    evidence: string[]
    confidence: number
  }[]
  confidence: number
  alternative?: string
  userFeedback?: 'helpful' | 'not_helpful' | 'needs_improvement'
  timestamp: Date
  status: 'processing' | 'completed' | 'reviewed'
}

interface AIExplanationPanelProps {
  documentId?: string
  explanation?: AIExplanation
  isLoading?: boolean
  onFeedback?: (feedback: 'helpful' | 'not_helpful' | 'needs_improvement') => void
  onRequestExplanation?: (documentId: string) => void
}

export default function AIExplanationPanel({
  documentId,
  explanation,
  isLoading = false,
  onFeedback,
  onRequestExplanation
}: AIExplanationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [userComment, setUserComment] = useState('')
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  // Mock explanation data - in production this would come from AI API
  const mockExplanation: AIExplanation = {
    id: 'exp-001',
    type: 'classification',
    documentId: documentId || 'doc-123',
    title: 'Classification: Invoice #2024-001',
    summary: 'AI a identifié ce document comme une facture commerciale avec une confiance de 95%',
    reasoning: [
      {
        step: 1,
        description: 'Analyse des mots-clés et indicateurs visuels',
        evidence: [
          'Présence de "INVOICE" dans l\'en-tête',
          'Formatage standard de facture avec colonnes',
          'Montants totaux et taxes (HST/GST) identifiables'
        ],
        confidence: 98
      },
      {
        step: 2,
        description: 'Validation de structure et cohérence',
        evidence: [
          'Numéro de facture présent (#2024-001)',
          'Dates d\'émission et d\'échéance cohérentes',
          'Informations vendeur/client identifiables'
        ],
        confidence: 96
      },
      {
        step: 3,
        description: 'Comparaison avec modèles connus',
        evidence: [
          'Correspondance à 89% avec factures similaires dans la base',
          'Catégorie de services "consulting" reconnue',
          'Montant dans la plage attendue pour ce type de service'
        ],
        confidence: 92
      },
      {
        step: 4,
        description: 'Évaluation finale et score de confiance',
        evidence: [
          'Score global pondéré: 95%',
          'Facteurs de validation: 8/8 présents',
          'Aucun indicateur de contrefaçon détecté'
        ],
        confidence: 95
      }
    ],
    confidence: 95,
    alternative: 'Classification possible: "Document commercial générique" (confiance: 78%)',
    timestamp: new Date(),
    status: 'completed'
  }

  const currentExplanation = explanation || mockExplanation

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#10b981'
    if (confidence >= 75) return '#3b82f6'
    if (confidence >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getStepIcon = (step: number) => {
    const icons = ['🔍', '📋', '🔬', '✅']
    return icons[Math.min(step - 1, icons.length - 1)]
  }

  const handleFeedback = (feedback: 'helpful' | 'not_helpful' | 'needs_improvement') => {
    if (onFeedback) {
      onFeedback(feedback)
    }
    setShowFeedbackForm(false)
  }

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
        borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              🤖
            </div>
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#fff',
                margin: '0 0 0.25rem 0'
              }}>
                Explication IA
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#a78bfa',
                margin: 0
              }}>
                {currentExplanation.summary}
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                fontSize: '0.875rem',
                color: '#9ca3af'
              }}>
                Confiance:
              </span>
              <span style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: getConfidenceColor(currentExplanation.confidence)
              }}>
                {currentExplanation.confidence}%
              </span>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '0.375rem',
                color: '#a78bfa',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isExpanded ? 'Masquer' : 'Détails'}
              <span style={{ fontSize: '0.75rem' }}>
                {isExpanded ? '↑' : '↓'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Explanation */}
      {isExpanded && (
        <div style={{ padding: '1.5rem' }}>
          {/* Reasoning Steps */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#fff',
              margin: '0 0 1rem 0'
            }}>
              🧠 Processus de Raisonnement IA
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentExplanation.reasoning.map((step, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0
                  }}>
                    {getStepIcon(step.step)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <h5 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#fff',
                        margin: 0
                      }}>
                        Étape {step.step}: {step.description}
                      </h5>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.125rem 0.5rem',
                        background: `${getConfidenceColor(step.confidence)}20`,
                        color: getConfidenceColor(step.confidence),
                        borderRadius: '9999px',
                        fontWeight: '600'
                      }}>
                        {step.confidence}%
                      </span>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#d1d5db',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                      }}>
                        Évidence identifiée:
                      </div>
                      <ul style={{
                        margin: 0,
                        paddingLeft: '1rem',
                        color: '#9ca3af',
                        fontSize: '0.75rem',
                        lineHeight: 1.4
                      }}>
                        {step.evidence.map((evidence, idx) => (
                          <li key={idx}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Classification */}
          {currentExplanation.alternative && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#fbbf24',
                margin: '0 0 0.5rem 0'
              }}>
                🔄 Alternative Considérée
              </h4>
              <p style={{
                fontSize: '0.875rem',
                color: '#d1d5db',
                margin: 0
              }}>
                {currentExplanation.alternative}
              </p>
            </div>
          )}

          {/* User Feedback Section */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#fff',
              margin: '0 0 1rem 0'
            }}>
              💬 Cette explication est-elle utile?
            </h4>

            {showFeedbackForm ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => handleFeedback('helpful')}
                      style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '0.375rem',
                        color: '#10b981',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      👍 Utile
                    </button>
                    <button
                      onClick={() => handleFeedback('needs_improvement')}
                      style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '0.375rem',
                        color: '#f59e0b',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      🔄 Améliorer
                    </button>
                    <button
                      onClick={() => handleFeedback('not_helpful')}
                      style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '0.375rem',
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Pas utile
                    </button>
                  </div>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Commentaires supplémentaires (optionnel)..."
                    style={{
                      width: '100%',
                      minHeight: '3rem',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  />
                  <button
                    onClick={() => {
                      handleFeedback(showFeedbackForm ? 'helpful' : 'needs_improvement')
                      setUserComment('')
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Soumettre le feedback
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.375rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Donner votre feedback
                </button>
                <button
                  onClick={() => onRequestExplanation?.(documentId!)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '0.375rem',
                    color: '#3b82f6',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Ré-analyser
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div style={{
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid rgba(139, 92, 246, 0.3)',
            borderTopColor: '#8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#a78bfa', margin: 0 }}>
            IA en cours d'analyse...
          </p>
        </div>
      )}
    </div>
  )
}