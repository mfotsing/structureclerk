'use client'

import { useState, useEffect } from 'react'
import { useUserSegmentation } from '@/contexts/UserSegmentationContext'
import {
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
  Users,
  Zap,
  Target,
  BarChart3,
  Lightbulb,
  CheckCircle
} from 'lucide-react'

interface FeatureRecommendation {
  id: string
  title: string
  description: string
  icon: any
  benefit: string
  timeToValue: string
  url: string
  priority: 'high' | 'medium' | 'low'
  category: 'productivity' | 'insights' | 'collaboration' | 'automation'
}

interface FeatureRecommendationsProps {
  maxItems?: number
  className?: string
}

export default function FeatureRecommendations({
  maxItems = 3,
  className = ""
}: FeatureRecommendationsProps) {
  const { segment, journeyData, isLoaded } = useUserSegmentation()
  const [recommendations, setRecommendations] = useState<FeatureRecommendation[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])

  // Get recommendations based on user segment and journey
  const getRecommendationsForSegment = (segment: string, journeyData: any): FeatureRecommendation[] => {
    const baseRecommendations: FeatureRecommendation[] = [
      {
        id: 'smart-quotes',
        title: 'Devis Intelligent',
        description: 'Créez des devis en parlant à votre caméra',
        icon: Sparkles,
        benefit: 'Gain de temps: 15min/devi',
        timeToValue: '2 min',
        url: '/dashboard/smart-quotes/create',
        priority: 'high',
        category: 'productivity'
      },
      {
        id: 'invoice-extraction',
        title: 'Extraction IA de Factures',
        description: 'Scannez et extrayez les données en 10 secondes',
        icon: Zap,
        benefit: 'Précision: 94%',
        timeToValue: '30 sec',
        url: '/dashboard/invoices/extract',
        priority: 'high',
        category: 'automation'
      },
      {
        id: 'forecasts',
        title: 'Prévisions Financières',
        description: 'Anticipez vos revenus et cash-flow',
        icon: TrendingUp,
        benefit: 'Visibilité +85%',
        timeToValue: '5 min',
        url: '/dashboard/forecasts',
        priority: 'medium',
        category: 'insights'
      },
      {
        id: 'metrology',
        title: 'Caméra Métrique',
        description: 'Mesures automatiques avec IA',
        icon: Target,
        benefit: 'Précision: 98%',
        timeToValue: '1 min',
        url: '/dashboard/metrology/camera',
        priority: 'medium',
        category: 'productivity'
      },
      {
        id: 'approvals',
        title: 'Approbations Multi-niveaux',
        description: 'Workflow d\'approbation personnalisé',
        icon: CheckCircle,
        benefit: 'Contrôle total',
        timeToValue: '3 min',
        url: '/dashboard/approvals',
        priority: 'medium',
        category: 'collaboration'
      },
      {
        id: 'timesheets',
        title: 'Feuilles de Temps Mobile',
        description: 'Suivez le temps sur chantier',
        icon: Clock,
        benefit: 'Facturation précise',
        timeToValue: '2 min',
        url: '/dashboard/timesheets/mobile',
        priority: 'low',
        category: 'productivity'
      }
    ]

    // Filter recommendations based on segment and what user has already tried
    let filtered = baseRecommendations.filter(rec => {
      // Remove if user has already used this feature
      const featureKey = rec.id.replace('-', '_')
      if (journeyData[`hasUsed${featureKey.charAt(0).toUpperCase() + featureKey.slice(1)}`]) {
        return false
      }

      // Remove if dismissed
      if (dismissed.includes(rec.id)) {
        return false
      }

      // Segment-specific filtering
      switch (segment) {
        case 'beginner':
          return rec.priority === 'high' && rec.category === 'productivity'

        case 'solo_contractor':
          return rec.priority === 'high' || (rec.priority === 'medium' && rec.category === 'automation')

        case 'small_business':
          return rec.priority === 'high' || (rec.priority === 'medium' && rec.category !== 'collaboration')

        case 'growth_business':
          return rec.priority !== 'low'

        case 'enterprise':
        case 'power_user':
          return true

        default:
          return rec.priority === 'high'
      }
    })

    // Sort by priority and relevance
    const priorityWeight = { high: 3, medium: 2, low: 1 }
    filtered.sort((a, b) => {
      const scoreA = priorityWeight[a.priority]
      const scoreB = priorityWeight[b.priority]
      return scoreB - scoreA
    })

    return filtered.slice(0, maxItems)
  }

  useEffect(() => {
    if (isLoaded) {
      const recs = getRecommendationsForSegment(segment, journeyData)
      setRecommendations(recs)

      // Load dismissed recommendations from localStorage
      const dismissedRecs = localStorage.getItem('dismissed_recommendations')
      if (dismissedRecs) {
        setDismissed(JSON.parse(dismissedRecs))
      }
    }
  }, [segment, journeyData, isLoaded, maxItems])

  const handleDismiss = (recId: string) => {
    const updatedDismissed = [...dismissed, recId]
    setDismissed(updatedDismissed)
    localStorage.setItem('dismissed_recommendations', JSON.stringify(updatedDismissed))

    // Update recommendations
    const recs = getRecommendationsForSegment(segment, journeyData)
    setRecommendations(recs)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return <Zap className="w-4 h-4 text-orange-500" />
      case 'insights': return <BarChart3 className="w-4 h-4 text-blue-500" />
      case 'collaboration': return <Users className="w-4 h-4 text-purple-500" />
      case 'automation': return <Sparkles className="w-4 h-4 text-green-500" />
      default: return <Lightbulb className="w-4 h-4 text-gray-500" />
    }
  }

  if (!isLoaded || recommendations.length === 0) {
    return null
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recommandé pour vous
            </h3>
            <p className="text-sm text-gray-600">
              Basé sur votre profil: <span className="font-medium capitalize">{segment.replace('_', ' ')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-100">
                  <rec.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  {getCategoryIcon(rec.category)}
                </div>

                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{rec.benefit}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Valeur en {rec.timeToValue}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={rec.url}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Essayer maintenant
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDismiss(rec.id)}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Masquer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicator */}
      <div className="mt-6 pt-4 border-t border-blue-100">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Adapté à votre usage</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-blue-500" />
            <span>Éprouvé par 127+ entrepreneurs</span>
          </div>
        </div>
      </div>
    </div>
  )
}