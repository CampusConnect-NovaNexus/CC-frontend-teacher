// import React from 'react';
// import { StyleSheet, TouchableOpacity, View } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { ThemedText } from './ThemedText';
// import { ThemedView } from './ThemedView';
// import { borderRadius, spacing } from '@/constants/Spacing';
// import { useThemeColor } from '@/hooks/useThemeColor';

// interface DashboardCardProps {
//   title: string;
//   value: number | string;
//   icon: keyof typeof Ionicons.glyphMap;
//   color?: string;
//   variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
//   onPress?: () => void;
// }

// const DashboardCard: React.FC<DashboardCardProps> = ({ 
//   title, 
//   value, 
//   icon, 
//   color,
//   variant = 'primary',
//   onPress 
// }) => {
//   // Get the color based on variant if no specific color is provided
//   const getColorFromVariant = () => {
//     if (color) return color;
    
//     switch (variant) {
//       case 'success': return useThemeColor({}, 'success');
//       case 'warning': return useThemeColor({}, 'warning');
//       case 'error': return useThemeColor({}, 'error');
//       case 'info': return useThemeColor({}, 'info');
//       case 'primary':
//       default: return useThemeColor({}, 'primary');
//     }
//   };
  
//   const iconColor = getColorFromVariant();
  
//   return (
//     <ThemedView
//       surface="card"
//       elevation="sm"
//       style={styles.container}
//     >
//       <TouchableOpacity 
//         style={styles.touchable}
//         onPress={onPress}
//         disabled={!onPress}
//         activeOpacity={0.7}
//       >
//         <View style={styles.iconContainer}>
//           <Ionicons name={icon} size={28} color={iconColor} />
//         </View>
//         <ThemedText variant="headingMedium" style={styles.value}>
//           {value}
//         </ThemedText>
//         <ThemedText variant="labelMedium" style={styles.title}>
//           {title}
//         </ThemedText>
//       </TouchableOpacity>
//     </ThemedView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     borderRadius: borderRadius.md,
//     marginRight: spacing.md,
//     marginBottom: spacing.md,
//     width: '30%',
//     minWidth: 100,
//     overflow: 'hidden',
//   },
//   touchable: {
//     padding: spacing.md,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   iconContainer: {
//     marginBottom: spacing.sm,
//   },
//   value: {
//     marginBottom: spacing.xs,
//   },
//   title: {
//     textAlign: 'center',
//   },
// });

// export default DashboardCard;
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  onPress?: () => void;
}

const getVariantColor = (variant: string) => {
  switch (variant) {
    case 'success':
      return '#22c55e'; // green-500
    case 'warning':
      return '#facc15'; // yellow-400
    case 'error':
      return '#ef4444'; // red-500
    case 'info':
      return '#3b82f6'; // blue-500
    case 'primary':
    default:
      return '#6366f1'; // indigo-500
  }
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  variant = 'primary',
  onPress,
}) => {
  const iconColor = color ?? getVariantColor(variant);

  return (
    <View className="rounded-lg mr-4 mb-4 w-[30%] min-w-[100px] overflow-hidden bg-gray/70 shadow-sm">
      <TouchableOpacity
        className="p-4 items-center rounded-md bg-gray/50  justify-center"
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.7}
      >
        <View className="mb-2">
          <Ionicons name={icon} size={28} color={iconColor} />
        </View>
        <Text className="text-lg font-bold mb-1 text-gray-800">{value}</Text>
        <Text className="text-center text-gray-500 text-sm">{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardCard;
