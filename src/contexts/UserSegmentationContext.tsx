'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

export type UserSegment =
  | 'solo_contractor'    // Independent contractor, simple needs
  | 'small_business'     // Small team, basic project management
  | 'growth_business'    // Growing company, advanced features
  | 'enterprise'         // Large organization, complex workflows
  | 'power_user'         // Advanced user, uses many features
  | 'beginner'           // New user, needs guidance

interface UserJourneyData {
  hasUploadedDocuments: boolean
  hasCreatedProjects: boolean
  hasAddedClients: boolean
  hasUsedQuotes: boolean
  hasUsedInvoices: boolean
  hasUsedForecasts: boolean
  hasUsedApprovals: boolean
  hasUsedAdmin: boolean
  documentsProcessed: number
  daysActive: number
  lastActive: string
  featureFrequency: Record<string, number>
}

interface UserSegmentationContextType {
  segment: UserSegment
  journeyData: UserJourneyData
  isLoaded: boolean
  updateActivity: (feature: string) => void
  refreshSegmentation: () => Promise<void>
}

const UserSegmentationContext = createContext<UserSegmentationContextType | undefined>(undefined)

interface UserSegmentationProviderProps {
  children: ReactNode
  userId: string
}

export function UserSegmentationProvider({ children, userId }: UserSegmentationProviderProps) {
  const [segment, setSegment] = useState<UserSegment>('beginner')
  const [journeyData, setJourneyData] = useState<UserJourneyData>({
    hasUploadedDocuments: false,
    hasCreatedProjects: false,
    hasAddedClients: false,
    hasUsedQuotes: false,
    hasUsedInvoices: false,
    hasUsedForecasts: false,
    hasUsedApprovals: false,
    hasUsedAdmin: false,
    documentsProcessed: 0,
    daysActive: 0,
    lastActive: new Date().toISOString(),
    featureFrequency: {}
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const supabase = createClient()

  // Calculate user segment based on behavior
  const calculateSegment = (data: UserJourneyData): UserSegment => {
    const {
      hasUploadedDocuments,
      hasCreatedProjects,
      hasAddedClients,
      hasUsedQuotes,
      hasUsedInvoices,
      hasUsedForecasts,
      hasUsedApprovals,
      hasUsedAdmin,
      documentsProcessed,
      daysActive,
      featureFrequency
    } = data

    // New user - just started
    if (daysActive < 1 && !hasUploadedDocuments && !hasCreatedProjects) {
      return 'beginner'
    }

    // Solo contractor - basic document management
    if (hasUploadedDocuments && !hasCreatedProjects && !hasAddedClients) {
      return 'solo_contractor'
    }

    // Small business - project and client management
    if (hasUploadedDocuments && (hasCreatedProjects || hasAddedClients)) {
      if (!hasUsedForecasts && !hasUsedApprovals) {
        return 'small_business'
      }
    }

    // Power user - uses many features frequently
    const totalFeaturesUsed = Object.values(data).filter(v => typeof v === 'boolean' && v).length
    const avgFrequency = Object.values(featureFrequency).reduce((a, b) => a + b, 0) / Object.keys(featureFrequency).length

    if (totalFeaturesUsed >= 5 && avgFrequency > 10) {
      return 'power_user'
    }

    // Growth business - advanced features
    if ((hasUsedForecasts || hasUsedApprovals) && documentsProcessed > 20) {
      return 'growth_business'
    }

    // Enterprise - admin and advanced workflows
    if (hasUsedAdmin && documentsProcessed > 50) {
      return 'enterprise'
    }

    // Default to small business
    return 'small_business'
  }

  // Load user data from localStorage and Supabase
  const loadUserData = async () => {
    try {
      // Get stored journey data from localStorage
      const storedData = localStorage.getItem(`user_journey_${userId}`)
      const defaultJourneyData: UserJourneyData = {
        hasUploadedDocuments: false,
        hasCreatedProjects: false,
        hasAddedClients: false,
        hasUsedQuotes: false,
        hasUsedInvoices: false,
        hasUsedForecasts: false,
        hasUsedApprovals: false,
        hasUsedAdmin: false,
        documentsProcessed: 0,
        daysActive: 0,
        lastActive: new Date().toISOString(),
        featureFrequency: {}
      }
      let journeyData: UserJourneyData = storedData ? JSON.parse(storedData) : defaultJourneyData

      // Load actual data from Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', userId)
        .single()

      if (profile) {
        const daysActive = Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
        journeyData.daysActive = daysActive
      }

      // Count documents (mock for now, replace with actual query)
      journeyData.documentsProcessed = parseInt(localStorage.getItem('documents_processed') || '0')

      // Update segment based on data
      const newSegment = calculateSegment(journeyData)
      setSegment(newSegment)
      setJourneyData(journeyData)

      // Store updated data
      localStorage.setItem(`user_journey_${userId}`, JSON.stringify(journeyData))
      localStorage.setItem(`user_segment_${userId}`, newSegment)

    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoaded(true)
    }
  }

  // Update user activity for a specific feature
  const updateActivity = (feature: string) => {
    const updatedData = { ...journeyData }

    // Mark features as used
    switch (feature) {
      case 'documents':
        updatedData.hasUploadedDocuments = true
        updatedData.documentsProcessed += 1
        break
      case 'projects':
        updatedData.hasCreatedProjects = true
        break
      case 'clients':
        updatedData.hasAddedClients = true
        break
      case 'quotes':
        updatedData.hasUsedQuotes = true
        break
      case 'invoices':
        updatedData.hasUsedInvoices = true
        break
      case 'forecasts':
        updatedData.hasUsedForecasts = true
        break
      case 'approvals':
        updatedData.hasUsedApprovals = true
        break
      case 'admin':
        updatedData.hasUsedAdmin = true
        break
    }

    // Update frequency
    updatedData.featureFrequency[feature] = (updatedData.featureFrequency[feature] || 0) + 1
    updatedData.lastActive = new Date().toISOString()

    // Calculate new segment
    const newSegment = calculateSegment(updatedData)

    // Update state
    setJourneyData(updatedData)
    setSegment(newSegment)

    // Persist changes
    localStorage.setItem(`user_journey_${userId}`, JSON.stringify(updatedData))
    localStorage.setItem(`user_segment_${userId}`, newSegment)
    localStorage.setItem('documents_processed', updatedData.documentsProcessed.toString())
  }

  // Refresh segmentation data
  const refreshSegmentation = async () => {
    await loadUserData()
  }

  useEffect(() => {
    if (userId) {
      loadUserData()
    }
  }, [userId])

  const value: UserSegmentationContextType = {
    segment,
    journeyData,
    isLoaded,
    updateActivity,
    refreshSegmentation
  }

  return (
    <UserSegmentationContext.Provider value={value}>
      {children}
    </UserSegmentationContext.Provider>
  )
}

export function useUserSegmentation() {
  const context = useContext(UserSegmentationContext)
  if (context === undefined) {
    throw new Error('useUserSegmentation must be used within a UserSegmentationProvider')
  }
  return context
}

// Helper function to get navigation items based on segment
export function getNavigationForSegment(segment: UserSegment) {
  const baseNavigation = [
    { href: '/dashboard', label: 'Tableau de bord', icon: '📊', priority: 'high' },
    { href: '/dashboard/documents', label: 'Documents', icon: '📁', priority: 'high' },
  ]

  const segmentNavigation = {
    beginner: [
      ...baseNavigation,
      { href: '/dashboard/clients', label: 'Clients', icon: '👥', priority: 'medium' },
      { href: '/dashboard/projects', label: 'Projets', icon: '🏗️', priority: 'medium' },
      { href: '/dashboard/invoices/extract', label: 'Extraction IA', icon: '🤖', priority: 'high' },
    ],
    solo_contractor: [
      ...baseNavigation,
      { href: '/dashboard/invoices', label: 'Factures', icon: '📄', priority: 'high' },
      { href: '/dashboard/quotes', label: 'Devis', icon: '📝', priority: 'high' },
      { href: '/dashboard/clients', label: 'Clients', icon: '👥', priority: 'medium' },
    ],
    small_business: [
      ...baseNavigation,
      { href: '/dashboard/clients', label: 'Clients', icon: '👥', priority: 'high' },
      { href: '/dashboard/projects', label: 'Projets', icon: '🏗️', priority: 'high' },
      { href: '/dashboard/invoices', label: 'Factures', icon: '📄', priority: 'high' },
      { href: '/dashboard/quotes', label: 'Devis', icon: '📝', priority: 'high' },
      { href: '/dashboard/invoices/extract', label: 'Extraction IA', icon: '🤖', priority: 'medium' },
      { href: '/dashboard/forecasts', label: 'Prévisions', icon: '📈', priority: 'medium' },
    ],
    growth_business: [
      ...baseNavigation,
      { href: '/dashboard/clients', label: 'Clients', icon: '👥', priority: 'high' },
      { href: '/dashboard/projects', label: 'Projets', icon: '🏗️', priority: 'high' },
      { href: '/dashboard/invoices', label: 'Factures', icon: '📄', priority: 'high' },
      { href: '/dashboard/quotes', label: 'Devis', icon: '📝', priority: 'high' },
      { href: '/dashboard/forecasts', label: 'Prévisions', icon: '📈', priority: 'high' },
      { href: '/dashboard/approvals', label: 'Approbations', icon: '✅', priority: 'high' },
      { href: '/dashboard/invoices/extract', label: 'Extraction IA', icon: '🤖', priority: 'medium' },
      { href: '/dashboard/timesheets', label: 'Feuilles de temps', icon: '⏰', priority: 'medium' },
    ],
    enterprise: [
      { href: '/dashboard', label: 'Tableau de bord', icon: '📊', priority: 'high' },
      { href: '/dashboard/documents', label: 'Documents', icon: '📁', priority: 'high' },
      { href: '/dashboard/clients', label: 'Clients', icon: '👥', priority: 'high' },
      { href: '/dashboard/projects', label: 'Projets', icon: '🏗️', priority: 'high' },
      { href: '/dashboard/invoices', label: 'Factures', icon: '📄', priority: 'high' },
      { href: '/dashboard/quotes', label: 'Devis', icon: '📝', priority: 'high' },
      { href: '/dashboard/forecasts', label: 'Prévisions', icon: '📈', priority: 'high' },
      { href: '/dashboard/approvals', label: 'Approbations', icon: '✅', priority: 'high' },
      { href: '/dashboard/admin', label: 'Admin', icon: '🔧', priority: 'high' },
      { href: '/dashboard/invoices/extract', label: 'Extraction IA', icon: '🤖', priority: 'medium' },
      { href: '/dashboard/timesheets', label: 'Feuilles de temps', icon: '⏰', priority: 'medium' },
      { href: '/dashboard/reports', label: 'Rapports', icon: '📊', priority: 'medium' },
      { href: '/dashboard/settings', label: 'Paramètres', icon: '⚙️', priority: 'low' },
    ],
    power_user: [
      ...baseNavigation,
      { href: '/dashboard/clients', label: 'Clients', icon: '👥', priority: 'high' },
      { href: '/dashboard/projects', label: 'Projets', icon: '🏗️', priority: 'high' },
      { href: '/dashboard/invoices', label: 'Factures', icon: '📄', priority: 'high' },
      { href: '/dashboard/quotes', label: 'Devis', icon: '📝', priority: 'high' },
      { href: '/dashboard/smart-quotes', label: 'Devis Intelligent', icon: '✨', priority: 'high' },
      { href: '/dashboard/metrology', label: 'Métrologie', icon: '📏', priority: 'high' },
      { href: '/dashboard/forecasts', label: 'Prévisions', icon: '📈', priority: 'high' },
      { href: '/dashboard/approvals', label: 'Approbations', icon: '✅', priority: 'high' },
      { href: '/dashboard/invoices/extract', label: 'Extraction IA', icon: '🤖', priority: 'medium' },
      { href: '/dashboard/timesheets', label: 'Feuilles de temps', icon: '⏰', priority: 'medium' },
      { href: '/dashboard/files/search', label: 'Recherche', icon: '🔍', priority: 'medium' },
    ]
  }

  return segmentNavigation[segment] || segmentNavigation.beginner
}