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
import { AnimatedDot } from "../components/onboarding/AnimatedDot";
import { blurhash } from "../utils/blurhash";
import { slides } from "../dto/onboarding";
import { useAssets } from "expo-asset";

const { width } = Dimensions.get("window");

function Slide({ item, index, translateX }) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const [assets] = useAssets([
    require("../../assets/images/onb1.png"),
    require("../../assets/images/onb2.png"),
    require("../../assets/images/onb3.png"),
  ]);

  const animatedImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      translateX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      translateX.value,
      inputRange,
      [20, 0, 20],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      translateX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <View style={{ width }} className="flex-1">
      <View className="flex-col">
        <Animated.View className="h-1/2 p-4" style={animatedImageStyle}>
          <Image
            source={assets ? assets[index] : ""}
            style={{ width: "100%", height: "100%" }}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
        </Animated.View>
        <View className="h-3/4 bg-primary px-8 mt-5">
          <Animated.View className="flex-col h-1/2" style={animatedTextStyle}>
            <Text className="text-light font-sans-bold">HAGOC</Text>
            <Text className="text-light text-3xl font-sans-bold">
              {item.title}
            </Text>
            <Text className="text-secondary text-md font-sans mt-2">
              {item.description}
            </Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

export default function Welcome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const flatListRef = useRef(null);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem("onboarding", "true");
    router.replace("/(auth)/login");
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
    return <Slide item={item} index={index} translateX={translateX} />;
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
              <Text className="text-light font-lg font-sans-medium">
                {currentIndex < slides.length - 1 ? "Next" : "Get Started"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}
