import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import SimpleLineChart from '@/components/SimpleLineChart';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { spacing, layout, borderRadius } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

const screenWidth = Dimensions.get('window').width;

interface ClassItem {
  id: string;
  name: string;
  students: number;
}

export default function AttendanceScreen() {
  const [loading, setLoading] = useState(false);
  
  // Get theme colors
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const errorColor = useThemeColor({}, 'error');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const iconColor = useThemeColor({}, 'icon');
  
  // Mock data for attendance chart
  const attendanceLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const attendanceData = [85, 78, 92, 88];

  // Mock data for classes
  const classes: ClassItem[] = [
    { id: '1', name: 'Computer Science - CS101', students: 45 },
    { id: '2', name: 'Data Structures - CS201', students: 38 },
    { id: '3', name: 'Database Systems - CS301', students: 42 },
    { id: '4', name: 'Web Development - CS401', students: 35 }
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedText variant="displaySmall" style={styles.pageTitle}>
          Attendance Management
        </ThemedText>
        
        {/* Quick Actions */}
        <Card style={styles.card}>
          <CardHeader title="Quick Actions" />
          <CardContent style={styles.quickActionsContainer}>
            <View style={styles.actionButtonsRow}>
              <Button
                variant="primary"
                leftIcon="calendar-outline"
                style={styles.actionButton}
                onPress={() => router.push('/attendance/take')}
              >
                Take Attendance
              </Button>
              
              <Button
                variant="secondary"
                leftIcon="bar-chart-outline"
                style={styles.actionButton}
                onPress={() => router.push('/attendance/reports')}
              >
                View Reports
              </Button>
            </View>
          </CardContent>
        </Card>
        
        {/* Attendance Overview Chart */}
        <Card style={styles.card}>
          <CardHeader title="Monthly Overview" />
          <CardContent>
            <SimpleLineChart
              data={attendanceData}
              labels={attendanceLabels}
              width={screenWidth - (layout.screenPaddingHorizontal * 2 + spacing.md * 2)}
              height={220}
              color={primaryColor}
              title="Average Attendance (%)"
            />
          </CardContent>
        </Card>
        
        {/* Classes */}
        <Card style={styles.card}>
          <CardHeader title="Your Classes" />
          <CardContent style={styles.classesContainer}>
            {classes.map((classItem, index) => (
              <TouchableOpacity 
                key={classItem.id}
                style={[
                  styles.classItem,
                  index < classes.length - 1 && styles.classItemWithBorder
                ]}
                onPress={() => router.push({
                  pathname: "/attendance/class/[id]",
                  params: { id: classItem.id }
                })}
                activeOpacity={0.7}
              >
                <View style={styles.classItemContent}>
                  <View>
                    <ThemedText variant="headingSmall">
                      {classItem.name}
                    </ThemedText>
                    <ThemedText 
                      variant="bodySmall" 
                      style={{ color: textSecondaryColor }}
                    >
                      {classItem.students} students
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={iconColor} />
                </View>
              </TouchableOpacity>
            ))}
          </CardContent>
        </Card>
        
        {/* Low Attendance Alert */}
        <ThemedView 
          style={styles.alertCard}
          lightColor={`${errorColor}10`} // 10% opacity
          bordered
        >
          <View style={styles.alertHeader}>
            <Ionicons name="warning-outline" size={24} color={errorColor} style={styles.alertIcon} />
            <ThemedText 
              variant="headingSmall" 
              style={{ color: errorColor }}
            >
              Low Attendance Alert
            </ThemedText>
          </View>
          
          <ThemedText 
            variant="bodyMedium" 
            style={styles.alertDescription}
          >
            5 students have attendance below 75%
          </ThemedText>
          
          <Button
            variant="danger"
            size="sm"
            onPress={() => router.push('/attendance/low')}
            style={styles.alertButton}
          >
            View Students
          </Button>
        </ThemedView>
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
  card: {
    marginBottom: layout.sectionSpacing,
  },
  quickActionsContainer: {
    paddingHorizontal: spacing.sm,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    borderRadius: borderRadius.md,
  },
  classesContainer: {
    padding: 0,
  },
  classItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  classItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  classItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertCard: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: layout.sectionSpacing,
    borderColor: 'rgba(244, 67, 54, 0.3)', // Error color with opacity
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertIcon: {
    marginRight: spacing.sm,
  },
  alertDescription: {
    marginBottom: spacing.md,
  },
  alertButton: {
    alignSelf: 'flex-start',
  },
});