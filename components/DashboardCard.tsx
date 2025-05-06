import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 mr-4 mb-4 shadow-sm w-[30%] items-center"
      onPress={onPress}
      disabled={!onPress}
    >
      <Ionicons name={icon} size={28} color={color} />
      <Text className="text-xl font-bold mt-2">{value}</Text>
      <Text className="text-gray-600">{title}</Text>
    </TouchableOpacity>
  );
};

export default DashboardCard;