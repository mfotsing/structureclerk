'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Sector {
  id: string
  name: string
  title: string
  subtitle: string
  description: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  icon: string
  features: {
    icon: string
    text: string
  }[]
  imageAlt: string
}

const sectors: Sector[] = [
  {
    id: 'residential',
    name: 'Résidentiel',
    title: 'La Gestion Simplifiée',
    subtitle: 'pour les Projets Résidentiels',
    description: 'Transformez vos rénovations en succès avec des outils conçus pour les entrepreneurs en résidentiel.',
    primaryColor: '#FF6B35',
    secondaryColor: '#2E5A88',
    accentColor: '#FF9F1C',
    icon: '🏠',
    features: [
      { icon: '📋', text: 'Devis RBQ résidentiels' },
      { icon: '📅', text: 'Planning projets famille' },
      { icon: '🏠', text: 'Gestion propriétaires' },
      { icon: '💳', text: 'Paiements simplifiés' }
    ],
    imageAlt: 'Entrepreneur rénovation maison québécoise'
  },
  {
    id: 'commercial',
    name: 'Commercial',
    title: 'L\'Excellence Opérationnelle',
    subtitle: 'pour les Projets Commerciaux',
    description: 'Gérez des projets complexes avec précision et professionnalisme dans le secteur commercial.',
    primaryColor: '#2E5A88',
    secondaryColor: '#6C757D',
    accentColor: '#17A2B8',
    icon: '🏢',
    features: [
      { icon: '📊', text: 'Soumissions complexes' },
      { icon: '👥', text: 'Équipes multiples' },
      { icon: '🏛️', text: 'Permis municipaux' },
      { icon: '📈', text: 'ROI projets' }
    ],
    imageAlt: 'Gérant projet commercial centre-ville'
  },
  {
    id: 'industrial',
    name: 'Industriel',
    title: 'La Sécurité avant Tout',
    subtitle: 'pour les Chantiers Industriels',
    description: 'Maîtrisez la complexité industrielle avec des outils robustes et conformes CNESST.',
    primaryColor: '#28A745',
    secondaryColor: '#5A6C7D',
    accentColor: '#20C997',
    icon: '🏭',
    features: [
      { icon: '⚡', text: 'Projets complexes' },
      { icon: '🔒', text: 'Sécurité CNESST' },
      { icon: '📋', text: 'Documentation technique' },
      { icon: '👷', text: 'Équipes spécialisées' }
    ],
    imageAlt: 'Superviseur chantier industriel'
  },
  {
    id: 'renovation',
    name: 'Rénovation',
    title: 'L\'Efficacité Redéfinie',
    subtitle: 'pour les Projets de Rénovation',
    description: 'Accélérez vos rénovations avec une gestion multi-projets dynamique et efficace.',
    primaryColor: '#FFC107',
    secondaryColor: '#2E5A88',
    accentColor: '#FD7E14',
    icon: '🔧',
    features: [
      { icon: '🚀', text: 'Interventions rapides' },
      { icon: '📞', text: 'Gestion clients' },
      { icon: '🛠️', text: 'Multi-projets' },
      { icon: '💫', text: 'Service après-vente' }
    ],
    imageAlt: 'Entrepreneur multi-projets dynamique'
  }
]

export default function SectorHeroRotator() {
  const [activeSector, setActiveSector] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNextSector()
          return 0
        }
        return prev + 1.25 // 100% / 8 secondes / 10 updates per second
      })
    }, 100)

    return () => clearInterval(interval)
  }, [activeSector])

  const handleSectorChange = (index: number) => {
    if (index !== activeSector && !isAnimating) {
      setIsAnimating(true)
      setProgress(0)
      setTimeout(() => {
        setActiveSector(index)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleNextSector = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setProgress(0)
      setTimeout(() => {
        setActiveSector((prev) => (prev + 1) % sectors.length)
        setIsAnimating(false)
      }, 300)
    }
  }

  const sector = sectors[activeSector]

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full transition-all duration-100 ease-linear"
          style={{ 
            width: `${progress}%`,
            backgroundColor: sector.primaryColor 
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content - 60% on desktop */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="text-center lg:text-left">
              {/* Sector Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ 
                  backgroundColor: `${sector.primaryColor}10`,
                  color: sector.primaryColor 
                }}
              >
                <span className="text-2xl">{sector.icon}</span>
                <span className="font-semibold text-sm">{sector.name}</span>
              </div>

              {/* Main Title */}
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
                style={{ color: sector.secondaryColor }}
              >
                {sector.title}
              </h1>
              
              <h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6"
                style={{ color: sector.primaryColor }}
              >
                {sector.subtitle}
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                {sector.description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                {sector.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button 
                  variant="primary" 
                  size="xl"
                  className="shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  style={{ backgroundColor: sector.primaryColor }}
                >
                  Commencer Gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="border-2 hover:bg-gray-50"
                  style={{ 
                    borderColor: sector.secondaryColor,
                    color: sector.secondaryColor 
                  }}
                >
                  Voir la Démo
                </Button>
              </div>

              {/* Sector Selector */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {sectors.map((sect, index) => (
                  <button
                    key={sect.id}
                    onClick={() => handleSectorChange(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                      activeSector === index
                        ? 'shadow-md transform scale-105'
                        : 'hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: activeSector === index ? 'white' : 'transparent',
                      borderColor: activeSector === index ? sect.primaryColor : '#e5e7eb',
                      color: activeSector === index ? sect.primaryColor : '#6b7280'
                    }}
                  >
                    <span className="text-lg">{sect.icon}</span>
                    <span className="text-sm font-medium hidden sm:inline">{sect.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image - 40% on desktop */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="relative">
              {/* Placeholder for sector image */}
              <div 
                className="rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br aspect-video lg:aspect-square flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${sector.primaryColor}20, ${sector.secondaryColor}20)`
                }}
              >
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">{sector.icon}</div>
                  <p className="text-lg font-medium" style={{ color: sector.secondaryColor }}>
                    {sector.imageAlt}
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    {sector.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center gap-1 text-sm">
                        <span>{feature.icon}</span>
                        <CheckCircle className="w-4 h-4" style={{ color: sector.primaryColor }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20"
                style={{ backgroundColor: sector.accentColor }}
              />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20"
                style={{ backgroundColor: sector.primaryColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Image (show on mobile only) */}
      <div className="lg:hidden px-4 pb-8">
        <div 
          className="rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br aspect-video flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${sector.primaryColor}20, ${sector.secondaryColor}20)`
          }}
        >
          <div className="text-center p-6">
            <div className="text-5xl mb-3">{sector.icon}</div>
            <p className="text-base font-medium" style={{ color: sector.secondaryColor }}>
              {sector.imageAlt}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}