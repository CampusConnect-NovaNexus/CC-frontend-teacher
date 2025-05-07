import { StyleSheet, Text as RNText, type TextProps, useColorScheme } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { createTextStyles, legacyTextStyles } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

export type TypographyVariant = 
  | 'displayLarge' 
  | 'displayMedium' 
  | 'displaySmall'
  | 'headingLarge' 
  | 'headingMedium' 
  | 'headingSmall'
  | 'bodyLarge' 
  | 'bodyMedium' 
  | 'bodySmall'
  | 'labelLarge' 
  | 'labelMedium' 
  | 'labelSmall'
  | 'caption'
  | 'button'
  | 'link'
  // Legacy types for backward compatibility
  | 'default' 
  | 'defaultSemiBold' 
  | 'title' 
  | 'subtitle';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: TypographyVariant;
  // Legacy prop for backward compatibility
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

// Export both as ThemedText and as Text for backward compatibility
export function ThemedText({
  style,
  lightColor,
  darkColor,
  variant,
  type, // Legacy prop
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme() || 'light';
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  // Create text styles based on current theme
  const textStyles = createTextStyles(colorScheme === 'dark' ? 'dark' : 'light');
  
  // Determine which variant to use (prioritize variant over type)
  const finalVariant = variant || mapLegacyTypeToVariant(type);
  
  return (
    <RNText
      style={[
        // Apply the appropriate text style based on variant
        getTextStyle(finalVariant, textStyles),
        // Override with custom color if provided
        lightColor || darkColor ? { color } : undefined,
        // Apply any additional custom styles
        style,
      ]}
      {...rest}
    />
  );
}

// Helper function to get the appropriate text style
function getTextStyle(variant: TypographyVariant | undefined, textStyles: ReturnType<typeof createTextStyles>) {
  // Handle legacy types
  if (variant === 'default') return legacyTextStyles.default;
  if (variant === 'defaultSemiBold') return legacyTextStyles.defaultSemiBold;
  if (variant === 'title') return legacyTextStyles.title;
  if (variant === 'subtitle') return legacyTextStyles.subtitle;
  
  // Handle modern variants
  if (variant && textStyles[variant]) {
    return textStyles[variant];
  }
  
  // Default to bodyMedium if no variant specified
  return textStyles.bodyMedium;
}

// Helper function to map legacy type to modern variant
function mapLegacyTypeToVariant(type?: string): TypographyVariant | undefined {
  switch (type) {
    case 'default': return 'bodyMedium';
    case 'defaultSemiBold': return 'labelLarge';
    case 'title': return 'displaySmall';
    case 'subtitle': return 'headingMedium';
    case 'link': return 'link';
    default: return undefined;
  }
}

// Export Text as an alias for ThemedText for backward compatibility
export const Text = ThemedText;
