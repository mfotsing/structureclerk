'use client'

import { useState, useEffect } from 'react'

interface AnimatedNumberProps {
  end: number
  suffix?: string
  duration?: number
  className?: string
}

export default function AnimatedNumber({ end, suffix = '', duration = 2000, className = '' }: AnimatedNumberProps) {
  const [current, setCurrent] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCurrent(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, isVisible])

  return (
    <span className={className}>
      {current}{suffix}
    </span>
  )
}
