/**
 * Modern color system for Campus Connect Teacher App
 * This design system follows a consistent color palette across light and dark modes
 */

// Primary colors
const primary = {
  50: '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#2196f3', // Main primary color
  600: '#1e88e5',
  700: '#1976d2',
  800: '#1565c0',
  900: '#0d47a1',
};

// Secondary colors (accent)
const secondary = {
  50: '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50', // Main secondary color
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
};

// Neutral colors
const neutral = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};

// Semantic colors
const semantic = {
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

// Surface colors
const surface = {
  light: {
    background: '#ffffff',
    card: '#ffffff',
    input: '#f5f5f5',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    input: '#2c2c2c',
  },
};

export const Colors = {
  light: {
    // Text colors
    text: neutral[900],
    textSecondary: neutral[600],
    textTertiary: neutral[500],
    textInverse: '#ffffff',
    
    // Background colors
    background: surface.light.background,
    backgroundSecondary: neutral[50],
    card: surface.light.card,
    input: surface.light.input,
    
    // Brand colors
    primary: primary[500],
    primaryDark: primary[700],
    primaryLight: primary[300],
    secondary: secondary[500],
    secondaryDark: secondary[700],
    secondaryLight: secondary[300],
    
    // UI element colors
    border: neutral[200],
    divider: neutral[200],
    focus: primary[500],
    hover: `${primary[500]}10`, // 10% opacity
    
    // Tab navigation
    tabIconDefault: neutral[500],
    tabIconSelected: primary[500],
    tabBackground: '#ffffff',
    
    // Status colors
    success: semantic.success,
    warning: semantic.warning,
    error: semantic.error,
    info: semantic.info,
    
    // Legacy support
    tint: primary[500],
    icon: neutral[600],
  },
  dark: {
    // Text colors
    text: '#ffffff',
    textSecondary: neutral[400],
    textTertiary: neutral[500],
    textInverse: neutral[900],
    
    // Background colors
    background: surface.dark.background,
    backgroundSecondary: '#1e1e1e',
    card: surface.dark.card,
    input: surface.dark.input,
    
    // Brand colors
    primary: primary[400], // Slightly lighter in dark mode
    primaryDark: primary[600],
    primaryLight: primary[200],
    secondary: secondary[400], // Slightly lighter in dark mode
    secondaryDark: secondary[600],
    secondaryLight: secondary[200],
    
    // UI element colors
    border: neutral[700],
    divider: neutral[700],
    focus: primary[400],
    hover: `${primary[400]}15`, // 15% opacity
    
    // Tab navigation
    tabIconDefault: neutral[400],
    tabIconSelected: primary[400],
    tabBackground: '#1e1e1e',
    
    // Status colors
    success: '#66bb6a', // Lighter version for dark mode
    warning: '#ffb74d', // Lighter version for dark mode
    error: '#e57373', // Lighter version for dark mode
    info: '#64b5f6', // Lighter version for dark mode
    
    // Legacy support
    tint: primary[400],
    icon: neutral[400],
  },
  
  // Expose the raw color palettes for custom use cases
  palette: {
    primary,
    secondary,
    neutral,
    semantic,
  },
};
