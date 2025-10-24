'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

export type FeedbackType = 'nps' | 'feature_rating' | 'bug_report' | 'feature_request' | 'general_feedback' | 'milestone_feedback'

export type FeedbackTrigger = 'onboarding_complete' | 'first_extraction' | 'first_quote' | 'weekly_checkin' | 'feature_usage' | 'error_occurred' | 'time_saved'

export interface FeedbackData {
  id: string
  userId: string
  type: FeedbackType
  trigger: FeedbackTrigger
  rating?: number
  score?: number // NPS score 0-10
  comment?: string
  feature?: string
  context?: Record<string, any>
  timestamp: string
  responded: boolean
}

export interface NPSFeedback extends FeedbackData {
  type: 'nps'
  score: number // 0-10
  reason?: string
  improvement?: string
  promoterType?: 'promoter' | 'passive' | 'detractor'
}

export interface FeedbackSurvey {
  id: string
  type: FeedbackType
  title: string
  description: string
  questions: {
    id: string
    type: 'rating' | 'nps' | 'text' | 'multiple'
    label: string
    required?: boolean
    options?: string[]
    min?: number
    max?: number
  }[]
  trigger: FeedbackTrigger
  conditions?: {
    userSegment?: string[]
    featureUsed?: string
    timeSinceLastFeedback?: number // hours
    minUsageCount?: number
    showOnce?: boolean
  }
  showOnce?: boolean
  priority: 'low' | 'medium' | 'high'
}

interface FeedbackContextType {
  // Survey Management
  availableSurveys: FeedbackSurvey[]
  currentSurvey: FeedbackSurvey | null
  showSurvey: boolean
  responses: Record<string, any>

  // Actions
  submitFeedback: (surveyId: string, responses: Record<string, any>) => Promise<void>
  dismissSurvey: (surveyId: string) => void
  recordEvent: (trigger: FeedbackTrigger, context?: Record<string, any>) => void
  shouldShowSurvey: (survey: FeedbackSurvey) => boolean
  setResponses: (responses: Record<string, any>) => void

  // Analytics
  getNPSData: () => { promoters: number; passives: number; detractors: number; score: number }
  getFeedbackTrends: () => any[]
  getUserFeedbackHistory: () => FeedbackData[]
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

interface FeedbackEvent {
  trigger: FeedbackTrigger
  timestamp: string
  context?: Record<string, any>
}

const FEEDBACK_SURVEYS: FeedbackSurvey[] = [
  {
    id: 'onboarding_nps',
    type: 'nps',
    title: "Comment s'est passée votre première expérience ?",
    description: "Votre feedback nous aide à améliorer StructureClerk pour tous les entrepreneurs.",
    questions: [
      {
        id: 'nps_score',
        type: 'nps',
        label: 'Sur une échelle de 0 à 10, quelle est la probabilité que vous recommandiez StructureClerk à un collègue entrepreneur ?',
        required: true,
        min: 0,
        max: 10
      },
      {
        id: 'reason',
        type: 'text',
        label: 'Quelle est la raison principale de votre note ?',
        required: false
      }
    ],
    trigger: 'onboarding_complete',
    conditions: { showOnce: true },
    priority: 'high'
  },
  {
    id: 'first_extraction_rating',
    type: 'feature_rating',
    title: 'Évaluez votre première extraction',
    description: "Comment s'est passée votre première utilisation de l'extraction IA ?",
    questions: [
      {
        id: 'accuracy',
        type: 'rating',
        label: 'Précision de l\'extraction',
        required: true,
        min: 1,
        max: 5
      },
      {
        id: 'speed',
        type: 'rating',
        label: 'Rapidité du traitement',
        required: true,
        min: 1,
        max: 5
      },
      {
        id: 'ease_of_use',
        type: 'rating',
        label: 'Facilité d\'utilisation',
        required: true,
        min: 1,
        max: 5
      },
      {
        id: 'comments',
        type: 'text',
        label: 'Commentaires supplémentaires (optionnel)',
        required: false
      }
    ],
    trigger: 'first_extraction',
    conditions: { showOnce: true },
    priority: 'high'
  },
  {
    id: 'weekly_checkin',
    type: 'general_feedback',
    title: "Comment s'est passée votre semaine ?",
    description: "Aidez-nous à comprendre votre expérience et à améliorer StructureClerk.",
    questions: [
      {
        id: 'overall_satisfaction',
        type: 'rating',
        label: 'Satisfaction générale cette semaine',
        required: true,
        min: 1,
        max: 5
      },
      {
        id: 'time_saved',
        type: 'multiple',
        label: 'Combien de temps avez-vous économisé cette semaine ?',
        required: false,
        options: ['Moins d\'1 heure', '1-3 heures', '3-5 heures', '5-10 heures', 'Plus de 10 heures']
      },
      {
        id: 'biggest_win',
        type: 'text',
        label: 'Quelle a été votre plus grande réussite cette semaine ?',
        required: false
      },
      {
        id: 'improvement',
        type: 'text',
        label: 'Que pourrions-nous améliorer pour vous ?',
        required: false
      }
    ],
    trigger: 'weekly_checkin',
    conditions: { timeSinceLastFeedback: 168 }, // 1 week
    priority: 'medium'
  },
  {
    id: 'feature_usage_feedback',
    type: 'feature_rating',
    title: 'Feedback sur la fonctionnalité',
    description: 'Votre expérience avec cette fonctionnalité nous aide à l\'améliorer.',
    questions: [
      {
        id: 'usefulness',
        type: 'rating',
        label: 'Utilité de cette fonctionnalité',
        required: true,
        min: 1,
        max: 5
      },
      {
        id: 'ease',
        type: 'rating',
        label: 'Facilité d\'utilisation',
        required: true,
        min: 1,
        max: 5
      },
      {
        id: 'suggestions',
        type: 'text',
        label: 'Suggestions d\'amélioration',
        required: false
      }
    ],
    trigger: 'feature_usage',
    conditions: { minUsageCount: 3 },
    priority: 'low'
  },
  {
    id: 'milestone_celebration',
    type: 'milestone_feedback',
    title: 'Félicitations pour votre progression !',
    description: "Célébrons vos réussites et apprenons de votre expérience.",
    questions: [
      {
        id: 'achievement_rating',
        type: 'rating',
        label: 'Comment évaluez-vous cette réussite ?',
        required: true,
        min: 1,
        max: 5
      },
      {
        id: 'share_experience',
        type: 'text',
        label: 'Racontez votre expérience (optionnel)',
        required: false
      }
    ],
    trigger: 'time_saved',
    conditions: { minUsageCount: 10 },
    priority: 'medium'
  }
]

interface FeedbackProviderProps {
  children: ReactNode
  userId: string
}

export function FeedbackProvider({ children, userId }: FeedbackProviderProps) {
  const [availableSurveys, setAvailableSurveys] = useState<FeedbackSurvey[]>(FEEDBACK_SURVEYS)
  const [currentSurvey, setCurrentSurvey] = useState<FeedbackSurvey | null>(null)
  const [showSurvey, setShowSurvey] = useState(false)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackData[]>([])
  const [eventHistory, setEventHistory] = useState<FeedbackEvent[]>([])

  const supabase = createClient()

  // Check if survey should be shown based on conditions
  const shouldShowSurvey = (survey: FeedbackSurvey): boolean => {
    // Check if already responded
    if (survey.showOnce && feedbackHistory.some(f => f.trigger === survey.trigger)) {
      return false
    }

    // Check time since last feedback
    if (survey.conditions?.timeSinceLastFeedback) {
      const lastFeedback = feedbackHistory
        .filter(f => f.type === survey.type)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

      if (lastFeedback) {
        const hoursSince = (Date.now() - new Date(lastFeedback.timestamp).getTime()) / (1000 * 60 * 60)
        if (hoursSince < survey.conditions.timeSinceLastFeedback) {
          return false
        }
      }
    }

    // Check other conditions (user segment, feature usage, etc.)
    // This would integrate with the user segmentation context
    return true
  }

  // Record user events that might trigger feedback
  const recordEvent = (trigger: FeedbackTrigger, context?: Record<string, any>) => {
    const event = {
      trigger,
      timestamp: new Date().toISOString(),
      context
    }

    setEventHistory(prev => [...prev, event])

    // Check if any surveys should be triggered
    const eligibleSurvey = availableSurveys.find(survey =>
      survey.trigger === trigger && shouldShowSurvey(survey)
    )

    if (eligibleSurvey) {
      setCurrentSurvey(eligibleSurvey)
      setShowSurvey(true)
      setResponses({})
    }
  }

  // Submit feedback
  const submitFeedback = async (surveyId: string, responsesData: Record<string, any>) => {
    try {
      const survey = availableSurveys.find(s => s.id === surveyId)
      if (!survey) return

      const feedbackData: Partial<FeedbackData> = {
        userId,
        type: survey.type,
        trigger: survey.trigger,
        timestamp: new Date().toISOString(),
        responded: true,
        context: {
          surveyId,
          responses: responsesData,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      }

      // Add type-specific data
      if (survey.type === 'nps') {
        const score = responsesData.nps_score
        ;(feedbackData as NPSFeedback).score = score
        ;(feedbackData as NPSFeedback).promoterType = score >= 9 ? 'promoter' : score >= 7 ? 'passive' : 'detractor'
        ;(feedbackData as NPSFeedback).reason = responsesData.reason
        ;(feedbackData as NPSFeedback).improvement = responsesData.improvement
      }

      if (survey.type === 'feature_rating') {
        feedbackData.rating = Object.values(responsesData).reduce((acc: number, val: any) =>
          acc + (typeof val === 'number' ? val : 0), 0) / Object.keys(responsesData).length
        feedbackData.feature = responsesData.feature || 'general'
      }

      // Save to Supabase (or localStorage for demo)
      const { data, error } = await supabase
        .from('feedback')
        .insert(feedbackData)
        .select()

      if (error) {
        console.error('Error saving feedback:', error)
        // Fallback to localStorage
        const existingFeedback = JSON.parse(localStorage.getItem('feedback_history') || '[]')
        localStorage.setItem('feedback_history', JSON.stringify([...existingFeedback, { ...feedbackData, id: Date.now().toString() }]))
      } else {
        // data peut être un tableau ou un objet unique selon l'opération Supabase
        if (Array.isArray(data)) {
          setFeedbackHistory(prev => [...prev, ...(data as FeedbackData[])])
        } else if (data) {
          setFeedbackHistory(prev => [...prev, data as FeedbackData])
        }
      }

      // Close survey
      setShowSurvey(false)
      setCurrentSurvey(null)
      setResponses({})

      // Trigger follow-up actions based on feedback
      if (survey.type === 'nps' && (feedbackData as NPSFeedback).promoterType === 'promoter') {
        // Could trigger referral program or testimonial request
        console.log('Promoter detected - could trigger referral flow')
      }

      if (survey.type === 'nps' && (feedbackData as NPSFeedback).promoterType === 'detractor') {
        // Could trigger support outreach
        console.log('Detractor detected - could trigger support intervention')
      }

    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  // Dismiss survey without responding
  const dismissSurvey = (surveyId: string) => {
    const survey = availableSurveys.find(s => s.id === surveyId)
    if (!survey) return

    // Record dismissal
    const dismissalData: FeedbackData = {
      id: Date.now().toString(),
      userId,
      type: survey.type,
      trigger: survey.trigger,
      timestamp: new Date().toISOString(),
      responded: false,
      context: {
        surveyId,
        dismissed: true,
        userAgent: navigator.userAgent
      }
    }

    setFeedbackHistory(prev => [...prev, dismissalData])
    setShowSurvey(false)
    setCurrentSurvey(null)
    setResponses({})
  }

  // Get NPS analytics
  const getNPSData = () => {
    const npsFeedback = feedbackHistory.filter(f => f.type === 'nps') as NPSFeedback[]

    const promoters = npsFeedback.filter(f => f.promoterType === 'promoter').length
    const passives = npsFeedback.filter(f => f.promoterType === 'passive').length
    const detractors = npsFeedback.filter(f => f.promoterType === 'detractor').length

    const total = promoters + passives + detractors
    const score = total > 0 ? ((promoters - detractors) / total) * 100 : 0

    return { promoters, passives, detractors, score }
  }

  // Get feedback trends
  const getFeedbackTrends = () => {
    // Group feedback by week and calculate averages
    const weeklyData = feedbackHistory.reduce((acc: any, feedback) => {
      const week = new Date(feedback.timestamp).toISOString().split('T')[0]
      if (!acc[week]) {
        acc[week] = { count: 0, totalRating: 0, npsScores: [] }
      }
      acc[week].count++
      if (feedback.rating) {
        acc[week].totalRating += feedback.rating
      }
      if (feedback.type === 'nps') {
        acc[week].npsScores.push((feedback as NPSFeedback).score)
      }
      return acc
    }, {})

    return Object.entries(weeklyData).map(([week, data]: [string, any]) => ({
      week,
      count: data.count,
      avgRating: data.totalRating / data.count,
      npsScore: data.npsScores.length > 0
        ? (data.npsScores.reduce((a: number, b: number) => a + b, 0) / data.npsScores.length) * 10 - 50
        : 0
    }))
  }

  // Get user feedback history
  const getUserFeedbackHistory = () => {
    return feedbackHistory.filter(f => f.userId === userId)
  }

  const value: FeedbackContextType = {
    availableSurveys,
    currentSurvey,
    showSurvey,
    responses,
    submitFeedback,
    dismissSurvey,
    recordEvent,
    shouldShowSurvey,
    setResponses,
    getNPSData,
    getFeedbackTrends,
    getUserFeedbackHistory
  }

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}