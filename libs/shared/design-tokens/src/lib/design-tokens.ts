/**
 * Design Tokens
 * Exported as TypeScript constants for JavaScript usage
 */

// Colors
export const colors = {
  primary: '#2563eb',
  primaryDark: '#1e40af',
  primaryLight: '#3b82f6',
  secondary: '#64748b',
  secondaryDark: '#475569',
  secondaryLight: '#94a3b8',
  accent: '#f59e0b',
  accentDark: '#d97706',
  accentLight: '#fbbf24',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0ea5e9',
  white: '#ffffff',
  black: '#000000',
  gray: {
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
  },
};

// Spacing
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

// Typography
export const typography = {
  fontFamily: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    mono: "'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Border radius
export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// Transitions
export const transitions = {
  fast: '150ms ease-in-out',
  base: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-index
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Palette (structured hues and shades)
export const palette = {
  blue: { 50: '#EFF6FF', 100: '#DBEAFE', 600: colors.primary, 700: colors.primaryDark },
  slate: { 50: '#F8FAFC', 100: '#F1F5F9', 600: colors.secondary, 700: colors.secondaryDark, 900: '#0F172A' },
  amber: { 50: '#FFFBEB', 100: '#FEF3C7', 500: colors.accent, 600: colors.accentDark },
  gray: { ...colors.gray },
  white: colors.white,
  black: colors.black,
};

// Semantic aliases (prefer using these in apps)
export const semantic = {
  primary: colors.primary,
  primaryHover: colors.primaryDark,
  secondary: colors.secondary,
  text: colors.gray[900],
  textMuted: colors.gray[600],
  border: colors.gray[200],
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,
};

// Numeric spacing scale (4px base)
export const space = {
  4: '0.25rem',
  8: '0.5rem',
  12: '0.75rem',
  16: '1rem',
  24: '1.5rem',
  32: '2rem',
  48: '3rem',
  64: '4rem',
};

// Sizing helpers
export const sizing = {
  container: { sm: breakpoints.sm, md: breakpoints.md, lg: breakpoints.lg, xl: breakpoints.xl, xxl: breakpoints['2xl'] },
  icon: { sm: '16px', md: '20px', lg: '24px' },
};

// Border widths
export const border = {
  width: { hairline: '1px', thin: '2px', thick: '3px' },
};

// Elevation (alias shadows)
export const elevation = {
  sm: shadows.sm,
  md: shadows.md,
  lg: shadows.lg,
  xl: shadows.xl,
};

// Motion tokens
export const motion = {
  duration: { fast: '150ms', base: '250ms', slow: '350ms' },
  easing: { standard: 'cubic-bezier(0.2, 0, 0, 1)', decel: 'cubic-bezier(0, 0, 0.2, 1)', accel: 'cubic-bezier(0.4, 0, 1, 1)' },
  transition: { base: `all ${transitions.base}` },
};

// Layer aliases (alias zIndex)
export const layers = { ...zIndex };

// Opacity presets
export const opacity = {
  dim: 0.6,
  overlay: 0.7,
  disabled: 0.4,
};

// Component-level tokens (optional helpers)
export const components = {
  header: { height: { base: '64px' }, bg: 'var(--color-header-bg)', border: 'var(--color-header-border)' },
  footer: { paddingY: { base: spacing.md, md: spacing.lg } },
  button: { height: { md: '40px' }, radius: borderRadius.md, bg: colors.primary, text: colors.white },
};
