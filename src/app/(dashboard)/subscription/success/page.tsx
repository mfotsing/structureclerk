import { CheckCircle, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Bienvenue dans StructureClerk Pro ! 🎉
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8">
            Votre abonnement a été activé avec succès. Vous avez maintenant accès à toutes les fonctionnalités premium.
          </p>

          {/* Features Unlocked */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-brand-navy mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-orange" />
              Fonctionnalités Débloquées
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Projets, factures et documents illimités</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Assistant IA conversationnel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Analytics et prévisions financières</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>1 000 000 tokens IA par mois</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Support prioritaire</span>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block w-full bg-brand-orange text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Accéder au Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/subscription/billing"
              className="block w-full border-2 border-brand-navy text-brand-navy py-4 rounded-lg font-semibold hover:bg-brand-navy hover:text-white transition-all"
            >
              Gérer Mon Abonnement
            </Link>
          </div>

          {/* Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Un email de confirmation a été envoyé à votre adresse.
              <br />
              Besoin d&apos;aide?{' '}
              <a
                href="mailto:info@structureclerk.ca"
                className="text-brand-orange hover:underline"
              >
                Contactez-nous
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Vous serez facturé automatiquement chaque mois.
            <br />
            Annulation possible à tout moment sans frais.
          </p>
        </div>
      </div>
    </div>
  )
}
