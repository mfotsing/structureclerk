/**
 * Page: /subscription/expired
 *
 * Affichée quand l'essai de 30 jours est expiré ou l'abonnement est inactif
 */

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function SubscriptionExpiredPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const trialEnded = profile.trial_ends_at && new Date(profile.trial_ends_at) < new Date()
  const daysInTrial = profile.trial_ends_at
    ? Math.ceil((new Date(profile.trial_ends_at).getTime() - new Date(profile.trial_started_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24))
    : 30

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
          <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Image
              src="/logo.jpg"
              alt="StructureClerk Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {trialEnded ? 'Essai gratuit terminé' : 'Abonnement requis'}
          </h1>
          <p className="text-indigo-100">
            {trialEnded
              ? `Votre période d'essai de ${daysInTrial} jours est terminée`
              : 'Activez votre abonnement pour continuer'}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Continuez à transformer votre entreprise avec l&apos;IA
            </h2>
            <p className="text-gray-600 leading-relaxed">
              StructureClerk vous aide à gagner un temps précieux grâce à l&apos;intelligence
              artificielle. Analysez vos documents, générez des réponses aux appels d&apos;offres,
              et gérez votre entreprise comme jamais auparavant.
            </p>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-indigo-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Plan Pro</h3>
                <p className="text-sm text-gray-600">Tout inclus, sans limite</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-indigo-600">99$</div>
                <div className="text-sm text-gray-500">CAD / mois</div>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  <strong>Analyse IA illimitée</strong> de documents (PDF, images, Word)
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  <strong>Génération automatique</strong> de réponses aux appels d&apos;offres
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  <strong>Résumés intelligents</strong> de contrats
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Gestion complète: clients, projets, factures, devis
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Calcul automatique des taxes québécoises (TPS + TVQ)
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">Support client prioritaire</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/subscription/checkout"
              className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center font-semibold py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              S&apos;abonner maintenant - 99$ / mois
            </Link>

            <Link
              href="/subscription/info"
              className="block w-full bg-white border-2 border-gray-300 text-gray-700 text-center font-semibold py-4 rounded-lg hover:bg-gray-50 transition-all"
            >
              En savoir plus
            </Link>
          </div>

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Vous avez des questions ? Contactez-nous
            </p>
            <a
              href="mailto:support@structureclerk.ca"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              support@structureclerk.ca
            </a>
          </div>

          {/* Data Export */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Vous pouvez exporter toutes vos données avant de décider.{' '}
              <Link href="/api/export" className="underline font-medium">
                Exporter mes données
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
