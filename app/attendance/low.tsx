import { useAuth } from '@/context/AuthContext';
import { getCourses } from '@/service/attendance/getCourses';
import { getLowAttendanceStudents } from '@/service/attendance/getLowAttendance';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Types
interface CourseType {
  course_code: string;
  Teacher: string[];
  TA: string[];
  total_classes: number;
}

interface StudentWithLowAttendance {
  
  attendance_percentage: number;
  student_name: string; 
  student_roll_no: string; 
}

interface LowAttendanceData {
  course_code: string;
  total_classes: number;
  students_with_low_attendance: StudentWithLowAttendance[];
  total_students: number;
  start_date?: string;
  end_date?: string;
}

// Colors for black and white theme
const COLORS = {
  primary: '#000000',
  background: '#ffffff',
  card: '#ffffff',
  text: '#000000',
  textSecondary: '#555555',
  border: '#dddddd',
  error: '#ff3b30',
  success: '#34c759',
  warning: '#ffcc00',
  info: '#007aff',
  divider: '#eeeeee',
};

export default function LowAttendanceScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('');
  const [lowAttendanceData, setLowAttendanceData] = useState<LowAttendanceData | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AsyncStorage keys
  const COURSES_STORAGE_KEY = '@teacher_low_attendance_courses';
  const getLowAttendanceStorageKey = (courseCode: string, startDate?: Date, endDate?: Date) => {
    const dateParams = startDate || endDate 
      ? `_${startDate?.toISOString() || 'nostart'}_${endDate?.toISOString() || 'noend'}`
      : '';
    return `@low_attendance_${courseCode}${dateParams}`;
  };

  // Load cached courses
  const loadCachedCourses = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(COURSES_STORAGE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as CourseType[];
        setCourses(parsedData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading cached courses:', error);
      return false;
    }
  };

  // Cache courses
  const cacheCourses = async (coursesData: CourseType[]) => {
    try {
      await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(coursesData));
    } catch (error) {
      console.error('Error caching courses:', error);
    }
  };

  // Load cached low attendance data
  const loadCachedLowAttendanceData = async (courseCode: string) => {
    if (!courseCode) return false;
    
    try {
      const storageKey = getLowAttendanceStorageKey(courseCode, startDate || undefined, endDate || undefined);
      const cachedData = await AsyncStorage.getItem(storageKey);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as LowAttendanceData;
        setLowAttendanceData(parsedData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading cached low attendance data:', error);
      return false;
    }
  };

  // Cache low attendance data
  const cacheLowAttendanceData = async (data: LowAttendanceData, courseCode: string) => {
    try {
      const storageKey = getLowAttendanceStorageKey(courseCode, startDate || undefined, endDate || undefined);
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching low attendance data:', error);
    }
  };

  // Fetch courses
  const fetchCourses = async (showLoading = true) => {
    if (!user?.email) return;
    
    try {
      if (showLoading) setLoadingCourses(true);
      const coursesData = await getCourses(user.email);
      setCourses(coursesData);
      cacheCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch low attendance data
  const fetchLowAttendanceData = async (courseCode: string, showLoading = true) => {
    if (!courseCode) return;
    
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const data = await getLowAttendanceStudents(
        courseCode,
        startDate ? startDate.toISOString() : undefined,
        endDate ? endDate.toISOString() : undefined
      );
      
      setLowAttendanceData(data);
      cacheLowAttendanceData(data, courseCode);
    } catch (error) {
      console.error('Error fetching low attendance data:', error);
      setError('Failed to fetch low attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Handle course selection
  const handleCourseChange = (courseCode: string) => {
    setSelectedCourseCode(courseCode);
    if (courseCode) {
      // First try to load cached data
      loadCachedLowAttendanceData(courseCode).then(hasCachedData => {
        // If no cached data or we need fresh data anyway, fetch from API
        if (!hasCachedData) {
          setLoading(true);
        }
        // Always fetch fresh data, but we might already be showing cached data
        fetchLowAttendanceData(courseCode, !hasCachedData);
      });
    } else {
      setLowAttendanceData(null);
    }
  };

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses(false);
    if (selectedCourseCode) {
      await fetchLowAttendanceData(selectedCourseCode, false);
    }
    setRefreshing(false);
  }, [selectedCourseCode]);

  // Date picker handlers
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedCourseCode) {
        fetchLowAttendanceData(selectedCourseCode);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      if (selectedCourseCode) {
        fetchLowAttendanceData(selectedCourseCode);
      }
    }
  };

  const clearDateFilters = () => {
    setStartDate(null);
    setEndDate(null);
    if (selectedCourseCode) {
      fetchLowAttendanceData(selectedCourseCode);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toISOString().split('T')[0];
  };

  // Initial data loading
  useEffect(() => {
    const initializeData = async () => {
      // First try to load cached courses
      const hasCachedCourses = await loadCachedCourses();
      
      // If no cached courses or we need fresh data anyway, fetch from API
      if (!hasCachedCourses) {
        setLoadingCourses(true);
      }
      
      // Always fetch fresh courses, but we might already be showing cached data
      if (user?.email) {
        fetchCourses(!hasCachedCourses);
      }
    };
    
    initializeData();
  }, [user]);

  // Render student item
  const renderStudentItem = ({ item }: { item: StudentWithLowAttendance }) => (
    <View style={[styles.studentCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
      <View style={styles.studentHeader}>
        <View>
          <Text style={[styles.studentName, { color: COLORS.text }]}>
            {item.student_name}
          </Text>
          <Text style={[styles.studentName, { color: COLORS.text }]}>
            {item.student_roll_no}
          </Text>
          
        </View>
        <View style={[styles.attendanceBadge, { backgroundColor: '#fff0f0', borderColor: COLORS.error }]}>
          <Text style={[styles.attendanceText, { color: COLORS.error }]}>
            {item.attendance_percentage.toFixed(1)}%
          </Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          className='bg-blue-500 flex-row items-center px-4 py-2 rounded-md mr-2'
          onPress={() => {/* Send notification functionality would go here */}}
        >
          <Ionicons name="mail-outline" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Notify</Text>
        </TouchableOpacity>
        
        {/* <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          onPress={() => router.push({
            pathname: "/attendance/student/[id]",
            params: { id: item.student_roll_no }
          })}
        >
          <Ionicons name="eye-outline" size={16} color="#ffffff" />
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={[styles.emptyState, { borderColor: COLORS.success }]}>
      <Ionicons name="checkmark-circle-outline" size={48} color={COLORS.success} />
      <Text style={[styles.emptyStateTitle, { color: COLORS.success }]}>
        Perfect Attendance!
      </Text>
      <Text style={[styles.emptyStateText, { color: COLORS.textSecondary }]}>
        All students in this course have attendance above the 75% threshold.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <FlatList
        data={lowAttendanceData?.students_with_low_attendance || []}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.student_id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <View>
                <Text style={[styles.pageTitle, { color: COLORS.text }]}>Low Attendance</Text>
                
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
              <Text style={[styles.cardTitle, { color: COLORS.text }]}>Select Course</Text>
              {loadingCourses ? (
                <ActivityIndicator size="small" color={COLORS.primary} style={styles.loader} />
              ) : (
                <View style={[styles.pickerContainer, { borderColor: COLORS.border }]}>
                  <Picker
                    selectedValue={selectedCourseCode}
                    onValueChange={handleCourseChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a course..." value="" />
                    {courses.map((course) => (
                      <Picker.Item 
                        key={course.course_code} 
                        label={course.course_code} 
                        value={course.course_code} 
                      />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            {selectedCourseCode && (
              <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
                <Text style={[styles.cardTitle, { color: COLORS.text }]}>Date Range Filter</Text>
                <View style={styles.datePickerRow}>
                  <TouchableOpacity 
                    style={[styles.datePickerButton, { borderColor: COLORS.primary }]}
                    onPress={() => setShowStartPicker(true)}
                  >
                    <Text style={[styles.datePickerText, { color: COLORS.primary }]}>
                      Start: {formatDate(startDate)}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.datePickerButton, { borderColor: COLORS.primary }]}
                    onPress={() => setShowEndPicker(true)}
                  >
                    <Text style={[styles.datePickerText, { color: COLORS.primary }]}>
                      End: {formatDate(endDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {(startDate || endDate) && (
                  <TouchableOpacity
                    style={[styles.clearButton, { backgroundColor: COLORS.primary }]}
                    onPress={clearDateFilters}
                  >
                    <Text style={styles.clearButtonText}>Clear Filters</Text>
                  </TouchableOpacity>
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
              </View>
            )}

            {selectedCourseCode && lowAttendanceData && (
              <View style={[styles.statsCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
                <Text style={[styles.cardTitle, { color: COLORS.text }]}>Course Statistics</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: COLORS.text }]}>
                      {lowAttendanceData.total_classes}
                    </Text>
                    <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
                      Total Classes
                    </Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: COLORS.text }]}>
                      {lowAttendanceData.total_students}
                    </Text>
                    <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
                      Total Students
                    </Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: COLORS.error }]}>
                      {lowAttendanceData.students_with_low_attendance.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
                      Low Attendance
                    </Text>
                  </View>
                </View>
                
                {lowAttendanceData.start_date && lowAttendanceData.end_date && (
                  <Text style={[styles.dateRange, { color: COLORS.textSecondary }]}>
                    Period: {new Date(lowAttendanceData.start_date).toLocaleDateString()} - 
                    {new Date(lowAttendanceData.end_date).toLocaleDateString()}
                  </Text>
                )}
              </View>
            )}

            {selectedCourseCode && lowAttendanceData && lowAttendanceData.students_with_low_attendance.length > 0 && (
              <View style={[styles.alertCard, { backgroundColor: '#fff0f0', borderColor: '#ffcccb' }]}>
                <View style={styles.alertHeader}>
                  <Ionicons name="warning-outline" size={24} color={COLORS.error} />
                  <Text style={[styles.alertTitle, { color: COLORS.error }]}>
                    Attention Required
                  </Text>
                </View>
                <Text style={[styles.alertText, { color: COLORS.text }]}>
                  {lowAttendanceData.students_with_low_attendance.length} students have attendance below the required 75% threshold. 
                  Consider sending them a notification or scheduling a meeting.
                </Text>
                
                <TouchableOpacity 
                  style={[styles.notifyAllButton, { backgroundColor: COLORS.primary }]}
                  onPress={() => {/* Notify all functionality would go here */}}
                >
                  <Text style={styles.notifyAllText}>Notify All Students</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedCourseCode && loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={[styles.loadingText, { color: COLORS.textSecondary }]}>
                  Loading attendance data...
                </Text>
              </View>
            )}

            {selectedCourseCode && error && (
              <View style={[styles.errorCard, { backgroundColor: '#fff0f0', borderColor: COLORS.error }]}>
                <Ionicons name="alert-circle-outline" size={24} color={COLORS.error} />
                <Text style={[styles.errorText, { color: COLORS.error }]}>{error}</Text>
              </View>
            )}

            {selectedCourseCode && !loading && !error && lowAttendanceData && 
             lowAttendanceData.students_with_low_attendance.length === 0 && renderEmptyState()}

            {selectedCourseCode && !loading && !error && lowAttendanceData && 
             lowAttendanceData.students_with_low_attendance.length > 0 && (
              <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
                Students with Low Attendance
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !selectedCourseCode ? (
            <View style={styles.selectCoursePrompt}>
              <Ionicons name="school-outline" size={48} color={COLORS.textSecondary} />
              <Text style={[styles.promptText, { color: COLORS.textSecondary }]}>
                Please select a course to view attendance data
              </Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.text}
            colors={[COLORS.text]}
            progressBackgroundColor={COLORS.background}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pageSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  loader: {
    marginVertical: 10,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  datePickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 14,
  },
  clearButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  dateRange: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  alertText: {
    fontSize: 14,
    lineHeight: 20,
  },
  notifyAllButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  notifyAllText: {
    color: 'white',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  studentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  studentRoll: {
    fontSize: 14,
    marginTop: 2,
  },
  attendanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  attendanceText: {
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 13,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginVertical: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  selectCoursePrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  promptText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});