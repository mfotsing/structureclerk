'use client'

import { useEffect, useRef } from 'react'

interface AnalyticsTrackerProps {
  trackPageView?: boolean
  trackScorecard?: boolean
}

export default function AnalyticsTracker({ trackPageView = true, trackScorecard = false }: AnalyticsTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    // Get or create session ID
    let sessionId = localStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('analytics_session_id', sessionId)
    }

    // Track page view
    if (trackPageView) {
      trackAnalyticsEvent('page_view', {
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      })
    }
  }, [trackPageView])

  const trackAnalyticsEvent = async (type: string, data: any) => {
    try {
      const sessionId = localStorage.getItem('analytics_session_id')
      if (!sessionId) return

      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data: {
            ...data,
            timestamp: new Date().toISOString()
          }
        })
      })
    } catch (error) {
      // Fail silently to not affect user experience
      console.debug('Analytics tracking failed:', error)
    }
  }

  // Expose tracking functions globally
  useEffect(() => {
    // Make tracking available globally for other components
    (window as any).analyticsTrack = trackAnalyticsEvent

    return () => {
      delete (window as any).analyticsTrack
    }
  }, [])

  return null
}

// Hook for scorecard tracking
export function useScorecardTracking() {
  const trackScorecardEvent = (eventType: 'started' | 'completed' | 'question_answered', data?: any) => {
    const sessionId = localStorage.getItem('analytics_session_id')
    if (!sessionId) return

    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'scorecard_event',
        data: {
          event_type: eventType,
          data,
          timestamp: new Date().toISOString()
        }
      })
    }).catch(() => {
      // Fail silently
    })
  }

  const trackLeadCapture = (leadData: any) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'lead_capture',
        data: {
          ...leadData,
          timestamp: new Date().toISOString()
        }
      })
    }).catch(() => {
      // Fail silently
    })
  }

  return { trackScorecardEvent, trackLeadCapture }
}

// Global declaration for TypeScript
declare global {
  interface Window {
    analyticsTrack?: (type: string, data: any) => void
  }
}