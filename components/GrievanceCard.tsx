import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Grievance {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  userId: string;
  upvotes: number;
  comments: number;
}

interface GrievanceCardProps {
  grievance: Grievance;
  onPress: () => void;
  isAdmin?: boolean;
}

const GrievanceCard: React.FC<GrievanceCardProps> = ({ 
  grievance, 
  onPress,
  isAdmin = false
}) => {
  const formattedDate = new Date(grievance.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 shadow-sm"
      onPress={onPress}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <Text className="text-lg font-semibold">{grievance.title}</Text>
          <Text className="text-gray-600 mt-1" numberOfLines={2}>
            {grievance.description}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${grievance.status === 'pending' ? 'bg-yellow-100' : 'bg-green-100'}`}>
          <Text className={`text-xs font-medium ${grievance.status === 'pending' ? 'text-yellow-800' : 'text-green-800'}`}>
            {grievance.status === 'pending' ? 'Pending' : 'Resolved'}
          </Text>
        </View>
      </View>
      
      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-gray-500 text-xs">{formattedDate}</Text>
        
        <View className="flex-row">
          <View className="flex-row items-center mr-4">
            <Ionicons name="arrow-up-outline" size={16} color="#7f8c8d" />
            <Text className="text-gray-500 text-xs ml-1">{grievance.upvotes}</Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={16} color="#7f8c8d" />
            <Text className="text-gray-500 text-xs ml-1">{grievance.comments}</Text>
          </View>
        </View>
      </View>
      
      {isAdmin && (
        <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-end">
          {grievance.status === 'pending' && (
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="checkmark-circle-outline" size={16} color="#2ecc71" />
              <Text className="text-green-600 text-xs ml-1">Mark as Resolved</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default GrievanceCard;