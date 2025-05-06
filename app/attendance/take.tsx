import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  present: boolean;
}

interface Class {
  id: string;
  name: string;
}

export default function TakeAttendanceScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState(new Date());

  // Mock data for classes and students
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClasses([
        { id: '1', name: 'Computer Science - CS101' },
        { id: '2', name: 'Data Structures - CS201' },
        { id: '3', name: 'Database Systems - CS301' },
        { id: '4', name: 'Web Development - CS401' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      // Simulate API call to get students for the selected class
      setTimeout(() => {
        const mockStudents = Array.from({ length: 30 }, (_, i) => ({
          id: `student-${i + 1}`,
          name: `Student ${i + 1}`,
          rollNumber: `CS${2023}${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
          present: true,
        }));
        setStudents(mockStudents);
        setLoading(false);
      }, 1000);
    }
  }, [selectedClass]);

  const toggleAttendance = (studentId: string) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, present: !student.present } 
        : student
    ));
  };

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, present: true })));
  };

  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, present: false })));
  };

  const saveAttendance = () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class first');
      return;
    }

    if (students.length === 0) {
      Alert.alert('Error', 'No students found for this class');
      return;
    }

    setSaving(true);
    
    // Simulate API call to save attendance
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        'Success',
        'Attendance saved successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = students.filter(student => student.present).length;
  const absentCount = students.length - presentCount;

  const renderStudentItem = ({ item }: { item: Student }) => (
    <TouchableOpacity 
      className="flex-row items-center justify-between p-4 bg-white rounded-lg mb-2 shadow-sm"
      onPress={() => toggleAttendance(item.id)}
    >
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full items-center justify-center ${item.present ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`font-bold ${item.present ? 'text-green-600' : 'text-red-600'}`}>
            {item.name.charAt(0)}
          </Text>
        </View>
        <View className="ml-3">
          <Text className="font-medium text-gray-800">{item.name}</Text>
          <Text className="text-gray-500 text-sm">{item.rollNumber}</Text>
        </View>
      </View>
      <View className={`w-8 h-8 rounded-full items-center justify-center ${item.present ? 'bg-green-500' : 'bg-red-500'}`}>
        <Ionicons 
          name={item.present ? 'checkmark' : 'close'} 
          size={18} 
          color="#ffffff" 
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold mb-4">Take Attendance</Text>
        
        <View className="mb-4">
          <Text className="text-gray-700 mb-2">Select Class</Text>
          <View className="border border-gray-300 rounded-lg overflow-hidden">
            <Picker
              selectedValue={selectedClass}
              onValueChange={(itemValue) => setSelectedClass(itemValue)}
              enabled={!loading}
            >
              <Picker.Item label="Select a class..." value="" />
              {classes.map(classItem => (
                <Picker.Item 
                  key={classItem.id} 
                  label={classItem.name} 
                  value={classItem.id} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        {selectedClass && students.length > 0 && (
          <>
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
              <Ionicons name="search" size={20} color="#95a5a6" />
              <TextInput
                className="flex-1 ml-2 text-gray-800"
                placeholder="Search students..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#95a5a6" />
                </TouchableOpacity>
              ) : null}
            </View>
            
            <View className="flex-row justify-between mb-4">
              <TouchableOpacity 
                className="bg-green-500 py-2 px-4 rounded-lg flex-row items-center"
                onPress={markAllPresent}
              >
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text className="text-white font-medium ml-1">Mark All Present</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-red-500 py-2 px-4 rounded-lg flex-row items-center"
                onPress={markAllAbsent}
              >
                <Ionicons name="close-circle" size={18} color="#ffffff" />
                <Text className="text-white font-medium ml-1">Mark All Absent</Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-between mb-4 bg-gray-100 p-3 rounded-lg">
              <View className="items-center">
                <Text className="text-gray-600">Total</Text>
                <Text className="text-lg font-bold">{students.length}</Text>
              </View>
              <View className="items-center">
                <Text className="text-green-600">Present</Text>
                <Text className="text-lg font-bold text-green-600">{presentCount}</Text>
              </View>
              <View className="items-center">
                <Text className="text-red-600">Absent</Text>
                <Text className="text-lg font-bold text-red-600">{absentCount}</Text>
              </View>
              <View className="items-center">
                <Text className="text-blue-600">Percentage</Text>
                <Text className="text-lg font-bold text-blue-600">
                  {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : !selectedClass ? (
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons name="calendar-outline" size={60} color="#bdc3c7" />
          <Text className="text-gray-500 mt-4 text-lg text-center">
            Please select a class to take attendance
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredStudents}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-10">
                <Ionicons name="people-outline" size={60} color="#bdc3c7" />
                <Text className="text-gray-500 mt-4 text-lg">No students found</Text>
              </View>
            }
          />
          
          <View className="p-4 bg-white border-t border-gray-200">
            <TouchableOpacity 
              className="bg-blue-500 py-3 rounded-lg items-center"
              onPress={saveAttendance}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-lg">Save Attendance</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}