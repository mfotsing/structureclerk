'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Footer from '@/components/Footer'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import AnimatedNumber from '@/components/home/AnimatedNumber'

export default function Home() {
  const t = useTranslations()

  // Success examples data
  const successExamples = [
    {
      title: "Construction commerciale",
      description: "Gestion de 450+ documents avec 30% d'économie de temps",
      metrics: ["450 documents", "30% temps gagné", "0 erreurs"],
      icon: "🏢"
    },
    {
      title: "Construction résidentielle",
      description: "Centralisation de 3 projets simultanés avec validation en 24h",
      metrics: ["3 projets", "24h validation", "100% conforme"],
      icon: "🏘️"
    },
    {
      title: "Travailleur autonome",
      description: "Automatisation complète des factures et soumissions",
      metrics: ["200+ factures", "Auto-classées", "IA intégrée"],
      icon: "🏗️"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-ui-background via-white to-ui-background-secondary">
      {/* Header with Login Button & Language Switcher */}
      <header className="w-full py-4 px-4 sm:px-6">
        <div className="container mx-auto flex justify-end items-center gap-4">
          <LanguageSwitcher />
          <Link href="/login">
            <Button variant="outline" size="sm">
              Connexion
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/logo-full.svg"
                alt="StructureClerk"
                width={600}
                height={150}
                className="w-full max-w-2xl h-auto"
              />
            </div>

            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-4 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight">
                La GED Intelligente pour
                <span className="text-brand-orange block">les Professionnels BTP</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-ui-text-secondary max-w-3xl mx-auto leading-relaxed font-medium">
                Automatisez la gestion de vos documents avec l&apos;IA.
                <strong className="text-brand-navy"> Gagnez 30% de temps</strong> sur vos tâches administratives.
              </p>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 pt-8">
                <Link href="/signup">
                  <Button variant="primary" size="xl" className="shadow-assembly-lg hover:shadow-assembly-xl transform hover:-translate-y-1 transition-all duration-200">
                    Commencer Gratuitement
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="xl">
                    Voir la Démo
                  </Button>
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-ui-text-muted pt-4">
                <svg className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Approuvé par les entrepreneurs du Québec</span>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 py-16">
              <Card variant="elevated" padding="lg" className="text-center">
                <div className="text-4xl font-bold text-brand-orange mb-2">
                  <AnimatedNumber end={30} suffix="%" />
                </div>
                <p className="text-sm text-ui-text-secondary font-medium">Temps économisé</p>
              </Card>
              <Card variant="elevated" padding="lg" className="text-center">
                <div className="text-4xl font-bold text-brand-navy mb-2">
                  <AnimatedNumber end={100} suffix="%" />
                </div>
                <p className="text-sm text-ui-text-secondary font-medium">Documents centralisés</p>
              </Card>
              <Card variant="elevated" padding="lg" className="text-center">
                <div className="text-4xl font-bold text-ui-success mb-2">
                  <AnimatedNumber end={0} />
                </div>
                <p className="text-sm text-ui-text-secondary font-medium">Erreurs de saisie</p>
              </Card>
            </div>

            {/* Success Examples Section */}
            <div className="mt-32">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-navy mb-4">
                Cas d'usage
              </h2>
              <p className="text-center text-ui-text-secondary text-lg mb-16 max-w-2xl mx-auto">
                Découvrez par ces exemples comment vous pouvez transformer votre gestion documentaire
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                {successExamples.map((example, index) => (
                  <Card 
                    key={index} 
                    variant="elevated" 
                    padding="lg" 
                    className="hover:shadow-assembly-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <CardHeader>
                      <div className="text-4xl mb-4">{example.icon}</div>
                      <CardTitle className="text-xl text-brand-navy">
                        {example.title}
                      </CardTitle>
                      <CardDescription className="text-ui-text-secondary">
                        {example.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {example.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-brand-orange mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-ui-text">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-48">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-navy mb-4">
                L'IA au Service de Votre Productivité
              </h2>
              <p className="text-center text-ui-text-secondary text-lg mb-16 max-w-2xl mx-auto">
                Une plateforme conçue pour les exigences du secteur BTP
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1: AI-Powered */}
                <Card variant="default" padding="lg" className="hover:border-brand-orange/50 transition-all duration-300">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-xl flex items-center justify-center mb-6 shadow-assembly-md">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl text-brand-navy">Upload Intelligent</CardTitle>
                    <CardDescription>
                      L&apos;IA analyse, classe et extrait automatiquement vos données
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-ui-text-secondary">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Reconnaissance automatique des documents</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Extraction des données clés</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Classement par projet automatique</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Feature 2: Quebec-Specific */}
                <Card variant="default" padding="lg" className="hover:border-brand-orange/50 transition-all duration-300">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-navy to-brand-navy-dark rounded-xl flex items-center justify-center mb-6 shadow-assembly-md">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl text-brand-navy">Conforme Québec</CardTitle>
                    <CardDescription>
                      Adapté aux normes et exigences du marché québécois
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-ui-text-secondary">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Taxes TPS/TVQ automatiques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Normes RBQ intégrées</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Rapports conformes CNESST</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Feature 3: All-in-One */}
                <Card variant="default" padding="lg" className="hover:border-brand-orange/50 transition-all duration-300">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-blue-dark rounded-xl flex items-center justify-center mb-6 shadow-assembly-md">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl text-brand-navy">Tout-en-Un</CardTitle>
                    <CardDescription>
                      Centralisez tous vos documents et collaborations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-ui-text-secondary">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Stockage cloud sécurisé</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Travail d&apos;équipe en temps réel</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Accès mobile sur chantier</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Final CTA Section */}
            <div className="mt-32 bg-gradient-to-br from-brand-navy to-brand-navy-dark rounded-2xl p-12 text-center text-white shadow-assembly-xl">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Prêt à Révolutionner Votre Gestion ?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Rejoignez les entrepreneurs qui gagnent 30% de temps avec StructureClerk
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button variant="primary" size="xl" className="bg-brand-orange hover:bg-brand-orange-dark text-white shadow-assembly-lg hover:shadow-assembly-xl transform hover:-translate-y-1 transition-all duration-200">
                    Commencer Gratuitement
                  </Button>
                </Link>
                <Link href="/qa">
                  <Button variant="secondary" size="xl" className="bg-white text-brand-navy hover:bg-ui-background-hover">
                    Demander une Démo
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-blue-200 mt-6">
                ✨ Sans engagement • Annulation à tout moment • Support québécois
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky CTA Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-brand-orange shadow-lg p-4 sm:hidden z-50">
        <Link href="/signup">
          <Button variant="primary" className="w-full">
            Commencer Gratuitement
          </Button>
        </Link>
      </div>

      <Footer />
    </div>
  )
}
