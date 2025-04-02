"use client"
import { useState, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { ChevronLeft, Moon, Clock, Coffee, Wind, BookOpen, ChevronDown, ChevronUp, Check } from "lucide-react-native"
import { router } from "expo-router"

const SleepMethodCard = ({ title, icon, description, tips, index }) => {
  const [expanded, setExpanded] = useState(false)
  const [completed, setCompleted] = useState(false)
  const animatedHeight = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.98)).current

  const IconComponent = icon

  const toggleExpand = () => {
    const newExpanded = !expanded
    setExpanded(newExpanded)

    // Animate height and opacity
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: newExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: newExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: newExpanded ? 1 : 0.98,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }

  // Calculate animation delay based on index for staggered effect
  const animationDelay = index * 100

  return (
    <Animated.View
      style={{
        opacity: 1,
        transform: [{ scale: 1 }],
        marginBottom: 16,
      }}
    >
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.9} className="bg-[#1E1E30] rounded-xl overflow-hidden">
        <View className="p-5">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-x-3">
              <View className="w-10 h-10 bg-[#2A2A40] rounded-full items-center justify-center">
                <IconComponent size={20} color="#8A7CFF" />
              </View>
              <Text className="text-white font-sans-semibold text-lg flex-1">{title}</Text>
            </View>
            <View className="flex-row items-center gap-x-3">
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation()
                  setCompleted(!completed)
                }}
                className={`w-6 h-6 rounded-full items-center justify-center ${completed ? "bg-[#8A7CFF]" : "border border-[#8A7CFF]"}`}
              >
                {completed && <Check size={14} color="#FFFFFF" />}
              </TouchableOpacity>
              {expanded ? <ChevronUp size={20} color="#8A7CFF" /> : <ChevronDown size={20} color="#8A7CFF" />}
            </View>
          </View>

          <Animated.View
            style={{
              maxHeight: animatedHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 500], // Adjust based on content
              }),
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              overflow: "hidden",
            }}
          >
            <View className="mt-4">
              <Text className="text-gray-300 font-sans mb-4">{description}</Text>
              <View className="bg-[#2A2A40] rounded-lg p-4">
                <Text className="text-white font-sans-medium mb-3">Tips:</Text>
                {tips.map((tip, index) => (
                  <View key={index} className="flex-row mb-2 last:mb-0">
                    <Text className="text-[#8A7CFF] mr-2">•</Text>
                    <Text className="text-gray-300 font-sans flex-1">{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const ProgressIndicator = ({ steps, currentStep }) => {
  return (
    <View className="flex-row justify-between items-center mb-6 px-2">
      {Array.from({ length: steps }).map((_, index) => (
        <View key={index} className="flex-1 flex-row items-center">
          <View
            className={`w-6 h-6 rounded-full items-center justify-center ${
              index < currentStep ? "bg-[#8A7CFF]" : "bg-[#2A2A40]"
            }`}
          >
            {index < currentStep ? (
              <Check size={14} color="#FFFFFF" />
            ) : (
              <Text className="text-white text-xs">{index + 1}</Text>
            )}
          </View>
          {index < steps - 1 && (
            <View className={`flex-1 h-1 ${index < currentStep - 1 ? "bg-[#8A7CFF]" : "bg-[#2A2A40]"}`} />
          )}
        </View>
      ))}
    </View>
  )
}

const HowToSleep = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const scrollViewRef = useRef(null)

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
        <ScrollView ref={scrollViewRef} className="px-5 py-5" showsVerticalScrollIndicator={false}>
          <View className="flex flex-row items-center gap-x-5 mb-5">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="p-1">
                <ChevronLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="text-white font-sans-bold text-3xl">How to Sleep Better</Text>
          </View>

          <View className="bg-[#2A2A40] p-5 rounded-xl mb-6">
            <Text className="text-gray-300 font-sans italic">
              "Sleep is the golden chain that ties health and our bodies together." - Thomas Dekker
            </Text>
          </View>

          <ProgressIndicator steps={5} currentStep={currentStep} />

          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-white font-sans-semibold text-xl">Sleep Methods</Text>
            <TouchableOpacity
              onPress={() => setCurrentStep((prev) => Math.min(prev + 1, 5))}
              className="bg-[#2A2A40] px-4 py-2 rounded-full"
            >
              <Text className="text-[#8A7CFF] font-sans-medium">Track Progress</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-gray-400 font-sans mb-5">Tap on each method to learn more and track your progress</Text>

          {sleepMethods.map((method, index) => (
            <SleepMethodCard
              key={index}
              index={index}
              title={method.title}
              icon={method.icon}
              description={method.description}
              tips={method.tips}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default HowToSleep

