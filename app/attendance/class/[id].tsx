import SimpleLineChart from "@/components/SimpleLineChart";
import { getStudents } from "@/service/attendance/getStudents";
import { getAttendanceStatsOfClass } from "@/service/attendance/getAttendanceStatsOfClass";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  Switch,
  Button,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from "@react-native-community/datetimepicker";

const screenWidth = Dimensions.get("window").width;

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  course_code: string;
}

export default function ClassAttendanceScreen() {
  const params = useLocalSearchParams();
  const courseCode = params.id as string;

  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(new Date());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isTakingAttendance, setIsTakingAttendance] = useState(false);

  const attendanceLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const attendanceData = [85, 78, 92, 88];
  const formatDate = (date: Date) => {
    return date.toISOString(); // ISO 8601 format
  };

  useEffect(() => {
    loadClassData();
  }, [courseCode]);

  const loadClassData = async () => {
    try {
      setLoading(true);

      const Classdata = await getAttendanceStatsOfClass(courseCode, startDate?.toISOString(), endDate?.toISOString());
      const data= await getStudents(courseCode);
      setClassName(courseCode.toUpperCase() || "Unknown Class");
      const mappedData: Student[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        rollNumber: item.roll_no,
        course_code: item.course_code,
      }));
      await setStudents(mappedData);
    } catch (error) {
      console.error("Error loading class data:", error);
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
    <SafeAreaView className="flex-1 bg-gray-300">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold">{className}</Text>
              <View className="flex-col items-center">

              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                className="bg-white border rounded-lg p-2 mb-4"
                >
                <Text style={{ fontSize: 16 }}>
                  {startDate
                    ? `Start Date: ${formatDate(startDate).slice(0,10)}`
                    : "Select Start Date"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className="bg-white border rounded-lg p-2 mb-4"
                >
                <Text style={{ fontSize: 16 }}>
                  {endDate
                    ? `End Date: ${formatDate(endDate).slice(0,10)}`
                    : "Select End Date"}
                </Text>
              </TouchableOpacity>
              
              </View>
              {showStartPicker && (
                <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  console.log("Selected Start Date:", selectedDate);
                  
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
              <Text className="text-gray-600">{students.length} students</Text>
            </View>
          </View>

          <View className="mb-6 flex-row justify-between items-center">
            <Text className="text-lg font-semibold">
              {isTakingAttendance ? "Mark Attendance" : "Students"}
            </Text>
          </View>

          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            extraData={students}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
