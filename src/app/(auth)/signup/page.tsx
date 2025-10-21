'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

export default function SignupPage() {
  const t = useTranslations()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create organization
        const slug = organizationName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: organizationName,
            slug: `${slug}-${Date.now().toString(36)}`,
          })
          .select()
          .single()

        if (orgError) throw orgError

        // Update profile with organization
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            organization_id: orgData.id,
            role: 'owner',
          })
          .eq('id', authData.user.id)

        if (profileError) throw profileError

        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 2000)
      }
    } catch (error: any) {
      setError(error.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-orange-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-brand-blue/20">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-2">{t('auth.accountCreatedSuccess')}</h2>
            <p className="text-brand-gray">{t('auth.redirectingToDashboard')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-orange-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo-icon.svg"
              alt="StructureClerk Icon"
              width={100}
              height={100}
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-brand-navy">Structure</span>
            <span className="text-brand-orange">Clerk</span>
          </h1>
          <p className="text-brand-gray">{t('auth.signUpForAccount')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-brand-blue/20">
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-brand-navy mb-2">
                {t('auth.companyName')}
              </label>
              <input
                id="organizationName"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                placeholder={t('auth.companyNamePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-brand-navy mb-2">
                {t('auth.fullName')}
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                placeholder={t('auth.fullNamePlaceholder')}
              />
            </div>

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
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                placeholder="••••••••"
              />
              <p className="text-xs text-brand-gray mt-1">{t('auth.passwordMinLength')}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
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
  )
}
