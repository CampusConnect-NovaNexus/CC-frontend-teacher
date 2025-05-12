
import { addStudentToCourse } from "@/service/attendance/addStudentToCourse";
import { getCourseAttendanceStats } from "@/service/attendance/getCourseAttendancePercentage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
const screenWidth = Dimensions.get("window").width;

interface Student {
  attendance_percentage: number;
  attended_classes: number;
  student_name: string;
  roll_no: string;
}

export default function ClassAttendanceScreen() {
  const params = useLocalSearchParams();
  const courseCode = params.id as string;

  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState(new Date());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isTakingAttendance, setIsTakingAttendance] = useState(false);
  
  // Add student modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);

  const attendanceLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const attendanceData = [85, 78, 92, 88];
  const formatDate = (date: Date) => {
    return date.toISOString(); // ISO 8601 format
  };

  useEffect(() => {
    loadStudents();
    
  }, [courseCode]);

  // Filter students based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        student => 
          student.student_name.toLowerCase().includes(query) || 
          student.roll_no.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  // Handle adding a student
  const handleAddStudent = async () => {
    if (!studentName.trim() || !studentRollNo.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter student name and roll number',
      });
      return;
    }

    try {
      setAddingStudent(true);
      
      await addStudentToCourse(courseCode, studentName.trim(), studentRollNo.trim());
      
      // Clear the inputs and close modal
      setStudentName('');
      setStudentRollNo('');
      setShowAddStudentModal(false);
      
      // Reload students list
      await loadStudents();
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Student added to course successfully',
      });
    } catch (error) {
      console.error('Error adding student:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add student to course',
      });
    } finally {
      setAddingStudent(false);
    }
  };

  const loadStudents = async () => {
    try {
      setClassName(courseCode.toUpperCase() || "Unknown Class");
      const data = await getCourseAttendanceStats(courseCode, startDate?.toISOString(), endDate?.toISOString());
      
      if (!data || !data.students || !Array.isArray(data.students)) {
        console.error("Invalid data format received:", data);
        setLoading(false);
        return;
      }
      
      let mappedData: Student[] = data.students.map((item: any) => ({
        student_name: item.student_name || "Unknown",
        roll_no: item.roll_no || "N/A",
        attendance_percentage: item.attendance_percentage || 0,
        attended_classes: item.attended_classes || 0,
      }));
      
      mappedData.sort((a, b) => {
        try {
          const numA = parseInt(a.roll_no.replace(/[^\d]/g, ''), 10);
          const numB = parseInt(b.roll_no.replace(/[^\d]/g, ''), 10);
          return isNaN(numA) || isNaN(numB) ? 0 : numA - numB; // Sort in ascending order
        } catch (error) {
          return 0; // Default case if parsing fails
        }
      });
      
      
      setStudents(mappedData);
      setFilteredStudents(mappedData);
    } catch (error) {
      console.error("Error loading students in id  :", error);
    } finally {
      setLoading(false);
    }
  };

  

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View className="bg-white p-4 rounded-lg mb-3 shadow-sm border border-gray-100" style={{ elevation: 2 }}>
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="font-bold text-lg text-black">{item.student_name}</Text>
          <View className="flex-row items-center mt-1">
            <View className="bg-black px-2 py-1 rounded-md mr-2">
              <Text className="text-white font-medium text-xs">{item.roll_no}</Text>
            </View>
            <Text className="text-gray-600 text-sm">{item.attendance_percentage}% Attendance</Text>
          </View>
        </View>
        <View className="bg-black h-10 w-10 rounded-full items-center justify-center">
          <Text className="text-white font-bold">
            {item.roll_no.slice(6)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4">
          
          {/* Add Student Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showAddStudentModal}
            onRequestClose={() => setShowAddStudentModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add Student to {className}</Text>
                  <TouchableOpacity onPress={() => setShowAddStudentModal(false)}>
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Student Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter student name"
                    placeholderTextColor="#666"
                    value={studentName}
                    onChangeText={setStudentName}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Roll Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter roll number"
                    placeholderTextColor="#666"
                    value={studentRollNo}
                    onChangeText={setStudentRollNo}
                    autoCapitalize="characters"
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleAddStudent}
                  disabled={addingStudent}
                >
                  {addingStudent ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.addButtonText}>Add Student</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="mr-3 bg-black p-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold text-black">{className}</Text>
              <Text className="text-gray-600">
                {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View className="bg-gray-100 rounded-lg mb-5 flex-row items-center px-3 shadow-sm border border-gray-200">
            <Ionicons name="search" size={20} color="#333" />
            <TextInput
              className="flex-1 p-3"
              placeholder="Search by name or roll number"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                className="bg-gray-300 rounded-full p-1"
              >
                <Ionicons name="close" size={16} color="#333" />
              </TouchableOpacity>
            )}
          </View>

          {/* Date Selection */}
          <View className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200">
            <Text className="text-black font-bold text-lg mb-3">Date Range</Text>
            <View className="flex-row justify-between mb-3">
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                className="bg-white border border-gray-300 rounded-lg p-3 w-[48%] flex-row items-center"
                style={{ elevation: 1 }}
              >
                <Ionicons name="calendar-outline" size={18} color="black" className="mr-2" />
                <Text className="text-black ml-2" numberOfLines={1}>
                  {startDate
                    ? formatDate(startDate).slice(0, 10)
                    : "Start Date"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className="bg-white border border-gray-300 rounded-lg p-3 w-[48%] flex-row items-center"
                style={{ elevation: 1 }}
              >
                <Ionicons name="calendar-outline" size={18} color="black" className="mr-2" />
                <Text className="text-black ml-2" numberOfLines={1}>
                  {endDate
                    ? formatDate(endDate).slice(0, 10)
                    : "End Date"}
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              onPress={loadStudents}
              className="bg-black py-3 rounded-lg items-center"
              style={{ elevation: 3 }}
            >
              <Text className="text-white font-bold">Get Attendance</Text>
            </TouchableOpacity>
          </View>
          
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
          {/* Get Attendance button is already in the Date Range section */}
          {/* Students List */}
          <View className="mb-3">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-black">
                Student List
              </Text>
              <View className="bg-gray-100 px-3 py-1 rounded-full">
                <Text className="text-black font-medium">
                  {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
                </Text>
              </View>
            </View>

            {filteredStudents.length === 0 ? (
              <View className="bg-gray-50 p-5 rounded-lg items-center justify-center border border-gray-200">
                <Ionicons name="search" size={40} color="#ccc" />
                <Text className="text-gray-500 mt-2 text-center">
                  {searchQuery ? "No students match your search" : "No students found"}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredStudents}
                renderItem={renderStudentItem}
                keyExtractor={(item) => item.roll_no}
                scrollEnabled={false}
                extraData={filteredStudents}
                ItemSeparatorComponent={() => <View className="h-2" />}
              />
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Floating Action Button to add student */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowAddStudentModal(true)}
      >
        <Ionicons name="person-add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: 'black',
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: 'black',
  },
  addButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
