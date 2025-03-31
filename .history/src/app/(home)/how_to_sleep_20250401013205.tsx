"use client"
import { useRef, useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { ChevronLeft, Moon, Clock, Coffee, Wind, BookOpen, ChevronDown, ChevronUp } from "lucide-react-native"
import { router } from "expo-router"
import { useSleepStore } from "../store/"
import { CongratulationsDialog } from "./components/congratulations-dialog"

const AnimatedProgressLine = ({ steps, completedSteps, currentStep }) => {
  const animatedValues = useRef(steps.map(() => new Animated.Value(0))).current

  useEffect(() => {
    // Animate the progress line when currentStep changes
    Animated.stagger(
      150,
      animatedValues.map((anim, index) =>
        Animated.timing(anim, {
          toValue: index < currentStep ? 1 : 0,
          duration: 400,
          useNativeDriver: true, // This is fine for opacity and transforms
        }),
      ),
    ).start()
  }, [currentStep, animatedValues])

  return (
    <View className="absolute left-[29px] top-0 bottom-0 w-1 z-0">
      {steps.map((_, index) => {
        if (index === steps.length - 1) return null // No line after last item

        const lineHeight = 84 // Approximate distance between icons

        return (
          <View
            key={index}
            style={{
              position: "absolute",
              top: 30 + index * lineHeight,
              height: lineHeight,
              width: 2,
              backgroundColor: "#2A2A40",
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#8A7CFF",
                transform: [
                  {
                    scaleY: animatedValues[index],
                  },
                ],
                opacity: animatedValues[index],
              }}
            />
          </View>
        )
      })}
    </View>
  )
}

const SleepMethodCard = ({ title, icon, description, tips, index }) => {
  const { expandedIndex, toggleExpanded, completeStep } = useSleepStore()
  const expanded = expandedIndex === index
  const IconComponent = icon

  // Use state for height instead of animated value
  const [contentHeight, setContentHeight] = useState(0)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Measure content height
  const [measuredHeight, setMeasuredHeight] = useState(0)
  const contentRef = useRef(null)

  useEffect(() => {
    // Animate opacity
    Animated.timing(fadeAnim, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true, // This is fine for opacity
    }).start()

    // Set height based on expanded state
    setContentHeight(expanded ? measuredHeight : 0)

    // Mark step as completed when expanded
    if (expanded) {
      completeStep(index)
    }
  }, [expanded, index, completeStep, measuredHeight])

  return (
    <TouchableOpacity
      onPress={() => toggleExpanded(index)}
      activeOpacity={0.9}
      className="bg-[#1E1E30] rounded-xl mb-4 overflow-hidden relative z-10"
    >
      <View className="p-5">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-x-3">
            <View className="w-10 h-10 bg-[#2A2A40] rounded-full items-center justify-center">
              <IconComponent size={20} color="#8A7CFF" />
            </View>
            <Text className="text-white font-sans-semibold text-lg flex-1">{title}</Text>
          </View>
          <View>{expanded ? <ChevronUp size={20} color="#8A7CFF" /> : <ChevronDown size={20} color="#8A7CFF" />}</View>
        </View>

        {/* Hidden content for measurement */}
        <View
          ref={contentRef}
          onLayout={(event) => {
            if (!measuredHeight) {
              setMeasuredHeight(event.nativeEvent.layout.height)
            }
          }}
          style={{ position: "absolute", opacity: 0, zIndex: -1 }}
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
        </View>

        {/* Animated content */}
        <Animated.View
          style={{
            height: contentHeight,
            opacity: fadeAnim,
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
  )
}

const ProgressHeader = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100

  return (
    <View className="mb-6">
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-400 font-sans">Progress</Text>
        <Text className="text-white font-sans-medium">{Math.round(progress)}%</Text>
      </View>
      <View className="h-2 bg-[#2A2A40] rounded-full overflow-hidden">
        <View
          className="h-full bg-[#8A7CFF] rounded-full"
          style={{
            width: `${progress}%`,
          }}
        />
      </View>
    </View>
  )
}

const HowToSleep = () => {
  const { currentStep, completedSteps, showCongratulations, setShowCongratulations, hasShownCongratulations } =
    useSleepStore()

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

  // For debugging - add a button to reset the hasShownCongratulations flag
  const resetCongratulationsFlag = () => {
    // This would typically be hidden in production
    localStorage.removeItem("sleep-progress")
    window.location.reload()
  }

  return (
    <LinearGradient
      colors={["#121212", "#1E1E30", "#231B36", "#1E1E30", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView ref={scrollViewRef} className="px-5 py-5" showsVerticalScrollIndicator={false}>
          <View className="flex flex-row items-center gap-x-5">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="p-1">
                <ChevronLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="text-white font-sans-bold text-3xl py-5">How to Sleep</Text>
          </View>

          <ProgressHeader currentStep={completedSteps.length} totalSteps={sleepMethods.length} />

          <Text className="text-white font-sans-semibold text-xl mb-3">Sleep Methods</Text>
          <Text className="text-gray-400 font-sans mb-4">Tap on each method to learn more</Text>

          <View className="relative">
            <AnimatedProgressLine steps={sleepMethods} completedSteps={completedSteps} currentStep={currentStep} />

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
          </View>

          {/* For development purposes only */}
          {/* 
          <TouchableOpacity 
            onPress={resetCongratulationsFlag}
            className="mt-8 bg-[#2A2A40] p-3 rounded-lg"
          >
            <Text className="text-white text-center">Reset Congratulations (Dev Only)</Text>
          </TouchableOpacity>
          */}
        </ScrollView>

        {/* Congratulations Dialog */}
        <CongratulationsDialog visible={showCongratulations} onClose={() => setShowCongratulations(false)} />
      </SafeAreaView>
    </LinearGradient>
  )
}

export default HowToSleep

