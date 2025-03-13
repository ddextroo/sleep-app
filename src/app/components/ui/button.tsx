import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/**
 * Button - A reusable animated button component for the Sleep App
 *
 * @param {Object} props
 * @param {string} props.variant - Button style variant ('primary', 'secondary', 'outline', 'ghost')
 * @param {string} props.label - Button text
 * @param {Function} props.onPress - Function to call when button is pressed
 * @param {string} [props.size] - Button size ('sm', 'md', 'lg')
 * @param {boolean} [props.isLoading] - Show loading indicator
 * @param {boolean} [props.isDisabled] - Disable button
 * @param {boolean} [props.fullWidth] - Make button take full width
 * @param {React.ReactNode} [props.leftIcon] - Icon to show on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon to show on the right
 * @param {string} [props.className] - Additional class names for the button container
 */
const Button = ({
  variant,
  label,
  onPress,
  size = "md",
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  leftIcon = undefined,
  rightIcon = undefined,
  className = "",
  ...props
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-accent text-light";
      case "secondary":
        return "bg-secondary text-light";
      case "outline":
        return "bg-transparent border border-accent text-accent";
      case "ghost":
        return "bg-transparent text-light";
      default:
        return "bg-accent text-light";
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "py-2 px-3 rounded-lg";
      case "md":
        return "py-3 px-4 rounded-xl";
      case "lg":
        return "py-4 px-6 rounded-2xl";
      default:
        return "py-3 px-4 rounded-xl";
    }
  };

  // Get text size based on button size
  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-base";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
    opacity.value = withTiming(0.9, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  // Animated styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  // Combine all styles
  const buttonClasses = `
    ${getVariantStyles()} 
    ${getSizeStyles()} 
    ${fullWidth ? "w-full" : ""} 
    ${isDisabled ? "opacity-50" : ""}
    flex flex-row items-center justify-center
  `;

  const textClasses = `
    ${variant === "outline" ? "text-accent" : "text-light"} 
    ${getTextSize()} 
    font-sans-medium
    text-center
  `;

  const containerClasses = `${fullWidth ? "w-full" : ""} ${className}`;

  return (
    <Animated.View className={containerClasses} style={animatedStyles}>
      <TouchableOpacity
        onPress={isDisabled || isLoading ? null : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={isDisabled || isLoading}
        className={buttonClasses}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={variant === "outline" ? "#8B5CF6" : "#FFFFFF"}
            className="mr-2"
          />
        ) : leftIcon ? (
          <View className="mr-2">{leftIcon}</View>
        ) : null}

        <Text className={textClasses}>{label}</Text>

        {rightIcon && !isLoading ? (
          <View className="ml-2">{rightIcon}</View>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Button;
