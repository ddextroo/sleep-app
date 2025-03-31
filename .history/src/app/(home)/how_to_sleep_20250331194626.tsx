"use client"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { ChevronLeft,Moon,Clock, Coffee, Wind, Music, BookOpen, ChevronDown, ChevronUp, Check,} from "lucide-react-native";
import { router } from 'expo-router';

const SleepMethodCard = ({ title, icon, description, tips }) => {
  const [expanded, setExpanded] = useState(false)
  const [completed, setCompleted] = useState(false)

  const IconComponent = icon

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.9}
      className="bg-[#1E1E30] rounded-xl mb-4 overflow-hidden"
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-[#2A2A40] rounded-full items-center justify-center mr-3">
              <IconComponent size={20} color="#8A7CFF" />
            </View>
            <Text className="text-white font-sans-semibold text-lg flex-1">{title}</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation()
                setCompleted(!completed)
              }}
              className={`w-6 h-6 rounded-full mr-3 items-center justify-center ${completed ? "bg-[#8A7CFF]" : "border border-[#8A7CFF]"}`}
            >
              {completed && <Check size={14} color="#FFFFFF" />}
            </TouchableOpacity>
            {expanded ? <ChevronUp size={20} color="#8A7CFF" /> : <ChevronDown size={20} color="#8A7CFF" />}
          </View>
        </View>

        {expanded && (
          <View className="mt-3">
            <Text className="text-gray-300 font-sans mb-3">{description}</Text>
            <View className="bg-[#2A2A40] rounded-lg p-3">
              <Text className="text-white font-sans-medium mb-2">Tips:</Text>
              {tips.map((tip, index) => (
                <View key={index} className="flex-row mb-2 last:mb-0">
                  <Text className="text-[#8A7CFF] mr-2">•</Text>
                  <Text className="text-gray-300 font-sans flex-1">{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const HowToSleep = () => {
  const sleepMethods = [
    {
      title: "Create a Bedtime Routine",
      icon: Moon,
      description:
        "A consistent bedtime routine signals to your body that it's time to wind down and prepare for sleep.",
      tips: [
        "Take a warm bath or shower before bed",
        "Read a book or listen to calming music",
        "Avoid screens at least 30 minutes before bed",
        "Practice gentle stretching or yoga",
      ],
    },
    {
      title: "Optimize Your Environment",
      icon: Wind,
      description:
        "Your sleep environment plays a crucial role in how quickly you fall asleep and the quality of your rest.",
      tips: [
        "Keep the room cool (18°C - 22°C)",
        "Use blackout curtains or an eye mask",
        "Reduce noise with earplugs or white noise",
        "Choose a comfortable mattress and pillow",
      ],
    },
    {
      title: "Maintain Consistent Schedule",
      icon: Clock,
      description:
        "Keeping a regular sleep schedule helps regulate your body's internal clock and can help you fall asleep and wake up more easily.",
      tips: [
        "Go to bed and wake up at the same time daily",
        "Avoid long naps (keep under 30 minutes)",
        "Get morning sunlight to reset your circadian rhythm",
        "Create weekend routines similar to weekdays",
      ],
    },
    {
      title: "Watch Your Diet",
      icon: Coffee,
      description:
        "What you eat and drink, especially in the hours before bedtime, can impact your sleep quality significantly.",
      tips: [
        "Avoid caffeine after 2pm",
        "Skip alcohol close to bedtime",
        "Eat a light dinner at least 2-3 hours before bed",
        "Try calming herbal teas like chamomile",
      ],
    },
    {
      title: "Manage Stress & Anxiety",
      icon: BookOpen,
      description:
        "Mental activity is one of the main causes of insomnia. Learning to quiet your mind can help improve sleep quality.",
      tips: [
        "Practice deep breathing or meditation",
        "Keep a journal to write down worries",
        "Try progressive muscle relaxation",
        "Use guided imagery or visualization",
      ],
    },
  ]

  return (
    <LinearGradient
      colors={["#121212", "#1E1E30", "#231B36", "#1E1E30", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="px-5 py-5">
          <View className="flex-row items-center mb-2">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="p-1">
                <ChevronLeft color="white"/>
              </View>
            </TouchableOpacity>
            <Text className="text-white font-sans-bold text-2xl">How to Sleep Better</Text>
          </View>

          <View className="bg-[#2A2A40] p-4 rounded-xl mb-6">
            <Text className="text-gray-300 font-sans italic">
              "Sleep is the golden chain that ties health and our bodies together." - Thomas Dekker
            </Text>
          </View>

          <Text className="text-white font-sans-semibold text-xl mb-3">Sleep Methods</Text>
          <Text className="text-gray-400 font-sans mb-4">Tap on each method to learn more and track your progress</Text>

          {sleepMethods.map((method, index) => (
            <SleepMethodCard
              key={index}
              title={method.title}
              icon={method.icon}
              description={method.description}
              tips={method.tips}
            />
          ))}


          <View className="bg-[#1E1E30] rounded-xl p-4 mb-4">
            <Text className="text-white font-sans-semibold text-lg mb-3">Tonight's Recommendation</Text>
            <View className="bg-[#2A2A40] rounded-lg p-3 flex-row items-center">
              <View className="w-12 h-12 bg-[#3D3D5C] rounded-lg items-center justify-center mr-3">
                <Music size={24} color="#8A7CFF" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-sans-medium">Deep Sleep Meditation</Text>
                <Text className="text-gray-400 font-sans">20 minutes • Guided</Text>
              </View>
              <TouchableOpacity className="bg-[#8A7CFF] w-10 h-10 rounded-full items-center justify-center">
                <Text className="text-white">▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default HowToSleep

