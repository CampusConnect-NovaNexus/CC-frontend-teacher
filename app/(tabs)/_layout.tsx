import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const { user, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  
  // Get theme colors
  const primary = useThemeColor({}, 'primary');
  const tabIconDefault = useThemeColor({}, 'tabIconDefault');
  const tabBackground = useThemeColor({}, 'tabBackground');
  const textInverse = useThemeColor({}, 'textInverse');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading]);

  return (
    <Tabs
      screenOptions={{
        // Tab bar styling
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: tabIconDefault,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          backgroundColor: tabBackground,
          borderTopColor: useThemeColor({}, 'border'),
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        
        // Header styling
        headerStyle: {
          backgroundColor: primary,
        },
        headerTintColor: textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        
        // Tab bar label styling
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        
        // Animation
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="grievances"
        options={{
          title: 'Grievances',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}