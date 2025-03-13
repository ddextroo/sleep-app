import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function Page() {
  return (
    <View>
      <Text className="text-lg">This uses Poppins-Regular by default</Text>
      <Text className="font-sans-bold text-lg">Bold text</Text>
      <Text className="font-sans-medium text-lg">Medium text</Text>
    </View>
  );
}
