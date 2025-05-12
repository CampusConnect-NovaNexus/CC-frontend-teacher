import { useAuth } from '@/context/AuthContext';
import { addTAtoCourse } from '@/service/attendance/addTAtoCourse';
import { getCourses } from '@/service/attendance/getCourses';
import { removeTAfromCourse } from '@/service/attendance/removeTAfromCourse';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';

interface CourseType {
  course_code: string;
  Teacher: string[];
  TA: string[];
  total_classes: number;
}

const COLORS = {
  primary: '#000000',
  background: '#ffffff',
  card: '#ffffff',
  text: '#000000',
  textSecondary: '#555555',
  border: '#dddddd',
  error: '#ff3b30',
  success: '#34c759',
  divider: '#eeeeee',
};

export default function ManageTAScreen() {
  const { user } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('');
  const [taEmail, setTaEmail] = useState<string>('');
  const [addingTA, setAddingTA] = useState(false);
  const [removingTA, setRemovingTA] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const COURSES_STORAGE_KEY = '@teacher_courses_with_ta';

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

 
  const cacheCourses = async (coursesData: CourseType[]) => {
    try {
      await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(coursesData));
    } catch (error) {
      console.error('Error caching courses:', error);
    }
  };

 
  const fetchCourses = async (showLoading = true) => {
    const teacherEmail = email || user?.email;
    if (!teacherEmail) return;
    
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const coursesData = await getCourses(teacherEmail);
      setCourses(coursesData);
      cacheCourses(coursesData);
      
      if (coursesData.length > 0 && !selectedCourseCode) {
        setSelectedCourseCode(coursesData[0].course_code);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses(false);
    setRefreshing(false);
  }, [user]);

  const handleAddTA = async () => {
    if (!selectedCourseCode || !taEmail || !taEmail.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a course and enter a valid email',
      });
      return;
    }

    try {
      setAddingTA(true);
      setError(null);
      
      await addTAtoCourse(selectedCourseCode, taEmail.trim());
      
      await fetchCourses(false);
      
      setTaEmail('');
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Teaching Assistant added successfully',
      });
    } catch (error) {
      console.error('Error adding TA:', error);
      setError('Failed to add Teaching Assistant');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add Teaching Assistant',
      });
    } finally {
      setAddingTA(false);
    }
  };

  
  const handleRemoveTA = async (courseCode: string, taEmail: string) => {
    Alert.alert(
      'Remove Teaching Assistant',
      `Are you sure you want to remove ${taEmail} from ${courseCode}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setRemovingTA(taEmail);
              setError(null);
              
              await removeTAfromCourse(courseCode, taEmail);
              
              await fetchCourses(false);
              
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Teaching Assistant removed successfully',
              });
            } catch (error) {
              console.error('Error removing TA:', error);
              setError('Failed to remove Teaching Assistant');
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to remove Teaching Assistant',
              });
            } finally {
              setRemovingTA(null);
            }
          },
        },
      ]
    );
  };

 
  useEffect(() => {
    const initializeData = async () => {
      const hasCachedCourses = await loadCachedCourses();
      
      if (!hasCachedCourses) {
        setLoading(true);
      }
      
      const teacherEmail = email || user?.email;
      if (teacherEmail) {
        fetchCourses(!hasCachedCourses);
      }
    };
    
    initializeData();
  }, [user, email]);

  
  const renderTAItem = ({ item, courseCode }: { item: string, courseCode: string }) => (
    <View style={[styles.taItem, { borderColor: COLORS.border }]}>
      <Text style={[styles.taEmail, { color: COLORS.text }]}>{item}</Text>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveTA(courseCode, item)}
        disabled={removingTA === item}
      >
        {removingTA === item ? (
          <ActivityIndicator size="small" color={COLORS.error} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        )}
      </TouchableOpacity>
    </View>
  );

  
  const renderCourseCard = ({ item }: { item: CourseType }) => (
    <View style={[styles.courseCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
      <View style={styles.courseHeader}>
        <Text style={[styles.courseCode, { color: COLORS.text }]}>{item.course_code}</Text>
        <Text style={[styles.courseInfo, { color: COLORS.textSecondary }]}>
          {item.total_classes} total classes
        </Text>
      </View>
      
      <View style={styles.taSection}>
        <Text style={[styles.taSectionTitle, { color: COLORS.text }]}>
          Teaching Assistants ({item.TA.length})
        </Text>
        
        {item.TA.length === 0 ? (
          <Text style={[styles.noTAText, { color: COLORS.textSecondary }]}>
            No teaching assistants assigned to this course
          </Text>
        ) : (
          <View style={styles.taList}>
            {item.TA.map((ta) => (
              <View key={ta} style={{ width: '100%' }}>
                {renderTAItem({ item: ta, courseCode: item.course_code })}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <FlatList
        data={courses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.course_code}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <View>
                <Text style={[styles.pageTitle, { color: COLORS.text }]}>Manage Teaching Asst.</Text>
                
              </View>
            </View>

            <View style={[styles.addTACard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
              <Text style={[styles.cardTitle, { color: COLORS.text }]}>Add Teaching Assistant</Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: COLORS.textSecondary }]}>Select Course</Text>
                <View style={[styles.pickerContainer, { borderColor: COLORS.border }]}>
                  <Picker
                    selectedValue={selectedCourseCode}
                    onValueChange={(value) => setSelectedCourseCode(value)}
                    style={styles.picker}
                  >
                    {courses.map((course) => (
                      <Picker.Item 
                        key={course.course_code} 
                        label={course.course_code} 
                        value={course.course_code} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: COLORS.textSecondary }]}>TA Email Address</Text>
                <TextInput
                  style={[styles.input, { borderColor: COLORS.border, color: COLORS.text }]}
                  placeholder="Enter email address"
                  placeholderTextColor={COLORS.textSecondary}
                  value={taEmail}
                  onChangeText={setTaEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: COLORS.primary }]}
                onPress={handleAddTA}
                disabled={addingTA || !selectedCourseCode || !taEmail.trim()}
              >
                {addingTA ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.addButtonText}>Add Teaching Assistant</Text>
                )}
              </TouchableOpacity>
            </View>

            {error && (
              <View style={[styles.errorCard, { backgroundColor: '#fff0f0', borderColor: COLORS.error }]}>
                <Ionicons name="alert-circle-outline" size={24} color={COLORS.error} />
                <Text style={[styles.errorText, { color: COLORS.error }]}>{error}</Text>
              </View>
            )}

            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Your Courses</Text>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={[styles.loadingText, { color: COLORS.textSecondary }]}>
                Loading courses...
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="school-outline" size={48} color={COLORS.textSecondary} />
              <Text style={[styles.emptyStateText, { color: COLORS.textSecondary }]}>
                No courses found
              </Text>
            </View>
          )
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
  addTACard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 60,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  addButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
  },
  courseCard: {
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
  courseHeader: {
    marginBottom: 12,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: '600',
  },
  courseInfo: {
    fontSize: 14,
    marginTop: 2,
  },
  taSection: {
    marginTop: 8,
  },
  taSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  taList: {
    width: '100%',
  },
  taItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  taEmail: {
    fontSize: 14,
  },
  removeButton: {
    padding: 6,
  },
  noTAText: {
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  errorCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
  },
});