'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function QAPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error: any) {
      setStatus('error')
      setErrorMessage(error.message)
    }
  }

  const faqs = [
    {
      question: 'Combien coûte StructureClerk ?',
      answer: 'StructureClerk offre un essai gratuit de 30 jours sans carte de crédit requise. Après l\'essai, l\'abonnement est de 99$ CAD par mois, avec accès complet à toutes les fonctionnalités incluant l\'IA, le stockage illimité et le support prioritaire.',
    },
    {
      question: 'Est-ce que mes données sont sécurisées ?',
      answer: 'Absolument. Nous utilisons un chiffrement de niveau bancaire (SSL/TLS) pour toutes les communications. Vos données sont stockées sur des serveurs sécurisés au Canada et nous effectuons des sauvegardes quotidiennes automatiques. Nous sommes conformes aux normes RGPD et nous ne vendons jamais vos données.',
    },
    {
      question: 'Comment fonctionne l\'analyse de documents par IA ?',
      answer: 'Notre IA propulsée par Claude 3.5 Sonnet analyse automatiquement vos documents (PDF, DOCX, images) pour extraire les informations clés, classifier les types de documents, et même générer des réponses aux appels d\'offres. L\'IA comprend le contexte québécois (TPS, TVQ, normes RBQ) et s\'améliore continuellement.',
    },
    {
      question: 'Puis-je importer mes données existantes ?',
      answer: 'Oui! Vous pouvez importer vos clients, projets et factures depuis Excel, CSV ou d\'autres logiciels. Notre équipe peut aussi vous assister gratuitement lors de votre migration pour assurer une transition en douceur.',
    },
    {
      question: 'Combien d\'utilisateurs peuvent accéder à mon compte ?',
      answer: 'L\'abonnement Pro inclut jusqu\'à 5 utilisateurs. Vous pouvez inviter des membres de votre équipe avec des permissions personnalisées (administrateur, gestionnaire, employé) pour contrôler qui peut voir et modifier quelles informations.',
    },
    {
      question: 'Que se passe-t-il si j\'annule mon abonnement ?',
      answer: 'Vous pouvez annuler à tout moment en 1 clic, sans frais cachés. Vous conservez l\'accès jusqu\'à la fin de votre période payée. Avant l\'annulation, vous pouvez exporter toutes vos données en JSON pour les conserver ou migrer ailleurs.',
    },
    {
      question: 'StructureClerk fonctionne-t-il sur mobile ?',
      answer: 'Oui! Notre plateforme est entièrement responsive et fonctionne parfaitement sur smartphone et tablette. Vous pouvez consulter vos projets, créer des factures et uploader des photos de chantier directement depuis votre mobile.',
    },
    {
      question: 'Offrez-vous du support en français ?',
      answer: 'Bien sûr! Notre équipe de support est 100% bilingue et basée au Québec. Nous offrons un support par email, chat en direct et même des appels vidéo si nécessaire. Temps de réponse moyen : moins de 2 heures.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <main className="flex-1">
        {/* Header */}
        <div className="bg-brand-navy text-white py-16">
          <div className="container mx-auto px-4">
            <Link
              href="/"
              className="text-blue-200 hover:text-brand-orange transition-colors mb-4 inline-block"
            >
              ← Retour à l&apos;accueil
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Questions fréquentes
            </h1>
            <p className="text-xl text-blue-200">
              Tout ce que vous devez savoir sur StructureClerk
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-brand-blue/20 hover:border-brand-orange transition-colors group"
                >
                  <summary className="font-semibold text-lg text-brand-navy cursor-pointer flex items-center justify-between">
                    {faq.question}
                    <svg
                      className="w-5 h-5 text-brand-orange transform group-open:rotate-180 transition-transform flex-shrink-0 ml-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-brand-gray leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-brand-blue/20">
              <h2 className="text-3xl font-bold text-brand-navy mb-4">
                Vous ne trouvez pas votre réponse ?
              </h2>
              <p className="text-brand-gray mb-8">
                Envoyez-nous un message et notre équipe vous répondra dans les 24 heures.
              </p>

              {status === 'success' ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold">Message envoyé avec succès!</p>
                      <p className="text-sm">Nous vous répondrons sous peu à {formData.email || 'votre adresse email'}.</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {status === 'error' ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                  {errorMessage}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-navy mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                      placeholder="Jean Tremblay"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-navy mb-2">
                      Adresse courriel *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                      placeholder="jean@construction.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-brand-navy mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                    placeholder="Question sur la facturation"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-navy mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none resize-none"
                    placeholder="Décrivez votre question ou problème..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>

                <p className="text-sm text-brand-gray text-center">
                  Ou écrivez-nous directement à{' '}
                  <a href="mailto:info@structureclerk.ca" className="text-brand-orange hover:underline font-medium">
                    info@structureclerk.ca
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
