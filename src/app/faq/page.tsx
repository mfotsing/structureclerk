'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HelpCircle, MessageSquare, AlertCircle, Mail, ChevronDown, ChevronUp } from 'lucide-react'

const faqCategories = [
  {
    id: 'general',
    name: 'Questions générales',
    icon: HelpCircle,
    color: 'blue',
    items: [
      {
        question: 'Qu\'est-ce que StructureClerk ?',
        answer: 'StructureClerk est une plateforme SaaS conçue pour les entrepreneurs du bâtiment qui automatise la gestion des documents administratifs. Notre IA transforme vos factures, soumissions et autres documents en décisions exploitables.'
      },
      {
        question: 'Pour qui est StructureClerk ?',
        answer: 'StructureClerk est spécialement conçu pour les entrepreneurs et PME du secteur de la construction au Québec qui veulent optimiser leur gestion administrative.'
      },
      {
        question: 'Comment commencer avec StructureClerk ?',
        answer: 'Commencez par faire notre scorecard gratuit pour évaluer votre chaos administratif. Vous pouvez ensuite vous inscrire pour un essai gratuit de 30 jours.'
      }
    ]
  },
  {
    id: 'pricing',
    name: 'Tarifs et facturation',
    icon: MessageSquare,
    color: 'green',
    items: [
      {
        question: 'Quels sont les prix de StructureClerk ?',
        answer: 'Nous proposons deux plans : Plan Pro à 99$/mois et Plan Enterprise à 299$/mois. Les 30 premiers jours sont gratuits pour tous les nouveaux clients.'
      },
      {
        question: 'Puis-je changer de plan à tout moment ?',
        answer: 'Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Les changements prennent effet au début du cycle de facturation suivant.'
      },
      {
        question: 'Quelles méthodes de paiement acceptez-vous ?',
        answer: 'Nous acceptons les cartes de crédit (Visa, Mastercard, American Express) traitées de manière sécurisée via Stripe.'
      },
      {
        question: 'Comment annuler mon abonnement ?',
        answer: 'Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Votre accès reste actif jusqu\'à la fin de la période de facturation.'
      }
    ]
  },
  {
    id: 'features',
    name: 'Fonctionnalités',
    icon: AlertCircle,
    color: 'purple',
    items: [
      {
        question: 'Quels types de documents StructureClerk peut-il traiter ?',
        answer: 'StructureClerk peut traiter les factures, soumissions, contrats, bons de commande, relevés de compte et tout autre document administratif lié à vos projets.'
      },
      {
        question: 'Mes données sont-elles sécurisées ?',
        answer: 'Absolument. Toutes vos données sont chiffrées de bout en bout et stockées au Canada. Nous respectons les normes RGPD et les lois canadiennes sur la protection des données.'
      },
      {
        question: 'Puis-je intégrer StructureClerk avec mes outils existants ?',
        answer: 'Oui, nous nous intégrons avec QuickBooks, FreshBooks et offrons une API complète pour les intégrations personnalisées.'
      }
    ]
  },
  {
    id: 'support',
    name: 'Support technique',
    icon: Mail,
    color: 'orange',
    items: [
      {
        question: 'Comment contacter le support ?',
        answer: 'Vous pouvez nous contacter via notre page de support, par email à support@structureclerk.ca, ou utiliser le chat en direct disponible du lundi au vendredi, 9h-17h.'
      },
      {
        question: 'Quel est le temps de réponse du support ?',
        answer: 'Nous nous efforçons de répondre à toutes les demandes dans les 24 heures. Les clients Enterprise bénéficient d\'un support prioritaire 24/7.'
      },
      {
        question: 'Proposez-vous de la formation ?',
        answer: 'Oui, nous proposons des tutoriels vidéo, une base de connaissances complète et des sessions de formation personnalisées pour les clients Enterprise.'
      }
    ]
  }
]

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const toggleExpanded = (categoryId: string, itemIndex: number) => {
    const key = `${categoryId}-${itemIndex}`
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedItems(newExpanded)
  }

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
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Foire Aux Questions</h1>
          <p className="text-xl text-blue-100">
            Trouvez des réponses rapides à vos questions sur StructureClerk
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Vous ne trouvez pas votre réponse ?</h3>
            <p className="text-blue-700 mb-4">
              Notre équipe de support est là pour vous aider
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contacter le support
            </Link>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category) => {
            const Icon = category.icon
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600'
            }

            return (
              <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {category.items.map((item, index) => {
                    const key = `${category.id}-${index}`
                    const isExpanded = expandedItems.has(key)

                    return (
                      <div key={key} className="hover:bg-gray-50">
                        <button
                          onClick={() => toggleExpanded(category.id, index)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Encore des questions ?</h2>
          <p className="text-gray-600 mb-6">
            Notre équipe de support est disponible pour vous aider à tirer le meilleur parti de StructureClerk
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Contacter le support
            </Link>
            <Link
              href="/scorecard?scorecard=scorecard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              Faire le scorecard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}