import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { logout, user } = useContext(AuthContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-primary p-6 items-center">
        <View className="w-24 h-24 rounded-full overflow-hidden bg-white mb-4">
          <Image
            source={require('@/assets/images/profile-placeholder.png')}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-white text-xl font-bold">{user?.name || 'Teacher Name'}</Text>
        <Text className="text-white opacity-80">{user?.email || 'teacher@example.com'}</Text>
        <Text className="text-white opacity-80 mt-1">Computer Science Department</Text>
      </View>

      <View className="p-4">
        <View className="bg-white rounded-lg shadow-sm mb-6">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={24} color="#3498db" />
              <Text className="ml-3 text-gray-800 font-medium">Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="key-outline" size={24} color="#3498db" />
              <Text className="ml-3 text-gray-800 font-medium">Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
          </TouchableOpacity>
          
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={24} color="#3498db" />
              <Text className="ml-3 text-gray-800 font-medium">Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#bdc3c7', true: '#3498db' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View className="bg-white rounded-lg shadow-sm mb-6">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="help-circle-outline" size={24} color="#3498db" />
              <Text className="ml-3 text-gray-800 font-medium">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="document-text-outline" size={24} color="#3498db" />
              <Text className="ml-3 text-gray-800 font-medium">Terms & Policies</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={24} color="#3498db" />
              <Text className="ml-3 text-gray-800 font-medium">About</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          className="bg-red-500 py-4 rounded-lg items-center mb-8"
          onPress={handleLogout}
        >
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}