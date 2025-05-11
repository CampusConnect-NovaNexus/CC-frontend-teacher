import SimpleLineChart from '@/components/SimpleLineChart';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';



const screenWidth = Dimensions.get('window').width;

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  attendancePercentage: number;
  present: boolean;
}

export default function ClassAttendanceScreen() {
  const params = useLocalSearchParams();
  const classId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(new Date());
  const [isTakingAttendance, setIsTakingAttendance] = useState(false);
  
  // Mock data for attendance chart
  const attendanceLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const attendanceData = [85, 78, 92, 88];
  
  useEffect(() => {
    // In a real app, fetch class details and students based on classId
    loadClassData();
  }, [classId]);
  
  const loadClassData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const classNames = {
        '1': 'Computer Science - CS101',
        '2': 'Data Structures - CS201',
        '3': 'Database Systems - CS301',
        '4': 'Web Development - CS401'
      };
      
      setClassName(classNames[classId as keyof typeof classNames] || 'Unknown Class');
      
      // Generate mock students
      const mockStudents: Student[] = Array.from({ length: 15 }, (_, i) => ({
        id: `student-${i + 1}`,
        name: `Student ${i + 1}`,
        rollNumber: `CS${classId}${i + 1 < 10 ? '0' : ''}${i + 1}`,
        attendancePercentage: Math.floor(Math.random() * 30) + 70, // 70-99%
        present: true
      }));
      
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error loading class data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleStudentPresence = (studentId: string) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, present: !student.present } 
        : student
    ));
  };
  
  const saveAttendance = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send the attendance data to your backend
      setIsTakingAttendance(false);
      
      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Attendance saved successfully!'
      });
    } catch (error) {
      console.error('Error saving attendance:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save attendance. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderStudentItem = ({ item }: { item: Student }) => (
    <View className="flex-row justify-between items-center bg-white p-4 rounded-lg mb-3 shadow-sm">
      <View className="flex-1">
        <Text className="font-semibold text-lg">{item.name}</Text>
        <Text className="text-gray-600">{item.rollNumber}</Text>
      </View>
      
      {isTakingAttendance ? (
        <Switch
          value={item.present}
          onValueChange={() => toggleStudentPresence(item.id)}
          trackColor={{ false: '#f5f5f5', true: '#bde0fe' }}
          thumbColor={item.present ? '#3498db' : '#f4f3f4'}
        />
      ) : (
        <View className={`px-3 py-1 rounded-full ${item.attendancePercentage < 75 ? 'bg-red-100' : 'bg-green-100'}`}>
          <Text className={`text-sm font-medium ${item.attendancePercentage < 75 ? 'text-red-800' : 'text-green-800'}`}>
            {item.attendancePercentage}%
          </Text>
        </View>
      )}
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
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold">{className}</Text>
              <Text className="text-gray-600">{students.length} students</Text>
            </View>
          </View>
          
          {!isTakingAttendance && (
            <View className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <Text className="text-lg font-semibold mb-3">Attendance Overview</Text>
              <SimpleLineChart
                data={attendanceData}
                labels={attendanceLabels}
                width={screenWidth - 40}
                height={220}
                color="#3498db"
                title="Class Attendance (%)"
                backgroundColor="#ffffff"
              />
            </View>
          )}
          
          <View className="mb-6 flex-row justify-between items-center">
            <Text className="text-lg font-semibold">
              {isTakingAttendance ? 'Mark Attendance' : 'Students'}
            </Text>
            
            {isTakingAttendance ? (
              <View className="flex-row">
                <TouchableOpacity 
                  className="bg-gray-500 rounded-lg px-4 py-2 mr-2 flex-row items-center"
                  onPress={() => setIsTakingAttendance(false)}
                >
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="bg-green-500 rounded-lg px-4 py-2 flex-row items-center"
                  onPress={saveAttendance}
                >
                  <Text className="text-white">Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                className="bg-blue-500 rounded-lg px-4 py-2 flex-row items-center"
                onPress={() => setIsTakingAttendance(true)}
              >
                <Ionicons name="create-outline" size={18} color="#ffffff" className="mr-1" />
                <Text className="text-white ml-1">Take Attendance</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {isTakingAttendance && (
            <View className="mb-4 bg-blue-50 p-4 rounded-lg">
              <Text className="text-blue-800 font-medium">
                {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
              <Text className="text-blue-600 mt-1">
                Mark students as present or absent
              </Text>
            </View>
          )}
          
          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}