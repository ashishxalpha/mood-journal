/**
 * Root Layout Component
 * Sets up the navigation structure and theme for the app
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  const { checkAuth } = useAuthStore();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: '#FAFAFA',
              },
            }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="chatbot" options={{ presentation: 'modal' }} />
            <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
            <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
            <Stack.Screen name="about" options={{ presentation: 'modal' }} />
            <Stack.Screen name="journal/[id]" options={{ presentation: 'card' }} />
          </Stack>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
