'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, ChevronUp, Mail, Send, CheckCircle, AlertCircle, HelpCircle, MessageSquare } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Comment fonctionne le scorecard de chaos administratif ?',
    answer: 'Le scorecard est un questionnaire de 18 questions basé sur la méthodologie Priestley Standard. Il évalue vos pratiques administratives actuelles et vous donne un score de 0 à 100. Selon votre score, vous recevrez des recommandations personnalisées pour optimiser votre gestion.',
    category: 'scorecard'
  },
  {
    id: '2',
    question: 'Combien de temps dure l\'analyse ?',
    answer: 'L\'analyse prend environ 2 minutes. Vous répondez aux questions et recevez immédiatement vos résultats avec un plan d\'action personnalisé.',
    category: 'scorecard'
  },
  {
    id: '3',
    question: 'StructureClerk est-il adapté pour les entrepreneurs du bâtiment ?',
    answer: 'Oui, StructureClerk est spécialement conçu pour les entrepreneurs du bâtiment au Québec. Notre solution comprend des fonctionnalités adaptées : gestion des soumissions, suivi des projets, facturation selon les normes du bâtiment, et bien plus.',
    category: 'produit'
  },
  {
    id: '4',
    question: 'Quels types de documents StructureClerk peut-il traiter ?',
    answer: 'StructureClerk peut traiter les factures, soumissions, contrats, bons de commande, relevés de compte, et tout autre document administratif lié à vos projets de construction.',
    category: 'produit'
  },
  {
    id: '5',
    question: 'Comment la facturation fonctionne-t-elle ?',
    answer: 'Nous proposons deux plans : Pro à 99$/mois et Enterprise à 299$/mois. Le plan Pro inclut la facturation illimitée, l\'extraction IA des factures, et les prévisions financières. Le plan Enterprise ajoute les approbations multi-niveaux et les workflows personnalisés. Les 30 premiers jours sont gratuits.',
    category: 'tarifs'
  },
  {
    id: '6',
    question: 'Puis-je annuler mon abonnement à tout moment ?',
    answer: 'Oui, vous pouvez annuler votre abonnement à tout moment sans frais. Votre accès restera actif jusqu\'à la fin de la période de facturation en cours.',
    category: 'tarifs'
  },
  {
    id: '7',
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Absolument. Nous utilisons un chiffrement de bout en bout, suivons les normes RGPD, et stockons toutes vos données au Canada. Vos informations sensibles sont protégées et ne sont jamais partagées sans votre consentement.',
    category: 'sécurité'
  },
  {
    id: '8',
    question: 'Comment puis-je intégrer StructureClerk avec mes outils existants ?',
    answer: 'StructureClerk s\'intègre avec QuickBooks, FreshBooks, et offre une API complète pour les intégrations personnalisées. Notre équipe d\'assistance peut vous aider à configurer vos intégrations.',
    category: 'intégrations'
  },
  {
    id: '9',
    question: 'Quel type de support est offert ?',
    answer: 'Nous offrons un support par email et chat en direct du lundi au vendredi, 9h-17h. Les clients Enterprise bénéficient d\'un support prioritaire 24/7. Nous avons aussi une base de connaissances complète et des tutoriels vidéo.',
    category: 'support'
  }
]

export default function SupportPage() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'support'
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formMessage, setFormMessage] = useState('')

  const recaptchaRef = useRef<HTMLDivElement>(null)

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFAQs = selectedCategory === 'all'
    ? faqData
    : faqData.filter(item => item.category === selectedCategory)

  const categories = [
    { id: 'all', name: 'Toutes les questions', icon: HelpCircle },
    { id: 'scorecard', name: 'Scorecard', icon: MessageSquare },
    { id: 'produit', name: 'Produit', icon: AlertCircle },
    { id: 'tarifs', name: 'Tarifs', icon: Mail },
    { id: 'sécurité', name: 'Sécurité', icon: CheckCircle },
    { id: 'intégrations', name: 'Intégrations', icon: HelpCircle },
    { id: 'support', name: 'Support', icon: MessageSquare }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('loading')
    setFormMessage('')

    try {
      // Simuler la vérification reCAPTCHA (remplacer avec vraie intégration)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simuler l'envoi du formulaire
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setFormStatus('success')
        setFormMessage('Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 heures.')
        setFormData({ name: '', email: '', subject: '', message: '', type: 'support' })
      } else {
        throw new Error('Erreur lors de l\'envoi')
      }
    } catch (error) {
      setFormStatus('error')
      setFormMessage('Une erreur est survenue. Veuillez réessayer plus tard ou nous contacter directement par email.')
    }
  }

  useEffect(() => {
    // Charger reCAPTCHA (remplacer avec votre clé site)
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-icon.svg"
                alt="StructureClerk"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-gray-900">
                <span className="text-blue-900">Structure</span>
                <span className="text-orange-500">Clerk</span>
              </span>
            </Link>

            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-12 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Support</h1>
          <p className="text-xl text-blue-100">
            Nous sommes là pour vous aider. Trouvez des réponses à vos questions ou contactez notre équipe.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Foire Aux Questions</h2>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </button>
                  )
                })}
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFAQs.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{item.question}</span>
                      {expandedItems.has(item.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedItems.has(item.id) && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contactez-nous</h2>

              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Message envoyé!</h3>
                  <p className="text-gray-600">{formMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Type de demande
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="support">Support technique</option>
                      <option value="billing">Facturation</option>
                      <option value="feature">Demande de fonctionnalité</option>
                      <option value="partnership">Partenariat</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* reCAPTCHA */}
                  <div ref={recaptchaRef} className="g-recaptcha" data-sitekey="VOTRE_CLE_RECAPTCHA"></div>

                  {formStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600">{formMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Autres façons de nous contacter</h3>
                <div className="space-y-3">
                  <a href="mailto:support@structureclerk.ca" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                    <Mail className="w-5 h-5" />
                    <span>support@structureclerk.ca</span>
                  </a>
                  <div className="text-sm text-gray-500">
                    <p>Réponse sous 24h</p>
                    <p>Support: Lun-Ven, 9h-17h (HE)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}