'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Check, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Footer from '@/components/Footer'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'

export default function DemoPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="w-full py-4 px-4 sm:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-icon.svg"
              alt="StructureClerk"
              width={40}
              height={40}
              className="drop-shadow-sm"
            />
            <span className="text-2xl font-bold hidden sm:block">
              <span className="text-brand-navy">Structure</span>
              <span className="text-brand-orange">Clerk</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="px-6 py-2 bg-white text-brand-navy border-2 border-brand-navy rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm sm:text-base shadow-sm"
            >
              {t('auth.loginButton')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
            Découvrez StructureClerk en Action
          </h1>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto">
            Voyez comment notre plateforme IA simplifie la gestion administrative pour les entrepreneurs en construction au Québec
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-2xl p-4 border-2 border-brand-blue/20">
            <div className="aspect-video bg-gradient-to-br from-brand-navy to-brand-blue rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-navy/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-12 h-12 text-white ml-2" />
                  </div>
                  <p className="text-white text-xl font-semibold">Vidéo de démonstration</p>
                  <p className="text-blue-200 text-sm mt-2">Durée: 3 minutes</p>
                </div>
              </div>
              <Image
                src="/logo-icon.svg"
                alt="Demo Background"
                width={400}
                height={400}
                className="opacity-10"
              />
            </div>
          </div>
        </div>

        {/* Features Demo List */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-8 text-center">
            Ce que vous verrez dans la démo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Création de facture en 3 clics',
              'Extraction automatique de données avec IA',
              'Calcul automatique TPS/TVQ',
              'Gestion de projets de construction',
              'Prévisions financières intelligentes',
              'Dashboard en temps réel',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md">
                <Check className="w-6 h-6 text-brand-orange flex-shrink-0" />
                <span className="text-brand-navy font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-brand-navy to-brand-blue rounded-2xl shadow-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à essayer StructureClerk?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Commencez votre essai gratuit de 30 jours. Aucune carte de crédit requise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-10 py-4 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Essayer Gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="mailto:info@structureclerk.ca?subject=Demande de démo personnalisée"
                className="px-10 py-4 bg-white text-brand-navy rounded-lg hover:bg-blue-50 transition-colors font-bold"
              >
                Demander une démo personnalisée
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <p className="text-brand-gray mb-4">
            Des questions? Notre équipe est là pour vous aider.
          </p>
          <a
            href="mailto:info@structureclerk.ca"
            className="text-brand-orange hover:text-orange-600 font-semibold underline"
          >
            info@structureclerk.ca
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
