import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DashboardCard from '@/components/DashboardCard';
import { fetchGrievanceStats } from '@/service/grievance/getStats';
import { fetchAttendanceStats } from '@/service/attendance/getStats';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { spacing, layout, borderRadius } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingGrievances: 0,
    resolvedGrievances: 0,
    totalGrievances: 0,
    averageAttendance: 0,
    lowAttendanceStudents: 0,
    totalStudents: 0,
  });

  // Get theme colors
  const primaryColor = useThemeColor({}, 'primary');

  useEffect(() => {
    const loadStats = async () => {
      try {
        // In a real app, these would be actual API calls
        // For now, we'll simulate with mock data
        const grievanceStats = await fetchGrievanceStats();
        const attendanceStats = await fetchAttendanceStats();
        
        setStats({
          pendingGrievances: grievanceStats.pending || 0,
          resolvedGrievances: grievanceStats.resolved || 0,
          totalGrievances: grievanceStats.total || 0,
          averageAttendance: attendanceStats.averagePercentage || 0,
          lowAttendanceStudents: attendanceStats.lowAttendanceCount || 0,
          totalStudents: attendanceStats.totalStudents || 0,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText variant="displaySmall" style={styles.pageTitle}>
          Teacher Dashboard
        </ThemedText>
        
        {/* Quick Actions */}
        <Card style={styles.sectionCard}>
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
                variant="primary"
                leftIcon="document-text-outline"
                style={styles.actionButton}
                onPress={() => router.push('/grievances')}
              >
                View Grievances
              </Button>
            </View>
            
            <View style={styles.actionButtonsRow}>
              <Button 
                variant="primary"
                leftIcon="bar-chart-outline"
                style={styles.actionButton}
                onPress={() => router.push('/attendance/reports')}
              >
                Attendance Reports
              </Button>
              
              <Button 
                variant="primary"
                leftIcon="settings-outline"
                style={styles.actionButton}
                onPress={() => router.push('/profile')}
              >
                Settings
              </Button>
            </View>
          </CardContent>
        </Card>
        
        {/* Grievance Stats */}
        <Card style={styles.sectionCard}>
          <CardHeader title="Grievance Overview" />
          <CardContent style={styles.statsContainer}>
            <DashboardCard 
              title="Pending"
              value={stats.pendingGrievances}
              icon="alert-circle-outline"
              variant="warning"
              onPress={() => router.push('/grievances?filter=pending')}
            />
            <DashboardCard 
              title="Resolved"
              value={stats.resolvedGrievances}
              icon="checkmark-circle-outline"
              variant="success"
              onPress={() => router.push('/grievances?filter=resolved')}
            />
            <DashboardCard 
              title="Total"
              value={stats.totalGrievances}
              icon="document-text-outline"
              variant="info"
              onPress={() => router.push('/grievances')}
            />
          </CardContent>
        </Card>
        
        {/* Attendance Stats */}
        <Card style={styles.sectionCard}>
          <CardHeader title="Attendance Overview" />
          <CardContent style={styles.statsContainer}>
            <DashboardCard 
              title="Avg. Attendance"
              value={`${stats.averageAttendance}%`}
              icon="analytics-outline"
              variant="info"
              onPress={() => router.push('/attendance/reports')}
            />
            <DashboardCard 
              title="Low Attendance"
              value={stats.lowAttendanceStudents}
              icon="warning-outline"
              variant="error"
              onPress={() => router.push('/attendance/low')}
            />
            <DashboardCard 
              title="Total Students"
              value={stats.totalStudents}
              icon="people-outline"
              variant="primary"
              onPress={() => router.push('/attendance/students')}
            />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  quickActionsContainer: {
    paddingHorizontal: spacing.sm,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  actionButton: {
    width: '48%',
    borderRadius: borderRadius.md,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});