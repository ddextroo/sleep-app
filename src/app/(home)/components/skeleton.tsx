"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Animated, StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

interface SkeletonProps {
  width?: number | string
  height?: number | string
  borderRadius?: number
  style?: any
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  width: propWidth = "100%",
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const translateX = useRef(new Animated.Value(-width)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        useNativeDriver: true,
        duration: 1500,
      }),
    ).start()
  }, [translateX])

  return (
    <View
      style={[
        {
          width: propWidth,
          height,
          borderRadius,
          backgroundColor: "#2A2A40",
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          transform: [{ translateX }],
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          position: "absolute",
        }}
      >
        <LinearGradientView />
      </Animated.View>
    </View>
  )
}

// This simulates a LinearGradient since we're not importing expo-linear-gradient
const LinearGradientView = () => (
  <View
    style={{
      width: "100%",
      height: "100%",
      position: "absolute",
      backgroundImage: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)",
    }}
  />
)

export const MusicItemSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkeletonLoader width={56} height={56} borderRadius={8} />
      <View style={styles.contentContainer}>
        <SkeletonLoader width="70%" height={18} style={styles.titleSkeleton} />
        <SkeletonLoader width="50%" height={14} />
      </View>
      <SkeletonLoader width={40} height={16} style={styles.durationSkeleton} />
      <SkeletonLoader width={40} height={40} borderRadius={20} style={styles.buttonSkeleton} />
    </View>
  )
}

export const TabsSkeleton: React.FC = () => {
  return (
    <View style={styles.tabsContainer}>
      <SkeletonLoader width={80} height={32} borderRadius={16} />
      <SkeletonLoader width={80} height={32} borderRadius={16} />
      <SkeletonLoader width={100} height={32} borderRadius={16} />
      <SkeletonLoader width={80} height={32} borderRadius={16} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E30",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  durationSkeleton: {
    marginRight: 12,
  },
  buttonSkeleton: {
    alignSelf: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
})

