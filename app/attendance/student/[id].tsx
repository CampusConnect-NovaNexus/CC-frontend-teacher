import SimpleLineChart from '@/components/SimpleLineChart';
import { getAttendanceStats } from '@/service/attendance/getAttendanceStats';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Light mode colors
const COLORS = {
  primary: '#4361ee',
  secondary: '#3f37c9',
  success: '#10b981',
  error: '#f44336',
  background: '#ffffff',
  card: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e0e0e0',
  divider: '#e0e0e0',
};

// Card components
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <View className={`bg-white rounded-lg shadow-md border border-gray-200 mb-4 overflow-hidden ${className || ''}`}>
      {children}
    </View>
  );
}

function CardHeader({ title }: { title: string }) {
  return (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-lg font-semibold text-gray-800">{title}</Text>
    </View>
  );
}

function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <View className={`p-4 ${className || ''}`}>
      {children}
    </View>
  );
}

interface AttendanceStatsType {
  student_id: string;
  student_name: string;
  roll_no: string;
  course_code: string;
  total_classes: number;
  attended_classes: number;
  attendance_percentage: number;
  start_date?: string;
  end_date?: string;
}

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AttendanceStatsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [id, startDate, endDate]);

  const fetchStats = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const statsData = await getAttendanceStats(
        id, 
        startDate ? startDate.toISOString() : undefined, 
        endDate ? endDate.toISOString() : undefined
      );
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      setError('Failed to load attendance statistics');
      setLoading(false);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toISOString().split('T')[0];
  };

  const clearDateFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <View className="flex-1 bg-white mb-4">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 pb-8"
      >
        <Text className="text-xl font-semibold text-gray-800 mt-4 mb-2">
          Student Attendance Details
        </Text>

        <Card>
          <CardHeader title="Date Range Filter" />
          <CardContent>
            <View className="flex-row justify-between mb-2">
              <TouchableOpacity 
                className="border border-blue-600 rounded-md py-2 px-4 w-[48%] items-center"
                onPress={() => setShowStartPicker(true)}
                activeOpacity={0.7}
              >
                <Text className="text-blue-600">Start: {formatDate(startDate)}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="border border-blue-600 rounded-md py-2 px-4 w-[48%] items-center"
                onPress={() => setShowEndPicker(true)}
                activeOpacity={0.7}
              >
                <Text className="text-blue-600">End: {formatDate(endDate)}</Text>
              </TouchableOpacity>
            </View>
            
            {(startDate || endDate) && (
              <TouchableOpacity
                className="bg-blue-700 rounded-md py-1 px-3 self-end"
                onPress={clearDateFilters}
                activeOpacity={0.7}
              >
                <Text className="text-white text-sm font-medium">Clear Filters</Text>
              </TouchableOpacity>
            )}
            
            {showStartPicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}
            
            {showEndPicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
          </CardContent>
        </Card>

        {loading ? (
          <View className="justify-center items-center p-4 min-h-[200px]">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : error ? (
          <View className="justify-center items-center p-4 min-h-[200px]">
            <Text className="text-lg text-red-500">
              {error}
            </Text>
          </View>
        ) : !stats ? (
          <View className="justify-center items-center p-4 min-h-[200px]">
            <Text className="text-lg text-gray-500">
              No attendance data available
            </Text>
          </View>
        ) : (
          <Card>
            <CardHeader title={`Attendance Statistics: ${stats.student_name}`} />
            <CardContent>
              <View className="flex-row justify-between mb-4">
                <View className="items-center flex-1">
                  <Text className="text-sm text-gray-500">
                    Roll Number
                  </Text>
                  <Text className="text-lg">
                    {stats.roll_no}
                  </Text>
                </View>
                
                <View className="items-center flex-1">
                  <Text className="text-sm text-gray-500">
                    Course
                  </Text>
                  <Text className="text-lg">
                    {stats.course_code}
                  </Text>
                </View>
              </View>
              
              <View className="flex-row justify-between mb-4">
                <View className="items-center flex-1">
                  <Text className="text-sm text-gray-500">
                    Total Classes
                  </Text>
                  <Text className="text-lg">
                    {stats.total_classes}
                  </Text>
                </View>
                
                <View className="items-center flex-1">
                  <Text className="text-sm text-gray-500">
                    Attended Classes
                  </Text>
                  <Text className="text-lg">
                    {stats.attended_classes}
                  </Text>
                </View>
                
                <View className="items-center flex-1">
                  <Text 
                    className={`text-sm ${stats.attendance_percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}
                  >
                    Attendance
                  </Text>
                  <Text 
                    className={`text-lg font-semibold ${stats.attendance_percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}
                  >
                    {stats.attendance_percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
              
              {stats.start_date && stats.end_date && (
                <View className="items-center mb-4">
                  <Text className="text-sm text-gray-500">
                    Period: {new Date(stats.start_date).toLocaleDateString()} - {new Date(stats.end_date).toLocaleDateString()}
                  </Text>
                </View>
              )}
              
              <SimpleLineChart
                data={[stats.attendance_percentage]}
                labels={['Attendance']}
                width={300}
                height={200}
                color={stats.attendance_percentage >= 75 ? COLORS.success : COLORS.error}
                title="Attendance Percentage"
              />
            </CardContent>
          </Card>
        )}
        
        <TouchableOpacity
          className="bg-blue-700 rounded-md py-2 px-4 flex-row items-center mt-4"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-medium">Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

