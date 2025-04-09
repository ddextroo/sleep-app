import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";

export default function MenuItem({ icon, title }) {
  return (
    <TouchableOpacity className="p-4 border-b border-muted flex flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-x-3">
        {icon}
        <Text className="font-sans text-foreground">{title}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );
}
