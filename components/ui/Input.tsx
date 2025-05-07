import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TextInputProps, 
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { borderRadius, spacing } from '@/constants/Spacing';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  helperText?: string;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  helperText,
  isPassword,
  secureTextEntry,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Get theme colors
  const inputBackground = useThemeColor({}, 'input');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'textTertiary');
  const primaryColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');
  
  // Determine if we should show the password toggle icon
  const showPasswordToggle = isPassword || secureTextEntry;
  
  // Determine the border color based on state
  const getBorderColor = () => {
    if (error) return errorColor;
    if (isFocused) return primaryColor;
    return borderColor;
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  // Determine the right icon
  const renderRightIcon = () => {
    if (showPasswordToggle) {
      return (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Ionicons 
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
            size={20} 
            color={iconColor} 
          />
        </TouchableOpacity>
      );
    }
    
    if (rightIcon) {
      return (
        <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
          <Ionicons name={rightIcon} size={20} color={iconColor} />
        </TouchableOpacity>
      );
    }
    
    return null;
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText 
          variant="labelMedium" 
          style={[styles.label, labelStyle]}
        >
          {label}
        </ThemedText>
      )}
      
      <View 
        style={[
          styles.inputContainer, 
          { 
            backgroundColor: inputBackground,
            borderColor: getBorderColor(),
            borderWidth: 1,
          },
          isFocused && styles.inputFocused,
        ]}
      >
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={iconColor} 
            style={styles.leftIcon} 
          />
        )}
        
        <TextInput
          style={[
            styles.input, 
            { color: textColor },
            inputStyle,
          ]}
          placeholderTextColor={placeholderColor}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={showPasswordToggle ? !isPasswordVisible : false}
          {...rest}
        />
        
        {renderRightIcon()}
      </View>
      
      {(error || helperText) && (
        <ThemedText 
          variant="caption" 
          style={[
            styles.helperText,
            error && { color: errorColor },
          ]}
        >
          {error || helperText}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  inputFocused: {
    borderWidth: 2,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  helperText: {
    marginTop: spacing.xs,
  },
});