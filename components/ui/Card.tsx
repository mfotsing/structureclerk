'use client'

import { ReactNode, HTMLAttributes } from 'react'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { colors, animations, themes, spacing } from '@/styles/design-tokens'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: 'sm' | 'md' | 'lg'
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  animate?: boolean
  children: ReactNode
}

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  hover = false,
  animate = true,
  className = '',
  style = {},
  ...props
}: CardProps) => {
  const { components, getAnimation, getShadow, currentTheme } = useDesignTokens()

  const baseStyle: React.CSSProperties = {
    background: currentTheme.surface,
    borderRadius: rounded === 'full' ? '9999px' : components.card.borderRadius[rounded],
    padding: components.card.padding[padding],
    border: 'none',
    transition: `all ${animations.duration[200]} ${animations.easing.easeInOut}`,
    position: 'relative',
    overflow: 'hidden',
    ...style
  }

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'default':
        return {
          background: currentTheme.surface,
          border: `1px solid ${currentTheme.border}`
        }

      case 'elevated':
        return {
          background: currentTheme.surface,
          boxShadow: getShadow(shadow as any),
          border: `1px solid ${currentTheme.border}`
        }

      case 'outlined':
        return {
          background: 'transparent',
          border: `2px solid ${currentTheme.border}`,
          boxShadow: 'none'
        }

      case 'glass':
        return {
          background: currentTheme.background,
          backdropFilter: currentTheme.backdrop,
          border: `1px solid ${currentTheme.border}`,
          boxShadow: getShadow('lg')
        }

      default:
        return {}
    }
  }

  const getHoverStyles = (): React.CSSProperties => {
    if (!hover) return {}

    return {
      transform: 'translateY(-2px)',
      boxShadow: getShadow('xl'),
      borderColor: colors.primary[300]
    }
  }

  const cardStyle: React.CSSProperties = {
    ...baseStyle,
    ...getVariantStyles(),
    ...getHoverStyles(),
    ...(animate && getAnimation('scaleIn'))
  }

  return (
    <div
      className={className}
      style={cardStyle}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title?: string
  subtitle?: string
  icon?: string
  action?: ReactNode
  style?: React.CSSProperties
}

export const CardHeader = ({ title, subtitle, icon, action, style }: CardHeaderProps) => {
  const { getTextStyle, getSpacing, currentTheme } = useDesignTokens()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing[4],
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
        {icon && (
          <div
            style={{
              fontSize: '1.5rem',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {icon}
          </div>
        )}
        <div>
          {title && (
            <h3 style={getTextStyle('heading', 'sm')}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                ...getTextStyle('caption', 'md'),
                marginTop: spacing[1],
                color: currentTheme.text.secondary
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  style?: React.CSSProperties
}

export const CardContent = ({ children, style }: CardContentProps) => {
  const { getTextStyle } = useDesignTokens()

  return (
    <div
      style={{
        ...getTextStyle('body', 'md'),
        lineHeight: 1.6,
        ...style
      }}
    >
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: ReactNode
  style?: React.CSSProperties
}

export const CardFooter = ({ children, style }: CardFooterProps) => {
  const { currentTheme } = useDesignTokens()

  return (
    <div
      style={{
        marginTop: spacing[4],
        paddingTop: spacing[4],
        borderTop: `1px solid ${currentTheme.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...style
      }}
    >
      {children}
    </div>
  )
}

// Composant combiné pour faciliter l'utilisation
interface QuickCardProps extends CardProps {
  title?: string
  subtitle?: string
  icon?: string
  action?: ReactNode
  footer?: ReactNode
}

export const QuickCard = ({
  title,
  subtitle,
  icon,
  action,
  footer,
  children,
  ...cardProps
}: QuickCardProps) => {
  return (
    <Card {...cardProps}>
      {(title || subtitle || icon || action) && (
        <CardHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          action={action}
        />
      )}
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'
QuickCard.displayName = 'QuickCard'

export default Card