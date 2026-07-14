// Project X Design System
// Agricultural, healthy, calm, modern, warm, trusted, practical

export const colors = {
  primary: '#2F6B3B',
  primaryLight: '#4A8F5A',
  primaryDark: '#1E4D28',
  secondary: '#8B5E3C',
  secondaryLight: '#A97B5A',
  accent: '#D9A441',
  accentLight: '#E8C278',

  background: '#F7F5EF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  text: '#2B2B2B',
  textSecondary: '#5C5C5C',
  textTertiary: '#8A8A8A',
  textInverse: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  border: '#E5E0D8',
  borderLight: '#F0EDE6',
  divider: '#E5E0D8',

  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#C98A00',
  warningLight: '#FFF8E1',
  error: '#C94B32',
  errorLight: '#FDECEA',

  urgencyLow: '#2E7D32',
  urgencyMedium: '#C98A00',
  urgencyHigh: '#C94B32',
  urgencyCritical: '#8B0000',

  overlay: 'rgba(0,0,0,0.5)',
  shadow: 'rgba(0,0,0,0.08)',

  chatUser: '#E8F5E9',
  chatAssistant: '#FFFFFF',
  chipBackground: '#F0EDE6',
  chipSelected: '#2F6B3B',
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: colors.text,
  },
  h4: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: colors.text,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    color: colors.text,
  },
  bodySm: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  buttonSm: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    color: colors.text,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  pill: 50,
  circle: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
};

export const layout = {
  screenPadding: spacing.xl,
  cardPadding: spacing.lg,
  sectionGap: spacing.xxl,
  itemGap: spacing.md,
};
