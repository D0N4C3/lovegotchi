import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

function RootLayoutNav() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const nav = useRootNavigationState();

  useEffect(() => {
    if (!nav?.key || loading) return;
    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";

    if (!profile && !inAuth) router.replace("/(auth)/welcome");
    else if (profile && !profile.partnerId && !inOnboarding) router.replace("/(onboarding)/partner");
    else if (profile && profile.partnerId && !profile.onboardingCompleted && !inOnboarding) router.replace("/(onboarding)/shared");
    else if (profile?.onboardingCompleted && (inAuth || inOnboarding)) router.replace("/(tabs)");
  }, [profile, loading, segments, nav?.key]);

  return <Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(auth)" /><Stack.Screen name="(onboarding)" /><Stack.Screen name="(tabs)" /></Stack>;
}

export default function RootLayout() {
  useEffect(() => { SplashScreen.hideAsync(); }, []);
  return <QueryClientProvider client={queryClient}><GestureHandlerRootView style={{ flex: 1 }}><StatusBar style="light" /><ToastProvider><AuthProvider><RootLayoutNav /></AuthProvider></ToastProvider></GestureHandlerRootView></QueryClientProvider>;
}
