// StructureClerk Brand Colors
export const BRAND_COLORS = {
  // Primary colors
  primaryNavy: '#0A1A33',
  silver: '#E3E7EB',
  accentTeal: '#00A6A6',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',

  // Extended palette for UI
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

// Typography
export const BRAND_TYPOGRAPHY = {
  wordmark: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  foundersEdition: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 700,
    letterSpacing: '2%',
    textTransform: 'uppercase' as const,
  },
} as const;

// Logo scaling rules
export const LOGO_SIZES = {
  appStore: 1024,
  playStore: 512,
  desktop: 256,
  favicon: 48,
  ui: 32,
  navBar: 16,
} as const;

// CSS custom properties for global access
export const BRAND_CSS_VARS = `
  :root {
    --brand-primary-navy: ${BRAND_COLORS.primaryNavy};
    --brand-silver: ${BRAND_COLORS.silver};
    --brand-accent-teal: ${BRAND_COLORS.accentTeal};
    --brand-white: ${BRAND_COLORS.white};
    --brand-black: ${BRAND_COLORS.black};
  }
`;