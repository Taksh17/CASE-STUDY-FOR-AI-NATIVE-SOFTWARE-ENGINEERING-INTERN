/**
 * Design tokens and theme constants.
 *
 * Centralizing colors, spacing, typography, and border radii here
 * ensures visual consistency and makes future theming/dark-mode
 * straightforward — change values in one place instead of hunting
 * through dozens of StyleSheet.create calls.
 */

export const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',

  success: '#16A34A',
  successLight: '#DCFCE7',

  error: '#DC2626',
  errorLight: '#FEE2E2',

  warning: '#F59E0B',
  warningLight: '#FEF3C7',

  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

/**
 * Cross-platform card shadow.
 * iOS uses shadow* props, Android uses elevation.
 */
export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
} as const;
