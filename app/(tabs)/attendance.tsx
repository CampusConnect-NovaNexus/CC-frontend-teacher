import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import SimpleLineChart from '@/components/SimpleLineChart';

const screenWidth = Dimensions.get('window').width;

export default function AttendanceScreen() {
  const [loading, setLoading] = useState(false);
  
  // Mock data for attendance chart
  const attendanceLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const attendanceData = [85, 78, 92, 88];

  // Mock data for classes
  const classes = [
    { id: '1', name: 'Computer Science - CS101', students: 45 },
    { id: '2', name: 'Data Structures - CS201', students: 38 },
    { id: '3', name: 'Database Systems - CS301', students: 42 },
    { id: '4', name: 'Web Development - CS401', students: 35 }
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">Attendance Management</Text>
        
        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap">
            <TouchableOpacity 
              className="bg-blue-500 rounded-lg p-4 mr-4 mb-4 shadow-sm w-[45%] items-center"
              onPress={() => router.push('/attendance/take')}
            >
              <Ionicons name="calendar-outline" size={28} color="#ffffff" />
              <Text className="mt-2 font-medium text-white">Take Attendance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-green-500 rounded-lg p-4 mb-4 shadow-sm w-[45%] items-center"
              onPress={() => router.push('/attendance/reports')}
            >
              <Ionicons name="bar-chart-outline" size={28} color="#ffffff" />
              <Text className="mt-2 font-medium text-white">View Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Attendance Overview Chart */}
        <View className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold mb-3">Monthly Overview</Text>
          <SimpleLineChart
            data={attendanceData}
            labels={attendanceLabels}
            width={screenWidth - 40}
            height={220}
            color="#3498db"
            title="Average Attendance (%)"
          />
        </View>
        
        {/* Classes */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Your Classes</Text>
          {classes.map(classItem => (
            <TouchableOpacity 
              key={classItem.id}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm"
              onPress={() => router.push({
                pathname: "/attendance/class/[id]",
                params: { id: classItem.id }
              })}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="font-semibold text-lg">{classItem.name}</Text>
                  <Text className="text-gray-600">{classItem.students} students</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#95a5a6" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Low Attendance Alert */}
        <View className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
          <View className="flex-row items-center mb-2">
            <Ionicons name="warning-outline" size={24} color="#e74c3c" />
            <Text className="text-lg font-semibold ml-2 text-red-600">Low Attendance Alert</Text>
          </View>
          <Text className="text-gray-700 mb-3">5 students have attendance below 75%</Text>
          <TouchableOpacity 
            className="bg-red-500 py-2 px-4 rounded-lg self-start"
            onPress={() => router.push('/attendance/low')}
          >
            <Text className="text-white font-medium">View Students</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}