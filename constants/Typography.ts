/**
 * Typography system for Campus Connect Teacher App
 * This defines consistent text styles across the application
 */

import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

// Font family configuration
// Note: You'll need to ensure these fonts are loaded in your app
export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
};

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Line heights
export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 30,
  '2xl': 32,
  '3xl': 38,
  '4xl': 44,
  '5xl': 60,
};

// Letter spacing
export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
};

// Font weights
export const fontWeight = {
  normal: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

// Text styles
export const createTextStyles = (mode: 'light' | 'dark') => {
  const colors = Colors[mode];
  
  return StyleSheet.create({
    // Display styles
    displayLarge: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize['5xl'],
      lineHeight: lineHeight['5xl'],
      fontWeight: fontWeight.bold,
      color: colors.text,
      letterSpacing: letterSpacing.tight,
    },
    displayMedium: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize['4xl'],
      lineHeight: lineHeight['4xl'],
      fontWeight: fontWeight.bold,
      color: colors.text,
      letterSpacing: letterSpacing.tight,
    },
    displaySmall: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize['3xl'],
      lineHeight: lineHeight['3xl'],
      fontWeight: fontWeight.bold,
      color: colors.text,
      letterSpacing: letterSpacing.tight,
    },
    
    // Heading styles
    headingLarge: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize['2xl'],
      lineHeight: lineHeight['2xl'],
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    headingMedium: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.xl,
      lineHeight: lineHeight.xl,
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    headingSmall: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.lg,
      lineHeight: lineHeight.lg,
      fontWeight: fontWeight.semiBold,
      color: colors.text,
    },
    
    // Body styles
    bodyLarge: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.lg,
      lineHeight: lineHeight.lg,
      fontWeight: fontWeight.normal,
      color: colors.text,
    },
    bodyMedium: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      fontWeight: fontWeight.normal,
      color: colors.text,
    },
    bodySmall: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      fontWeight: fontWeight.normal,
      color: colors.text,
    },
    
    // Label styles
    labelLarge: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      fontWeight: fontWeight.medium,
      color: colors.text,
    },
    labelMedium: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      fontWeight: fontWeight.medium,
      color: colors.text,
    },
    labelSmall: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.xs,
      lineHeight: lineHeight.xs,
      fontWeight: fontWeight.medium,
      color: colors.text,
    },
    
    // Special styles
    caption: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      lineHeight: lineHeight.xs,
      fontWeight: fontWeight.normal,
      color: colors.textSecondary,
    },
    button: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      fontWeight: fontWeight.medium,
      color: colors.textInverse,
      textTransform: 'uppercase',
      letterSpacing: letterSpacing.wide,
    },
    link: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      fontWeight: fontWeight.normal,
      color: colors.primary,
      textDecorationLine: 'underline',
    },
  });
};

// For backward compatibility with existing code
export const legacyTextStyles = StyleSheet.create({
  default: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
  defaultSemiBold: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: fontWeight.semiBold,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight['3xl'],
  },
  subtitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.xl,
  },
});