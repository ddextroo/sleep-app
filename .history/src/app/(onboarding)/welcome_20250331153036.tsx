import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useState, useCallback, useRef } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Extrapolate,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { AnimatedDot } from "../../components/onboarding/AnimatedDot";
import { blurhash } from "../utils/blurhash";
import { slides } from "../dto/onboarding";
import { useOnboardingStore } from "../store/authStore";
import Slide from "~/components/onboarding/Slide";

const { width } = Dimensions.get("window");

export default function Welcome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const flatListRef = useRef(null);
  const { setOnboardingComplete } = useOnboardingStore();

  const completeOnboarding = async () => {
    await setOnboardingComplete(true);
    router.pu("/(auth)/login");
  };

  const updateCurrentIndex = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      translateX.value = event.contentOffset.x;
      const newIndex = Math.round(event.contentOffset.x / width);
      if (newIndex !== currentIndex) {
        runOnJS(updateCurrentIndex)(newIndex);
      }
    },
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(currentIndex === slides.length - 1 ? 1.05 : 1);
    return {
      transform: [{ scale }],
    };
  });

  const renderSlide = ({ item, index }) => {
    return (
      <Slide width={width} item={item} index={index} translateX={translateX} />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />

      <View className="absolute bottom-10 left-0 right-0 px-8">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row gap-x-3">
            {slides.map((_, i) => (
              <AnimatedDot
                width={width}
                key={i}
                index={i}
                currentIndex={currentIndex}
                translateX={translateX}
              />
            ))}
          </View>

          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              onPress={
                currentIndex < slides.length - 1
                  ? () => {
                      flatListRef.current.scrollToIndex({
                        index: currentIndex + 1,
                        animated: true,
                      });
                    }
                  : completeOnboarding
              }
              className="bg-transparent"
              style={{ opacity: 0.9 }}
              activeOpacity={0.7}
            >
              <Text className="text-foreground font-lg font-sans-medium">
                {currentIndex < slides.length - 1 ? "Next" : "Get Started"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}
