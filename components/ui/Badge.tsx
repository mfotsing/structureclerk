'use client'

import { ReactNode } from 'react'
import { useDesignTokens, useAITokens } from '@/hooks/useDesignTokens'
import { colors, typography, animations, themes, spacing } from '@/styles/design-tokens'
import { utils } from '@/styles/design-tokens'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'confidence'
  confidence?: number // Pour les badges de confiance IA
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  outline?: boolean
  style?: React.CSSProperties
}

export const Badge = ({
  children,
  variant = 'default',
  confidence,
  size = 'md',
  rounded = true,
  outline = false,
  style = {}
}: BadgeProps) => {
  const { currentTheme, getSpacing, getConfidenceStyle } = useDesignTokens()
  const aiTokens = useAITokens()

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          fontSize: '0.625rem',
          padding: `${spacing[1]} ${spacing[2]}`,
          lineHeight: 1
        }
      case 'md':
        return {
          fontSize: '0.75rem',
          padding: `${spacing[1.5]} ${spacing[3]}`,
          lineHeight: 1
        }
      case 'lg':
        return {
          fontSize: '0.875rem',
          padding: `${spacing[2]} ${spacing[4]}`,
          lineHeight: 1
        }
      default:
        return {}
    }
  }

  const getVariantStyles = (): React.CSSProperties => {
    if (variant === 'confidence' && confidence !== undefined) {
      const confidenceStyle = getConfidenceStyle(confidence)
      return {
        backgroundColor: outline ? 'transparent' : confidenceStyle.backgroundColor,
        color: confidenceStyle.textColor,
        border: outline ? `1px solid ${confidenceStyle.borderColor}` : 'none'
      }
    }

    switch (variant) {
      case 'default':
        return {
          backgroundColor: outline ? 'transparent' : currentTheme.surface,
          color: currentTheme.text.secondary,
          border: outline ? `1px solid ${currentTheme.border}` : 'none'
        }

      case 'primary':
        return {
          backgroundColor: outline ? 'transparent' : colors.primary[500],
          color: outline ? colors.primary[600] : '#ffffff',
          border: outline ? `1px solid ${colors.primary[500]}` : 'none'
        }

      case 'success':
        return {
          backgroundColor: outline ? 'transparent' : colors.success[500],
          color: outline ? colors.success[600] : '#ffffff',
          border: outline ? `1px solid ${colors.success[500]}` : 'none'
        }

      case 'warning':
        return {
          backgroundColor: outline ? 'transparent' : colors.warning[500],
          color: outline ? colors.warning[600] : '#ffffff',
          border: outline ? `1px solid ${colors.warning[500]}` : 'none'
        }

      case 'error':
        return {
          backgroundColor: outline ? 'transparent' : colors.error[500],
          color: outline ? colors.error[600] : '#ffffff',
          border: outline ? `1px solid ${colors.error[500]}` : 'none'
        }

      default:
        return {}
    }
  }

  const getConfidenceLabel = (): string => {
    if (confidence === undefined) return ''

    if (confidence >= 90) return 'Excellente'
    if (confidence >= 75) return 'Bonne'
    if (confidence >= 60) return 'Moyenne'
    return 'Faible'
  }

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rounded ? '9999px' : '0.375rem',
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    transition: `all ${animations.duration[200]} ${animations.easing.easeInOut}`,
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style
  }

  // Si c'est un badge de confiance, afficher le pourcentage et le label
  if (variant === 'confidence' && confidence !== undefined) {
    return (
      <div style={badgeStyle}>
        <span style={{ marginRight: spacing[1] }}>{confidence}%</span>
        <span>{getConfidenceLabel()}</span>
      </div>
    )
  }

  return (
    <div style={badgeStyle}>
      {children}
    </div>
  )
}

// Badge spécial pour les statuts IA
interface StatusBadgeProps {
  status: 'processing' | 'completed' | 'error' | 'thinking'
  text?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export const StatusBadge = ({ status, text, size = 'md', animated = true }: StatusBadgeProps) => {
  const { getSpacing } = useDesignTokens()
  const aiTokens = useAITokens()

  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          color: aiTokens.status.processing,
          bgColor: utils.getColorWithOpacity(aiTokens.status.processing, 0.1),
          icon: '⏳',
          label: text || 'En cours'
        }
      case 'completed':
        return {
          color: aiTokens.status.completed,
          bgColor: utils.getColorWithOpacity(aiTokens.status.completed, 0.1),
          icon: '✅',
          label: text || 'Terminé'
        }
      case 'error':
        return {
          color: aiTokens.status.error,
          bgColor: utils.getColorWithOpacity(aiTokens.status.error, 0.1),
          icon: '❌',
          label: text || 'Erreur'
        }
      case 'thinking':
        return {
          color: aiTokens.status.thinking,
          bgColor: utils.getColorWithOpacity(aiTokens.status.thinking, 0.1),
          icon: '🤔',
          label: text || 'Réflexion'
        }
      default:
        return {
          color: colors.neutral[500],
          bgColor: colors.neutral[100],
          icon: '📌',
          label: text || 'Inconnu'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge
      variant="default"
      size={size}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${utils.getColorWithOpacity(config.color, 0.2)}`
      }}
    >
      <span style={{ marginRight: spacing[1], fontSize: '1em' }}>
        {animated && status === 'processing' ? (
          <span
            style={{
              display: 'inline-block',
              animation: `spin ${animations.duration[1000]} linear infinite`
            }}
          >
            {config.icon}
          </span>
        ) : (
          config.icon
        )}
      </span>
      {config.label}
    </Badge>
  )
}

// Badge pour les scores et métriques
interface MetricBadgeProps {
  value: number
  label?: string
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  precision?: number
  size?: 'sm' | 'md' | 'lg'
}

export const MetricBadge = ({
  value,
  label,
  unit,
  trend,
  precision = 1,
  size = 'md'
}: MetricBadgeProps) => {
  const { getSpacing, getColorWithOpacity, currentTheme } = useDesignTokens()

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return colors.success[600]
      case 'down':
        return colors.error[600]
      default:
        return colors.neutral[600]
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      default:
        return '→'
    }
  }

  const formatValue = () => {
    if (unit === '%') {
      return `${value.toFixed(precision)}%`
    }
    if (unit === '$') {
      return `$${value.toFixed(precision)}`
    }
    return `${value.toFixed(precision)}${unit || ''}`
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[1],
        padding: `${spacing[1]} ${spacing[2]}`,
        backgroundColor: currentTheme.surface,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: '0.375rem',
        fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '0.875rem' : '0.8rem'
      }}
    >
      <span style={{ fontWeight: '600', color: currentTheme.text.primary }}>
        {formatValue()}
      </span>
      {trend && (
        <span
          style={{
            color: getTrendColor(),
            fontSize: '0.875em',
            fontWeight: '600'
          }}
        >
          {getTrendIcon()}
        </span>
      )}
      {label && (
        <span style={{ color: currentTheme.text.secondary }}>
          {label}
        </span>
      )}
    </div>
  )
}

Badge.displayName = 'Badge'
StatusBadge.displayName = 'StatusBadge'
MetricBadge.displayName = 'MetricBadge'

export default Badge