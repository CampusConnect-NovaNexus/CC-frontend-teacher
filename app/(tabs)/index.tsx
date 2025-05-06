import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DashboardCard from '@/components/DashboardCard';
import { fetchGrievanceStats } from '@/service/grievance/getStats';
import { fetchAttendanceStats } from '@/service/attendance/getStats';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingGrievances: 0,
    resolvedGrievances: 0,
    totalGrievances: 0,
    averageAttendance: 0,
    lowAttendanceStudents: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        // In a real app, these would be actual API calls
        // For now, we'll simulate with mock data
        const grievanceStats = await fetchGrievanceStats();
        const attendanceStats = await fetchAttendanceStats();
        
        setStats({
          pendingGrievances: grievanceStats.pending || 0,
          resolvedGrievances: grievanceStats.resolved || 0,
          totalGrievances: grievanceStats.total || 0,
          averageAttendance: attendanceStats.averagePercentage || 0,
          lowAttendanceStudents: attendanceStats.lowAttendanceCount || 0,
          totalStudents: attendanceStats.totalStudents || 0,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">Teacher Dashboard</Text>
        
        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap">
            <TouchableOpacity 
              className="bg-white rounded-lg p-4 mr-4 mb-4 shadow-sm w-[45%] items-center"
              onPress={() => router.push('/attendance/take')}
            >
              <Ionicons name="calendar-outline" size={28} color="#3498db" />
              <Text className="mt-2 font-medium">Take Attendance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white rounded-lg p-4 mb-4 shadow-sm w-[45%] items-center"
              onPress={() => router.push('/grievances')}
            >
              <Ionicons name="document-text-outline" size={28} color="#3498db" />
              <Text className="mt-2 font-medium">View Grievances</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white rounded-lg p-4 mr-4 mb-4 shadow-sm w-[45%] items-center"
              onPress={() => router.push('/attendance/reports')}
            >
              <Ionicons name="bar-chart-outline" size={28} color="#3498db" />
              <Text className="mt-2 font-medium">Attendance Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white rounded-lg p-4 mb-4 shadow-sm w-[45%] items-center"
              onPress={() => router.push('/profile')}
            >
              <Ionicons name="settings-outline" size={28} color="#3498db" />
              <Text className="mt-2 font-medium">Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Grievance Stats */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Grievance Overview</Text>
          <View className="flex-row flex-wrap">
            <DashboardCard 
              title="Pending"
              value={stats.pendingGrievances}
              icon="alert-circle-outline"
              color="#f39c12"
              onPress={() => router.push('/grievances?filter=pending')}
            />
            <DashboardCard 
              title="Resolved"
              value={stats.resolvedGrievances}
              icon="checkmark-circle-outline"
              color="#2ecc71"
              onPress={() => router.push('/grievances?filter=resolved')}
            />
            <DashboardCard 
              title="Total"
              value={stats.totalGrievances}
              icon="document-text-outline"
              color="#3498db"
              onPress={() => router.push('/grievances')}
            />
          </View>
        </View>
        
        {/* Attendance Stats */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Attendance Overview</Text>
          <View className="flex-row flex-wrap">
            <DashboardCard 
              title="Avg. Attendance"
              value={`${stats.averageAttendance}%`}
              icon="analytics-outline"
              color="#3498db"
              onPress={() => router.push('/attendance/reports')}
            />
            <DashboardCard 
              title="Low Attendance"
              value={stats.lowAttendanceStudents}
              icon="warning-outline"
              color="#e74c3c"
              onPress={() => router.push('/attendance/low')}
            />
            <DashboardCard 
              title="Total Students"
              value={stats.totalStudents}
              icon="people-outline"
              color="#9b59b6"
              onPress={() => router.push('/attendance/students')}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}