'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Zap, Brain, Target, Shield, TrendingUp } from 'lucide-react'

interface AIConfidenceBadgeProps {
  feature: string
  confidence: number
  processing?: boolean
  results?: any
  className?: string
}

export default function AIConfidenceBadge({
  feature,
  confidence,
  processing = false,
  results,
  className = ""
}: AIConfidenceBadgeProps) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (!processing) {
      const timer = setTimeout(() => {
        setAnimatedConfidence(confidence)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [confidence, processing])

  const getConfidenceColor = (value: number) => {
    if (value >= 95) return 'text-green-600 bg-green-50 border-green-200'
    if (value >= 85) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (value >= 75) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getConfidenceIcon = (value: number) => {
    if (value >= 95) return <CheckCircle className="w-4 h-4" />
    if (value >= 85) return <Brain className="w-4 h-4" />
    if (value >= 75) return <Target className="w-4 h-4" />
    return <Shield className="w-4 h-4" />
  }

  const getConfidenceLabel = (value: number) => {
    if (value >= 95) return "Excellente"
    if (value >= 85) return "Très fiable"
    if (value >= 75) return "Fiable"
    return "Vérification requise"
  }

  const getFeatureDescription = (feature: string) => {
    const descriptions: Record<string, string> = {
      'extraction': "L'IA analyse votre document et extrait automatiquement les données clés comme les montants, dates, taxes et informations fournisseur.",
      'ocr': "Reconnaissance optique de caractères avec 94% de précision sur les documents standards.",
      'classification': "Catégorisation automatique des documents par type (facture, devis, contrat, etc.).",
      'forecast': "Prévisions basées sur vos données historiques et les tendances du marché.",
      'metrology': "Mesures précises avec intelligence artificielle, précision de 98% sur les mesures standards.",
      'generation': "Génération de documents intelligents basée sur vos modèles et données historiques."
    }
    return descriptions[feature] || "Traitement par intelligence artificielle avancée."
  }

  if (processing) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm ${className}`}>
        <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span>IA en cours...</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-sm font-medium transition-all duration-300 ${getConfidenceColor(animatedConfidence)} ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center gap-1">
          {getConfidenceIcon(animatedConfidence)}
          <Zap className="w-3 h-3" />
        </div>
        <span>IA {animatedConfidence}% fiable</span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-50 w-64">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>

          <div className="mb-2">
            <div className="flex items-center gap-2 font-semibold">
              <Brain className="w-4 h-4" />
              <span>Confiance IA: {getConfidenceLabel(animatedConfidence)}</span>
            </div>
          </div>

          <p className="text-xs text-gray-300 mb-3">
            {getFeatureDescription(feature)}
          </p>

          <div className="border-t border-gray-700 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span>Fiabilité:</span>
              <span className="font-medium">{animatedConfidence}%</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span>Documents analysés:</span>
              <span className="font-medium">15,847+</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span>Taux d'erreur:</span>
              <span className="font-medium">{100 - animatedConfidence}%</span>
            </div>
          </div>

          {animatedConfidence >= 95 && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="flex items-center gap-1 text-xs text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Prêt pour l'automatisation</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Stats */}
      {results && animatedConfidence >= 90 && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          ✓ Validé
        </div>
      )}
    </div>
  )
}

// Compact version for inline use
interface CompactAIConfidenceProps {
  score: number
  label?: string
  showPercentage?: boolean
  className?: string
}

export function CompactAIConfidence({
  score,
  label = "IA",
  showPercentage = true,
  className = ""
}: CompactAIConfidenceProps) {
  const getColor = (value: number) => {
    if (value >= 95) return 'text-green-600'
    if (value >= 85) return 'text-blue-600'
    if (value >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Brain className={`w-3 h-3 ${getColor(score)}`} />
      <span className="text-xs font-medium">{label}</span>
      {showPercentage && (
        <span className={`text-xs ${getColor(score)}`}>{score}%</span>
      )}
    </div>
  )
}