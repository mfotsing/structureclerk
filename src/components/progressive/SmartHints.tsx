'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUserSegmentation } from '@/contexts/UserSegmentationContext'
import { X, Lightbulb, ArrowRight, Sparkles } from 'lucide-react'

interface SmartHint {
  id: string
  title: string
  content: string
  type: 'tip' | 'shortcut' | 'feature' | 'warning'
  action?: {
    text: string
    url: string
  }
  dismissible: boolean
  priority: 'low' | 'medium' | 'high'
}

interface SmartHintsProps {
  className?: string
}

export default function SmartHints({ className = "" }: SmartHintsProps) {
  const pathname = usePathname()
  const { segment, journeyData, isLoaded } = useUserSegmentation()
  const [hints, setHints] = useState<SmartHint[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])

  // Get hints based on current page and user segment
  const getHintsForPath = (path: string, segment: string): SmartHint[] => {
    const pageMap: Record<string, SmartHint[]> = {
      '/dashboard': [
        {
          id: 'dashboard-shortcuts',
          title: 'Raccourcis rapides',
          content: 'Appuyez sur Cmd+K pour accéder rapidement à n\'importe quelle fonctionnalité.',
          type: 'shortcut',
          priority: 'low',
          dismissible: true
        },
        {
          id: 'dashboard-mobile',
          title: 'Application mobile',
          content: ' Téléchargez l\'app mobile pour suivre vos heures sur chantier.',
          type: 'feature',
          action: {
            text: 'Voir l\'app',
            url: '/dashboard/timesheets/mobile'
          },
          priority: 'medium',
          dismissible: true
        }
      ],
      '/dashboard/documents': [
        {
          id: 'documents-dropzone',
          title: 'Glissez-déposez vos fichiers',
          content: 'Vous pouvez uploader jusqu\'à 50 documents d\'un coup. L\'IA les traitera automatiquement.',
          type: 'tip',
          priority: 'high',
          dismissible: false
        },
        ...(segment === 'beginner' ? [{
          id: 'documents-first',
          title: 'Commencez simple',
          content: 'Uploadpez une facture ou un devis pour voir comment l\'IA extrait les données.',
          type: 'tip' as const,
          priority: 'high' as const,
          dismissible: true
        }] : [])
      ],
      '/dashboard/invoices/extract': [
        {
          id: 'extraction-accuracy',
          title: 'Précision de 94% garantie',
          content: 'Notre IA extrait correctement les montants, dates et taxes. Vérifiez simplement les résultats.',
          type: 'tip',
          priority: 'high',
          dismissible: false
        },
        {
          id: 'extraction-batch',
          title: 'Traitement par lot',
          content: 'Sélectionnez plusieurs factures pour les extraire d\'un seul coup et gagner du temps.',
          type: 'tip',
          priority: 'medium',
          dismissible: true
        }
      ],
      '/dashboard/quotes': [
        {
          id: 'quotes-template',
          title: 'Modèles réutilisables',
          content: 'Créez des modèles de devis pour vos services les plus fréquents et gagnez 10min par devis.',
          type: 'tip',
          priority: 'medium',
          dismissible: true
        },
        ...(segment === 'solo_contractor' ? [{
          id: 'quotes-quick',
          title: 'Devis rapide',
          content: 'Essayez le devis intelligent avec dictée vocale pour créer un devis en 2 minutes.',
          type: 'feature' as const,
          action: {
            text: 'Essayer',
            url: '/dashboard/smart-quotes/create'
          },
          priority: 'high' as const,
          dismissible: true
        }] : [])
      ],
      '/dashboard/clients': [
        {
          id: 'clients-import',
          title: 'Importez vos contacts',
          content: 'Importez votre carnet d\'adresses depuis Excel ou CSV pour ajouter tous vos clients d\'un coup.',
          type: 'tip',
          priority: 'medium',
          dismissible: true
        }
      ],
      '/dashboard/projects': [
        {
          id: 'projects-budget',
          title: 'Suivi budgétaire',
          content: 'Définissez un budget par projet pour recevoir des alertes lorsque vous atteignez 80%.',
          type: 'feature',
          action: {
            text: 'Configurer',
            url: '/dashboard/settings/budgets'
          },
          priority: 'medium',
          dismissible: true
        }
      ]
    }

    // Segment-specific hints
    const segmentHints: Record<string, SmartHint[]> = {
      beginner: [
        {
          id: 'beginner-tour',
          title: 'Visite guidée disponible',
          content: 'Prenez 5 minutes pour découvrir les fonctionnalités essentielles adaptées à votre profil.',
          type: 'feature' as const,
          action: {
            text: 'Commencer la visite',
            url: '/dashboard?tour=true'
          },
          priority: 'high' as const,
          dismissible: true
        }
      ],
      solo_contractor: [
        {
          id: 'solo-productivity',
          title: 'Maximisez votre productivité',
          content: 'Les entrepreneurs comme vous économisent en moyenne 5h/semaine avec l\'extraction IA.',
          type: 'tip' as const,
          priority: 'medium' as const,
          dismissible: true
        }
      ],
      growth_business: [
        {
          id: 'growth-approvals',
          title: 'Workflow d\'approbation',
          content: 'Configurez les approbations multi-niveaux pour mieux contrôler les dépenses importantes.',
          type: 'feature' as const,
          action: {
            text: 'Configurer',
            url: '/dashboard/approvals'
          },
          priority: 'medium' as const,
          dismissible: true
        }
      ]
    }

    // Get base hints for current path
    const baseHints = pageMap[path] || []

    // Add segment-specific hints if available
    const additionalHints = segmentHints[segment] || []

    // Filter out dismissed hints
    const allHints = [...baseHints, ...additionalHints].filter(hint => !dismissed.includes(hint.id))

    // Sort by priority
    const priorityWeight = { high: 3, medium: 2, low: 1 }
    return allHints.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
  }

  useEffect(() => {
    if (isLoaded) {
      const currentHints = getHintsForPath(pathname, segment)
      setHints(currentHints)

      // Load dismissed hints from localStorage
      const dismissedHints = localStorage.getItem('dismissed_hints')
      if (dismissedHints) {
        setDismissed(JSON.parse(dismissedHints))
      }
    }
  }, [pathname, segment, isLoaded])

  const handleDismiss = (hintId: string) => {
    const updatedDismissed = [...dismissed, hintId]
    setDismissed(updatedDismissed)
    localStorage.setItem('dismissed_hints', JSON.stringify(updatedDismissed))

    // Update hints
    const currentHints = getHintsForPath(pathname, segment)
    setHints(currentHints)
  }

  const getHintIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="w-4 h-4 text-yellow-500" />
      case 'shortcut': return <Sparkles className="w-4 h-4 text-blue-500" />
      case 'feature': return <Sparkles className="w-4 h-4 text-green-500" />
      case 'warning': return <X className="w-4 h-4 text-red-500" />
      default: return <Lightbulb className="w-4 h-4 text-gray-500" />
    }
  }

  const getHintStyle = (type: string, priority: string) => {
    const baseStyle = "rounded-lg border p-4 mb-3"

    if (type === 'warning') {
      return `${baseStyle} bg-red-50 border-red-200`
    }

    if (priority === 'high') {
      return `${baseStyle} bg-blue-50 border-blue-200`
    }

    return `${baseStyle} bg-gray-50 border-gray-200`
  }

  if (!isLoaded || hints.length === 0) {
    return null
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {hints.slice(0, 2).map((hint) => (
        <div key={hint.id} className={getHintStyle(hint.type, hint.priority)}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getHintIcon(hint.type)}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 mb-1">{hint.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{hint.content}</p>

              {hint.action && (
                <a
                  href={hint.action.url}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {hint.action.text}
                  <ArrowRight className="w-3 h-3" />
                </a>
              )}
            </div>

            {hint.dismissible && (
              <button
                onClick={() => handleDismiss(hint.id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}