import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { getCourses } from "@/service/attendance/getCourses";
import { getStudents } from "@/service/attendance/getStudents";
import { markAttendance } from "@/service/attendance/markAttendance";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface CourseType {
  course_code: string;
  Teacher: string[];
  TA: string[];
  total_classes: number;
}

interface StudentType {
  id: string;
  course_code: string;
  roll_no: string;
  name: string;
  present?: boolean;
}

export default function TakeAttendanceScreen() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("");
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchCourses(user.email);
    }
  }, [user]);

  const fetchCourses = async (email: string) => {
    try {
      setLoadingCourses(true);
      const coursesData = await getCourses(email);
      setCourses(coursesData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch courses.",
      });
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleCourseChange = (courseCode: string) => {
    setSelectedCourseCode(courseCode);
    const course = courses.find((c) => c.course_code === courseCode) || null;
    setSelectedCourse(course);
    if (course) fetchStudents(course.course_code);
    else setStudents([]);
  };

  const fetchStudents = async (courseCode: string) => {
    try {
      setLoading(true);
      const studentsData = await getStudents(courseCode);
      
      // Map data and add 'present' property
      let mappedStudents = studentsData.map((s) => ({ ...s, present: true }));
      
      // Sort by roll number (extract numeric part and sort numerically)
      mappedStudents.sort((a, b) => {
        // Extract numeric part from roll numbers (e.g., "019" from "B23CS019")
        const numA = parseInt(a.roll_no.replace(/[^\d]/g, ''), 10);
        const numB = parseInt(b.roll_no.replace(/[^\d]/g, ''), 10);
        
        return numA - numB; // Sort in ascending order
      });
      
      setStudents(mappedStudents);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch students.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  };

  const markAllPresent = () =>
    setStudents((prev) => prev.map((s) => ({ ...s, present: true })));
  const markAllAbsent = () =>
    setStudents((prev) => prev.map((s) => ({ ...s, present: false })));

  const saveAttendance = async () => {
    if (!selectedCourse)
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "Select a course.",
      });
    if (!students.length)
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "No students found.",
      });
    const presentRollNumbers = students
      .filter((s) => s.present)
      .map((s) => s.roll_no);
    try {
      setSaving(true);
      await markAttendance({
        course_code: selectedCourse.course_code,
        roll_numbers: presentRollNumbers,
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Attendance saved.",
        onHide: () => router.back(),
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save attendance.",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStudentItem = ({ item }: { item: StudentType }) => (
    <TouchableOpacity
      style={[
        styles.studentItem,
        { backgroundColor: item.present ? "#e0f7e9" : "#fde0e0" },
      ]}
      onPress={() => toggleAttendance(item.id)}
    >
      <View style={styles.studentInfo}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: item.present ? "#34c759" : "#ff3b30" },
          ]}
        >
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.roll}>{item.roll_no}</Text>
        </View>
      </View>
      <Ionicons
        name={item.present ? "checkmark" : "close"}
        size={20}
        color="white"
        style={{
          backgroundColor: item.present ? "#34c759" : "#ff3b30",
          borderRadius: 12,
          padding: 4,
        }}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Take Attendance</Text>
        <Text>Select Course</Text>
        {loadingCourses ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedCourseCode}
              onValueChange={handleCourseChange}
            >
              <Picker.Item label="Select a course..." value="" />
              {courses.map((c) => (
                <Picker.Item
                  key={c.course_code}
                  label={c.course_code}
                  value={c.course_code}
                />
              ))}
            </Picker>
          </View>
        )}
      </View>
      {selectedCourse ? (
        <View style={styles.body}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                leftIcon="search"
                rightIcon={searchQuery ? "close-circle" : undefined}
                onRightIconPress={
                  searchQuery ? () => setSearchQuery("") : undefined
                }
              />
              <View style={styles.actions}>
                <Button  onPress={markAllPresent}>Mark All Present</Button>
                <Button onPress={markAllAbsent}>Mark All Absent</Button>
              </View>
              <View style={styles.stats}>
                <Text>Total: {students.length}</Text>
                <Text>Present: {students.filter((s) => s.present).length}</Text>
                <Text>Absent: {students.filter((s) => !s.present).length}</Text>
              </View>
              <FlatList
                data={filteredStudents}
                renderItem={renderStudentItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
              <Button onPress={saveAttendance} loading={saving}>
                Save Attendance
              </Button>
            </>
          )}
        </View>
      ) : (
        <Text style={styles.empty}>
          Please select a course to take attendance
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#ccc" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  body: { padding: 16, flex: 1 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  studentInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "white", fontWeight: "bold", fontSize: 16 },
  name: { fontSize: 16, fontWeight: "600" },
  roll: { fontSize: 14, color: "#666" },
  separator: { height: 10 },
  empty: { padding: 20, textAlign: "center" },
});
