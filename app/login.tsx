import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';

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

  const { width } = Dimensions.get('window');

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-grow px-6 pt-10 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-8">
            <Image 
              source={require('@/assets/images/nit_logo.png')} 
              className="w-40 h-40 mb-4"
              resizeMode="contain"
            />
            <Text 
              className="text-[28px] font-bold mb-2 text-gray-800"
            >
              Welcome Back
            </Text>
            <Text 
              className="text-gray-600"
            >
              Login to your teacher account
            </Text>
          </View>

          {error && (
            <View 
              className="rounded-md p-4 mb-5 border-l-4 border-l-[#D32F2F] bg-red-50"
            >
              <Text 
                className="text-red-600"
              >
                {error}
              </Text>
            </View>
          )}

          <View className="mb-8 px-3">
            <Input
              label="Email Address"
              leftIcon="mail-outline"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className=''
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

            <TouchableOpacity className="self-end mb-4 mt-1">
              <Text 
                className="text-sky-600"
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              variant="primary"
              size="lg"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={{ marginTop: 16,
                backgroundColor: '#0369a1',
              }}
            >
              Login
            </Button>
          </View>

          <View className="mb-8">
            <Text 
              className="text-center leading-5 text-gray-600"
            >
              By logging in, you agree to our{' '}
              <Text 
                className="text-sky-600"
              >
                Terms of Service
              </Text> and{' '}
              <Text 
                className="text-sky-600"
              >
                Privacy Policy
              </Text>
            </Text>
          </View>

          <View className="flex-row justify-center items-center">
            <Text className="text-gray-700">
              Don't have an account?{' '}
            </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text 
                  className="text-sky-600 font-semibold"
                >
                  Register
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}