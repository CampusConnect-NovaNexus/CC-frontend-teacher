import SimpleLineChart from '@/components/SimpleLineChart';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { layout, spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getAttendanceStats } from '@/service/attendance/getAttendanceStats';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

interface AttendanceStatsType {
  student_id: string;
  student_name: string;
  roll_no: string;
  course_code: string;
  total_classes: number;
  attended_classes: number;
  attendance_percentage: number;
  start_date?: string;
  end_date?: string;
}

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AttendanceStatsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  useEffect(() => {
    fetchStats();
  }, [id, startDate, endDate]);

  const fetchStats = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const statsData = await getAttendanceStats(
        id, 
        startDate ? startDate.toISOString() : undefined, 
        endDate ? endDate.toISOString() : undefined
      );
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      setError('Failed to load attendance statistics');
      setLoading(false);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toISOString().split('T')[0];
  };

  const clearDateFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedText variant="headingMedium" style={styles.pageTitle}>
          Student Attendance Details
        </ThemedText>

        <Card style={styles.card}>
          <CardHeader title="Date Range Filter" />
          <CardContent>
            <View style={styles.dateFilterRow}>
              <Button 
                variant="outline"
                onPress={() => setShowStartPicker(true)}
                style={styles.dateButton}
              >
                Start: {formatDate(startDate)}
              </Button>
              
              <Button 
                variant="outline"
                onPress={() => setShowEndPicker(true)}
                style={styles.dateButton}
              >
                End: {formatDate(endDate)}
              </Button>
            </View>
            
            {(startDate || endDate) && (
              <Button
                variant="secondary"
                size="sm"
                onPress={clearDateFilters}
                style={styles.clearButton}
              >
                Clear Filters
              </Button>
            )}
            
            {showStartPicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}
            
            {showEndPicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
          </CardContent>
        </Card>

        {loading ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={primaryColor} />
          </View>
        ) : error ? (
          <View style={styles.centeredContainer}>
            <ThemedText variant="bodyLarge" style={{ color: errorColor }}>
              {error}
            </ThemedText>
          </View>
        ) : !stats ? (
          <View style={styles.centeredContainer}>
            <ThemedText variant="bodyLarge" style={{ color: textSecondaryColor }}>
              No attendance data available
            </ThemedText>
          </View>
        ) : (
          <Card style={styles.container}>
            <CardHeader title={`Attendance Statistics: ${stats.student_name}`} />
            <CardContent>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <ThemedText variant="bodySmall" style={{ color: textSecondaryColor }}>
                    Roll Number
                  </ThemedText>
                  <ThemedText variant="bodyLarge">
                    {stats.roll_no}
                  </ThemedText>
                </View>
                
                <View style={styles.statItem}>
                  <ThemedText variant="bodySmall" style={{ color: textSecondaryColor }}>
                    Course
                  </ThemedText>
                  <ThemedText variant="bodyLarge">
                    {stats.course_code}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <ThemedText variant="bodySmall" style={{ color: textSecondaryColor }}>
                    Total Classes
                  </ThemedText>
                  <ThemedText variant="bodyLarge">
                    {stats.total_classes}
                  </ThemedText>
                </View>
                
                <View style={styles.statItem}>
                  <ThemedText variant="bodySmall" style={{ color: textSecondaryColor }}>
                    Attended Classes
                  </ThemedText>
                  <ThemedText variant="bodyLarge">
                    {stats.attended_classes}
                  </ThemedText>
                </View>
                
                <View style={styles.statItem}>
                  <ThemedText 
                    variant="bodySmall" 
                    style={{ 
                      color: stats.attendance_percentage >= 75 ? successColor : errorColor 
                    }}
                  >
                    Attendance
                  </ThemedText>
                  <ThemedText 
                    variant="headingSmall" 
                    style={{ 
                      color: stats.attendance_percentage >= 75 ? successColor : errorColor 
                    }}
                  >
                    {stats.attendance_percentage.toFixed(1)}%
                  </ThemedText>
                </View>
              </View>
              
              {stats.start_date && stats.end_date && (
                <View style={styles.dateRange}>
                  <ThemedText variant="bodySmall" style={{ color: textSecondaryColor }}>
                    Period: {new Date(stats.start_date).toLocaleDateString()} - {new Date(stats.end_date).toLocaleDateString()}
                  </ThemedText>
                </View>
              )}
              
              <SimpleLineChart
                data={[stats.attendance_percentage]}
                labels={['Attendance']}
                width={300}
                height={200}
                color={stats.attendance_percentage >= 75 ? successColor : errorColor}
                title="Attendance Percentage"
              />
            </CardContent>
          </Card>
        )}
        
        <Button
          variant="secondary"
          leftIcon="arrow-back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Back
        </Button>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  scrollContent: {
    padding: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  pageTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
  },
  dateFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  dateButton: {
    width: '48%',
  },
  clearButton: {
    alignSelf: 'flex-end',
  },
  backButton: {
    marginTop: spacing.lg,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    minHeight: 200,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  dateRange: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
});