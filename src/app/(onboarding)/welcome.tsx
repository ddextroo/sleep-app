import { View, Text } from "react-native";
import React from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
  const completeOnboarding = async () => {
    await AsyncStorage.setItem("onboarding", "true");
    router.replace("/(auth)/login");
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-col">
        <View className="h-1/2 bg-gray-200 p-4">
          <Text>Left Half</Text>
        </View>
        <View className="h-1/2 bg-gray-400 p-4">
          <Text>Right Half</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
