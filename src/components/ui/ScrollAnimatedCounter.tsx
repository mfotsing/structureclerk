'use client'

import React, { useState, useEffect, useRef } from 'react'

interface ScrollAnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  delay?: number
  startAnimation?: boolean
}

export default function ScrollAnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
  delay = 0,
  startAnimation = false
}: ScrollAnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startAnimation || hasAnimated) return

    const timer = setTimeout(() => {
      const startTime = Date.now()
      const endTime = startTime + duration

      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentCount = Math.floor(easeOutQuart * end)

        setCount(currentCount)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(end)
          setHasAnimated(true)
        }
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timer)
  }, [startAnimation, end, duration, delay, hasAnimated])

  return (
    <div ref={counterRef} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  )
}

// Hook pour détecter quand un élément est visible dans le viewport
export function useIntersectionObserver<T extends Element>(
  ref: React.RefObject<T | null>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, {
      threshold: 0.3, // 30% de l'élément doit être visible
      ...options
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, options.threshold])

  return isIntersecting
}