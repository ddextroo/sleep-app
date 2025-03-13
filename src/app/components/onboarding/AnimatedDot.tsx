import Animated, { Extrapolate, interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";

export function AnimatedDot({ width, index, currentIndex, translateX }) {
    const dotAnimatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];
  
      const dotWidth = interpolate(
        translateX.value,
        inputRange,
        [4, 16, 4],
        Extrapolate.CLAMP
      );
  
      const opacity = interpolate(
        translateX.value,
        inputRange,
        [0.5, 1, 0.5],
        Extrapolate.CLAMP
      );
  
      return {
        width: withTiming(index === currentIndex ? 16 : 4, { duration: 250 }),
        opacity: withTiming(index === currentIndex ? 1 : 0.5, { duration: 250 }),
      };
    });
  
    return (
      <Animated.View
        className={`h-4 ${
          index === currentIndex ? "bg-accent" : "bg-secondary"
        } rounded-full`}
        style={dotAnimatedStyle}
      />
    );
  }