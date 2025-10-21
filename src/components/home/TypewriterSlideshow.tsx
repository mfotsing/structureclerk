'use client'

import { useState, useEffect } from 'react'

interface TypewriterSlideshowProps {
  phrases: string[]
  typingSpeed?: number
  pauseDuration?: number
  className?: string
}

export default function TypewriterSlideshow({
  phrases,
  typingSpeed = 50,
  pauseDuration = 2000,
  className = '',
}: TypewriterSlideshowProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]

    if (isTyping) {
      // Typing mode: add characters one by one
      if (charIndex < currentPhrase.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        }, typingSpeed)
        return () => clearTimeout(timeout)
      } else {
        // Finished typing, pause before moving to next phrase
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, pauseDuration)
        return () => clearTimeout(timeout)
      }
    } else {
      // Erasing mode (optional) or direct switch to next phrase
      // For horizontal slideshow, we'll just switch directly
      const nextIndex = (currentPhraseIndex + 1) % phrases.length
      setCurrentPhraseIndex(nextIndex)
      setDisplayedText('')
      setCharIndex(0)
      setIsTyping(true)
    }
  }, [charIndex, isTyping, currentPhraseIndex, phrases, typingSpeed, pauseDuration])

  return (
    <div className={`relative min-h-[80px] ${className}`}>
      <h2 className="text-4xl md:text-5xl font-bold text-brand-navy leading-tight">
        {displayedText}
        <span className="animate-pulse text-brand-orange">|</span>
      </h2>
    </div>
  )
}
