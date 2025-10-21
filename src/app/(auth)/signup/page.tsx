'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import ModernBackground from '@/components/ui/ModernBackground'

export default function SignupPage() {
  const t = useTranslations()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const router = useRouter()
  const supabase = createClient()

  const validatePassword = (pwd: string) => {
    const errors = []
    if (pwd.length < 8) errors.push("Le mot de passe doit contenir au moins 8 caractères")
    if (!/[A-Z]/.test(pwd)) errors.push("Le mot de passe doit contenir au moins une majuscule")
    if (!/[a-z]/.test(pwd)) errors.push("Le mot de passe doit contenir au moins une minuscule")
    if (!/[0-9]/.test(pwd)) errors.push("Le mot de passe doit contenir au moins un chiffre")
    return errors
  }

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd)
    setValidationErrors(validatePassword(pwd))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    // Validate password strength
    const errors = validatePassword(password)
    if (errors.length > 0) {
      setError(errors[0])
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) throw error

      // Show success message instead of redirecting
      setError(null)
      setLoading(false)
      // You could show a success message here or redirect to a confirmation page
      router.push('/login?message=signup-success')
    } catch (error: any) {
      setError(error.message || t('common.error'))
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
            <p className="text-brand-gray text-sm sm:text-base">{t('auth.createAccount')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-brand-blue/20">
            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-navy mb-2">
                  {t('auth.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                  placeholder={t('auth.emailPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brand-navy mb-2">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                    placeholder="••••••••"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-navy mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password || validationErrors.length > 0}
                className="w-full bg-brand-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? t('auth.creatingAccount') : t('auth.createMyAccount')}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-brand-gray">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link href="/login" className="text-brand-orange hover:text-orange-600 font-medium">
                  {t('auth.loginButton')}
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-brand-gray mt-8">
            {t('auth.termsAcceptance')}
          </p>
        </div>
      </div>
    </ModernBackground>
  )
}
