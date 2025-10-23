import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Types pour les analytics
interface PageView {
  path: string
  referrer: string | null
  userAgent: string | null
  ip: string
  timestamp: string
  sessionId: string
}

interface ScorecardEvent {
  event_type: 'started' | 'completed' | 'question_answered'
  data: {
    question_id?: string
    answer?: string
    score?: number
    category?: string
  }
  sessionId: string
  ip: string
  timestamp: string
}

// Session management
const sessions = new Map<string, { startTime: string; pageViews: number; events: number }>()

function getSessionId(request: NextRequest): string {
  const cookies = request.cookies.get('session_id')
  if (cookies?.value) {
    return cookies.value
  }

  // Generate new session ID
  const sessionId = 'session_' + Math.random().toString(36).substr(2, 9)
  return sessionId
}

function getIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body
    const sessionId = getSessionId(request)
    const ip = getIP(request)
    const timestamp = new Date().toISOString()

    const supabase = await createClient()

    switch (type) {
      case 'page_view':
        // Track page view
        const pageView: PageView = {
          path: data.path,
          referrer: request.headers.get('referer'),
          userAgent: request.headers.get('user-agent'),
          ip,
          timestamp,
          sessionId
        }

        await supabase
          .from('analytics_page_views')
          .insert(pageView)

        // Update session
        const session = sessions.get(sessionId) || { startTime: timestamp, pageViews: 0, events: 0 }
        session.pageViews++
        sessions.set(sessionId, session)

        return NextResponse.json({ success: true })

      case 'scorecard_event':
        // Track scorecard events
        const scorecardEvent: ScorecardEvent = {
          event_type: data.event_type,
          data: data.data,
          sessionId,
          ip,
          timestamp
        }

        await supabase
          .from('analytics_scorecard_events')
          .insert(scorecardEvent)

        // Update session
        const scorecardSession = sessions.get(sessionId) || { startTime: timestamp, pageViews: 0, events: 0 }
        scorecardSession.events++
        sessions.set(sessionId, scorecardSession)

        return NextResponse.json({ success: true })

      case 'lead_capture':
        // Track lead capture
        await supabase
          .from('analytics_leads')
          .insert({
            email: data.email,
            name: data.name,
            phone: data.phone,
            source: data.source || 'scorecard',
            score: data.score,
            category: data.category,
            qualification: data.qualification,
            ip,
            timestamp,
            sessionId
          })

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json(
          { error: 'Type d\'événement non valide' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du tracking analytics' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')
    const period = searchParams.get('period') || '7d'

    let data: any = {}

    switch (metric) {
      case 'visitors':
        // Get visitor statistics
        const days = parseInt(period.replace('d', ''))
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const { data: pageViews } = await supabase
          .from('analytics_page_views')
          .select('ip, timestamp')
          .gte('timestamp', startDate.toISOString())

        const uniqueVisitors = new Set()
        const returningVisitors = new Set()

        pageViews?.forEach((view: any) => {
          uniqueVisitors.add(view.ip)
          // Check if returning visitor (has previous page views)
          const userViews = pageViews.filter((v: any) => v.ip === view.ip)
          if (userViews.length > 1) {
            returningVisitors.add(view.ip)
          }
        })

        data = {
          total: uniqueVisitors.size,
          returning: returningVisitors.size,
          new: uniqueVisitors.size - returningVisitors.size
        }
        break

      case 'scorecard':
        // Get scorecard statistics
        const { data: scorecardEvents } = await supabase
          .from('analytics_scorecard_events')
          .select('event_type, data')
          .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

        const started = scorecardEvents?.filter((e: any) => e.event_type === 'started').length || 0
        const completed = scorecardEvents?.filter((e: any) => e.event_type === 'completed').length || 0
        const completionRate = started > 0 ? (completed / started) * 100 : 0

        // Calculate category distribution
        const completedEvents = scorecardEvents?.filter((e: any) => e.event_type === 'completed') || []
        const categoryCounts = completedEvents.reduce((acc: any, event: any) => {
          const category = event.data?.category
          if (category) {
            acc[category] = (acc[category] || 0) + 1
          }
          return acc
        }, {})

        const averageScore = completedEvents.reduce((sum: number, event: any) => {
          return sum + (event.data?.score || 0)
        }, 0) / (completedEvents.length || 1)

        data = {
          started,
          completed,
          completionRate: Math.round(completionRate * 10) / 10,
          averageScore: Math.round(averageScore * 10) / 10,
          categories: categoryCounts
        }
        break

      case 'leads':
        // Get lead statistics
        const { data: leads } = await supabase
          .from('analytics_leads')
          .select('qualification, score, category')
          .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

        const qualificationCounts = leads?.reduce((acc: any, lead: any) => {
          acc[lead.qualification] = (acc[lead.qualification] || 0) + 1
          return acc
        }, {})

        data = {
          total: leads?.length || 0,
          qualifications: qualificationCounts,
          averageScore: Math.round((leads?.reduce((sum: number, lead: any) => sum + (lead.score || 0), 0) / (leads?.length || 1)) * 10) / 10
        }
        break

      default:
        // Get overview
        const overviewStartDate = new Date()
        overviewStartDate.setDate(overviewStartDate.getDate() - 7)

        const [{ count: totalPageViews }] = await supabase
          .from('analytics_page_views')
          .select('*', { count: 'exact', head: true })
          .gte('timestamp', overviewStartDate.toISOString())

        const [{ count: totalScorecardEvents }] = await supabase
          .from('analytics_scorecard_events')
          .select('*', { count: 'exact', head: true })
          .gte('timestamp', overviewStartDate.toISOString())

        const [{ count: totalLeads }] = await supabase
          .from('analytics_leads')
          .select('*', { count: 'exact', head: true })
          .gte('timestamp', overviewStartDate.toISOString())

        data = {
          pageViews: totalPageViews || 0,
          scorecardEvents: totalScorecardEvents || 0,
          leads: totalLeads || 0,
          period: '7d'
        }
    }

    return NextResponse.json({ success: true, data })

  } catch (error: any) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des analytics' },
      { status: 500 }
    )
  }
}