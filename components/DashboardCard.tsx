import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { borderRadius, spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  onPress?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  variant = 'primary',
  onPress 
}) => {
  // Get the color based on variant if no specific color is provided
  const getColorFromVariant = () => {
    if (color) return color;
    
    switch (variant) {
      case 'success': return useThemeColor({}, 'success');
      case 'warning': return useThemeColor({}, 'warning');
      case 'error': return useThemeColor({}, 'error');
      case 'info': return useThemeColor({}, 'info');
      case 'primary':
      default: return useThemeColor({}, 'primary');
    }
  };
  
  const iconColor = getColorFromVariant();
  
  return (
    <ThemedView
      surface="card"
      elevation="sm"
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.touchable}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={28} color={iconColor} />
        </View>
        <ThemedText variant="headingMedium" style={styles.value}>
          {value}
        </ThemedText>
        <ThemedText variant="labelMedium" style={styles.title}>
          {title}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    width: '30%',
    minWidth: 100,
    overflow: 'hidden',
  },
  touchable: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: spacing.sm,
  },
  value: {
    marginBottom: spacing.xs,
  },
  title: {
    textAlign: 'center',
  },
});

export default DashboardCard;