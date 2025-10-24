'use client'

import { useState, useEffect } from 'react'
import { useFeedback } from '@/contexts/FeedbackContext'
import { TrendingUp, TrendingDown, Users, Star, MessageSquare, BarChart3, Target, CheckCircle } from 'lucide-react'

interface NPSDashboardProps {
  className?: string
  variant?: 'full' | 'compact' | 'minimal'
}

export default function NPSDashboard({ className = "", variant = 'full' }: NPSDashboardProps) {
  const { getNPSData, getFeedbackTrends, getUserFeedbackHistory } = useFeedback()
  const [npsData, setNpsData] = useState({ promoters: 0, passives: 0, detractors: 0, score: 0 })
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      try {
        const data = getNPSData()
        const trendData = getFeedbackTrends()
        setNpsData(data)
        setTrends(trendData)
      } catch (error) {
        console.error('Error loading NPS data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [getNPSData, getFeedbackTrends])

  const getScoreColor = (score: number) => {
    if (score >= 50) return 'text-green-600'
    if (score >= 0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Excellent'
    if (score >= 50) return 'Très bien'
    if (score >= 30) return 'Bien'
    if (score >= 0) return 'Correct'
    return 'À améliorer'
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />
  }

  const totalRespondents = npsData.promoters + npsData.passives + npsData.detractors

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">NPS:</span>
          <span className={`text-lg font-bold ${getScoreColor(npsData.score)}`}>
            {npsData.score.toFixed(0)}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {totalRespondents} avis
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-900">Score NPS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(npsData.score)}`}>
                {npsData.score.toFixed(0)}
              </span>
              <span className="text-sm text-gray-600">{getScoreLabel(npsData.score)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">{totalRespondents} répondants</div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700">{npsData.promoters}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-700">{npsData.passives}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-700">{npsData.detractors}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Net Promoter Score</h3>
              <p className="text-sm text-gray-600">Satisfaction client et recommandation</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(npsData.score)}`}>
              {npsData.score.toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">{getScoreLabel(npsData.score)}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Promoteurs</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{npsData.promoters}</div>
            <div className="text-xs text-green-700">
              {totalRespondents > 0 ? ((npsData.promoters / totalRespondents) * 100).toFixed(1) : 0}%
            </div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Passifs</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{npsData.passives}</div>
            <div className="text-xs text-yellow-700">
              {totalRespondents > 0 ? ((npsData.passives / totalRespondents) * 100).toFixed(1) : 0}%
            </div>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Détracteurs</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{npsData.detractors}</div>
            <div className="text-xs text-red-700">
              {totalRespondents > 0 ? ((npsData.detractors / totalRespondents) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>

        {/* Trends */}
        {trends.length > 1 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Tendance</h4>
            <div className="space-y-2">
              {trends.slice(-4).map((trend, index) => {
                const previousTrend = trends[trends.length - 5 + index - 1]
                const hasComparison = previousTrend
                return (
                  <div key={trend.week} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">{trend.week}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{trend.npsScore.toFixed(0)}</span>
                      {hasComparison && getTrendIcon(trend.npsScore, previousTrend.npsScore)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-xs text-gray-600">Taux de réponse</div>
              <div className="text-sm font-medium text-blue-900">
                {totalRespondents > 0 ? '23%' : '0%'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-xs text-gray-600">Satisfaction</div>
              <div className="text-sm font-medium text-green-900">
                {npsData.score >= 50 ? 'Élevée' : npsData.score >= 0 ? 'Correcte' : 'À améliorer'}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Objectif d'amélioration</h4>
              <p className="text-xs text-blue-800">
                {npsData.score >= 50
                  ? "Excellent! Maintenons ce niveau de satisfaction."
                  : npsData.score >= 0
                  ? "Bon début. Visons comment atteindre 50+."
                  : "Priorité : identifier et résoudre les problèmes des détracteurs."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}