import React, { useContext, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardDivider } from '@/components/ui/Card';
import { spacing, layout, borderRadius } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

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
      style={styles.menuItem} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={primaryColor} style={styles.menuItemIcon} />
        <ThemedText variant="bodyMedium">{label}</ThemedText>
      </View>
      
      {rightElement || (showChevron && (
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      ))}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Get theme colors
  const primaryColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');
  const textInverseColor = useThemeColor({}, 'textInverse');

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
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <ThemedView 
          style={styles.profileHeader}
          lightColor={primaryColor}
          darkColor={primaryColor}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/profile-placeholder.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          
          <ThemedText 
            variant="headingMedium" 
            style={{ color: textInverseColor, marginBottom: spacing.xs }}
          >
            {user?.name || 'Teacher Name'}
          </ThemedText>
          
          <ThemedText 
            variant="bodyMedium" 
            style={{ color: textInverseColor, opacity: 0.9 }}
          >
            {user?.email || 'teacher@example.com'}
          </ThemedText>
          
          <ThemedText 
            variant="bodyMedium" 
            style={{ color: textInverseColor, opacity: 0.9, marginTop: spacing.xs }}
          >
            Computer Science Department
          </ThemedText>
        </ThemedView>
        
        {/* Account Settings */}
        <Card style={styles.card}>
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
        
        {/* Support & Info */}
        <Card style={styles.card}>
          <CardHeader title="Support & Info" />
          <CardContent style={styles.cardContent}>
            <ProfileMenuItem 
              icon="help-circle-outline" 
              label="Help & Support" 
              onPress={() => {}} 
            />
            
            <CardDivider />
            
            <ProfileMenuItem 
              icon="document-text-outline" 
              label="Terms & Policies" 
              onPress={() => {}} 
            />
            
            <CardDivider />
            
            <ProfileMenuItem 
              icon="information-circle-outline" 
              label="About" 
              onPress={() => {}} 
            />
          </CardContent>
        </Card>
        
        {/* Logout Button */}
        <Button
          variant="danger"
          size="lg"
          onPress={handleLogout}
          fullWidth
          style={styles.logoutButton}
          leftIcon="log-out-outline"
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
    paddingBottom: spacing.xl,
  },
  profileHeader: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  card: {
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: spacing.lg,
  },
  cardContent: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: spacing.md,
  },
  logoutButton: {
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: spacing.xl,
  },
});