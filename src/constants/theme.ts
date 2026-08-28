import { Platform } from 'react-native';

export const Palette = {
  primary: '#1769AA',
  dark: '#12304A',
  accent: '#F28C28',
  gold: '#F5B942',
  background: '#F8FAFC',
  mainText: '#1F2937',
  secondaryText: '#64748B',
  success: '#22A06B',

  // Derived surfaces & utilities
  surface: '#FFFFFF',
  surfaceContainerLow: '#EFF4FF',
  surfaceContainer: '#E6EEFF',
  surfaceContainerHigh: '#DEE9FC',
  outline: '#E2E8F0',
  outlineDark: '#CBD5E1',
  errorRed: '#DC2626',
  errorContainer: '#FEE2E2',
  goldLight: '#FEF3C7',
  goldDark: '#B45309',
  successLight: '#DCFCE7',
  accentLight: '#FFEDD5',
  accentDark: '#C2410C',
  textInverse: '#FFFFFF',
  navyLight: '#1E40AF',
};

export const Colors = {
  light: {
    text: Palette.mainText,
    textSecondary: Palette.secondaryText,
    textInverse: Palette.textInverse,
    background: Palette.background,
    backgroundElement: Palette.surfaceContainerLow,
    backgroundSelected: Palette.surfaceContainer,
    primary: Palette.primary,
    dark: Palette.dark,
    accent: Palette.accent,
    gold: Palette.gold,
    success: Palette.success,
    surface: Palette.surface,
    outline: Palette.outline,
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textInverse: '#1F2937',
    background: '#0F172A',
    backgroundElement: '#1E293B',
    backgroundSelected: '#334155',
    primary: '#38BDF8',
    dark: Palette.dark,
    accent: Palette.accent,
    gold: Palette.gold,
    success: Palette.success,
    surface: '#1E293B',
    outline: '#334155',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter, -apple-system, Roboto, sans-serif',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  containerMargin: 20,
  gutter: 16,
  // legacy compatibility
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 6,
  default: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const Shadows = {
  subtle: {
    shadowColor: Palette.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    shadowColor: Palette.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  hover: {
    shadowColor: Palette.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
};

export const BottomTabInset = Platform.select({ ios: 60, android: 70, web: 65 }) ?? 65;
export const MaxContentWidth = 900;
