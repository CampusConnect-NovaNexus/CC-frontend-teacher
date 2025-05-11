import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';
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
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: tabIconDefault,
        tabBarStyle: {
          height: 60,
          paddingTop: 5,
          paddingBottom: 10,
          backgroundColor: tabBackground,
          borderTopColor: useThemeColor({}, 'border'),
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        
        // Header styling
        headerStyle: {
          backgroundColor: '#d4d4d4',
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
          headerShown: false,
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