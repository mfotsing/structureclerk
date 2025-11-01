// Design Tokens StructureClerk
// Systemème de design cohérent pour l'écosystème StructureClerk

// ========================================
// COULEURS (Colors)
// ========================================

export const colors = {
  // Couleurs primaires - Base de la marque
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49'
  },

  // Couleurs secondaires - Accent et actions
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764'
  },

  // Couleurs de succès - Validation et actions positives
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },

  // Couleurs d'avertissement - Attention et actions préventives
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },

  // Couleurs d'erreur - Actions critiques et alertes
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },

  // Palette neutre - Textes, fonds et interfaces
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  },

  // Palette sombre - Mode night/dark theme
  dark: {
    50: '#18181b',
    100: '#27272a',
    200: '#3f3f46',
    300: '#52525b',
    400: '#71717a',
    500: '#a1a1aa',
    600: '#d4d4d8',
    700: '#e4e4e7',
    800: '#f4f4f5',
    900: '#fafafa',
    950: '#ffffff'
  }
}

// ========================================
// TYPOGRAPHIE (Typography)
// ========================================

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
    display: ['Inter Display', 'Inter', 'system-ui', 'sans-serif']
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }]
  },

  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  }
}

// ========================================
// ESPACEMENT (Spacing)
// ========================================

export const spacing = {
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem'
}

// ========================================
// BORDER RADIUS (Border Radius)
// ========================================

export const borderRadius = {
  none: '0px',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px'
}

// ========================================
// OMBRES (Shadows)
// ========================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // Ombres thématiques StructureClerk
  glow: {
    primary: '0 0 20px rgba(14, 165, 233, 0.3)',
    secondary: '0 0 20px rgba(168, 85, 247, 0.3)',
    success: '0 0 20px rgba(34, 197, 94, 0.3)',
    warning: '0 0 20px rgba(245, 158, 11, 0.3)',
    error: '0 0 20px rgba(239, 68, 68, 0.3)'
  }
}

// ========================================
// BREAKPOINTS (Responsive Breakpoints)
// ========================================

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px'
}

// ========================================
// ANIMATIONS (Animations & Transitions)
// ========================================

export const animations = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },

  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // Courbes bézier personnalisées StructureClerk
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    entrance: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  keyframes: {
    // Animations d'entrée
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' }
    },
    slideInUp: {
      from: {
        opacity: '0',
        transform: 'translateY(10px)'
      },
      to: {
        opacity: '1',
        transform: 'translateY(0)'
      }
    },
    slideInDown: {
      from: {
        opacity: '0',
        transform: 'translateY(-10px)'
      },
      to: {
        opacity: '1',
        transform: 'translateY(0)'
      }
    },
    scaleIn: {
      from: {
        opacity: '0',
        transform: 'scale(0.95)'
      },
      to: {
        opacity: '1',
        transform: 'scale(1)'
      }
    },

    // Animations de chargement
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' }
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' }
    },
    bounce: {
      '0%, 100%': {
        transform: 'translateY(-25%)',
        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
      },
      '50%': {
        transform: 'translateY(0)',
        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
      }
    },

    // Animations spécifiques StructureClerk
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' }
    },
    glowPulse: {
      '0%, 100%': {
        opacity: '0.3',
        transform: 'scale(1)'
      },
      '50%': {
        opacity: '0.8',
        transform: 'scale(1.05)'
      }
    }
  }
}

// ========================================
// Z-INDEX (Stacking Context)
// ========================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
  // Z-index spécifiques StructureClerk
  sidebar: 1000,
  header: 1100,
  aiChat: 2000,
   notification: 3000
}

// ========================================
// COMPOSANTS SPÉCIFIQUES STRUCTURECLERK
// ========================================

export const components = {
  // Button tokens
  button: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem'
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem'
    },
    borderRadius: {
      sm: borderRadius.md,
      md: borderRadius.lg,
      lg: borderRadius.xl
    },
    fontSize: {
      sm: typography.fontSize.sm[0],
      md: typography.fontSize.base[0],
      lg: typography.fontSize.lg[0]
    }
  },

  // Card tokens
  card: {
    padding: {
      sm: spacing[4],
      md: spacing[6],
      lg: spacing[8]
    },
    borderRadius: {
      sm: borderRadius.lg,
      md: borderRadius['2xl'],
      lg: borderRadius['3xl']
    },
    shadow: {
      sm: shadows.base,
      md: shadows.md,
      lg: shadows.lg
    }
  },

  // Input tokens
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem'
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.75rem 1rem',
      lg: '1rem 1.25rem'
    },
    borderRadius: {
      sm: borderRadius.md,
      md: borderRadius.lg,
      lg: borderRadius.xl
    }
  },

  // AI Components tokens
  ai: {
    chat: {
      borderRadius: borderRadius['2xl'],
      shadow: shadows['2xl'],
      backdrop: 'rgba(15, 23, 42, 0.95)'
    },
    explanation: {
      borderRadius: borderRadius.lg,
      background: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)'
    },
    confidence: {
      high: colors.success[500],
      medium: colors.warning[500],
      low: colors.error[500]
    }
  }
}

// ========================================
// THÈMES PRÉDÉFINIS
// ========================================

export const themes = {
  light: {
    background: colors.neutral[50],
    foreground: colors.neutral[900],
    surface: '#ffffff',
    border: colors.neutral[200],
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      tertiary: colors.neutral[400]
    }
  },

  dark: {
    background: colors.dark[900],
    foreground: colors.dark[50],
    surface: colors.dark[800],
    border: colors.dark[700],
    text: {
      primary: colors.dark[50],
      secondary: colors.dark[400],
      tertiary: colors.dark[600]
    }
  },

  // Thème StructureClerk spécifique avec mode glassmorphism
  structureclerk: {
    background: 'rgba(15, 23, 42, 0.95)',
    foreground: '#ffffff',
    surface: 'rgba(255, 255, 255, 0.05)',
    surfaceHover: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.1)',
    text: {
      primary: '#ffffff',
      secondary: colors.neutral[300],
      tertiary: colors.neutral[500]
    },
    backdrop: 'blur(20px)',
    // Couleurs spécifiques au branding StructureClerk
    brand: {
      primary: colors.primary[600],
      secondary: colors.secondary[600],
      accent: colors.secondary[500]
    }
  }
}

// ========================================
// UTILITAIRES DE DESIGN TOKENS
// ========================================

export const utils = {
  // Récupérer une couleur avec opacité
  getColorWithOpacity: (color: string, opacity: number): string => {
    // Convertit hex en rgba
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  },

  // Calculer la taille responsive
  getResponsiveSize: (size: string, breakpoint: keyof typeof breakpoints): string => {
    const sizes: Record<string, string> = {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
    return sizes[size] || sizes.md
  },

  // Créer un dégradé de marque
  createBrandGradient: (type: 'primary' | 'secondary' | 'success' | 'warning' | 'error'): string => {
    const gradients = {
      primary: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
      secondary: `linear-gradient(135deg, ${colors.secondary[500]}, ${colors.secondary[600]})`,
      success: `linear-gradient(135deg, ${colors.success[500]}, ${colors.success[600]})`,
      warning: `linear-gradient(135deg, ${colors.warning[500]}, ${colors.warning[600]})`,
      error: `linear-gradient(135deg, ${colors.error[500]}, ${colors.error[600]})`
    }
    return gradients[type]
  },

  // Obtenir les tokens de confiance IA
  getConfidenceTokens: (confidence: number) => {
    if (confidence >= 90) {
      return {
        color: colors.success[500],
        bgOpacity: 0.1,
        borderColor: colors.success[300],
        text: 'Excellent'
      }
    } else if (confidence >= 75) {
      return {
        color: colors.warning[500],
        bgOpacity: 0.1,
        borderColor: colors.warning[300],
        text: 'Bon'
      }
    } else {
      return {
        color: colors.error[500],
        bgOpacity: 0.1,
        borderColor: colors.error[300],
        text: 'À améliorer'
      }
    }
  }
}

// Export par défaut pour faciliter l'utilisation
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  animations,
  zIndex,
  components,
  themes,
  utils
}