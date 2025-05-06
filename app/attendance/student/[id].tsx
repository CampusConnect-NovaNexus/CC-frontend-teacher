import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import SimpleLineChart from '@/components/SimpleLineChart';

const screenWidth = Dimensions.get('window').width;

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone?: string;
  department: string;
  year: number;
  attendancePercentage: number;
  attendanceHistory: {
    date: string;
    status: 'present' | 'absent' | 'late';
    class: string;
  }[];
}

interface AttendanceByMonth {
  month: string;
  percentage: number;
}

export default function StudentDetailScreen() {
  const params = useLocalSearchParams();
  const studentId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState<AttendanceByMonth[]>([]);
  
  useEffect(() => {
    loadStudentDetails();
  }, [studentId]);
  
  const loadStudentDetails = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock attendance history
      const today = new Date();
      const attendanceHistory = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        // Randomly assign status with 80% chance of present
        const rand = Math.random();
        let status: 'present' | 'absent' | 'late';
        if (rand < 0.8) {
          status = 'present';
        } else if (rand < 0.9) {
          status = 'late';
        } else {
          status = 'absent';
        }
        
        return {
          date: date.toISOString(),
          status,
          class: ['Computer Science', 'Data Structures', 'Database Systems', 'Web Development'][Math.floor(Math.random() * 4)]
        };
      });
      
      // Mock student data
      const mockStudent: Student = {
        id: studentId,
        name: `Student ${parseInt(studentId.split('-')[1])}`,
        rollNumber: `CS${Math.floor(Math.random() * 4) + 1}${Math.floor(Math.random() * 100)}`,
        email: `student${parseInt(studentId.split('-')[1])}@example.com`,
        phone: Math.random() > 0.3 ? `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
        department: 'Computer Science',
        year: Math.floor(Math.random() * 4) + 1,
        attendancePercentage: Math.floor(Math.random() * 30) + 70, // 70-99%
        attendanceHistory
      };
      
      setStudent(mockStudent);
      
      // Generate monthly attendance data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const mockMonthlyData = months.map(month => ({
        month,
        percentage: Math.floor(Math.random() * 30) + 70 // 70-99%
      }));
      
      setMonthlyAttendance(mockMonthlyData);
    } catch (error) {
      console.error('Error loading student details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };
  
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }
  
  if (!student) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Text className="text-lg text-gray-600">Student not found</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
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
            <Text className="text-2xl font-bold">Student Details</Text>
          </View>
          
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-xl font-bold mb-2">{student.name}</Text>
            <Text className="text-gray-600 mb-1">Roll Number: {student.rollNumber}</Text>
            <Text className="text-gray-600 mb-1">Email: {student.email}</Text>
            {student.phone && <Text className="text-gray-600 mb-1">Phone: {student.phone}</Text>}
            <Text className="text-gray-600 mb-1">Department: {student.department}</Text>
            <Text className="text-gray-600 mb-1">Year: {student.year}</Text>
            
            <View className="mt-3 flex-row items-center">
              <Text className="text-gray-700 font-semibold mr-2">Attendance:</Text>
              <View className={`px-3 py-1 rounded-full ${student.attendancePercentage < 75 ? 'bg-red-100' : 'bg-green-100'}`}>
                <Text className={`text-sm font-medium ${student.attendancePercentage < 75 ? 'text-red-800' : 'text-green-800'}`}>
                  {student.attendancePercentage}%
                </Text>
              </View>
            </View>
          </View>
          
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-semibold mb-3">Attendance Trend</Text>
            <SimpleLineChart
              data={monthlyAttendance.map(item => item.percentage)}
              labels={monthlyAttendance.map(item => item.month)}
              width={screenWidth - 40}
              height={220}
              color="#3498db"
              title="Monthly Attendance (%)"
              backgroundColor="#ffffff"
            />
          </View>
          
          <Text className="text-lg font-semibold mb-3">Attendance History</Text>
          
          {student.attendanceHistory.map((record, index) => (
            <View key={index} className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="font-semibold">{formatDate(record.date)}</Text>
                  <Text className="text-gray-600 text-sm">{record.class}</Text>
                </View>
                
                <View className={`px-3 py-1 rounded-full ${getStatusColor(record.status)}`}>
                  <Text className={`text-sm font-medium capitalize ${getStatusColor(record.status).split(' ')[1]}`}>
                    {record.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}