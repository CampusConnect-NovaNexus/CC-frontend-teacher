# Campus Connect Teacher App Design System

This document outlines the design system for the Campus Connect Teacher App, providing guidelines for consistent UI development across the application.

## Table of Contents

1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Components](#components)
5. [Layout](#layout)
6. [Icons](#icons)
7. [Usage Guidelines](#usage-guidelines)

## Colors

Our color system is organized into primary, secondary, neutral, and semantic colors with various shades for each. The system supports both light and dark modes.

### Primary Colors

The primary color palette is based on blue tones:

```
primary: {
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
}
```

### Secondary Colors

The secondary color palette is based on green tones:

```
secondary: {
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
}
```

### Neutral Colors

Neutral colors for text, backgrounds, and borders:

```
neutral: {
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
}
```

### Semantic Colors

Colors that convey specific meanings:

```
semantic: {
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
}
```

### Usage

Colors are accessed through the `useThemeColor` hook:

```jsx
const primaryColor = useThemeColor({}, 'primary');
const textColor = useThemeColor({}, 'text');
```

## Typography

Our typography system defines consistent text styles across the application.

### Font Sizes

```
fontSize: {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
}
```

### Text Variants

- **Display**: Large, prominent text (displayLarge, displayMedium, displaySmall)
- **Heading**: Section headers (headingLarge, headingMedium, headingSmall)
- **Body**: Regular text content (bodyLarge, bodyMedium, bodySmall)
- **Label**: Form labels and small headers (labelLarge, labelMedium, labelSmall)
- **Special**: Caption, button text, and links

### Usage

Use the `ThemedText` component with the appropriate variant:

```jsx
<ThemedText variant="headingLarge">Page Title</ThemedText>
<ThemedText variant="bodyMedium">Regular text content</ThemedText>
<ThemedText variant="labelSmall">Small label</ThemedText>
```

## Spacing

Our spacing system is based on a 4px grid to ensure consistent spacing throughout the app.

### Spacing Scale

```
spacing: {
  none: 0,
  xs: 4,    // Extra small
  sm: 8,    // Small
  md: 16,   // Medium
  lg: 24,   // Large
  xl: 32,   // Extra large
  '2xl': 48, // 2x Extra large
  '3xl': 64, // 3x Extra large
}
```

### Border Radius

```
borderRadius: {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}
```

### Shadows

Five levels of elevation with corresponding shadows:

- `shadows.none`: No shadow
- `shadows.xs`: Subtle shadow
- `shadows.sm`: Small shadow
- `shadows.md`: Medium shadow
- `shadows.lg`: Large shadow
- `shadows.xl`: Extra large shadow

## Components

Our design system includes the following core components:

### Text Components

- `ThemedText`: Text component with theme-aware styling and typography variants

### Layout Components

- `ThemedView`: Container component with theme-aware styling
- `Card`: Surface component for containing related content
- `CardHeader`: Header section for cards
- `CardContent`: Content section for cards
- `CardFooter`: Footer section for cards

### Input Components

- `Button`: Action button with multiple variants and states
- `Input`: Text input field with labels and validation

### Data Display Components

- `DashboardCard`: Card for displaying key metrics

## Layout

### Screen Layout

- Use `ThemedView` as the root container for screens
- Apply consistent padding using `layout.screenPaddingHorizontal` and `layout.screenPaddingVertical`
- Use `ScrollView` for scrollable content

### Section Layout

- Group related content in `Card` components
- Use consistent spacing between sections with `layout.sectionSpacing`

## Icons

We use the Ionicons library for icons throughout the app.

```jsx
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="home" size={24} color={primaryColor} />
```

## Usage Guidelines

### Creating a New Screen

1. Import the necessary components:

```jsx
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { spacing, layout } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
```

2. Create a screen with consistent layout:

```jsx
export default function MyScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText variant="displaySmall" style={styles.pageTitle}>
          Screen Title
        </ThemedText>
        
        <Card style={styles.sectionCard}>
          <CardHeader title="Section Title" />
          <CardContent>
            <ThemedText variant="bodyMedium">
              Content goes here
            </ThemedText>
            
            <Button
              variant="primary"
              onPress={() => {}}
              style={styles.button}
            >
              Action Button
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  pageTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionCard: {
    marginBottom: layout.sectionSpacing,
  },
  button: {
    marginTop: spacing.md,
  },
});
```

### Form Layout

For forms, use the `Input` component with consistent spacing:

```jsx
<View style={styles.formContainer}>
  <Input
    label="Email Address"
    leftIcon="mail-outline"
    placeholder="Enter your email"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
  />

  <Input
    label="Password"
    leftIcon="lock-closed-outline"
    placeholder="Enter your password"
    value={password}
    onChangeText={setPassword}
    isPassword
  />
  
  <Button
    variant="primary"
    size="lg"
    onPress={handleSubmit}
    fullWidth
    style={styles.submitButton}
  >
    Submit
  </Button>
</View>
```

### Dark Mode Support

All components automatically support dark mode through the `useThemeColor` hook. No additional configuration is needed.