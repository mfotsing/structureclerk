'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'

const SUGGESTED_QUESTIONS = [
  "Combien j'ai de factures impayées?",
  "Quel est mon revenu ce mois?",
  "Mes projets actifs?",
  "Statistiques globales",
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Bonjour! 👋 Je suis votre assistant IA. Posez-moi des questions sur vos projets, factures ou finances!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, conversation_id: convId }),
      })

      if (!res.ok) throw new Error('Erreur API')

      const data = await res.json()
      if (!convId) setConvId(data.conversation_id)

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Désolé, une erreur s'est produite.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-brand-orange text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110"
          aria-label="Ouvrir l'assistant IA"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border flex flex-col">
          <div className="bg-brand-navy text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Assistant IA</h3>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-800 p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {msg.role === 'assistant' && <Sparkles className="w-4 h-4 inline mr-1 text-brand-orange" />}
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="w-5 h-5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t p-4">
            <form onSubmit={e => { e.preventDefault(); handleSend() }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-brand-orange text-white p-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
