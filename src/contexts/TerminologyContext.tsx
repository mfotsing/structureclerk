'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useUserSegmentation } from './UserSegmentationContext'

// Terminology mapping from complex to simple terms
const terminologyMap = {
  // Navigation & Menu Items
  "Tableau de bord": {
    beginner: "Accueil",
    solo_contractor: "Mon Espace",
    small_business: "Accueil",
    growth_business: "Tableau de bord",
    enterprise: "Tableau de bord",
    power_user: "Dashboard"
  },
  "Extraction IA": {
    beginner: "Lire mes factures",
    solo_contractor: "Scanner factures",
    small_business: "Extraction IA",
    growth_business: "Extraction IA",
    enterprise: "Extraction automatisée",
    power_user: "OCR & Extraction"
  },
  "Prévisions": {
    beginner: "Voir l'avenir",
    solo_contractor: "Prévoir mes revenus",
    small_business: "Prévisions",
    growth_business: "Prévisions financières",
    enterprise: "Forecasting analytique",
    power_user: "Prévisions & Analytics"
  },
  "Approbations": {
    beginner: "Valider les dépenses",
    solo_contractor: "OK dépenses",
    small_business: "Approbations",
    growth_business: "Workflow d'approbation",
    enterprise: "Approvals & Governance",
    power_user: "Multi-level Approvals"
  },
  "Métrologie": {
    beginner: "Mesures intelligentes",
    solo_contractor: "Mesurer avec l'IA",
    small_business: "Métrologie",
    growth_business: "Métrologie IA",
    enterprise: "Metrology System",
    power_user: "AI Metrology"
  },
  "Feuilles de temps": {
    beginner: "Suivre mes heures",
    solo_contractor: "Mes heures",
    small_business: "Feuilles de temps",
    growth_business: "Time Tracking",
    enterprise: "Timesheet Management",
    power_user: "Time & Billing"
  },

  // Actions & Buttons
  "Extraire": {
    beginner: "Lire le document",
    solo_contractor: "Scanner",
    small_business: "Extraire",
    growth_business: "Extraire les données",
    enterprise: "Extraire & valider",
    power_user: "Extract"
  },
  "Générer": {
    beginner: "Créer automatiquement",
    solo_contractor: "Créer",
    small_business: "Générer",
    growth_business: "Générer avec IA",
    enterprise: "Générer & review",
    power_user: "Generate"
  },
  "Analyser": {
    beginner: "Comprendre mes données",
    solo_contractor: "Analyser",
    small_business: "Analyser",
    growth_business: "Analyser en détail",
    enterprise: "Analyse avancée",
    power_user: "Analyze"
  },
  "Optimiser": {
    beginner: "Améliorer",
    solo_contractor: "Optimiser",
    small_business: "Optimiser",
    growth_business: "Optimiser la performance",
    enterprise: "Optimisation stratégique",
    power_user: "Optimize"
  },

  // Business Terms
  "IPC (Indice de Performance des Coûts)": {
    beginner: "Santé de mes coûts",
    solo_contractor: "Contrôle des coûts",
    small_business: "Performance des coûts",
    growth_business: "IPC",
    enterprise: "Indice de Performance Coûts",
    power_user: "IPC (Cost Performance Index)"
  },
  "Marge Nette": {
    beginner: "Mes bénéfices",
    solo_contractor: "Bénéfices nets",
    small_business: "Marge nette",
    growth_business: "Marge nette",
    enterprise: "Net Margin",
    power_user: "Net Margin %"
  },
  "Taux Conversion Devis": {
    beginner: "Devis acceptés",
    solo_contractor: "Réussite des devis",
    small_business: "Taux de conversion",
    growth_business: "Conversion devis",
    enterprise: "Quote Conversion Rate",
    power_user: "Quote Conversion %"
  },
  "Utilisation Budget": {
    beginner: "Budget dépensé",
    solo_contractor: "Mon budget",
    small_business: "Utilisation budget",
    growth_business: "Suivi budgétaire",
    enterprise: "Budget Utilization",
    power_user: "Budget Utilization %"
  },

  // Features & Tools
  "Devis Intelligent": {
    beginner: "Parler mes devis",
    solo_contractor: "Devis vocal",
    small_business: "Devis Intelligent",
    growth_business: "Devis Intelligent",
    enterprise: "AI Quote Generation",
    power_user: "Smart Quotes"
  },
  "Caméra Métrique": {
    beginner: "Mesurer avec téléphone",
    solo_contractor: "Caméra mesure",
    small_business: "Caméra Métrique",
    growth_business: "Caméra Métrique IA",
    enterprise: "AI Camera Metrology",
    power_user: "Metric Camera"
  },
  "Workflow personnalisés": {
    beginner: "Mes étapes de travail",
    solo_contractor: "Mon processus",
    small_business: "Workflows personnalisés",
    growth_business: "Workflows avancés",
    enterprise: "Custom Workflows",
    power_user: "Custom Workflows"
  },
  "Approbations multi-niveaux": {
    beginner: "Validation en équipe",
    solo_contractor: "Validation à plusieurs",
    small_business: "Approbations multi-niveaux",
    growth_business: "Approbations hiérarchiques",
    enterprise: "Multi-level Approvals",
    power_user: "Multi-level Approval"
  },

  // Status & States
  "En attente": {
    beginner: "À faire",
    solo_contractor: "En attente",
    small_business: "En attente",
    growth_business: "En attente",
    enterprise: "Pending",
    power_user: "Pending"
  },
  "En cours": {
    beginner: "Je travaille dessus",
    solo_contractor: "En cours",
    small_business: "En cours",
    growth_business: "En cours",
    enterprise: "In Progress",
    power_user: "In Progress"
  },
  "Terminé": {
    beginner: "Fait !",
    solo_contractor: "Terminé",
    small_business: "Terminé",
    growth_business: "Terminé",
    enterprise: "Completed",
    power_user: "Completed"
  },
  "Approuvé": {
    beginner: "Validé ✅",
    solo_contractor: "Approuvé",
    small_business: "Approuvé",
    growth_business: "Approuvé",
    enterprise: "Approved",
    power_user: "Approved"
  },

  // Error Messages
  "Erreur lors de l'extraction": {
    beginner: "Je n'ai pas pu lire le document",
    solo_contractor: "Erreur d'extraction",
    small_business: "Échec de l'extraction",
    growth_business: "Erreur extraction",
    enterprise: "Extraction failed",
    power_user: "Extraction Error"
  },
  "Chargement...": {
    beginner: "Je prépare...",
    solo_contractor: "Chargement...",
    small_business: "Chargement...",
    growth_business: "Chargement en cours",
    enterprise: "Loading...",
    power_user: "Loading..."
  }
}

// Help tooltips for complex terms
const helpTooltips = {
  "IPC": "Indice qui montre si vos coûts sont sous contrôle (1.0 = parfait, moins de 1.0 = attention)",
  "Marge Nette": "Vos bénéfices après toutes les dépenses, en pourcentage du chiffre d'affaires",
  "Taux Conversion": "Pourcentage de vos devis qui deviennent des contrats signés",
  "Extraction IA": "Technologie qui lit automatiquement vos factures et contrats comme un humain",
  "Workflow": "Suite d'étapes pour valider et traiter vos documents et dépenses",
  "Métrologie": "Mesure précise des dimensions avec intelligence artificielle"
}

interface TerminologyContextType {
  simplify: (text: string) => string
  getTooltip: (term: string) => string | undefined
  shouldShowTooltip: (term: string) => boolean
}

const TerminologyContext = createContext<TerminologyContextType | undefined>(undefined)

interface TerminologyProviderProps {
  children: ReactNode
}

export function TerminologyProvider({ children }: TerminologyProviderProps) {
  const { segment } = useUserSegmentation()

  // Simplify text based on user segment
  const simplify = (text: string): string => {
    // Check if we have a mapping for this exact text
    const mapping = terminologyMap[text as keyof typeof terminologyMap]
    if (mapping) {
      return mapping[segment as keyof typeof mapping] || text
    }

    // Check for partial matches (for dynamic text)
    for (const [complexTerm, segmentMap] of Object.entries(terminologyMap)) {
      if (text.includes(complexTerm)) {
        const simplified = segmentMap[segment as keyof typeof segmentMap]
        if (simplified && simplified !== complexTerm) {
          return text.replace(complexTerm, simplified)
        }
      }
    }

    // Additional rules for beginners
    if (segment === 'beginner') {
      // Simplify technical jargon
      text = text.replace(/automatisé/g, 'automatique')
      text = text.replace(/analytique/g, 'détaillé')
      text = text.replace(/optimisation/g, 'amélioration')
      text = text.replace(/performance/g, 'résultats')
      text = text.replace(/intégration/g, 'connexion')
      text = text.replace(/configuration/g, 'paramètres')
      text = text.replace(/déployer/g, 'lancer')
      text = text.replace(/implémenter/g, 'mettre en place')
    }

    return text
  }

  // Get help tooltip for a term
  const getTooltip = (term: string): string | undefined => {
    return helpTooltips[term as keyof typeof helpTooltips]
  }

  // Determine if tooltip should be shown based on user segment
  const shouldShowTooltip = (term: string): boolean => {
    // Show tooltips for beginners and solo contractors on complex terms
    const complexTerms = ['IPC', 'Marge', 'Conversion', 'Extraction', 'Workflow', 'Métrologie']
    const isComplexTerm = complexTerms.some(complex => term.includes(complex))

    return (segment === 'beginner' || segment === 'solo_contractor') && isComplexTerm
  }

  const value: TerminologyContextType = {
    simplify,
    getTooltip,
    shouldShowTooltip
  }

  return (
    <TerminologyContext.Provider value={value}>
      {children}
    </TerminologyContext.Provider>
  )
}

export function useTerminology() {
  const context = useContext(TerminologyContext)
  if (context === undefined) {
    throw new Error('useTerminology must be used within a TerminologyProvider')
  }
  return context
}

// Helper component for simplified text with optional tooltip
interface SimplifiedTextProps {
  text: string
  showTooltip?: boolean
  className?: string
}

export function SimplifiedText({ text, showTooltip = true, className = "" }: SimplifiedTextProps) {
  const { simplify, getTooltip, shouldShowTooltip } = useTerminology()
  const simplifiedText = simplify(text)
  const tooltip = getTooltip(text)
  const showHelpTooltip = showTooltip && tooltip && shouldShowTooltip(text)

  return (
    <span
      className={`${className} ${showHelpTooltip ? 'cursor-help border-b-2 border-dotted border-gray-400' : ''}`}
      title={showHelpTooltip ? tooltip : undefined}
    >
      {simplifiedText}
    </span>
  )
}