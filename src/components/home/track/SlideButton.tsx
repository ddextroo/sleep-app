import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Moon, X } from "lucide-react-native";

const { width } = Dimensions.get("window");

const SleepTrackingFAB = ({ onStartTracking }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  // Interpolate values for animations
  const fabWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [60, width - 40],
  });

  const fabBorderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 16],
  });

  const textOpacity = animation.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0, 0, 1],
  });

  const iconRotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleStartTracking = () => {
    if (expanded) {
      // Collapse the FAB first
      toggleExpand();

      // Then start tracking after animation completes
      setTimeout(() => {
        if (onStartTracking) onStartTracking();
      }, 300);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fab,
          {
            width: fabWidth,
            borderRadius: fabBorderRadius,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fabContent}
          onPress={expanded ? handleStartTracking : toggleExpand}
          activeOpacity={0.8}
        >
          {expanded ? (
            <>
              <Animated.Text style={[styles.fabText, { opacity: textOpacity }]}>
                Start Sleep Tracking
              </Animated.Text>
              <Animated.View style={styles.iconContainer}>
                <Moon size={24} color="#FFFFFF" />
              </Animated.View>
            </>
          ) : (
            <Animated.View
              style={[
                styles.iconContainer,
                { transform: [{ rotate: iconRotate }] },
              ]}
            >
              <Moon size={24} color="#FFFFFF" />
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {expanded && (
        <TouchableOpacity style={styles.closeButton} onPress={toggleExpand}>
          <X size={20} color="#954CE9" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "flex-end",
  },
  fab: {
    height: 60,
    backgroundColor: "#954CE9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  fabContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: "100%",
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
});

export default SleepTrackingFAB;
