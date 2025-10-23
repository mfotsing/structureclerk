'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ModernBackground from '@/components/ui/ModernBackground'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModernBackground variant="auth">
      <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo-icon.svg"
              alt="StructureClerk Icon"
              width={80}
              height={80}
              className="drop-shadow-lg sm:w-100 sm:h-100"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="text-brand-navy">Structure</span>
            <span className="text-brand-orange">Clerk</span>
          </h1>
          <p className="text-brand-gray text-sm sm:text-base">Connectez-vous à votre compte</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-brand-blue/20">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-navy mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-brand-navy">
                  Mot de passe
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-orange hover:text-orange-600 font-medium"
                >
                  Mot de passe oublié?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-brand-gray">
              Pas encore de compte?{' '}
              <Link href="/signup" className="text-brand-orange hover:text-orange-600 font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-brand-gray mt-8">
          Votre assistant intelligent pour la gestion de construction
        </p>
        </div>
      </div>
    </ModernBackground>
  )
}
