'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  context?: {
    documentId?: string
    actionItems?: string[]
    relatedQueries?: string[]
    confidence?: number
  }
}

interface QuickQuery {
  id: string
  text: string
  icon: string
  category: 'financial' | 'operational' | 'strategic' | 'compliance'
  intent: string
}

export default function ConversationalAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'system',
      content: "Bonjour ! Je suis votre assistant IA StructureClerk. Je peux vous aider à analyser vos documents, comprendre vos finances, optimiser vos opérations et prendre des décisions éclairées. Que souhaitez-vous savoir aujourd'hui ?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickQueries: QuickQuery[] = [
    {
      id: 'revenue-trend',
      text: 'Quel est le trend de mes revenus ce mois-ci ?',
      icon: '📈',
      category: 'financial',
      intent: 'analyze_revenue_trend'
    },
    {
      id: 'unpaid-invoices',
      text: 'Quelles factures sont en attente de paiement ?',
      icon: '💰',
      category: 'financial',
      intent: 'list_unpaid_invoices'
    },
    {
      id: 'recent-documents',
      text: 'Quels documents ai-je récemment traités ?',
      icon: '📄',
      category: 'operational',
      intent: 'list_recent_documents'
    },
    {
      id: 'meeting-summary',
      text: 'Résume mes réunions de cette semaine',
      icon: '🎙️',
      category: 'operational',
      intent: 'summarize_meetings'
    },
    {
      id: 'tax-deadline',
      text: 'Quelles sont mes échéances fiscales importantes ?',
      icon: '📅',
      category: 'compliance',
      intent: 'list_tax_deadlines'
    },
    {
      id: 'cost-optimization',
      text: 'Comment puis-je optimiser mes dépenses ?',
      icon: '💡',
      category: 'strategic',
      intent: 'suggest_cost_optimization'
    }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock AI responses based on user intent
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('revenu') || lowerMessage.includes('trend') || lowerMessage.includes('mois')) {
      return {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `📈 **Analyse de vos revenus ce mois-ci**

Vos revenus ont augmenté de **15%** par rapport au mois dernier, atteignant **$12,475**.

**Détail par client :**
- Client A: $5,200 (+42% vs mois dernier)
- Client B: $3,800 (+8% vs mois dernier)
- Client C: $3,475 (+12% vs mois dernier)

**Facteurs de croissance :**
- Nouveau contrat avec Client A
- Réalisation de projet additionnel pour Client C
- Maintien de la rétention client à 95%

**Recommandation :** Continuez sur cette trajectoire et envisagez d'augmenter vos tarifs pour les nouveaux projets.`,
        timestamp: new Date(),
        context: {
          confidence: 94,
          actionItems: ['Envisager augmentation tarifs', 'Documenter succès Client A'],
          relatedQueries: ['Prévisions revenus prochain mois', 'Analyse rentabilité par client']
        }
      }
    }

    if (lowerMessage.includes('facture') || lowerMessage.includes('paiement') || lowerMessage.includes('attente')) {
      return {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `💰 **Factures en attente de paiement**

Vous avez **3 factures** en attente pour un total de **$8,450** :

**🔴 En retard (5+ jours) :**
- Facture #2024-042: $3,200 (Client X) - Échéance: 15 oct
- Facture #2024-045: $2,100 (Client Y) - Échéance: 20 oct

**🟡 En attente (0-4 jours) :**
- Facture #2024-047: $3,150 (Client Z) - Échéance: 28 oct

**Actions suggérées :**
1. Envoyer rappel immédiat pour Factures #042 et #045
2. Configurer rappels automatiques 3 jours avant échéance
3. Prévoir paiement de Facture #047 cette semaine

Souhaitez-vous que je génère les rappels automatiquement ?`,
        timestamp: new Date(),
        context: {
          confidence: 98,
          actionItems: ['Envoyer rappels factures retard', 'Configurer rappels automatiques'],
          relatedQueries: ['Historique paiements Client X', 'Délai moyen paiement par client']
        }
      }
    }

    if (lowerMessage.includes('document') || lowerMessage.includes('traité')) {
      return {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `📄 **Documents récemment traités (7 derniers jours)**

**Total : 47 documents** avec un taux de précision de **94.7%**

**Par type :**
- 📋 Factures: 18 documents
- 📑 Contrats: 7 documents
- 🧾 Reçus: 12 documents
- 📊 Rapports: 6 documents
- 📝 Autres: 4 documents

**Derniers traitements :**
1. **Facture ABC-2024-089** - Il y a 2 heures
   - Classification: Facture client (98% confiance)
   - Montant extrait: $2,450

2. **Contrat Partnership-2024** - Il y a 4 heures
   - Classification: Contrat service (95% confiance)
   - Date début: 1 nov 2024

3. **Reçu Dépenses bureau** - Il y a 6 heures
   - Classification: Reçu dépenses (92% confiance)
   - Montant: $127.35

**Productivité :** L'IA vous a fait économiser **12.5 heures** cette semaine !`,
        timestamp: new Date(),
        context: {
          confidence: 96,
          actionItems: ['Examiner facture ABC-2024-089', 'Valider contrat Partnership-2024'],
          relatedQueries: ['Documents par client', 'Précision classification par type']
        }
      }
    }

    if (lowerMessage.includes('réunion') || lowerMessage.includes('semaine')) {
      return {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `🎙️ **Résumé de vos réunions cette semaine**

**Total : 4 réunions** - Durée totale: 5h 30min

**📋 Lundi 28 oct - Client Project Review**
- Participants: Vous, Client A, Équipe technique (3)
- Durée: 1h 45min
- **Décisions clés :**
  - Approuvé Phase 2 du projet
  - Budget additionnel de $15,000
  - Livraison: 15 déc 2024
- **Actions :** Envoyer plan détaillé Phase 2

**💡 Mercredi 30 oct - Team Standup**
- Participants: Équipe interne (5)
- Durée: 45min
- **Points discussés :**
  - Statut projets en cours
  - Allocation ressources Q4
  - Vacances décembre

**🎯 Jeudi 31 oct - Strategy Session**
- Participants: Vous, Partners (2)
- Durée: 2h
- **Stratégie 2025 :**
  - Expansion marché Québec
  - Nouveaux services IA
  - Objectif: +40% revenus

**Productivité gagnée :** 3h grâce aux transcriptions automatiques !`,
        timestamp: new Date(),
        context: {
          confidence: 91,
          actionItems: ['Envoyer plan Phase 2', 'Préparer expansion Québec'],
          relatedQueries: ['Actions par réunion', 'Taux de participation par client']
        }
      }
    }

    if (lowerMessage.includes('impôt') || lowerMessage.includes('fisca') || lowerMessage.includes('échéance')) {
      return {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `📅 **Vos échéances fiscales importantes**

**🔴 Urgent - Mois prochain :**
- **15 nov** - Dépôt TPS/TVQ trimestre 3
  - Estimé: $2,340 (TPS) + $3,180 (TVQ)
  - Basé sur revenus Q3: $31,200

- **30 nov** - Versements acomptes provisionnels
  - Estimé: $4,500 (fédéral) + $2,100 (provincial)

**🟡 À préparer - Décembre :**
- **15 déc** - Relevés T4/T5 à émettre
- **31 déc** - Clôture exercice financier 2024

**📋 Documents requis :**
- ✅ Relevés bancaires Q3
- ✅ Factures émises/reçues
- ✅ Reçus dépenses professionnelles
- ⏳ T4 des employés (à obtenir)

**Recommandation :** Mettre de côté **$12,120** pour ces obligations fiscales.

Souhaitez-vous que je prépare les formulaires TPS/TVQ automatiquement ?`,
        timestamp: new Date(),
        context: {
          confidence: 97,
          actionItems: ['Préparer TPS/TVQ Q3', 'Obtenir T4 employés', 'Provisionner $12,120'],
          relatedQueries: ['Historique impôts payés', 'Optimisation fiscale'],
          documentId: 'tax-deadlines-2024'
        }
      }
    }

    if (lowerMessage.includes('optimis') || lowerMessage.includes('dépense')) {
      return {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `💡 **Opportunités d'optimisation des dépenses**

**📊 Analyse de vos dépenses ce mois-ci :**
- Total: $4,532 (-8% vs mois dernier) ✅
- Récurrentes: $2,180 (48%)
- Variables: $2,352 (52%)

**🎯 Actions prioritaires identifiées :**

**1. Abonnements logiciels (-$127/mois)**
- Tool X: $89/mois → Alternative gratuite disponible
- Service Y: $38/mois → Plan annuel = 30% d'économie

**2. Télécommunications (-$45/mois)**
- Forfait mobile: $120/mois → Négociation possible
- Internet: $85/mois → Offre concurrente à $65

**3. Fournitures de bureau (-$23/mois)**
- Achat en gros: 15% d'économie potentielle
- Abonnement livraison: Gratuit au-delà de $100

**Économies totales mensuelles : $195**
**Économies annuelles projetées : $2,340**

**Plan d'action recommandé :**
1. Analyser utilisation Tool X ce mois
2. Contacter fournisseur télécommunications
3. Évaluer besoins fournitures Q4

**Impact sur rentabilité :** +2.3% marge nette

Voulez-vous que je crée un plan d'action détaillé ?`,
        timestamp: new Date(),
        context: {
          confidence: 89,
          actionItems: ['Analyser Tool X utilisation', 'Négocier forfaits', 'Acheter en gros'],
          relatedQueries: ['Dépenses par catégorie', 'ROI investissements récents']
        }
      }
    }

    // Default response
    return {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: `Je comprends votre question. Voici ce que je peux vous aider à faire :

**📊 Analyse financière**
- Trends revenus et dépenses
- Suivi factures et paiements
- Projections cash flow

**📋 Gestion documents**
- Classification et extraction
- Recherche intelligente
- Organisation automatique

**🎙️ Transcriptions et réunions**
- Résumés automatiques
- Actions et décisions
- Historique conversations

**⚙️ Optimisation opérations**
- Automatisation tâches
- Recommandations IA
- Productivité

**Pourriez-vous préciser votre question ou choisir parmi les requêtes rapides ci-dessus ?**`,
      timestamp: new Date(),
      context: {
        confidence: 75,
        relatedQueries: ['Revenus ce mois', 'Factures en attente', 'Documents récents', 'Réunions semaine']
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

    // Generate AI response
    const aiResponse = await generateAIResponse(inputValue)
    setMessages(prev => [...prev, aiResponse])
    setIsTyping(false)

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

  if (!isExpanded) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000
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
      width: '28rem',
      height: '40rem',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      zIndex: 1000,
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
              Assistant IA
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: '#a78bfa',
              margin: 0
            }}>
              Posez-moi vos questions
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
            Questions fréquentes
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

              {message.context?.actionItems && (
                <div style={{
                  marginTop: '0.75rem',
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
                    ✅ Actions suggérées :
                  </div>
                  {message.context.actionItems.map((action, idx) => (
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

              {message.context?.relatedQueries && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>
                  Questions similaires : {message.context.relatedQueries.join(', ')}
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
                {message.context?.confidence && (
                  <span style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '9999px',
                    fontSize: '0.625rem'
                  }}>
                    {message.context.confidence}% confiance
                  </span>
                )}
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
            placeholder="Posez votre question..."
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
            Envoyer
            <span>→</span>
          </button>
        </div>
        <p style={{
          fontSize: '0.625rem',
          color: '#6b7280',
          margin: '0.5rem 0 0 0',
          textAlign: 'center'
        }}>
          L'IA peut faire des erreurs. Vérifiez les informations importantes.
        </p>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}