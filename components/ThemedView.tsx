import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { shadows } from '@/constants/Spacing';

export type SurfaceVariant = 'primary' | 'secondary' | 'card' | 'input';
export type ElevationLevel = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  surface?: SurfaceVariant;
  elevation?: ElevationLevel;
  bordered?: boolean;
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  surface = 'primary',
  elevation = 'none',
  bordered = false,
  ...otherProps 
}: ThemedViewProps) {
  // Get the background color based on the surface variant
  const backgroundColor = getSurfaceColor(surface, { light: lightColor, dark: darkColor });
  
  // Get the shadow style based on elevation
  const shadowStyle = getShadowStyle(elevation);
  
  // Get border style if bordered is true
  const borderStyle = bordered ? getBorderStyle() : undefined;

  return (
    <View 
      style={[
        { backgroundColor },
        shadowStyle,
        borderStyle,
        style
      ]} 
      {...otherProps} 
    />
  );
}

// Helper function to get the appropriate surface color
function getSurfaceColor(
  variant: SurfaceVariant, 
  colorOverrides: { light?: string; dark?: string }
) {
  switch (variant) {
    case 'primary':
      return useThemeColor(colorOverrides, 'background');
    case 'secondary':
      return useThemeColor(colorOverrides, 'backgroundSecondary');
    case 'card':
      return useThemeColor(colorOverrides, 'card');
    case 'input':
      return useThemeColor(colorOverrides, 'input');
    default:
      return useThemeColor(colorOverrides, 'background');
  }
}

// Helper function to get shadow style based on elevation
function getShadowStyle(elevation: ElevationLevel) {
  return shadows[elevation];
}

// Helper function to get border style
function getBorderStyle() {
  const borderColor = useThemeColor({}, 'border');
  return {
    borderWidth: 1,
    borderColor,
  };
}
