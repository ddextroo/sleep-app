import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native";

export default function Profile() {
  return (
    <SafeAreaView className={`flex-1 bg-background justify-center items-center`}>
      <Text className={`text-white text-lg`}>Profile here! 🎉</Text>
    </SafeAreaView>
  );
}
