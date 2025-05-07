import React from 'react';
import { 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  View, 
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '../ThemedText';
import { borderRadius, spacing } from '@/constants/Spacing';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  iconOnly = false,
  style,
  textStyle,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  // Get colors based on the current theme
  const primaryColor = useThemeColor({}, 'primary');
  const primaryDarkColor = useThemeColor({}, 'primaryDark');
  const textColor = useThemeColor({}, 'text');
  const textInverseColor = useThemeColor({}, 'textInverse');
  const backgroundColor = useThemeColor({}, 'background');
  const errorColor = useThemeColor({}, 'error');
  
  // Determine button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: primaryColor,
          borderColor: 'transparent',
          textColor: textInverseColor,
        };
      case 'secondary':
        return {
          backgroundColor: useThemeColor({}, 'secondary'),
          borderColor: 'transparent',
          textColor: textInverseColor,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: primaryColor,
          textColor: primaryColor,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: primaryColor,
        };
      case 'danger':
        return {
          backgroundColor: errorColor,
          borderColor: 'transparent',
          textColor: textInverseColor,
        };
      default:
        return {
          backgroundColor: primaryColor,
          borderColor: 'transparent',
          textColor: textInverseColor,
        };
    }
  };
  
  // Determine button size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          fontSize: 14,
          iconSize: 16,
        };
      case 'lg':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          fontSize: 18,
          iconSize: 22,
        };
      case 'md':
      default:
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          fontSize: 16,
          iconSize: 18,
        };
    }
  };
  
  const buttonStyles = getButtonStyles();
  const sizeStyles = getSizeStyles();
  
  // Apply disabled styles if button is disabled or loading
  const isDisabled = disabled || loading;
  const opacityStyle = isDisabled ? { opacity: 0.6 } : undefined;
  
  // Determine icon color based on variant
  const iconColor = buttonStyles.textColor;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonStyles.backgroundColor,
          borderColor: buttonStyles.borderColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: iconOnly ? sizeStyles.paddingVertical : sizeStyles.paddingHorizontal,
          borderRadius: iconOnly ? borderRadius.full : borderRadius.md,
        },
        fullWidth && styles.fullWidth,
        opacityStyle,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...rest}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="small" color={buttonStyles.textColor} />
        ) : (
          <>
            {leftIcon && !iconOnly && (
              <Ionicons
                name={leftIcon}
                size={sizeStyles.iconSize}
                color={iconColor}
                style={styles.leftIcon}
              />
            )}
            
            {iconOnly && leftIcon ? (
              <Ionicons
                name={leftIcon}
                size={sizeStyles.iconSize}
                color={iconColor}
              />
            ) : !iconOnly ? (
              <ThemedText
                style={[
                  {
                    color: buttonStyles.textColor,
                    fontSize: sizeStyles.fontSize,
                    fontWeight: '600',
                  },
                  textStyle,
                ]}
              >
                {children}
              </ThemedText>
            ) : null}
            
            {rightIcon && !iconOnly && (
              <Ionicons
                name={rightIcon}
                size={sizeStyles.iconSize}
                color={iconColor}
                style={styles.rightIcon}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.xs,
  },
});