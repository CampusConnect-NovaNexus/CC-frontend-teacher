import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { spacing, layout, borderRadius } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  present: boolean;
}

interface Class {
  id: string;
  name: string;
}

export default function TakeAttendanceScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState(new Date());
  
  // Get theme colors
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');
  const infoColor = useThemeColor({}, 'info');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const backgroundSecondaryColor = useThemeColor({}, 'backgroundSecondary');

  // Mock data for classes and students
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClasses([
        { id: '1', name: 'Computer Science - CS101' },
        { id: '2', name: 'Data Structures - CS201' },
        { id: '3', name: 'Database Systems - CS301' },
        { id: '4', name: 'Web Development - CS401' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      // Simulate API call to get students for the selected class
      setTimeout(() => {
        const mockStudents = Array.from({ length: 30 }, (_, i) => ({
          id: `student-${i + 1}`,
          name: `Student ${i + 1}`,
          rollNumber: `CS${2023}${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
          present: true,
        }));
        setStudents(mockStudents);
        setLoading(false);
      }, 1000);
    }
  }, [selectedClass]);

  const toggleAttendance = (studentId: string) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, present: !student.present } 
        : student
    ));
  };

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, present: true })));
  };

  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, present: false })));
  };

  const saveAttendance = () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class first');
      return;
    }

    if (students.length === 0) {
      Alert.alert('Error', 'No students found for this class');
      return;
    }

    setSaving(true);
    
    // Simulate API call to save attendance
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        'Success',
        'Attendance saved successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = students.filter(student => student.present).length;
  const absentCount = students.length - presentCount;

  const renderStudentItem = ({ item }: { item: Student }) => {
    const statusBgColor = item.present ? `${successColor}20` : `${errorColor}20`;
    const statusTextColor = item.present ? successColor : errorColor;
    const statusIconBgColor = item.present ? successColor : errorColor;
    
    return (
      <TouchableOpacity 
        style={styles.studentItem}
        onPress={() => toggleAttendance(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.studentInfo}>
          <View style={[
            styles.studentAvatar, 
            { backgroundColor: statusBgColor }
          ]}>
            <ThemedText 
              variant="labelLarge" 
              style={{ color: statusTextColor, fontWeight: 'bold' }}
            >
              {item.name.charAt(0)}
            </ThemedText>
          </View>
          <View style={styles.studentDetails}>
            <ThemedText variant="bodyMedium" style={styles.studentName}>
              {item.name}
            </ThemedText>
            <ThemedText 
              variant="bodySmall" 
              style={{ color: textSecondaryColor }}
            >
              {item.rollNumber}
            </ThemedText>
          </View>
        </View>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: statusIconBgColor }
        ]}>
          <Ionicons 
            name={item.present ? 'checkmark' : 'close'} 
            size={18} 
            color="#ffffff" 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView 
        surface="card" 
        elevation="sm"
        style={styles.header}
      >
        <ThemedText variant="headingMedium" style={styles.title}>
          Take Attendance
        </ThemedText>
        
        <View style={styles.classPickerContainer}>
          <ThemedText variant="bodyMedium" style={styles.pickerLabel}>
            Select Class
          </ThemedText>
          <View style={[
            styles.pickerWrapper, 
            { borderColor }
          ]}>
            <Picker
              selectedValue={selectedClass}
              onValueChange={(itemValue) => setSelectedClass(itemValue)}
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item label="Select a class..." value="" />
              {classes.map(classItem => (
                <Picker.Item 
                  key={classItem.id} 
                  label={classItem.name} 
                  value={classItem.id} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        {selectedClass && students.length > 0 && (
          <>
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon="search"
              rightIcon={searchQuery ? "close-circle" : undefined}
              onRightIconPress={searchQuery ? () => setSearchQuery('') : undefined}
              containerStyle={styles.searchInput}
            />
            
            <View style={styles.actionButtonsContainer}>
              <Button
                variant="success"
                size="sm"
                leftIcon="checkmark-circle"
                onPress={markAllPresent}
                style={styles.actionButton}
              >
                Mark All Present
              </Button>
              
              <Button
                variant="danger"
                size="sm"
                leftIcon="close-circle"
                onPress={markAllAbsent}
                style={styles.actionButton}
              >
                Mark All Absent
              </Button>
            </View>
            
            <Card style={styles.statsCard}>
              <CardContent style={styles.statsContent}>
                <View style={styles.statItem}>
                  <ThemedText 
                    variant="bodySmall" 
                    style={{ color: textSecondaryColor }}
                  >
                    Total
                  </ThemedText>
                  <ThemedText variant="headingSmall">
                    {students.length}
                  </ThemedText>
                </View>
                
                <View style={styles.statItem}>
                  <ThemedText 
                    variant="bodySmall" 
                    style={{ color: successColor }}
                  >
                    Present
                  </ThemedText>
                  <ThemedText 
                    variant="headingSmall" 
                    style={{ color: successColor }}
                  >
                    {presentCount}
                  </ThemedText>
                </View>
                
                <View style={styles.statItem}>
                  <ThemedText 
                    variant="bodySmall" 
                    style={{ color: errorColor }}
                  >
                    Absent
                  </ThemedText>
                  <ThemedText 
                    variant="headingSmall" 
                    style={{ color: errorColor }}
                  >
                    {absentCount}
                  </ThemedText>
                </View>
                
                <View style={styles.statItem}>
                  <ThemedText 
                    variant="bodySmall" 
                    style={{ color: infoColor }}
                  >
                    Percentage
                  </ThemedText>
                  <ThemedText 
                    variant="headingSmall" 
                    style={{ color: infoColor }}
                  >
                    {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%
                  </ThemedText>
                </View>
              </CardContent>
            </Card>
          </>
        )}
      </ThemedView>

      {loading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : !selectedClass ? (
        <View style={styles.centeredContainer}>
          <Ionicons 
            name="calendar-outline" 
            size={60} 
            color={textSecondaryColor} 
          />
          <ThemedText 
            variant="bodyLarge" 
            style={[styles.emptyStateText, { color: textSecondaryColor }]}
          >
            Please select a class to take attendance
          </ThemedText>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredStudents}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.centeredContainer}>
                <Ionicons 
                  name="people-outline" 
                  size={60} 
                  color={textSecondaryColor} 
                />
                <ThemedText 
                  variant="bodyLarge" 
                  style={[styles.emptyStateText, { color: textSecondaryColor }]}
                >
                  No students found
                </ThemedText>
              </View>
            }
          />
          
          <ThemedView 
            surface="card" 
            elevation="sm"
            style={styles.footer}
          >
            <Button
              variant="primary"
              size="lg"
              onPress={saveAttendance}
              loading={saving}
              fullWidth
            >
              Save Attendance
            </Button>
          </ThemedView>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    marginBottom: spacing.md,
  },
  classPickerContainer: {
    marginBottom: spacing.md,
  },
  pickerLabel: {
    marginBottom: spacing.xs,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  actionButton: {
    width: '48%',
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyStateText: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  listContent: {
    padding: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: 'white',
    borderRadius: borderRadius.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentDetails: {
    marginLeft: spacing.sm,
  },
  studentName: {
    fontWeight: '500',
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
});