'use client'

import { useState } from 'react'
import { Check, Zap, ArrowRight } from 'lucide-react'
import { getAvailablePlans, formatPrice } from '@/lib/stripe/plans'

export default function PlansPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const plans = getAvailablePlans()

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })

      if (!response.ok) {
        throw new Error('Checkout error')
      }

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Erreur lors de la création de l\'abonnement')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
            Choisissez Votre Plan
          </h1>
          <p className="text-xl text-gray-600">
            Débloquez tout le potentiel de StructureClerk
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                plan.popular ? 'ring-4 ring-brand-orange' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-orange text-white px-4 py-1 rounded-full text-sm font-semibold">
                    ⭐ Plus Populaire
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-brand-navy mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-brand-navy">
                    {formatPrice(plan.price, plan.currency)}
                  </span>
                  <span className="text-gray-500">/ mois</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-brand-orange text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                    : 'bg-brand-navy text-white hover:bg-blue-900'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    Commencer Maintenant
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-navy text-center mb-8">
            Questions Fréquentes
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-brand-navy mb-2">
                Puis-je annuler à tout moment?
              </h3>
              <p className="text-gray-600">
                Oui, vous pouvez annuler votre abonnement à tout moment depuis
                votre page de facturation. Aucun frais d&apos;annulation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-brand-navy mb-2">
                Que se passe-t-il après l&apos;essai gratuit?
              </h3>
              <p className="text-gray-600">
                Vous serez automatiquement basculé sur le plan gratuit avec
                limites. Vous pouvez upgrader à tout moment.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-brand-navy mb-2">
                Les données sont-elles sécurisées?
              </h3>
              <p className="text-gray-600">
                Absolument. Toutes vos données sont chiffrées et hébergées au
                Canada. Conformité RGPD et Loi 25 Québec.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Des questions? Contactez-nous à{' '}
            <a
              href="mailto:info@structureclerk.ca"
              className="text-brand-orange hover:underline font-semibold"
            >
              info@structureclerk.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
