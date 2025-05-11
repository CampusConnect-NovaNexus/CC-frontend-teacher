import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDivider, CardHeader } from '@/components/ui/Card';
import { layout, spacing } from '@/constants/Spacing';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

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
  const primaryColor = useThemeColor({}, 'primary');
  const iconColor = useThemeColor({}, 'icon');
  
  return (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: '#FFFFFF' }]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={primaryColor} style={styles.menuItemIcon} />
        <ThemedText variant="bodyMedium" style={{ color: '#000000' }}>{label}</ThemedText>
      </View>
      
      {rightElement || (showChevron && (
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      ))}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const primaryColor = useThemeColor({}, 'primary');
  
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
    <ThemedView style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <ThemedView 
          style={[styles.profileHeader, { backgroundColor: '#FFFFFF' }]}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          
          <ThemedText 
            variant="headingMedium" 
            style={{ color: '#000000', marginBottom: spacing.xs }}
          >
            {user?.name || 'Teacher Name'}
          </ThemedText>
          
          <ThemedText 
            variant="bodyMedium" 
            style={{ color: '#333333' }}
          >
            {user?.email || 'teacher@example.com'}
          </ThemedText>
          
          <ThemedText 
            variant="bodyMedium" 
            style={{ color: '#333333', marginTop: spacing.xs }}
          >
            Computer Science Department
          </ThemedText>
        </ThemedView>
        
        {/* Account Settings */}
        <Card style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
          <CardHeader title="Account Settings" />
          <CardContent style={styles.cardContent}>
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
                  trackColor={{ false: '#bdc3c7', true: primaryColor }}
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
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#bdc3c7', true: primaryColor }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#bdc3c7"
                />
              }
            />
          </CardContent>
        </Card>
        
        {/* Logout Button */}
        <Button
          variant="danger"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  profileHeader: {
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  card: {
    marginBottom: spacing.md,
  },
  cardContent: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: spacing.sm,
  },
  logoutButton: {
    marginTop: spacing.md,
  },
});