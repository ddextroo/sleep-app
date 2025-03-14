// import React from "react";
// import { Text, View } from "react-native";
// import { SafeAreaView } from "react-native";

// export default function TrackScreen() {
//   return (
//     <SafeAreaView className="bg-background">
//       <View className="h-full flex flex-col justify-center items-center">
//         <Text className="text-foreground text-center">Track Screen</Text>
//       </View>
//     </SafeAreaView>
//   );
// }

import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import {
  Moon,
  Sun,
  Clock,
  Activity,
  ChevronLeft,
  ChevronRight,
  CloudMoon,
} from "lucide-react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const screenWidth = Dimensions.get("window").width;

export default function TrackScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample sleep data
  const sleepData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [7.2, 6.8, 8.1, 7.5, 6.5, 9.2, 7.8],
        color: (opacity = 1) => `rgba(149, 76, 233, ${opacity})`, // Violet color
        strokeWidth: 2,
      },
    ],
  };

  const sleepQuality = 85;
  const averageSleepTime = "7h 35m";
  const deepSleepPercentage = 28;
  const remSleepPercentage = 22;
  const lightSleepPercentage = 50;

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const navigateDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView className="flex-1 px-6">
        <View className="mt-8 mb-6 flex-row justify-between items-center">
          <Text className="text-foreground font-sans-bold text-3xl">
            Sleep Insights
          </Text>
          <View className="">
            <FontAwesome6 name="cloud-moon" size={30} color="#954CE9" />
          </View>
        </View>

        {/* Date Navigation */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => navigateDate(-1)} className="p-2">
            <ChevronLeft size={24} color="#954CE9" />
          </TouchableOpacity>
          <Text className="text-foreground text-lg font-sans">{formatDate(selectedDate)}</Text>
          <TouchableOpacity onPress={() => navigateDate(1)} className="p-2">
            <ChevronRight size={24} color="#954CE9" />
          </TouchableOpacity>
        </View>

        {/* Sleep Score Card */}
        <View className="bg-[#1E1E1E] rounded-3xl p-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-foreground text-lg font-sans-bold">
              Sleep Score
            </Text>
            <View className="bg-[#954CE9] rounded-full px-3 py-1">
              <Text className="text-foreground font-sans-medium">{sleepQuality}%</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center">
              <Clock size={18} color="#954CE9" />
              <Text className="text-foreground ml-2 font-sans">Duration</Text>
            </View>
            <Text className="text-foreground font-semibold font-sans">{averageSleepTime}</Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center">
              <Moon size={18} color="#954CE9" />
              <Text className="text-foreground ml-2 font-sans">Deep Sleep</Text>
            </View>
            <Text className="text-foreground font-sans">
              {deepSleepPercentage}%
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center">
              <Activity size={18} color="#954CE9" />
              <Text className="text-foreground ml-2 font-sans">REM Sleep</Text>
            </View>
            <Text className="text-foreground font-sans">
              {remSleepPercentage}%
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <Sun size={18} color="#954CE9" />
              <Text className="text-foreground ml-2 font-sans">Light Sleep</Text>
            </View>
            <Text className="text-foreground font-sans">
              {lightSleepPercentage}%
            </Text>
          </View>
        </View>

        {/* Sleep Stages Visualization */}
        <View className="bg-[#1E1E1E] rounded-3xl p-6 mb-6">
          <Text className="text-foreground text-lg font-sans-bold mb-4">
            Sleep Stages
          </Text>

          <View className="mb-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-400 font-sans">Deep</Text>
              <Text className="text-foreground font-sans">{deepSleepPercentage}%</Text>
            </View>
            <View className="h-3 bg-[#2D2D2D] rounded-full overflow-hidden">
              <View
                className="h-full bg-[#954CE9]"
                style={{ width: `${deepSleepPercentage}%` }}
              />
            </View>
          </View>

          <View className="mb-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-400 font-sans">REM</Text>
              <Text className="text-foreground font-sans">{remSleepPercentage}%</Text>
            </View>
            <View className="h-3 bg-[#2D2D2D] rounded-full overflow-hidden">
              <View
                className="h-full bg-[#7B68EE]"
                style={{ width: `${remSleepPercentage}%` }}
              />
            </View>
          </View>

          <View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-400 font-sans">Light</Text>
              <Text className="text-foreground font-sans">{lightSleepPercentage}%</Text>
            </View>
            <View className="h-3 bg-[#2D2D2D] rounded-full overflow-hidden">
              <View
                className="h-full bg-[#B19CD9]"
                style={{ width: `${lightSleepPercentage}%` }}
              />
            </View>
          </View>
        </View>

        {/* Weekly Sleep Chart */}
        <View className="bg-[#1E1E1E] rounded-3xl p-6 mb-6">
          <Text className="text-foreground text-lg font-sans-bold mb-4">
            Weekly Sleep
          </Text>

          {/* <View className="-ml-8"> */}
            <LineChart
              data={sleepData}
              width={screenWidth - 60}
              height={180}
            
              chartConfig={{
                backgroundColor: "#1E1E1E",
                backgroundGradientFrom: "#1E1E1E",
                backgroundGradientTo: "#1E1E1E",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#954CE9",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                marginHorizontal:-20,
                borderRadius: 16,
              }}
            />
          {/* </View> */}

          <View className="flex-row justify-between mt-2">
            <View className="items-center">
              <Text className="text-gray-400 text-xs font-sans">Avg. Sleep</Text>
              <Text className="text-foreground font-semibold font-sans">
                {averageSleepTime}
              </Text>
            </View>

            <View className="items-center">
              <Text className="text-gray-400 text-xs font-sans">Best Day</Text>
              <Text className="text-foreground font-semibold font-sans">Sat (9.2h)</Text>
            </View>

            <View className="items-center">
              <Text className="text-gray-400 text-xs font-sans">Worst Day</Text>
              <Text className="text-foreground font-semibold font-sans">Fri (6.5h)</Text>
            </View>
          </View>
        </View>

        {/* Sleep Tracking */}
        <View className="bg-[#1E1E1E] rounded-3xl p-6 mb-8">
          <Text className="text-foreground text-lg font-sans-bold mb-4">
            Track Tonight's Sleep
          </Text>

          <View className="flex-row justify-between mb-4">
            <TouchableOpacity className="bg-[#2D2D2D] rounded-xl p-4 flex-1 mr-2 items-center">
              <Clock size={24} color="#954CE9" />
              <Text className="text-foreground mt-2 font-sans">Bedtime</Text>
              <Text className="text-[#954CE9] font-bold mt-1 font-sans">10:30 PM</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-[#2D2D2D] rounded-xl p-4 flex-1 ml-2 items-center">
              <Sun size={24} color="#954CE9" />
              <Text className="text-foreground mt-2 font-sans">Wake Up</Text>
              <Text className="text-[#954CE9] font-bold mt-1 font-sans">6:45 AM</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-[#954CE9] rounded-xl py-4 items-center">
            <Text className="text-foreground text-lg font-sans-medium">
              Start Sleep Tracking
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
