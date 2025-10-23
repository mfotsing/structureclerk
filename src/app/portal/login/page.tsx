'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, AlertCircle, Lock, Shield } from 'lucide-react'

export default function PortalLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Vérifier le paramètre d'erreur
  React.useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'unauthorized') {
      setError('Accès non autorisé. Ce portail est réservé aux administrateurs.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError('Email ou mot de passe incorrect.')
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Vérifier si l'utilisateur est autorisé
        const authorizedEmails = ['info@structureclerk.ca', 'info@techvibes.ca']
        if (!data.user.email || !authorizedEmails.includes(data.user.email)) {
          await supabase.auth.signOut()
          setError('Accès non autorisé. Ce portail est réservé aux administrateurs.')
          setIsLoading(false)
          return
        }

        router.push('/portal')
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <Image
              src="/logo-icon.svg"
              alt="StructureClerk"
              width={80}
              height={80}
              className="drop-shadow-lg"
            />
          </Link>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Portail Admin</h2>
            </div>
            <p className="text-sm text-gray-300">
              Accès réservé aux administrateurs StructureClerk
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Connexion sécurisée</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Authentification à deux facteurs</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email administrateur
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none backdrop-blur-sm"
                placeholder="admin@structureclerk.ca"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none backdrop-blur-sm pr-12"
                  placeholder="•••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </>
              ) : (
                'Se connecter au portail'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">
                Accès sécurisé avec chiffrement de bout en bout
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <Link href="/forgot-password" className="hover:text-gray-300 transition-colors">
                  Mot de passe oublié?
                </Link>
                <span>•</span>
                <Link href="/" className="hover:text-gray-300 transition-colors">
                  Retour au site
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <h3 className="text-sm font-medium text-gray-200 mb-2">🔐 Sécurité du portail</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Connexion HTTPS obligatoire</li>
              <li>• Accès limité aux administrateurs autorisés</li>
              <li>• Sessions sécurisées avec expiration automatique</li>
              <li>• Journalisation des accès pour audit</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}