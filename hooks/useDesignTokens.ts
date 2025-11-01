'use client'

import { useMemo } from 'react'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  utils,
  themes,
  components,
  breakpoints
} from '@/styles/design-tokens'

interface UseDesignTokensReturn {
  // Colors
  colors: typeof colors
  getColorWithOpacity: (color: string, opacity: number) => string

  // Typography
  typography: typeof typography
  getTextStyle: (variant: 'heading' | 'body' | 'caption', size?: 'sm' | 'md' | 'lg') => React.CSSProperties

  // Spacing
  spacing: typeof spacing
  getSpacing: (value: keyof typeof spacing) => string

  // Shadows
  shadows: typeof shadows
  getShadow: (type: 'sm' | 'md' | 'lg' | 'xl' | 'glow' | 'ai') => string

  // Themes
  themes: typeof themes
  currentTheme: typeof themes.structureclerk

  // Components tokens
  components: typeof components

  // Utils
  utils: typeof utils

  // Animation helpers
  getAnimation: (type: 'fadeIn' | 'slideInUp' | 'scaleIn' | 'pulse') => React.CSSProperties

  // Breakpoints
  breakpoints: typeof breakpoints

  // Confidence styling (pour IA)
  getConfidenceStyle: (confidence: number) => {
    color: string
    backgroundColor: string
    borderColor: string
    textColor: string
  }
}

export function useDesignTokens(): UseDesignTokensReturn {
  const designTokens = useMemo(() => {
    const currentTheme = themes.structureclerk

    // Typography helper
    const getTextStyle = (variant: 'heading' | 'body' | 'caption', size: 'sm' | 'md' | 'lg' = 'md'): React.CSSProperties => {
      const baseStyles = {
        fontFamily: typography.fontFamily.sans.join(', '),
        color: currentTheme.text.primary,
        margin: 0
      }

      const variantStyles = {
        heading: {
          sm: { ...typography.fontSize.lg, fontWeight: typography.fontWeight.semibold },
          md: { ...typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold },
          lg: { ...typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold }
        },
        body: {
          sm: { ...typography.fontSize.sm, fontWeight: typography.fontWeight.normal },
          md: { ...typography.fontSize.base, fontWeight: typography.fontWeight.normal },
          lg: { ...typography.fontSize.lg, fontWeight: typography.fontWeight.normal }
        },
        caption: {
          sm: { ...typography.fontSize.xs, fontWeight: typography.fontWeight.normal },
          md: { ...typography.fontSize.sm, fontWeight: typography.fontWeight.normal },
          lg: { ...typography.fontSize.base, fontWeight: typography.fontWeight.normal }
        }
      }

      return {
        ...baseStyles,
        ...(variantStyles[variant][size] as unknown as React.CSSProperties)
      }
    }

    // Spacing helper
    const getSpacing = (value: keyof typeof spacing): string => {
      return spacing[value]
    }

    // Shadow helper
    const getShadow = (type: 'sm' | 'md' | 'lg' | 'xl' | 'glow' | 'ai'): string => {
      switch (type) {
        case 'sm':
          return shadows.sm
        case 'md':
          return shadows.md
        case 'lg':
          return shadows.lg
        case 'xl':
          return shadows.xl
        case 'glow':
          return shadows.glow.primary
        case 'ai':
          return shadows.glow.secondary
        default:
          return shadows.base
      }
    }

    // Animation helper
    const getAnimation = (type: 'fadeIn' | 'slideInUp' | 'scaleIn' | 'pulse'): React.CSSProperties => {
      const animationConfig = {
        fadeIn: {
          animation: `fadeIn ${animations.duration[300]} ${animations.easing.easeInOut} forwards`
        },
        slideInUp: {
          animation: `slideInUp ${animations.duration[500]} ${animations.easing.entrance} forwards`
        },
        scaleIn: {
          animation: `scaleIn ${animations.duration[200]} ${animations.easing.easeInOut} forwards`
        },
        pulse: {
          animation: `pulse ${animations.duration[1000]} ${animations.easing.easeInOut} infinite`
        }
      }

      return animationConfig[type]
    }

    // Confidence styling helper (spécifique IA)
    const getConfidenceStyle = (confidence: number) => {
      const tokens = utils.getConfidenceTokens(confidence)

      return {
        color: tokens.color,
        backgroundColor: utils.getColorWithOpacity(tokens.color, tokens.bgOpacity),
        borderColor: tokens.borderColor,
        textColor: tokens.color
      }
    }

    return {
      colors,
      getColorWithOpacity: utils.getColorWithOpacity,
      typography,
      getTextStyle,
      spacing,
      getSpacing,
      borderRadius,
      shadows,
      getShadow,
      animations,
      getAnimation,
      themes,
      currentTheme,
      components,
      utils,
      getConfidenceStyle,
      breakpoints
    }
  }, [])

  return designTokens
}

// Hook spécialisé pour les composants IA
export function useAITokens() {
  const { components, colors, utils, currentTheme } = useDesignTokens()

  return {
    // Tokens pour le chat IA
    chat: {
      borderRadius: components.ai.chat.borderRadius,
      shadow: components.ai.chat.shadow,
      background: components.ai.chat.backdrop,
      border: currentTheme.border,
      primaryMessage: utils.createBrandGradient('primary'),
      secondaryMessage: currentTheme.surface
    },

    // Tokens pour les explications IA
    explanation: {
      background: components.ai.explanation.background,
      border: components.ai.explanation.border,
      borderRadius: components.ai.explanation.borderRadius
    },

    // Tokens de confiance IA
    confidence: {
      high: components.ai.confidence.high,
      medium: components.ai.confidence.medium,
      low: components.ai.confidence.low
    },

    // Tokens d'état IA
    status: {
      processing: colors.warning[500],
      completed: colors.success[500],
      error: colors.error[500],
      thinking: colors.secondary[500]
    }
  }
}

// Hook pour les thèmes responsives
export function useResponsiveTokens() {
  const { spacing, typography, breakpoints } = useDesignTokens()

  const getResponsiveValue = <T>(values: { xs?: T; sm?: T; md?: T; lg?: T; xl?: T; defaultValue: T }): T => {
    // Cette fonction pourrait utiliser un hook de détection de breakpoint
    // Pour l'instant, retourne la valeur par défaut
    return values.defaultValue
  }

  return {
    spacing,
    typography,
    breakpoints,
    getResponsiveValue
  }
}

export default useDesignTokens