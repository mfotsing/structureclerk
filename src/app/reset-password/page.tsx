'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  useEffect(() => {
    // Check if we have a valid recovery token
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setError('Lien de réinitialisation invalide ou expiré')
      }
    }

    checkSession()
  }, [])

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = []

    if (pwd.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères')
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule')
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule')
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre')
    }

    return errors
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setValidationErrors(validatePassword(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    // Validate password strength
    const errors = validatePassword(password)
    if (errors.length > 0) {
      setError('Le mot de passe ne respecte pas les critères de sécurité')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      console.error('Reset password error:', err)
      setError(err.message || 'Une erreur est survenue lors de la réinitialisation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!success ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-brand-orange" />
                </div>
                <h1 className="text-2xl font-bold text-brand-navy mb-2">
                  Nouveau mot de passe
                </h1>
                <p className="text-gray-600">
                  Choisissez un mot de passe sécurisé pour votre compte
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password strength indicators */}
                  {password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={`text-xs ${password.length >= 8 ? 'text-green-700' : 'text-gray-500'}`}>
                          Au moins 8 caractères
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={`text-xs ${/[A-Z]/.test(password) ? 'text-green-700' : 'text-gray-500'}`}>
                          Une majuscule
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={`text-xs ${/[a-z]/.test(password) ? 'text-green-700' : 'text-gray-500'}`}>
                          Une minuscule
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={`text-xs ${/[0-9]/.test(password) ? 'text-green-700' : 'text-gray-500'}`}>
                          Un chiffre
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-2 text-xs text-red-600">
                      Les mots de passe ne correspondent pas
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Les mots de passe correspondent
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword || password !== confirmPassword || validationErrors.length > 0}
                  className="w-full px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-brand-navy mb-2">
                  Mot de passe réinitialisé!
                </h1>
                <p className="text-gray-600 mb-6">
                  Votre mot de passe a été modifié avec succès.
                  Vous allez être redirigé vers la page de connexion...
                </p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-semibold"
                >
                  Se connecter maintenant
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
