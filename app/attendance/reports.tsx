import SimpleBarChart from '@/components/SimpleBarChart';
import SimpleLineChart from '@/components/SimpleLineChart';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

type PeriodType = 'weekly' | 'monthly' | 'semester';

export default function AttendanceReportsScreen() {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('monthly');
  
  // Mock data for attendance chart
  const monthlyLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const monthlyData = [85, 78, 92, 88];
  
  const semesterLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const semesterData = [82, 85, 80, 88, 91];
  
  const classComparisonLabels = ['CS101', 'CS201', 'CS301', 'CS401'];
  const classComparisonData = [85, 78, 92, 88];

  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        className="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center mt-12 mb-6">
          <TouchableOpacity 
            className="mr-3 p-1"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">
            Attendance Reports
          </Text>
        </View>
        
        {/* Period Selection */}
        <View className="bg-white rounded-xl shadow-sm mb-5 p-4 border border-gray-100">
          <Text className="text-lg font-bold text-gray-800 mb-2">Time Period</Text>
          <View className="flex-row px-2">
            <TouchableOpacity 
              className={`px-4 py-1 rounded-full mr-2 border ${selectedPeriod === 'weekly' ? 'bg-black border-black' : 'bg-gray-100 border-gray-200'}`}
              onPress={() => setSelectedPeriod('weekly')}
            >
              <Text className={`text-sm font-medium ${selectedPeriod === 'weekly' ? 'text-white' : 'text-gray-800'}`}>
                Weekly
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`px-4 py-1 rounded-full mr-2 border ${selectedPeriod === 'monthly' ? 'bg-black border-black' : 'bg-gray-100 border-gray-200'}`}
              onPress={() => setSelectedPeriod('monthly')}
            >
              <Text className={`text-sm font-medium ${selectedPeriod === 'monthly' ? 'text-white' : 'text-gray-800'}`}>
                Monthly
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`px-4 py-1 rounded-full mr-2 border ${selectedPeriod === 'semester' ? 'bg-black border-black' : 'bg-gray-100 border-gray-200'}`}
              onPress={() => setSelectedPeriod('semester')}
            >
              <Text className={`text-sm font-medium ${selectedPeriod === 'semester' ? 'text-white' : 'text-gray-800'}`}>
                Semester
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Attendance Trend Chart */}
        <View className="bg-white rounded-xl shadow-sm mb-5 p-4 border border-gray-100">
          <Text className="text-lg font-bold text-gray-800 mb-2">Attendance Trend</Text>
          <SimpleLineChart
            data={selectedPeriod === 'semester' ? semesterData : monthlyData}
            labels={selectedPeriod === 'semester' ? semesterLabels : monthlyLabels}
            width={screenWidth - 40}
            height={220}
            color="#000000"
            title="Average Attendance (%)"
          />
        </View>
        
        {/* Class Comparison Chart */}
        <View className="bg-white rounded-xl shadow-sm mb-5 p-4 border border-gray-100">
          <Text className="text-lg font-bold text-gray-800 mb-2">Class Comparison</Text>
          <SimpleBarChart
            data={classComparisonData}
            labels={classComparisonLabels}
            width={screenWidth - 40}
            height={220}
            color="#000000"
            title="Class Attendance (%)"
          />
        </View>
        
        {/* Statistics Summary */}
        <View className="bg-white rounded-xl shadow-sm mb-5 p-4 border border-gray-100">
          <Text className="text-lg font-bold text-gray-800 mb-2">Summary Statistics</Text>
          <View className="flex-row justify-between mb-4">
            <View className="bg-blue-50 p-4 rounded-lg w-[48%] border border-blue-100">
              <Text className="text-sm font-medium text-blue-800">
                Highest Attendance
              </Text>
              <Text className="text-2xl font-bold text-blue-800">
                92%
              </Text>
              <Text className="text-xs text-blue-800">
                CS301 - Database Systems
              </Text>
            </View>
            
            <View className="bg-red-50 p-4 rounded-lg w-[48%] border border-red-100">
              <Text className="text-sm font-medium text-red-800">
                Lowest Attendance
              </Text>
              <Text className="text-2xl font-bold text-red-800">
                78%
              </Text>
              <Text className="text-xs text-red-800">
                CS201 - Data Structures
              </Text>
            </View>
          </View>
          
          <View className="bg-green-50 p-4 rounded-lg w-full border border-green-100">
            <Text className="text-sm font-medium text-green-800">
              Overall Average
            </Text>
            <Text className="text-2xl font-bold text-green-800">
              85.75%
            </Text>
            <Text className="text-xs text-green-800">
              Across all classes
            </Text>
          </View>
        </View>
        
        {/* Export Options */}
        <View className="bg-white rounded-xl shadow-sm mb-5 p-4 border border-gray-100">
          <Text className="text-lg font-bold text-gray-800 mb-2">Export Report</Text>
          <View className="flex-row justify-between px-2">
            <TouchableOpacity
              style={{ elevation: 2 }}
              className="bg-black px-3 py-2 rounded-lg w-[30%] items-center flex-row justify-center"
              onPress={() => {/* Export functionality would go here */}}
            >
              <Ionicons name="document-text-outline" size={16} color="white" className="mr-1" />
              <Text className="text-white text-sm font-medium ml-1">PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{ elevation: 2 }}
              className="bg-gray-800 px-3 py-2 rounded-lg w-[30%] items-center flex-row justify-center"
              onPress={() => {/* Export functionality would go here */}}
            >
              <Ionicons name="grid-outline" size={16} color="white" className="mr-1" />
              <Text className="text-white text-sm font-medium ml-1">Excel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{ elevation: 2 }}
              className="bg-white px-3 py-2 rounded-lg w-[30%] items-center flex-row justify-center border border-gray-300"
              onPress={() => {/* Export functionality would go here */}}
            >
              <Ionicons name="share-outline" size={16} color="black" className="mr-1" />
              <Text className="text-black text-sm font-medium ml-1">Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}