import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  attendancePercentage: number;
  email: string;
  phone?: string;
}

export default function StudentsScreen() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        student => 
          student.name.toLowerCase().includes(query) || 
          student.rollNumber.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockStudents: Student[] = Array.from({ length: 30 }, (_, i) => ({
        id: `student-${i + 1}`,
        name: `Student ${i + 1}`,
        rollNumber: `CS${Math.floor(Math.random() * 4) + 1}${i + 1 < 10 ? '0' : ''}${i + 1}`,
        attendancePercentage: Math.floor(Math.random() * 30) + 70, // 70-99%
        email: `student${i+1}@example.com`,
        phone: Math.random() > 0.3 ? `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : undefined
      }));
      
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <TouchableOpacity 
      className="bg-white p-4 rounded-lg mb-3 shadow-sm"
      onPress={() => router.push({
        pathname: "/attendance/student/[id]",
        params: { id: item.id }
      })}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="font-semibold text-lg">{item.name}</Text>
          <Text className="text-gray-600">{item.rollNumber}</Text>
          {item.email && <Text className="text-gray-600 text-sm">{item.email}</Text>}
        </View>
        
        <View className={`px-3 py-1 rounded-full ${item.attendancePercentage < 75 ? 'bg-red-100' : 'bg-green-100'}`}>
          <Text className={`text-sm font-medium ${item.attendancePercentage < 75 ? 'text-red-800' : 'text-green-800'}`}>
            {item.attendancePercentage}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 mt-12">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">All Students</Text>
        </View>
        
        <View className="bg-white rounded-lg mb-4 flex-row items-center px-3 shadow-sm">
          <Ionicons name="search" size={20} color="#95a5a6" />
          <TextInput
            className="flex-1 p-3"
            placeholder="Search by name or roll number"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#95a5a6" />
            </TouchableOpacity>
          )}
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#3498db" className="mt-4" />
        ) : (
          <>
            <Text className="mb-3 text-gray-600">{filteredStudents.length} students found</Text>
            <FlatList
              data={filteredStudents}
              renderItem={renderStudentItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </>
        )}
      </View>
    </View>
  );
}