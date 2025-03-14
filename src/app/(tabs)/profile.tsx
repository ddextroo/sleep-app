import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native";

export default function Profile() {
  return (
    <SafeAreaView className="bg-background">
      <View className="h-full flex flex-col justify-center items-center">
        <Text className="text-foreground text-center">Profile Screen</Text>
      </View>
    </SafeAreaView>
  );
}
