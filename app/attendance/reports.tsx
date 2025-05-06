import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import SimpleLineChart from '@/components/SimpleLineChart';
import SimpleBarChart from '@/components/SimpleBarChart';

const screenWidth = Dimensions.get('window').width;

export default function AttendanceReportsScreen() {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'semester'>('monthly');
  
  // Mock data for attendance chart
  const monthlyLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const monthlyData = [85, 78, 92, 88];
  
  const semesterLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const semesterData = [82, 85, 80, 88, 91];
  
  const classComparisonLabels = ['CS101', 'CS201', 'CS301', 'CS401'];
  const classComparisonData = [85, 78, 92, 88];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">Attendance Reports</Text>
        </View>
        
        {/* Period Selection */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Time Period</Text>
          <View className="flex-row">
            <TouchableOpacity 
              className={`mr-2 px-4 py-2 rounded-full ${selectedPeriod === 'weekly' ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => setSelectedPeriod('weekly')}
            >
              <Text className={selectedPeriod === 'weekly' ? 'text-white' : 'text-gray-700'}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`mr-2 px-4 py-2 rounded-full ${selectedPeriod === 'monthly' ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => setSelectedPeriod('monthly')}
            >
              <Text className={selectedPeriod === 'monthly' ? 'text-white' : 'text-gray-700'}>Monthly</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`px-4 py-2 rounded-full ${selectedPeriod === 'semester' ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => setSelectedPeriod('semester')}
            >
              <Text className={selectedPeriod === 'semester' ? 'text-white' : 'text-gray-700'}>Semester</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Attendance Trend Chart */}
        <View className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold mb-3">Attendance Trend</Text>
          <SimpleLineChart
            data={selectedPeriod === 'semester' ? semesterData : monthlyData}
            labels={selectedPeriod === 'semester' ? semesterLabels : monthlyLabels}
            width={screenWidth - 40}
            height={220}
            color="#3498db"
            title="Average Attendance (%)"
          />
        </View>
        
        {/* Class Comparison Chart */}
        <View className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold mb-3">Class Comparison</Text>
          <SimpleBarChart
            data={classComparisonData}
            labels={classComparisonLabels}
            width={screenWidth - 40}
            height={220}
            color="#3498db"
            title="Class Attendance (%)"
          />
        </View>
        
        {/* Statistics Summary */}
        <View className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold mb-3">Summary Statistics</Text>
          
          <View className="flex-row justify-between mb-3">
            <View className="bg-blue-50 p-3 rounded-lg w-[48%]">
              <Text className="text-blue-800 font-medium">Highest Attendance</Text>
              <Text className="text-2xl font-bold text-blue-600">92%</Text>
              <Text className="text-blue-800">CS301 - Database Systems</Text>
            </View>
            
            <View className="bg-red-50 p-3 rounded-lg w-[48%]">
              <Text className="text-red-800 font-medium">Lowest Attendance</Text>
              <Text className="text-2xl font-bold text-red-600">78%</Text>
              <Text className="text-red-800">CS201 - Data Structures</Text>
            </View>
          </View>
          
          <View className="bg-green-50 p-3 rounded-lg">
            <Text className="text-green-800 font-medium">Overall Average</Text>
            <Text className="text-2xl font-bold text-green-600">85.75%</Text>
            <Text className="text-green-800">Across all classes</Text>
          </View>
        </View>
        
        {/* Export Options */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Export Report</Text>
          <View className="flex-row">
            <TouchableOpacity 
              className="bg-blue-500 rounded-lg p-3 mr-3 flex-row items-center"
              onPress={() => {/* Export functionality would go here */}}
            >
              <Ionicons name="document-text-outline" size={20} color="#ffffff" />
              <Text className="text-white ml-2">PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-green-500 rounded-lg p-3 mr-3 flex-row items-center"
              onPress={() => {/* Export functionality would go here */}}
            >
              <Ionicons name="grid-outline" size={20} color="#ffffff" />
              <Text className="text-white ml-2">Excel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-gray-500 rounded-lg p-3 flex-row items-center"
              onPress={() => {/* Export functionality would go here */}}
            >
              <Ionicons name="share-outline" size={20} color="#ffffff" />
              <Text className="text-white ml-2">Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}