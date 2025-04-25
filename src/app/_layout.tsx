import "../global.css";
import { Slot, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, Text, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { supabase } from "./utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnboardingStore } from "./store/authStore";
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const { session, onboardingComplete, initAuth } = useOnboardingStore();
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("./../assets/fonts/Poppins-Medium.ttf"),
  });

  useEffect(() => {
    const checkAuth = async () => {
      await initAuth();

      // First check if onboarding is complete
      if (!onboardingComplete) {
        router.replace("/(onboarding)/welcome");
      }
      // Then check if user is authenticated
      else if (session) {
        router.replace("/(tabs)");
      }
      // If onboarding is complete but not authenticated, go to login
      else {
        router.replace("/(auth)/login");
      }

      setInitialized(true);
    };

    checkAuth();
  }, [onboardingComplete]);

  useEffect(() => {
    if (fontsLoaded && initialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialized]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Slot />
    </>
  );
}
