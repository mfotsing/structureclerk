'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Footer from '@/components/Footer'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import TypewriterSlideshow from '@/components/home/TypewriterSlideshow'

export default function Home() {
  const t = useTranslations()

  // Phrases for the typewriter slideshow
  const heroPhrasesValue = [
    t('homepage.hero.headline'),
    t('homepage.hero.headlineAccent'),
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-orange-50">
      {/* Header with Login Button & Language Switcher */}
      <header className="w-full py-4 px-4 sm:px-6">
        <div className="container mx-auto flex justify-end items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="px-6 py-2 bg-white text-brand-navy border-2 border-brand-navy rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm sm:text-base shadow-sm"
          >
            {t('auth.loginButton')}
          </Link>
        </div>
      </header>

      <main className="flex-1">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/logo-full.svg"
              alt={t('common.tagline')}
              width={600}
              height={150}
              className="w-full max-w-2xl h-auto"
            />
          </div>

          {/* Problem Statement - Crée connexion émotionnelle */}
          <p className="text-xl sm:text-2xl text-brand-gray max-w-3xl mx-auto px-4 font-medium">
            {t('homepage.hero.problem')}
          </p>

          {/* Hero Headline with Typewriter Animation */}
          <div className="max-w-4xl mx-auto px-4">
            <TypewriterSlideshow
              phrases={heroPhrasesValue}
              typingSpeed={50}
              pauseDuration={3000}
            />
          </div>

          {/* UVP Québec - Adaptation locale explicite */}
          <p className="text-lg sm:text-xl text-brand-gray max-w-3xl mx-auto px-4 leading-relaxed">
            <strong className="text-brand-navy">{t('homepage.hero.uvp')}</strong>, {t('homepage.hero.uvpDetails')}
          </p>

          {/* Stats / Bénéfices concrets - Preuves visuelles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-brand-orange/20">
              <div className="text-4xl font-bold text-brand-orange mb-2">30%</div>
              <p className="text-sm text-brand-gray">{t('homepage.stats.timeSaved')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-brand-navy/20">
              <div className="text-4xl font-bold text-brand-navy mb-2">100%</div>
              <p className="text-sm text-brand-gray">{t('homepage.stats.centralized')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-500/20">
              <div className="text-4xl font-bold text-green-600 mb-2">0</div>
              <p className="text-sm text-brand-gray">{t('homepage.stats.taxErrors')}</p>
            </div>
          </div>

          {/* Social Proof Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-brand-gray">
            <svg className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{t('homepage.hero.trustBadge')}</span>
          </div>

          {/* CTAs - Principal + Secondaire */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link
              href="/signup"
              className="px-8 sm:px-10 py-4 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center text-lg"
            >
              {t('homepage.hero.cta')}
            </Link>
            <a
              href="#features"
              className="px-8 sm:px-10 py-4 bg-white text-brand-navy border-2 border-brand-navy rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center"
            >
              {t('homepage.hero.ctaSecondary')}
            </a>
          </div>

          {/* Trust indicators */}
          <p className="text-sm text-brand-gray italic">
            &ldquo;{t('homepage.hero.testimonial')}&rdquo;
          </p>
        </div>

        {/* Features Section - Verbes d'action + Hiérarchie */}
        <div id="features" className="mt-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-navy mb-4">
            {t('homepage.features.title')}
          </h2>
          <p className="text-center text-brand-gray text-lg mb-16 max-w-2xl mx-auto">
            {t('homepage.features.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: AI-Powered - Verbes d'action */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-brand-blue/20 hover:border-brand-orange transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-brand-navy">{t('homepage.features.ai.title')}</h3>
              <p className="text-brand-gray mb-4 leading-relaxed">
                <strong className="text-brand-navy">{t('homepage.features.ai.description')}</strong>
              </p>
              <ul className="space-y-2 text-sm text-brand-gray">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('homepage.features.ai.feature1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('homepage.features.ai.feature2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('homepage.features.ai.feature3')}</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Quebec-Specific - Mots-clés SEO */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-brand-blue/20 hover:border-brand-orange transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-navy to-blue-900 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-brand-navy">{t('homepage.features.compliance.title')}</h3>
              <p className="text-brand-gray mb-4 leading-relaxed">
                <strong className="text-brand-navy">{t('homepage.features.compliance.description')}</strong>
              </p>
              <ul className="space-y-2 text-sm text-brand-gray">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('homepage.features.compliance.feature1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('homepage.features.compliance.feature2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('homepage.features.compliance.feature3')}</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: All-in-One - Collaboration */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-brand-blue/20 hover:border-brand-orange transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-brand-navy">{t('homepage.features.centralized.title')}</h3>
              <p className="text-brand-gray mb-4 leading-relaxed">
                <strong className="text-brand-navy">{t('homepage.features.centralized.description')}</strong>
              </p>
              <ul className="space-y-2 text-sm text-brand-gray">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('homepage.features.centralized.feature1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('homepage.features.centralized.feature2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('homepage.features.centralized.feature3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA Section - Sticky on mobile */}
        <div className="mt-32 bg-gradient-to-br from-brand-navy to-blue-900 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('homepage.finalCta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('homepage.finalCta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-block px-10 py-4 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
            >
              {t('homepage.finalCta.cta')}
            </Link>
            <Link
              href="/qa"
              className="inline-block px-10 py-4 bg-white text-brand-navy rounded-lg hover:bg-blue-50 transition-all font-semibold text-lg"
            >
              {t('homepage.finalCta.ctaDemo')}
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            {t('homepage.finalCta.trust')}
          </p>
        </div>
      </div>
      </main>

      {/* Sticky CTA Mobile - Visible seulement mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-brand-orange shadow-lg p-4 sm:hidden z-50">
        <Link
          href="/signup"
          className="block w-full px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-bold text-center"
        >
          {t('homepage.hero.cta')}
        </Link>
      </div>

      <Footer />
    </div>
  )
}
