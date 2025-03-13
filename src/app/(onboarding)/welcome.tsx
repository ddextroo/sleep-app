import { View, Text } from "react-native";
import React from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Welcome() {
  const completeOnboarding = async () => {
    await AsyncStorage.setItem("onboarding", "true");
    router.replace("/(auth)/login");
  };
  return (
    <View>
      <Text>Welcome</Text>
    </View>
  );
}
