import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

// Light mode colors
const COLORS = {
  primary: '#4361ee',
  secondary: '#3f37c9',
  error: '#f44336',
  background: '#ffffff',
  card: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e0e0e0',
  icon: '#757575',
  divider: '#e0e0e0',
  textInverse: '#ffffff',
};

// Profile menu item component
interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

function ProfileMenuItem({ 
  icon, 
  label, 
  onPress, 
  showChevron = true, 
  rightElement 
}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity 
      className="flex-row items-center justify-between py-4 px-4"
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View className="flex-row items-center">
        <Ionicons name={icon} size={24} color={COLORS.primary} className="mr-4" />
        <Text className="text-base text-gray-800">{label}</Text>
      </View>
      
      {rightElement || (showChevron && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.icon} />
      ))}
    </TouchableOpacity>
  );
}

// Card components
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <View className={`bg-white rounded-lg shadow-md border border-gray-200 mx-4 mt-4 overflow-hidden ${className || ''}`}>
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
    <View className={className || ''}>
      {children}
    </View>
  );
}

function CardDivider() {
  return <View className="h-px bg-gray-200 w-full" />;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleLogout = () => {
    Toast.show({
      type: 'info',
      text1: 'Logout',
      text2: 'Are you sure you want to logout?',
      position: 'top',
      bottomOffset: 100,
      autoHide: false,
      onPress: () => {
        Toast.hide();
        logout();
        router.replace('/login');
      },
      onHide: () => {},
      props: {
        buttons: [
          {
            text: 'Cancel',
            onPress: () => Toast.hide()
          },
          {
            text: 'Logout',
            onPress: () => {
              Toast.hide();
              logout();
              router.replace('/login');
            }
          }
        ]
      }
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Profile Header */}
        <View className="py-8 px-6 items-center bg-blue-600">
          <View className="w-24 h-24 rounded-full overflow-hidden bg-white mb-4 border-2 border-white/50">
            <Image
              source={require('@/assets/images/logo.png')}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          
          <Text className="text-xl font-semibold text-white mb-1">
            {user?.name || 'Teacher Name'}
          </Text>
          
          <Text className="text-base text-white/90">
            {user?.email || 'teacher@example.com'}
          </Text>
          
          <Text className="text-base text-white/90 mt-1">
            Computer Science Department
          </Text>
        </View>
        
        {/* Account Settings */}
        <Card>
          <CardHeader title="Account Settings" />
          <CardContent>
            <ProfileMenuItem 
              icon="person-outline" 
              label="Edit Profile" 
              onPress={() => {}} 
            />
            
            <CardDivider />
            
            <ProfileMenuItem 
              icon="key-outline" 
              label="Change Password" 
              onPress={() => {}} 
            />
            
            <CardDivider />
            
            <ProfileMenuItem 
              icon="notifications-outline" 
              label="Notifications" 
              showChevron={false}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#bdc3c7', true: COLORS.primary }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#bdc3c7"
                />
              }
            />
            
            <CardDivider />
            
            <ProfileMenuItem 
              icon="moon-outline" 
              label="Dark Mode" 
              showChevron={false}
              rightElement={
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: '#bdc3c7', true: COLORS.primary }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#bdc3c7"
                />
              }
            />
          </CardContent>
        </Card>
        
        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-500 py-3 px-6 rounded-md mx-auto mt-10 flex-row items-center justify-center w-[30%]"
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-base">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

