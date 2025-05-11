import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface Grievance {
  id: string;
  title: string;
  description: string;
  studentName: string;
  studentId: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  category: string;
  responses: Response[];
}

interface Response {
  id: string;
  text: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
  };
}

export default function GrievanceDetailScreen() {
  const params = useLocalSearchParams();
  const grievanceId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    loadGrievanceDetails();
  }, [grievanceId]);
  
  const loadGrievanceDetails = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockGrievance: Grievance = {
        id: grievanceId,
        title: 'Issue with Course Registration',
        description: 'I am unable to register for the Advanced Database course.  The system shows an error saying "Prerequisites not met" but I have completed all the required courses.',
        studentName: 'Alex Johnson',
        studentId: 'student-123',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Course Registration',
        responses: [
          {
            id: 'resp-1',
            text: 'Thank you for reporting this issue. I will check with the registration department and get back to you.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            author: {
              id: 'teacher-1',
              name: 'Dr. Smith',
              role: 'teacher'
            }
          },
          {
            id: 'resp-2',
            text: 'I checked my transcript and all prerequisites are marked as completed. Could this be a system error?',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            author: {
              id: 'student-123',
              name: 'Alex Johnson',
              role: 'student'
            }
          }
        ]
      };
      
      setGrievance(mockGrievance);
    } catch (error) {
      console.error('Error loading grievance details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const submitResponse = async () => {
    if (!responseText.trim() || !grievance) return;
    
    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add response to the list
      const newResponse: Response = {
        id: `resp-${Date.now()}`,
        text: responseText,
        createdAt: new Date().toISOString(),
        author: {
          id: 'teacher-1',
          name: 'Dr. Smith',
          role: 'teacher'
        }
      };
      
      setGrievance({
        ...grievance,
        responses: [...grievance.responses, newResponse],
        updatedAt: new Date().toISOString()
      });
      
      setResponseText('');
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const updateStatus = async (newStatus: 'pending' | 'in-progress' | 'resolved') => {
    if (!grievance) return;
    
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGrievance({
        ...grievance,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading && !grievance) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }
  
  if (!grievance) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Text className="text-lg text-gray-600">Grievance not found</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold">Grievance Details</Text>
          </View>
          
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-xl font-bold mb-2">{grievance.title}</Text>
            
            <View className="flex-row flex-wrap mb-3">
              <View className={`px-3 py-1 rounded-full mr-2 mb-2 ${getStatusColor(grievance.status)}`}>
                <Text className="text-sm font-medium capitalize">{grievance.status}</Text>
              </View>
              
              <View className={`px-3 py-1 rounded-full mr-2 mb-2 ${getPriorityColor(grievance.priority)}`}>
                <Text className="text-sm font-medium capitalize">Priority: {grievance.priority}</Text>
              </View>
              
              <View className="px-3 py-1 rounded-full bg-gray-100 mb-2">
                <Text className="text-sm font-medium text-gray-800">{grievance.category}</Text>
              </View>
            </View>
            
            <Text className="text-gray-700 mb-4">{grievance.description}</Text>
            
            <View className="border-t border-gray-200 pt-3">
              <Text className="text-gray-600 text-sm">Submitted by: {grievance.studentName}</Text>
              <Text className="text-gray-600 text-sm">Created: {formatDate(grievance.createdAt)}</Text>
              <Text className="text-gray-600 text-sm">Last updated: {formatDate(grievance.updatedAt)}</Text>
            </View>
          </View>
          
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-semibold mb-3">Update Status</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className={`px-4 py-2 rounded-lg ${grievance.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'}`}
                onPress={() => updateStatus('pending')}
                disabled={submitting}
              >
                <Text className={`${grievance.status === 'pending' ? 'text-white' : 'text-gray-600'} font-medium`}>Pending</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className={`px-4 py-2 rounded-lg ${grievance.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'}`}
                onPress={() => updateStatus('in-progress')}
                disabled={submitting}
              >
                <Text className={`${grievance.status === 'in-progress' ? 'text-white' : 'text-gray-600'} font-medium`}>In Progress</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className={`px-4 py-2 rounded-lg ${grievance.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`}
                onPress={() => updateStatus('resolved')}
                disabled={submitting}
              >
                <Text className={`${grievance.status === 'resolved' ? 'text-white' : 'text-gray-600'} font-medium`}>Resolved</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text className="text-lg font-semibold mb-3">Conversation</Text>
          
          {grievance.responses.map((response, index) => (
            <View 
              key={response.id} 
              className={`p-4 rounded-lg mb-3 ${response.author.role === 'teacher' ? 'bg-blue-50 ml-4' : 'bg-white mr-4'}`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-semibold">{response.author.name}</Text>
                <Text className="text-xs text-gray-500">{formatDate(response.createdAt)}</Text>
              </View>
              <Text className="text-gray-700">{response.text}</Text>
            </View>
          ))}
          
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="font-semibold mb-2">Add Response</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-3"
              placeholder="Type your response here..."
              multiline
              numberOfLines={4}
              value={responseText}
              onChangeText={setResponseText}
              style={{ textAlignVertical: 'top' }}
            />
            
            <TouchableOpacity 
              className="bg-blue-500 p-3 rounded-lg items-center"
              onPress={submitResponse}
              disabled={!responseText.trim() || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-medium">Submit Response</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}