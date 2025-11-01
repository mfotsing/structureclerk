// UI Components Index
// Exportation centralisée de tous les composants UI réutilisables

// Composants de base
export { default as Button } from './Button'
export { default as Card, CardHeader, CardContent, CardFooter, QuickCard } from './Card'
export { default as Badge, StatusBadge, MetricBadge } from './Badge'

// Design tokens et hooks
export { default as useDesignTokens } from '@/hooks/useDesignTokens'
export { useAITokens, useResponsiveTokens } from '@/hooks/useDesignTokens'

// Design tokens bruts (pour usage avancé)
export {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  zIndex,
  components,
  themes,
  utils
} from '@/styles/design-tokens'

// Réexportation pour compatibilité
export * from '@/styles/design-tokens'