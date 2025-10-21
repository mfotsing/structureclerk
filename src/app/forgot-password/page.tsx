'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full">
        {/* Back link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-orange transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Retour à la connexion</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {!success ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-brand-orange" />
                </div>
                <h1 className="text-2xl font-bold text-brand-navy mb-2">
                  Mot de passe oublié?
                </h1>
                <p className="text-gray-600">
                  Pas de problème. Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    placeholder="votre@email.com"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                </button>
              </form>

              {/* Help text */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Vous vous souvenez de votre mot de passe?{' '}
                <Link href="/login" className="text-brand-orange hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-brand-navy mb-2">
                  Email envoyé!
                </h1>
                <p className="text-gray-600 mb-6">
                  Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
                </p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Vérifiez votre boîte de réception</strong>
                  </p>
                  <p className="text-sm text-blue-700 mt-2">
                    Le lien expirera dans 60 minutes. Si vous ne voyez pas l&apos;email, vérifiez votre dossier spam.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSuccess(false)
                      setEmail('')
                    }}
                    className="w-full px-6 py-3 bg-white text-brand-navy border-2 border-brand-navy rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                  >
                    Envoyer à une autre adresse
                  </button>
                  <Link
                    href="/login"
                    className="block w-full px-6 py-3 text-center bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-semibold"
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Additional help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Besoin d&apos;aide?{' '}
            <Link href="/qa" className="text-brand-orange hover:underline">
              Contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
