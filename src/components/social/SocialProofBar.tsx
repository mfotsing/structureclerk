'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Users, TrendingUp, Star, Award, Zap } from 'lucide-react'

interface SocialProofData {
  activeUsers: number
  documentsProcessed: number
  hoursSaved: number
  accuracy: number
  recentSignups: number
  testimonial?: {
    name: string
    company: string
    text: string
    rating: number
  }
}

export default function SocialProofBar() {
  const [data, setData] = useState<SocialProofData>({
    activeUsers: 127,
    documentsProcessed: 15847,
    hoursSaved: 2340,
    accuracy: 94,
    recentSignups: 23,
    testimonial: {
      name: "Marc Dubois",
      company: "Dubois Construction",
      text: "StructureClerk m'a fait économiser 10h par semaine. L'extraction IA est bluffante!",
      rating: 5
    }
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        documentsProcessed: prev.documentsProcessed + Math.floor(Math.random() * 3),
        hoursSaved: prev.hoursSaved + Math.floor(Math.random() * 2)
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

          {/* Trust Badges */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                <span className="text-lg font-bold text-blue-600">{data.activeUsers}</span> entrepreneurs
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Précision IA <span className="text-lg font-bold text-green-600">{data.accuracy}%</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">
                <span className="text-lg font-bold text-orange-600">{(data.hoursSaved / 60).toFixed(0)}h</span> économisées/semaine
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                <span className="font-medium text-green-600">{data.recentSignups}</span> inscrits cette semaine
              </span>
            </div>

            {data.testimonial && (
              <div className="hidden lg:flex items-center gap-3 px-3 py-2 bg-white rounded-full border border-gray-200">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-600 max-w-xs">
                  <span className="font-medium">{data.testimonial.name}</span>: {data.testimonial.text.substring(0, 50)}...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}