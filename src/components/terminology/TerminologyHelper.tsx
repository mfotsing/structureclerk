'use client'

import { useState } from 'react'
import { useTerminology } from '@/contexts/TerminologyContext'
import { Info, X, Lightbulb, TrendingUp, DollarSign, Target, Zap } from 'lucide-react'

interface TerminologyHelperProps {
  term: string
  className?: string
}

export default function TerminologyHelper({ term, className = "" }: TerminologyHelperProps) {
  const { getTooltip, shouldShowTooltip } = useTerminology()
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenShown, setHasBeenShown] = useState(false)

  const tooltip = getTooltip(term)
  const shouldShow = shouldShowTooltip(term) && tooltip

  // Auto-show on first visit for complex terms
  const handleMouseEnter = () => {
    if (shouldShow && !hasBeenShown) {
      setIsVisible(true)
      setHasBeenShown(true)
    }
  }

  const getTermIcon = (term: string) => {
    if (term.includes('IPC') || term.includes('Coût')) return <DollarSign className="w-4 h-4 text-green-500" />
    if (term.includes('Marge')) return <TrendingUp className="w-4 h-4 text-blue-500" />
    if (term.includes('Conversion')) return <Target className="w-4 h-4 text-purple-500" />
    if (term.includes('Extraction') || term.includes('IA')) return <Zap className="w-4 h-4 text-orange-500" />
    return <Lightbulb className="w-4 h-4 text-yellow-500" />
  }

  if (!shouldShow) return null

  return (
    <>
      {/* Trigger */}
      <span
        className={`inline-flex items-center gap-1 cursor-help border-b-2 border-dotted border-gray-400 hover:border-gray-600 transition-colors ${className}`}
        onMouseEnter={handleMouseEnter}
        onClick={() => setIsVisible(true)}
      >
        {term}
        <Info className="w-3 h-3 text-gray-500" />
      </span>

      {/* Tooltip Modal */}
      {isVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0">
                {getTermIcon(term)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Qu'est-ce que "{term}" ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {tooltip}
                </p>
              </div>
            </div>

            {/* Example */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">En pratique</span>
              </div>
              <p className="text-sm text-blue-800">
                {getExampleForTerm(term)}
              </p>
            </div>

            {/* Action */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsVisible(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function getExampleForTerm(term: string): string {
  switch (term) {
    case 'IPC':
      return "Si votre IPC est de 0.85, cela veut dire que vous dépensez 15% de plus que prévu. C'est un signal qu'il faut vérifier vos coûts."

    case 'Marge Nette':
      return "Sur un chantier facturé 1000€, si après avoir payé tout (matériaux, salaires, etc.) il vous reste 150€, votre marge nette est de 15%."

    case 'Taux Conversion':
      return "Si vous envoyez 10 devis et que 3 clients signent, votre taux de conversion est de 30%. Plus ce chiffre est élevé, mieux c'est !"

    case 'Extraction IA':
      return "Prenez une photo de votre facture avec votre téléphone. L'IA lit automatiquement le montant, la date, le fournisseur... Plus besoin de taper à la main !"

    case 'Workflow':
      return "Workflow = étapes de travail. Ex: 1) Envoyer la facture 2) Votre manager vérifie 3) La comptabilité paie. Chaque étape est automatique."

    case 'Métrologie':
      return "Pointez votre caméra sur un mur, l'IA mesure les dimensions automatiquement. Plus besoin de décamètre ni de calculs manuels."

    default:
      return "Cet outil vous aide à mieux comprendre et gérer votre entreprise au quotidien."
  }
}

// Simpler version for inline tooltips
interface SimpleTooltipProps {
  term: string
  children: React.ReactNode
}

export function SimpleTooltip({ term, children }: SimpleTooltipProps) {
  const { getTooltip, shouldShowTooltip } = useTerminology()
  const [show, setShow] = useState(false)

  const tooltip = getTooltip(term)
  const shouldShow = shouldShowTooltip(term) && tooltip

  if (!shouldShow) return <>{children}</>

  return (
    <div className="relative inline-block">
      <div
        className="cursor-help"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>

      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          {tooltip}
        </div>
      )}
    </div>
  )
}