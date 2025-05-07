import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import SimpleLineChart from '@/components/SimpleLineChart';
import SimpleBarChart from '@/components/SimpleBarChart';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { spacing, layout, borderRadius } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

const screenWidth = Dimensions.get('window').width;

type PeriodType = 'weekly' | 'monthly' | 'semester';

export default function AttendanceReportsScreen() {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('monthly');
  
  // Get theme colors
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');
  const infoColor = useThemeColor({}, 'info');
  const textInverseColor = useThemeColor({}, 'textInverse');
  const borderColor = useThemeColor({}, 'border');
  const backgroundSecondaryColor = useThemeColor({}, 'backgroundSecondary');
  const iconColor = useThemeColor({}, 'icon');
  
  // Mock data for attendance chart
  const monthlyLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const monthlyData = [85, 78, 92, 88];
  
  const semesterLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const semesterData = [82, 85, 80, 88, 91];
  
  const classComparisonLabels = ['CS101', 'CS201', 'CS301', 'CS401'];
  const classComparisonData = [85, 78, 92, 88];
  
  // Get filter button style based on current period
  const getPeriodButtonStyle = (period: PeriodType) => {
    if (selectedPeriod === period) {
      return {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
      };
    }
    
    return {
      backgroundColor: backgroundSecondaryColor,
      borderColor,
    };
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={iconColor} />
          </TouchableOpacity>
          <ThemedText variant="headingLarge">
            Attendance Reports
          </ThemedText>
        </View>
        
        {/* Period Selection */}
        <Card style={styles.card}>
          <CardHeader title="Time Period" />
          <CardContent style={styles.periodButtonsContainer}>
            <View style={styles.periodButtons}>
              <TouchableOpacity 
                style={[
                  styles.periodButton, 
                  getPeriodButtonStyle('weekly')
                ]}
                onPress={() => setSelectedPeriod('weekly')}
              >
                <ThemedText 
                  variant="labelMedium"
                  style={{ 
                    color: selectedPeriod === 'weekly' ? textInverseColor : undefined 
                  }}
                >
                  Weekly
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.periodButton, 
                  getPeriodButtonStyle('monthly')
                ]}
                onPress={() => setSelectedPeriod('monthly')}
              >
                <ThemedText 
                  variant="labelMedium"
                  style={{ 
                    color: selectedPeriod === 'monthly' ? textInverseColor : undefined 
                  }}
                >
                  Monthly
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.periodButton, 
                  getPeriodButtonStyle('semester')
                ]}
                onPress={() => setSelectedPeriod('semester')}
              >
                <ThemedText 
                  variant="labelMedium"
                  style={{ 
                    color: selectedPeriod === 'semester' ? textInverseColor : undefined 
                  }}
                >
                  Semester
                </ThemedText>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>
        
        {/* Attendance Trend Chart */}
        <Card style={styles.card}>
          <CardHeader title="Attendance Trend" />
          <CardContent>
            <SimpleLineChart
              data={selectedPeriod === 'semester' ? semesterData : monthlyData}
              labels={selectedPeriod === 'semester' ? semesterLabels : monthlyLabels}
              width={screenWidth - (layout.screenPaddingHorizontal * 2 + spacing.md * 2)}
              height={220}
              color={primaryColor}
              title="Average Attendance (%)"
            />
          </CardContent>
        </Card>
        
        {/* Class Comparison Chart */}
        <Card style={styles.card}>
          <CardHeader title="Class Comparison" />
          <CardContent>
            <SimpleBarChart
              data={classComparisonData}
              labels={classComparisonLabels}
              width={screenWidth - (layout.screenPaddingHorizontal * 2 + spacing.md * 2)}
              height={220}
              color={primaryColor}
              title="Class Attendance (%)"
            />
          </CardContent>
        </Card>
        
        {/* Statistics Summary */}
        <Card style={styles.card}>
          <CardHeader title="Summary Statistics" />
          <CardContent>
            <View style={styles.statsRow}>
              <ThemedView 
                style={styles.statCard}
                lightColor={`${infoColor}10`}
                bordered
              >
                <ThemedText 
                  variant="labelMedium" 
                  style={{ color: infoColor }}
                >
                  Highest Attendance
                </ThemedText>
                <ThemedText 
                  variant="displaySmall" 
                  style={{ color: infoColor }}
                >
                  92%
                </ThemedText>
                <ThemedText 
                  variant="bodySmall" 
                  style={{ color: infoColor }}
                >
                  CS301 - Database Systems
                </ThemedText>
              </ThemedView>
              
              <ThemedView 
                style={styles.statCard}
                lightColor={`${errorColor}10`}
                bordered
              >
                <ThemedText 
                  variant="labelMedium" 
                  style={{ color: errorColor }}
                >
                  Lowest Attendance
                </ThemedText>
                <ThemedText 
                  variant="displaySmall" 
                  style={{ color: errorColor }}
                >
                  78%
                </ThemedText>
                <ThemedText 
                  variant="bodySmall" 
                  style={{ color: errorColor }}
                >
                  CS201 - Data Structures
                </ThemedText>
              </ThemedView>
            </View>
            
            <ThemedView 
              style={[styles.statCard, styles.fullWidthStatCard]}
              lightColor={`${successColor}10`}
              bordered
            >
              <ThemedText 
                variant="labelMedium" 
                style={{ color: successColor }}
              >
                Overall Average
              </ThemedText>
              <ThemedText 
                variant="displaySmall" 
                style={{ color: successColor }}
              >
                85.75%
              </ThemedText>
              <ThemedText 
                variant="bodySmall" 
                style={{ color: successColor }}
              >
                Across all classes
              </ThemedText>
            </ThemedView>
          </CardContent>
        </Card>
        
        {/* Export Options */}
        <Card style={styles.card}>
          <CardHeader title="Export Report" />
          <CardContent style={styles.exportButtonsContainer}>
            <Button
              variant="primary"
              leftIcon="document-text-outline"
              style={styles.exportButton}
              onPress={() => {/* Export functionality would go here */}}
            >
              PDF
            </Button>
            
            <Button
              variant="secondary"
              leftIcon="grid-outline"
              style={styles.exportButton}
              onPress={() => {/* Export functionality would go here */}}
            >
              Excel
            </Button>
            
            <Button
              variant="outline"
              leftIcon="share-outline"
              style={styles.exportButton}
              onPress={() => {/* Export functionality would go here */}}
            >
              Share
            </Button>
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
  scrollContent: {
    padding: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  card: {
    marginBottom: layout.sectionSpacing,
  },
  periodButtonsContainer: {
    paddingHorizontal: spacing.sm,
  },
  periodButtons: {
    flexDirection: 'row',
  },
  periodButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    width: '48%',
    borderWidth: 1,
  },
  fullWidthStatCard: {
    width: '100%',
  },
  exportButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  exportButton: {
    width: '30%',
  },
});