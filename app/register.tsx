import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ROLES = ['FACULTY', 'STAFF', 'ADMIN'];

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('FACULTY'); // Default role
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { register, isLoading, error, clearError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = async () => {
    // Clear any previous errors
    clearError();
    setLocalError(null);
    
    if (!email || !password || !name || !role) {
      setLocalError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(email, password, name, role);
    } catch (err: any) {
      console.error('Registration error:', err);
      setLocalError(err.message || 'Registration failed. Please try again.');
    }
  };

  // Clear any auth errors when component unmounts
  useEffect(() => {
    return () => {
      if (error) clearError();
    };
  }, [error, clearError]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const toggleSecureConfirmEntry = () => {
    setSecureConfirmTextEntry(!secureConfirmTextEntry);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Image 
            source={require('@/assets/images/nit_logo.png')} 
            className='w-40 h-40 mb-4'
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the Campus Connect teacher community</Text>
        </View>

        {(localError || error) && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{localError || error}</Text>
            <TouchableOpacity 
              onPress={() => {
                setLocalError(null);
                clearError();
              }}
              style={styles.errorDismiss}
            >
              <Ionicons name="close" size={20} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={22} color="#687076" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9BA1A6"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={22} color="#687076" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9BA1A6"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Role Selection Dropdown */}
          <TouchableOpacity 
            style={styles.inputWrapper}
            onPress={() => setShowRoleModal(true)}
            disabled={isLoading}
          >
            <Ionicons name="people-outline" size={22} color="#687076" style={styles.inputIcon} />
            <View style={styles.dropdownContainer}>
              <Text style={[styles.roleDisplay, !role && styles.placeholderText]}>
                {role || "Select Role"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={22} color="#687076" style={styles.dropdownIcon} />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={22} color="#687076" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 chars)"
              placeholderTextColor="#9BA1A6"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
              <Ionicons 
                name={secureTextEntry ? "eye-outline" : "eye-off-outline"} 
                size={22} 
                color="#687076" 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#687076" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#9BA1A6"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirmTextEntry}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={toggleSecureConfirmEntry} style={styles.eyeIcon}>
              <Ionicons 
                name={secureConfirmTextEntry ? "eye-outline" : "eye-off-outline"} 
                size={22} 
                color="#687076" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By registering, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      {/* Role Selection Modal */}
      <Modal
        visible={showRoleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Role</Text>
              <TouchableOpacity 
                onPress={() => setShowRoleModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#687076" />
              </TouchableOpacity>
            </View>
            
            {ROLES.map((roleOption) => (
              <TouchableOpacity
                key={roleOption}
                style={[
                  styles.roleOption,
                  role === roleOption && styles.selectedRoleOption
                ]}
                onPress={() => {
                  setRole(roleOption);
                  setShowRoleModal(false);
                }}
              >
                <Text 
                  style={[
                    styles.roleText,
                    role === roleOption && styles.selectedRoleText
                  ]}
                >
                  {roleOption}
                </Text>
                {role === roleOption && (
                  <Ionicons name="checkmark" size={22} color={Colors.light.tint} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#687076',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#E6E8EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#11181C',
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  errorDismiss: {
    padding: 8,
  },
  registerButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    color: '#687076',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.light.tint,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#687076',
    fontSize: 16,
  },
  loginLink: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    flex: 1,
  },
  dropdownContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  placeholderText: {
    color: '#9BA1A6',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E8EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  closeButton: {
    padding: 4,
  },
  roleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
  },
  selectedRoleOption: {
    backgroundColor: '#F8F9FA',
  },
  roleText: {
    fontSize: 16,
    color: '#11181C',
  },
  selectedRoleText: {
    color: Colors.light.tint,
    fontWeight: '500',
  },
  roleDisplay: {
    fontSize: 16,
    color: '#11181C',
    textAlignVertical: 'center',
  },
});