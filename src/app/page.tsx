'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Users, TrendingUp, Globe } from 'lucide-react'
import FrustrationHero from '@/components/scorecard/FrustrationHero'
import TransformationSection from '@/components/scorecard/TransformationSection'
import ValueProposition from '@/components/scorecard/ValueProposition'
import SocialProofBar from '@/components/social/SocialProofBar'
import TrustIndicators from '@/components/social/TrustIndicators'
import Testimonials from '@/components/social/Testimonials'
import AnimatedStatsSection from '@/components/ui/AnimatedStatsSection'
import { useRouter, usePathname } from 'next/navigation'

export default function HomePage() {
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = pathname.startsWith('/en') ? 'en' : 'fr'

  const changeLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, '') || '/'
    const targetPath = newLocale === 'en' ? `/en${newPath}` : newPath
    router.push(targetPath)
    setLanguageMenuOpen(false)
  }

  // Track when hero section is out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCTA(!entry.isIntersecting && entry.boundingClientRect.top < 0)
        setHeroVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Analytics tracking
  useEffect(() => {
    // Track page view
    console.log('Track Event: page_view', { page: 'landing_optimized' })
  }, [])

  const handlePrimaryCTA = () => {
    // Track CTA click
    console.log('Track Event: primary_cta_click', { source: 'hero' })

    // Navigate to scorecard
    window.location.href = '/scorecard?scorecard=scorecard'
  }

  
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navigation - with language selector */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-icon.svg"
                alt="StructureClerk"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-gray-900">
                <span className="text-blue-900">Structure</span>
                <span className="text-orange-500">Clerk</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLocale === 'en' ? 'EN' : 'FR'}</span>
                </button>

                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <button
                      onClick={() => changeLanguage('fr')}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                        currentLocale === 'fr' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      FR
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                        currentLocale === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                )}
              </div>

              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section avec CTA Principal Unique */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-gray-900/20"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center">
            
            {/* Hero Content */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className={`transition-all duration-1000 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* Frustration Hooks Rotating */}
                <FrustrationHero />

                {/* Main CTA - Above the Fold, Single Focus */}
                <div className={`mt-8 transition-all duration-1000 delay-300 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <button
                    onClick={handlePrimaryCTA}
                    className="group relative px-12 py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-orange-500/50 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <span>Calculer mon score de chaos administratif</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="block text-sm font-normal mt-2 text-orange-100">
                      Questionnaire de 10 questions • 2 minutes • Résultats immédiats
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA for Mobile - Appears when hero is out of view */}
      {showStickyCTA && (
        <div className="fixed bottom-6 left-0 right-0 z-40 md:hidden">
          <div className="max-w-md mx-auto px-4">
            <button
              onClick={handlePrimaryCTA}
              className="w-full px-6 py-3 bg-orange-500 text-white font-medium rounded-full shadow-lg flex items-center justify-center gap-2"
            >
              <span>Calculer mon score</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Social Proof Bar */}
      <SocialProofBar />

      {/* Transformation Section - Text Only, No CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TransformationSection />
        </div>
      </section>

      {/* Value Proposition - Text Only, No CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ValueProposition />
        </div>
      </section>

      {/* Social Proof & Trust Indicators */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi 127 entrepreneurs nous font confiance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez comment StructureClerk transforme la gestion d'entreprise avec une IA précise et fiable
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <TrustIndicators variant="full" />
            </div>
            <div>
              <Testimonials variant="featured" />
            </div>
          </div>

          <Testimonials variant="grid" maxItems={3} />
        </div>
      </section>

      {/* Footer - Navigation Links Only */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Image
                  src="/logo-icon.svg"
                  alt="StructureClerk"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <span className="text-xl font-bold">
                  <span className="text-white">Structure</span>
                  <span className="text-orange-500">Clerk</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                L'IA qui transforme vos documents en décisions. Spécialement conçu pour les entrepreneurs du bâtiment.
              </p>
              {/* Réseaux sociaux - Instagram et LinkedIn uniquement */}
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/structureclerk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/structureclerk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/pricing" className="hover:text-orange-400 transition-colors">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="/portal/login" className="hover:text-orange-400 transition-colors font-medium">
                    🔐 Portail Entreprise
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-orange-400 transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-orange-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-orange-400 transition-colors">
                    Carrières
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/support" className="hover:text-orange-400 transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/qa" className="hover:text-orange-400 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>
              © 2025 StructureClerk. Un produit de TechVibes.
            </p>
            <div className="flex space-x-6 mt-4 justify-center">
              <Link href="/privacy" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
