import "../global.css";
import { Slot, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { supabase } from "./utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
  });

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const onboarded = await AsyncStorage.getItem("onboarded");

      if (!onboarded) {
        router.replace("/(onboarding)/welcome");
      } else if (!session) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/(app)/home");
      }
      setInitialized(true);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialized]);

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </View>
  );
}
