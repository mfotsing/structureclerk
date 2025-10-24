'use client'

import React, { useRef } from 'react'
import ScrollAnimatedCounter, { useIntersectionObserver } from './ScrollAnimatedCounter'

export default function AnimatedStatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver<HTMLDivElement>(sectionRef)

  return (
    <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          <ScrollAnimatedCounter
            end={2}
            suffix=" minutes"
            startAnimation={isVisible}
            duration={1500}
          />
        </div>
        <div className="text-sm text-blue-200">Pour obtenir vos résultats</div>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          <ScrollAnimatedCounter
            end={500}
            suffix="+"
            startAnimation={isVisible}
            duration={2000}
            delay={200}
          />
        </div>
        <div className="text-sm text-blue-200">Entrepreneurs accompagnés</div>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          <ScrollAnimatedCounter
            end={10}
            suffix="h+"
            startAnimation={isVisible}
            duration={1800}
            delay={400}
          />
        </div>
        <div className="text-sm text-blue-200">Temps récupéré/semaine</div>
      </div>
    </div>
  )
}