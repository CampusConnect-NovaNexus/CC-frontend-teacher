import React, { useState, useEffect } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { spacing, layout, borderRadius } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();
  
  // Get theme colors
  const primaryColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  // Clear any auth errors when component unmounts
  useEffect(() => {
    return () => {
      if (error) clearError();
    };
  }, [error, clearError]);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    try {
      await login(email, password);
      // The navigation will be handled by the AuthContext after successful login
    } catch (error: any) {
      // Error is handled in the AuthContext
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Image 
              source={require('@/assets/images/logo-placeholder.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText variant="displaySmall" style={styles.title}>
              Welcome Back
            </ThemedText>
            <ThemedText variant="bodyMedium" style={{ color: textSecondaryColor }}>
              Login to your teacher account
            </ThemedText>
          </View>

          {error && (
            <ThemedView 
              style={styles.errorContainer}
              lightColor="#FFEBEE"
            >
              <ThemedText 
                variant="bodySmall" 
                style={{ color: errorColor }}
              >
                {error}
              </ThemedText>
            </ThemedView>
          )}

          <View style={styles.formContainer}>
            <Input
              label="Email Address"
              leftIcon="mail-outline"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Password"
              leftIcon="lock-closed-outline"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <ThemedText 
                variant="labelSmall" 
                style={{ color: primaryColor }}
              >
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            <Button
              variant="primary"
              size="lg"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            >
              Login
            </Button>
          </View>

          <View style={styles.termsContainer}>
            <ThemedText 
              variant="caption" 
              style={styles.termsText}
            >
              By logging in, you agree to our{' '}
              <ThemedText 
                variant="caption" 
                style={{ color: primaryColor }}
              >
                Terms of Service
              </ThemedText> and{' '}
              <ThemedText 
                variant="caption" 
                style={{ color: primaryColor }}
              >
                Privacy Policy
              </ThemedText>
            </ThemedText>
          </View>

          <View style={styles.footer}>
            <ThemedText variant="bodyMedium">
              Don't have an account?{' '}
            </ThemedText>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <ThemedText 
                  variant="labelLarge" 
                  style={{ color: primaryColor }}
                >
                  Register
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing[40],
    paddingBottom: spacing[40],
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  formContainer: {
    marginBottom: spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  termsContainer: {
    marginBottom: spacing.xl,
  },
  termsText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
});