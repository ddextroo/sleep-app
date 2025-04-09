"use client";

import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

const sleepFacts = [
  "If it takes you less than five minutes to fall asleep at night, you're probably sleep-deprived. Ideally, falling asleep should take 10 to 15 minutes.",
  "Stress, physical or mental illness, living or sleeping arrangements, family history, shift work, diet and exercise habits can all contribute to insomnia.",
  "Tiredness peaks twice a day: Around 2 a.m. and 2 p.m. for most people. That's why you're less alert after lunch.",
  "Regular exercise usually improves your sleep patterns. Strenuous exercise right before bed may keep you awake.",
  "Insomnia is not defined by the sleep you lose each night, but by the drowsiness, difficulty concentrating, headaches, irritability and other problems it can cause each day.",
];

const SleepFacts = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateCard = (direction: "left" | "right") => {
    slideAnim.setValue(direction === "left" ? 200 : -200);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const nextFact = () => {
    if (currentFactIndex < sleepFacts.length - 1) {
      animateCard("left");
      setCurrentFactIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevFact = () => {
    if (currentFactIndex > 0) {
      animateCard("right");
      setCurrentFactIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentFactIndex < sleepFacts.length - 1) {
        nextFact();
      } else {
        setCurrentFactIndex(0); // Restart from first fact
      }
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentFactIndex]);

  return (
    <LinearGradient
      colors={["#121212", "#1E1E30", "#231B36", "#1E1E30", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 px-5 py-5">
        {/* Header */}
        <View className="flex flex-row items-center gap-x-5">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="p-1">
              <Feather name="chevron-left" size={24} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-white font-sans-bold text-3xl py-5">
            Sleep Facts
          </Text>
        </View>

        <Text className="text-white font-sans-semibold text-xl mb-3">
          Uncover surprising truths about how sleep affects your health, energy
          levels, and daily performance.
        </Text>

        {/* Animated Fact Card */}
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
          }}
        >
          <View className="bg-[#2d2d4e] rounded-xl p-6 flex items-center justify-center mt-10">
            <View className="w-12 h-12 bg-[#2A2A40] rounded-full flex items-center justify-center mb-4">
              <Feather name="moon" size={24} color="#8A7CFF" />
            </View>
            <Text className="text-white text-lg font-sans-bold mb-6">
              Did you know?
            </Text>
            <Text className="text-white text-lg text-center font-sans-medium">
              {sleepFacts[currentFactIndex]}
            </Text>
          </View>
        </Animated.View>

        {/* Navigation Buttons */}
        <View className="flex-row justify-between items-center mt-6">
          <TouchableOpacity
            onPress={prevFact}
            disabled={currentFactIndex === 0}
            className={currentFactIndex === 0 ? "opacity-50" : ""}
          >
            <Feather name="chevron-left" size={30} color="#8A7CFF" />
          </TouchableOpacity>
          <Text className="text-white font-sans">{`${currentFactIndex + 1} / ${
            sleepFacts.length
          }`}</Text>
          <TouchableOpacity
            onPress={nextFact}
            disabled={currentFactIndex === sleepFacts.length - 1}
            className={
              currentFactIndex === sleepFacts.length - 1 ? "opacity-50" : ""
            }
          >
            <Feather name="chevron-right" size={30} color="#8A7CFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SleepFacts;
