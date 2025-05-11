import "./globals.css";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/toastConfig";
import { View } from "react-native";
import { Colors } from "@/constants/Colors";

function AppContent() {
  const { resolvedTheme } = useTheme();
  const colors = Colors[resolvedTheme];

  return (
    <SafeAreaProvider>
      <View style={{ 
        flex: 1, 
        backgroundColor: colors.background,
      }}>
        <View style={{
          flex: 1,
          backgroundColor: colors.backgroundSecondary,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Stack screenOptions={{ 
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.backgroundSecondary
            }
          }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </Stack>
        </View>
      </View>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <Toast />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
