import { borderRadius, layout, spacing } from '@/constants/Spacing';
import { useAuth } from '@/context/AuthContext';
import { getCourses } from '@/service/attendance/getCourses';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const COLORS = {
  primary: '#4361ee',
  secondary: '#3f37c9',
  error: '#991b1b',
  background: '#ffffff',
  card: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e0e0e0',
  icon: '#757575',
  divider: '#e0e0e0',
};

const FONT_SIZES = {
  displaySmall: 24,
  headingMedium: 18,
  headingSmall: 16,
  bodyMedium: 14,
  bodySmall: 12,
  labelMedium: 14,
};

interface CourseType {
  course_code: string;
  Teacher: string[];
  TA: string[];
  total_classes: number;
}

function Card({ children, style }: { children: React.ReactNode, style?: any }) {
  return (
    <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }, style]}>
      {children}
    </View>
  );
}

function CardHeader({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTextContainer}>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>{title}</Text>
      </View>
    </View>
  );
}

function CardContent({ children, style }: { children: React.ReactNode, style?: any }) {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
}

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  
  
  const COURSES_STORAGE_KEY = '@teacher_courses';
  
  const loadCachedCourses = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(COURSES_STORAGE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as CourseType[];
        setCourses(parsedData);
      }
    } catch (error) {
      console.error('Error loading cached courses:', error);
    }
  };
  
  const cacheCourses = async (coursesData: CourseType[]) => {
    try {
      await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(coursesData));
    } catch (error) {
      console.error('Error caching courses:', error);
    }
  };
  
  const fetchCourses = async (showLoading = true) => {
    if (!user?.email) return;
    
    try {
      
      const coursesData = await getCourses(user.email);
      setCourses(coursesData);
      cacheCourses(coursesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      
    }
  };
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses(false);
    setRefreshing(false);
  }, [user]);
  
  useEffect(() => {
    loadCachedCourses();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [user])
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.text} 
            colors={[COLORS.text]}
            progressBackgroundColor={COLORS.background} 
          />
        }
      >
        <Text style={[styles.pageTitle, { color: COLORS.text, fontSize: FONT_SIZES.displaySmall }]}>
          Your Courses
        </Text>
        
        {/* Quick Actions */}
        <Card style={styles.card}>
          <CardHeader title="Quick Actions" />
          <CardContent style={styles.quickActionsContainer}>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                className='bg-black flex-col items-center justify-center rounded-xl p-3 w-[48%] '
                onPress={() => router.push('/attendance/take')}
                activeOpacity={0.7}
              >
                <View  className='flex-col  items-center justify-center ' >
                  <Ionicons name="calendar-outline" size={32} color="#ffffff" style={styles.buttonIcon} />
                  <Text className='text-white pt-6 py-2 text-sm font-semibold'>Take Attendance</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                className='bg-black flex-col items-center justify-center rounded-xl p-3 w-[48%] '
                onPress={() => router.push('/attendance/reports')}
                activeOpacity={0.7}
              >
                <View className='flex-col items-center justify-center'>
                  <Ionicons name="bar-chart-outline" size={32} color="#ffffff" style={styles.buttonIcon} />
                  <Text className='text-white pt-6 py-2 text-sm font-semibold'>View Reports</Text>
                </View>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>
        
        
        {/* Classes */}
        <Card style={styles.card}>
          <CardHeader title="Your Courses" />
          <CardContent style={styles.classesContainer}>
            {loading ? (
              <Text style={[styles.loadingText, { color: COLORS.textSecondary }]}>
                Loading courses...
              </Text>
            ) : courses.length > 0 ? (
              courses.map((course, index) => (
                <TouchableOpacity 
                  key={course.course_code}
                  style={[
                    styles.classItem,
                    index < courses.length - 1 && styles.classItemWithBorder
                  ]}
                  onPress={() => router.push({
                    pathname: "/attendance/class/[id]",
                    params: { id: course.course_code }
                  })}
                  activeOpacity={0.7}
                >
                  <View style={styles.classItemContent}>
                    <View>
                      <Text style={[styles.courseCode, { color: COLORS.text }]}>
                        {course.course_code}
                      </Text>
                      <Text style={[styles.courseDetails, { color: COLORS.textSecondary }]}>
                        {course.total_classes} total classes
                      </Text>
                      <Text>Teaching Assistants : </Text>
                      {course.TA.map((ta, index) => (
                        <Text key={index} className='text-sm text-gray-500'>
                          {ta}
                        </Text>
                      ))}
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.icon} />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
                No courses found. Please contact your administrator.
              </Text>
            )}
          </CardContent>
        </Card>
        {/* Low Attendance Alert */}
        
        <View 
          style={[styles.alertCard, { backgroundColor: `${COLORS.error}10`, borderColor: 'rgba(244, 67, 54, 0.3)' }]}
        >
          <View style={styles.alertHeader}>
            <Ionicons name="warning-outline" size={24} color={COLORS.error} style={styles.alertIcon} />
            <Text style={[styles.alertTitle, { color: COLORS.error }]}>
              Low Attendance Alert
            </Text>
          </View>
          
          <Text style={[styles.alertDescription, { color: COLORS.text }]}
                className='self-center mt-5'>
            Some students have attendance below 75%
          </Text>
          
          <TouchableOpacity
            className='bg-rose-900 rounded-lg px-4 py-2 w-1/2 self-center'
            onPress={() => router.push('/attendance/low')}
            activeOpacity={0.7}
          >
            <Text className='text-white self-center py-2 text-sm font-semibold'>View Students</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    fontWeight: '600',
  },
  card: {
    marginBottom: layout.sectionSpacing,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.headingMedium,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
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
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primaryButton: {
    backgroundColor: '#000',
  },
  secondaryButton: {
    backgroundColor: '#000',
  },
  buttonIcon: {
    marginRight: spacing.xs,
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
    borderBottomColor: COLORS.divider,
  },
  classItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseCode: {
    fontSize: FONT_SIZES.headingSmall,
    fontWeight: '600',
  },
  courseDetails: {
    fontSize: FONT_SIZES.bodySmall,
    marginTop: 2,
  },
  loadingText: {
    padding: spacing.md,
    textAlign: 'center',
    opacity: 0.6,
  },
  emptyText: {
    padding: spacing.md,
    textAlign: 'center',
    opacity: 0.6,
  },
  alertCard: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: layout.sectionSpacing,
    borderWidth: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertIcon: {
    marginRight: spacing.sm,
  },
  alertTitle: {
    fontSize: FONT_SIZES.headingSmall,
    fontWeight: '600',
  },
  alertDescription: {
    fontSize: FONT_SIZES.bodyMedium,
    marginBottom: spacing.md,
  },
  alertButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
});