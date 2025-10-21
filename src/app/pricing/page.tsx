'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Footer from '@/components/Footer'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'

export default function PricingPage() {
  const t = useTranslations()

  const plans = [
    {
      name: 'Pro',
      price: '99',
      currency: 'CAD',
      period: '/mois',
      description: 'Parfait pour les entrepreneurs solo et petites équipes',
      features: [
        'Facturation illimitée',
        'Extraction IA de factures',
        'Prévisions financières IA',
        'Gestion clients & projets',
        'Documents centralisés',
        'Calcul TPS/TVQ automatique',
        'Support par email',
        '30 jours d\u2019essai gratuit',
      ],
      cta: 'Commencer avec Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '299',
      currency: 'CAD',
      period: '/mois',
      description: 'Pour les entreprises en croissance avec équipes multiples',
      features: [
        'Tout de Pro, plus:',
        'Approbations multi-niveaux',
        'Workflow personnalisés',
        'Analytics avancées',
        'API access',
        'Utilisateurs illimités',
        'Support prioritaire',
        'Gestionnaire de compte dédié',
      ],
      cta: 'Commencer avec Enterprise',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="w-full py-4 px-4 sm:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-icon.svg"
              alt="StructureClerk"
              width={40}
              height={40}
              className="drop-shadow-sm"
            />
            <span className="text-2xl font-bold hidden sm:block">
              <span className="text-brand-navy">Structure</span>
              <span className="text-brand-orange">Clerk</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="px-6 py-2 bg-white text-brand-navy border-2 border-brand-navy rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm sm:text-base shadow-sm"
            >
              {t('auth.loginButton')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
            Tarifs Simples et Transparents
          </h1>
          <p className="text-xl text-brand-gray max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Annulez à tout moment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-xl p-8 relative ${
                plan.popular ? 'ring-4 ring-brand-orange' : 'border-2 border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-orange text-white px-6 py-1 rounded-full text-sm font-semibold">
                  ⭐ Plus Populaire
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-brand-navy mb-2">{plan.name}</h2>
                <p className="text-brand-gray mb-6">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-brand-navy">{plan.price}</span>
                  <span className="text-xl text-brand-gray">{plan.currency}</span>
                  <span className="text-brand-gray">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                    <span className="text-brand-navy">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`block w-full py-4 rounded-lg font-bold text-center transition-all ${
                  plan.popular
                    ? 'bg-brand-orange text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                    : 'bg-white text-brand-navy border-2 border-brand-navy hover:bg-blue-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-brand-blue/20">
            <h3 className="text-2xl font-bold text-brand-navy mb-4">
              Questions sur les tarifs?
            </h3>
            <p className="text-brand-gray mb-6">
              Notre équipe est là pour vous aider à choisir le meilleur plan pour votre entreprise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/qa"
                className="px-8 py-3 bg-white text-brand-navy border-2 border-brand-navy rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Voir la FAQ
              </Link>
              <a
                href="mailto:info@structureclerk.ca"
                className="px-8 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Contactez-nous
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
