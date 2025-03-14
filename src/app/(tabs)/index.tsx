import { View, Text, SafeAreaView } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-background">
      <View className="h-full flex flex-col justify-center items-center">
        <Text className="text-foreground text-center">Home Screen</Text>
      </View>
    </SafeAreaView>
  );
}