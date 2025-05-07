/**
 * Spacing system for Campus Connect Teacher App
 * This defines consistent spacing values across the application
 */

// Base spacing unit (4px)
const BASE = 4;

export const spacing = {
  // Named spacing values
  none: 0,
  xs: BASE, // 4px
  sm: BASE * 2, // 8px
  md: BASE * 4, // 16px
  lg: BASE * 6, // 24px
  xl: BASE * 8, // 32px
  '2xl': BASE * 12, // 48px
  '3xl': BASE * 16, // 64px
  
  // Numeric spacing values for more granular control
  0: 0,
  1: BASE / 2, // 2px
  2: BASE, // 4px
  4: BASE * 2, // 8px
  6: BASE * 3, // 12px
  8: BASE * 4, // 16px
  10: BASE * 5, // 20px
  12: BASE * 6, // 24px
  16: BASE * 8, // 32px
  20: BASE * 10, // 40px
  24: BASE * 12, // 48px
  32: BASE * 16, // 64px
  40: BASE * 20, // 80px
  48: BASE * 24, // 96px
  56: BASE * 28, // 112px
  64: BASE * 32, // 128px
};

// Layout constants
export const layout = {
  // Screen padding
  screenPaddingHorizontal: spacing.md,
  screenPaddingVertical: spacing.md,
  
  // Card padding
  cardPaddingHorizontal: spacing.md,
  cardPaddingVertical: spacing.md,
  
  // Section spacing
  sectionSpacing: spacing.xl,
  
  // Element spacing
  elementSpacing: spacing.md,
  
  // Form spacing
  formItemSpacing: spacing.lg,
  
  // List spacing
  listItemSpacing: spacing.md,
};

// Border radius
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadows
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
};