import { useAssets } from "expo-asset";
import { View, Text, Animated } from "react-native";
import {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { blurhash } from "~/app/utils/blurhash";
import { Image } from "expo-image";

export default function Slide({ width, item, index, translateX }) {
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
    <View style={{ width }} className="flex-1 bg-background">
      <View className="flex-col">
        <Animated.View className="h-1/2" style={animatedImageStyle}>
          <Image
            source={assets ? assets[index] : ""}
            style={{ width: "100%", height: "100%" }}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
        </Animated.View>
        <View className="h-3/4 px-8 mt-5">
          <Animated.View className="flex-col h-1/2" style={animatedTextStyle}>
            <Text className="text-foreground text-md font-sans-bold">
              HAGOC
            </Text>
            <Text className="text-foreground text-2xl font-sans-bold mt-2">
              {item.title}
            </Text>
            <Text className="text-muted-foreground text-md font-sans mt-2">
              {item.description}
            </Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
