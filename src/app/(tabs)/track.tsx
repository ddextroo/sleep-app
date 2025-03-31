import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, PieChart, ProgressChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import {
  Moon,
  Sun,
  Clock,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SleepTrackingFAB from "~/components/home/track/SlideButton";

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

  const data = [
    {
      name: "Deep",
      percentage: 28,
      color: "#954CE9",
      legendFontColor: "#954CE9",
      legendFont: "font-sans",
    },
    {
      name: "REM",
      percentage: 22,
      color: "#7B68EE",
      legendFontColor: "#7B68EE",
      legendFont: "font-sans",
    },
    {
      name: "Light",
      percentage: 50,
      color: "#B19CD9",
      legendFontColor: "#B19CD9",
      legendFont: "font-sans",
    },
  ];

  const sleepQuality = 85;
  const averageSleepTime = "7h 35m";
  const duration = "7h 35m";
  const bedtime = "10:45 PM";
  const wakeup = "6:20 AM";

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleStartSleepTracking = () => {
    console.log("Sleep tracking started!");
    // Add your sleep tracking logic here
  };

  const navigateDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <LinearGradient
      colors={["#121212", "#1E1E30", "#231B36", "#1E1E30", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6">
          <View className="mt-8 mb-6 flex-row justify-between items-center">
            <Text className="text-foreground font-sans-bold text-3xl py-5">
              Sleep Insights
            </Text>
            <TouchableOpacity onPress={handleStartSleepTracking}>
              <Moon size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Date Navigation */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => navigateDate(-1)} className="p-2">
              <ChevronLeft size={24} color="#954CE9" />
            </TouchableOpacity>
            <Text className="text-foreground text-lg font-sans">
              {formatDate(selectedDate)}
            </Text>
            <TouchableOpacity onPress={() => navigateDate(1)} className="p-2">
              <ChevronRight size={24} color="#954CE9" />
            </TouchableOpacity>
          </View>

          <View className="rounded-2xl p-5 mb-6">
            {/* Main duration display */}
            <View className="items-center pt-2">
              <Text className="text-gray-400 text-sm font-sans mb-2">
                TOTAL SLEEP
              </Text>
              <View className="flex-row items-center">
                <Text className="text-[#954CE9] text-4xl font-sans-bold">
                  {duration}
                </Text>
              </View>
            </View>

            {/* Sleep timeline */}
            <View className="flex-row justify-between items-center px-6 py-2">
              <View className="items-center">
                <View className="bg-[#2D2D2D] p-2 rounded-full mb-1">
                  <Moon size={20} color="#954CE9" />
                </View>
                <Text className="text-gray-400 text-sm font-sans">Bedtime</Text>
                <Text className="text-white text-md font-sans-medium">
                  {bedtime}
                </Text>
              </View>

              {/* Timeline line */}
              <View className="flex-1 h-[2px] bg-[#2D2D2D] mx-2">
                <View
                  className="h-full bg-[#954CE9]"
                  style={{ width: "100%" }}
                />
              </View>

              <View className="items-center">
                <View className="bg-[#2D2D2D] p-2 rounded-full mb-1">
                  <Sun size={20} color="#954CE9" />
                </View>
                <Text className="text-gray-400 text-xs font-sans">Wake Up</Text>
                <Text className="text-white text-sm font-sans-medium">
                  {wakeup}
                </Text>
              </View>
            </View>
          </View>

          {/* Sleep Score Card */}
          <View className="rounded-3xl p-6 mb-6">
            {/* Header with Sleep Score */}
            <View className="flex-row justify-between items-center">
              <Text className="text-foreground text-lg font-sans-bold">
                Sleep Analysis
              </Text>
              <View className="bg-[#954CE9] rounded-full px-3 py-1">
                <Text className="text-foreground font-sans-medium">
                  {sleepQuality}%
                </Text>
              </View>
            </View>

            {/* Centered Pie Chart */}
            <View className="flex items-center w-full">
              <PieChart
                data={data}
                width={screenWidth * 0.7}
                height={180}
                hasLegend={false}
                chartConfig={{
                  backgroundColor: "#1E1E1E",
                  backgroundGradientFrom: "#1E1E1E",
                  backgroundGradientTo: "#1E1E1E",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                accessor={"percentage"}
                backgroundColor={"transparent"}
                paddingLeft={"70"}
                absolute
              />
            </View>

            {/* Enhanced Legend */}
            <View className="flex-row justify-around px-2">
              {data.map((item, index) => (
                <View key={index} className="items-center text-center">
                  <View className="flex-row items-center mb-1">
                    <View
                      className="h-3 w-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className="text-foreground font-sans">
                      {item.name}
                    </Text>
                  </View>
                  <Text className="text-foreground font-sans-bold">
                    {item.percentage}%
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Weekly Sleep Chart */}
          <View className="rounded-3xl p-6 mb-6">
            <Text className="text-foreground text-lg font-sans-bold mb-4">
              Weekly Sleep
            </Text>

            <LineChart
              data={sleepData}
              width={screenWidth - 60}
              height={180}
              chartConfig={{
                backgroundColor: "transparent",
                backgroundGradientFrom: "transparent",
                backgroundGradientTo: "transparent",
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
                fillShadowGradient: "rgba(149, 76, 233, 0.2)",
                fillShadowGradientOpacity: 0.2,
              }}
              bezier
              style={{
                marginVertical: 8,
                marginHorizontal: -20,
                borderRadius: 16,
                backgroundColor: "transparent",
              }}
              withShadow={false}
              transparent={true}
            />

            <View className="flex-row justify-between mt-2">
              <View className="items-center">
                <Text className="text-gray-400 text-xs font-sans">
                  Avg. Sleep
                </Text>
                <Text className="text-foreground font-semibold font-sans">
                  {averageSleepTime}
                </Text>
              </View>

              <View className="items-center">
                <Text className="text-gray-400 text-xs font-sans">
                  Best Day
                </Text>
                <Text className="text-foreground font-semibold font-sans">
                  Sat (9.2h)
                </Text>
              </View>

              <View className="items-center">
                <Text className="text-gray-400 text-xs font-sans">
                  Worst Day
                </Text>
                <Text className="text-foreground font-semibold font-sans">
                  Fri (6.5h)
                </Text>
              </View>
            </View>
          </View>

          {/* Sleep Tracking */}
          {/* <View className="rounded-3xl p-6 mb-8">
            <Text className="text-foreground text-lg font-sans-bold mb-4">
              Track Tonight's Sleep
            </Text>

            <View className="flex-row justify-between mb-4">
              <TouchableOpacity className=" rounded-xl p-4 flex-1 mr-2 items-center">
                <Clock size={24} color="#954CE9" />
                <Text className="text-foreground mt-2 font-sans">Bedtime</Text>
                <Text className="text-[#954CE9] font-bold mt-1 font-sans">
                  10:30 PM
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className=" rounded-xl p-4 flex-1 ml-2 items-center">
                <Sun size={24} color="#954CE9" />
                <Text className="text-foreground mt-2 font-sans">Wake Up</Text>
                <Text className="text-[#954CE9] font-bold mt-1 font-sans">
                  6:45 AM
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
