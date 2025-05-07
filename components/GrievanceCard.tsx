import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '@/components/ui/Card';
import { ThemedText } from '@/components/ThemedText';
import { spacing, borderRadius } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

export interface Grievance {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  userId: string;
  upvotes: number;
  comments: number;
}

interface GrievanceCardProps {
  grievance: Grievance;
  onPress: () => void;
  isAdmin?: boolean;
}

const GrievanceCard: React.FC<GrievanceCardProps> = ({ 
  grievance, 
  onPress,
  isAdmin = false
}) => {
  // Format the date
  const formattedDate = new Date(grievance.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Get theme colors
  const warningColor = useThemeColor({}, 'warning');
  const successColor = useThemeColor({}, 'success');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const dividerColor = useThemeColor({}, 'divider');
  
  // Determine status colors
  const getStatusColors = () => {
    if (grievance.status === 'pending') {
      return {
        bg: `${warningColor}20`, // 20% opacity
        text: warningColor
      };
    } else {
      return {
        bg: `${successColor}20`, // 20% opacity
        text: successColor
      };
    }
  };
  
  const statusColors = getStatusColors();

  return (
    <Card
      pressable
      onPress={onPress}
      elevation="sm"
    >
      <CardContent style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <ThemedText variant="headingSmall" numberOfLines={1}>
              {grievance.title}
            </ThemedText>
            <ThemedText 
              variant="bodySmall" 
              style={[styles.description, { color: textSecondaryColor }]} 
              numberOfLines={2}
            >
              {grievance.description}
            </ThemedText>
          </View>
          
          <View style={[
            styles.statusBadge, 
            { backgroundColor: statusColors.bg }
          ]}>
            <ThemedText 
              variant="labelSmall" 
              style={{ color: statusColors.text }}
            >
              {grievance.status === 'pending' ? 'Pending' : 'Resolved'}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.footer}>
          <ThemedText 
            variant="caption" 
            style={{ color: textSecondaryColor }}
          >
            {formattedDate}
          </ThemedText>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="arrow-up-outline" size={16} color={textSecondaryColor} />
              <ThemedText 
                variant="caption" 
                style={[styles.statText, { color: textSecondaryColor }]}
              >
                {grievance.upvotes}
              </ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={16} color={textSecondaryColor} />
              <ThemedText 
                variant="caption" 
                style={[styles.statText, { color: textSecondaryColor }]}
              >
                {grievance.comments}
              </ThemedText>
            </View>
          </View>
        </View>
        
        {isAdmin && (
          <>
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            <View style={styles.adminActions}>
              {grievance.status === 'pending' && (
                <TouchableOpacity style={styles.resolveButton}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={successColor} />
                  <ThemedText 
                    variant="labelSmall" 
                    style={[styles.resolveText, { color: successColor }]}
                  >
                    Mark as Resolved
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  description: {
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  stats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  statText: {
    marginLeft: spacing.xs,
  },
  divider: {
    height: 1,
    width: '100%',
    marginTop: spacing.md,
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resolveText: {
    marginLeft: spacing.xs,
  },
});

export default GrievanceCard;