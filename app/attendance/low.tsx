import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  className: string;
  attendancePercentage: number;
}

export default function LowAttendanceScreen() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  
  useEffect(() => {
    loadLowAttendanceStudents();
  }, []);
  
  const loadLowAttendanceStudents = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'John Doe',
          rollNumber: 'CS101',
          className: 'Computer Science - CS101',
          attendancePercentage: 65
        },
        {
          id: '2',
          name: 'Jane Smith',
          rollNumber: 'CS102',
          className: 'Computer Science - CS101',
          attendancePercentage: 70
        },
        {
          id: '3',
          name: 'Michael Johnson',
          rollNumber: 'CS201',
          className: 'Data Structures - CS201',
          attendancePercentage: 68
        },
        {
          id: '4',
          name: 'Emily Williams',
          rollNumber: 'CS301',
          className: 'Database Systems - CS301',
          attendancePercentage: 72
        },
        {
          id: '5',
          name: 'David Brown',
          rollNumber: 'CS401',
          className: 'Web Development - CS401',
          attendancePercentage: 69
        }
      ];
      
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error loading low attendance students:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderStudentItem = ({ item }: { item: Student }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="font-semibold text-lg">{item.name}</Text>
          <Text className="text-gray-600">{item.rollNumber}</Text>
          <Text className="text-gray-600 mt-1">{item.className}</Text>
        </View>
        <View className="bg-red-100 px-3 py-1 rounded-full">
          <Text className="text-red-800 font-medium">{item.attendancePercentage}%</Text>
        </View>
      </View>
      
      <View className="flex-row mt-4">
        <TouchableOpacity 
          className="bg-blue-500 rounded-lg px-3 py-1 mr-2 flex-row items-center"
          onPress={() => {/* Send notification functionality would go here */}}
        >
          <Ionicons name="mail-outline" size={16} color="#ffffff" />
          <Text className="text-white ml-1">Notify</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-green-500 rounded-lg px-3 py-1 flex-row items-center"
          onPress={() => {/* View details functionality would go here */}}
        >
          <Ionicons name="eye-outline" size={16} color="#ffffff" />
          <Text className="text-white ml-1">View Details</Text>
        </TouchableOpacity>
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
    <View className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold">Low Attendance</Text>
            <Text className="text-gray-600">{students.length} students below 75%</Text>
          </View>
        </View>
        
        <View className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle-outline" size={24} color="#e74c3c" />
            <Text className="text-lg font-semibold ml-2 text-red-600">Attention Required</Text>
          </View>
          <Text className="text-gray-700">
            These students have attendance below the required 75% threshold. Consider sending them a notification or scheduling a meeting.
          </Text>
        </View>
        
        <TouchableOpacity 
          className="mb-6 bg-blue-500 py-2 rounded-lg items-center"
          onPress={() => {/* Notify all functionality would go here */}}
        >
          <Text className="text-white font-medium">Notify All Students</Text>
        </TouchableOpacity>
        
        <FlatList
          data={students}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}