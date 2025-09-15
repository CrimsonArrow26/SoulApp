import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '@/hooks/auth-store';
import { ChatProvider } from '@/hooks/chat-store';
import { Platform, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      <Stack.Screen name="introduction" options={{ headerShown: false }} />
      <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
      <Stack.Screen name="interests-setup" options={{ headerShown: false }} />
      <Stack.Screen name="mode-selection" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="discover" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const isWeb = Platform.OS === 'web';
  const containerStyle = isWeb
    ? { flex: 1, backgroundColor: 'white', alignItems: 'center' as const, paddingTop: 24, paddingBottom: 24, minHeight: '100vh' as any }
    : { flex: 1 };
  const appFrameStyle = isWeb
    ? { flex: 1, width: 430, maxWidth: 430, alignSelf: 'center' as const }
    : { flex: 1 };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <View style={containerStyle}>
            <GestureHandlerRootView style={appFrameStyle}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </View>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}