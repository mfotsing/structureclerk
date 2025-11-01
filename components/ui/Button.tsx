'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { colors, typography, shadows, animations, themes, spacing } from '@/styles/design-tokens'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  rounded?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  className = '',
  style = {},
  disabled,
  ...props
}, ref) => {
  const { components, utils, getAnimation, getSpacing } = useDesignTokens()
  const currentTheme = themes.structureclerk

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    border: 'none',
    borderRadius: rounded ? '9999px' : components.button.borderRadius[size],
    padding: components.button.padding[size],
    fontSize: components.button.fontSize[size] as string,
    fontWeight: typography.fontWeight.semibold,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: `all ${animations.duration[200]} ${animations.easing.easeInOut}`,
    fontFamily: typography.fontFamily.sans.join(', '),
    width: fullWidth ? '100%' : 'auto',
    minHeight: components.button.height[size],
    position: 'relative',
    overflow: 'hidden',
    outline: 'none',
    textDecoration: 'none',
    boxSizing: 'border-box',
    ...style
  }

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: utils.createBrandGradient('primary'),
          color: '#ffffff',
          boxShadow: shadows.sm
        }

      case 'secondary':
        return {
          background: utils.createBrandGradient('secondary'),
          color: '#ffffff',
          boxShadow: shadows.sm
        }

      case 'outline':
        return {
          background: 'transparent',
          color: colors.primary[600],
          border: `1px solid ${colors.primary[500]}`
        }

      case 'ghost':
        return {
          background: 'transparent',
          color: currentTheme.text.primary
        }

      case 'success':
        return {
          background: utils.createBrandGradient('success'),
          color: '#ffffff',
          boxShadow: shadows.sm
        }

      case 'warning':
        return {
          background: utils.createBrandGradient('warning'),
          color: '#ffffff',
          boxShadow: shadows.sm
        }

      case 'error':
        return {
          background: utils.createBrandGradient('error'),
          color: '#ffffff',
          boxShadow: shadows.sm
        }

      default:
        return {}
    }
  }

  const getDisabledStyles = (): React.CSSProperties => {
    if (disabled || loading) {
      return {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'none !important'
      }
    }
    return {}
  }

  const buttonStyle: React.CSSProperties = {
    ...baseStyle,
    ...getVariantStyles(),
    ...getDisabledStyles()
  }

  const renderIcon = () => {
    if (!icon) return null

    return (
      <span
        style={{
          fontSize: '1.1em',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {icon}
      </span>
    )
  }

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <div
            style={{
              width: '1em',
              height: '1em',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: `spin ${animations.duration[1000]} linear infinite`
            }}
          />
          {children}
        </>
      )
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </>
    )
  }

  return (
    <button
      ref={ref}
      style={buttonStyle}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {renderContent()}
    </button>
  )
})

Button.displayName = 'Button'

export default Button