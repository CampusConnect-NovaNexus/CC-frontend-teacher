import SimpleBarChart from '@/components/SimpleBarChart';
import { useAuth } from '@/context/AuthContext';
import { getAttendanceStatsOfClass } from '@/service/attendance/getAttendanceStatsOfClass';
import { getCourseAttendanceStats } from '@/service/attendance/getCourseAttendancePercentage';
import { getCourses } from '@/service/attendance/getCourses';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

type PeriodType = 'weekly' | 'monthly' | 'semester';

const getDateRanges = (period: PeriodType) => {
  const today = new Date();
  let startDate: Date;

  if (period === 'weekly') {
    // Last 7 days
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);
  } else if (period === 'monthly') {
    // Last 30 days
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);
  } else {
    // Semester (last 6 months)
    startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 6);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  };
};

// Interface for course data
interface Course {
  course_code: string;
  course_name: string;
}

// Interface for attendance stats
interface AttendanceStats {
  course_code: string;
  total_classes: number;
  attended_classes: number;
  attendance_percentage: number;
  start_date: string;
  end_date: string;
  total_students: number;
}

// Interface for student attendance data
interface StudentAttendance {
  student_name: string;
  roll_no: string;
  attendance_percentage: number;
  attended_classes: number;
}

// Interface for course attendance data
interface CourseAttendance {
  course_code: string;
  total_students: number;
  start_date: string;
  end_date: string;
  students: StudentAttendance[];
}

export default function AttendanceReportsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('monthly');
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseStats, setCourseStats] = useState<AttendanceStats[]>([]);
  const [studentStats, setStudentStats] = useState<CourseAttendance[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Data for charts
  const [attendanceTrendLabels, setAttendanceTrendLabels] = useState<string[]>([]);
  const [attendanceTrendData, setAttendanceTrendData] = useState<number[]>([]);
  const [classComparisonLabels, setClassComparisonLabels] = useState<string[]>([]);
  const [classComparisonData, setClassComparisonData] = useState<number[]>([]);

  // Fetch courses and attendance data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;

      setLoading(true);
      setError(null);

      try {
        // Get date ranges based on selected period
        const { startDate, endDate } = getDateRanges(selectedPeriod);

        // Fetch courses
        const coursesData = await getCourses(user.email);
        setCourses(coursesData);

        const statsPromises = coursesData.map((course: Course) =>
          getAttendanceStatsOfClass(course.course_code, startDate, endDate)
        );

        const attendancePromises = coursesData.map((course: Course) =>
          getCourseAttendanceStats(course.course_code, startDate, endDate)
        );

        const allStats = await Promise.all(statsPromises);
        const allAttendance = await Promise.all(attendancePromises);

        setCourseStats(allStats);
        setStudentStats(allAttendance);

        const courseLabels = coursesData.map((course: Course) => course.course_code);
        const attendanceData = allStats.map((stat: AttendanceStats) => stat.attendance_percentage);

        setClassComparisonLabels(courseLabels);
        setClassComparisonData(attendanceData);

        if (allStats.length > 0) {
          const trendLabels = coursesData.map((course: Course) => course.course_code);
          const trendData = allStats.map((stat: AttendanceStats) => stat.attendance_percentage);

          setAttendanceTrendLabels(trendLabels);
          setAttendanceTrendData(trendData);
        }
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Failed to load attendance data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, selectedPeriod]);

  const getHighestAttendance = () => {
    if (courseStats.length === 0) return { percentage: 0, course: '' };

    const highest = courseStats.reduce((prev, current) =>
      (prev.attendance_percentage > current.attendance_percentage) ? prev : current
    );

    const course = courses.find((c: Course) => c.course_code === highest.course_code);

    return {
      percentage: highest.attendance_percentage,
      course: highest.course_code + (course ? ` - ${course.course_name}` : '')
    };
  };

  const getLowestAttendance = () => {
    if (courseStats.length === 0) return { percentage: 0, course: '' };

    const lowest = courseStats.reduce((prev, current) =>
      (prev.attendance_percentage < current.attendance_percentage) ? prev : current
    );

    const course = courses.find((c: Course) => c.course_code === lowest.course_code);

    return {
      percentage: lowest.attendance_percentage,
      course: lowest.course_code + (course ? ` - ${course.course_name}` : '')
    };
  };

  const getAverageAttendance = () => {
    if (courseStats.length === 0) return 0;

    const sum = courseStats.reduce((total, stat) => total + stat.attendance_percentage, 0);
    return (sum / courseStats.length).toFixed(2);
  };

  const highest = getHighestAttendance();
  const lowest = getLowestAttendance();
  const average = getAverageAttendance();

  // Handle period change
  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="px-4 pb-96"
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
              onPress={() => handlePeriodChange('weekly')}
            >
              <Text className={`text-sm font-medium ${selectedPeriod === 'weekly' ? 'text-white' : 'text-gray-800'}`}>
                Weekly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-1 rounded-full mr-2 border ${selectedPeriod === 'monthly' ? 'bg-black border-black' : 'bg-gray-100 border-gray-200'}`}
              onPress={() => handlePeriodChange('monthly')}
            >
              <Text className={`text-sm font-medium ${selectedPeriod === 'monthly' ? 'text-white' : 'text-gray-800'}`}>
                Monthly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-1 rounded-full mr-2 border ${selectedPeriod === 'semester' ? 'bg-black border-black' : 'bg-gray-100 border-gray-200'}`}
              onPress={() => handlePeriodChange('semester')}
            >
              <Text className={`text-sm font-medium ${selectedPeriod === 'semester' ? 'text-white' : 'text-gray-800'}`}>
                Semester
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#000" />
            <Text className="mt-4 text-gray-600">Loading attendance data...</Text>
          </View>
        ) : error ? (
          <View className="bg-red-50 p-4 rounded-xl mb-5 border border-red-100">
            <Text className="text-red-800">{error}</Text>
            <TouchableOpacity
              className="bg-red-800 px-4 py-2 rounded-lg mt-2 self-start"
              onPress={() => {
                const { startDate, endDate } = getDateRanges(selectedPeriod);
                if (user?.email) {
                  setLoading(true);
                  getCourses(user.email)
                    .then(setCourses)
                    .finally(() => setLoading(false));
                }
              }}
            >
              <Text className="text-white font-medium">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Attendance Trend Chart */}
            <View className="bg-white rounded-xl shadow-sm mb-5 p-4 min-h-[35%] h-fit border border-gray-100">
              <Text className="text-lg font-bold text-gray-800 mb-2">Attendance Trend</Text>
              {attendanceTrendData.length > 0 ? (
                  <SimpleBarChart
                    data={attendanceTrendData}
                    labels={attendanceTrendLabels}
                    width={screenWidth - 56}
                    height={300}
                    color="#000000"
                    title="Average Attendance (%)"
                  />

              ) : (
                <View className="items-center justify-center py-10">
                  <Text className="text-gray-500">No attendance data available</Text>
                </View>
              )}
            </View>

            {/* Class Comparison Chart */}
            <View className="bg-white rounded-xl shadow-sm mb-5 p-4 min-h-[35%] h-fit border border-gray-100">
              <Text className="text-lg font-bold text-gray-800 mb-2">Class Comparison</Text>
              {classComparisonData.length > 0 ? (

                <SimpleBarChart
                  data={classComparisonData}
                  labels={classComparisonLabels}
                  width={screenWidth - 56}
                  height={350}
                  color="#000000"
                  title="Class Attendance (%)"
                />

              ) : (
                <View className="items-center justify-center py-10">
                  <Text className="text-gray-500">No class comparison data available</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}