import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { Dimensions, Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#954CE9",
          tabBarInactiveTintColor: "#6B7280",
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
              height: height * 0.08,
              backgroundColor: "#1E1E1E",
              borderTopColor: "#2D2D2D",
              paddingBottom: insets.bottom > 0 ? 20 : 10,
            },
            default: {
              height: height * 0.08,
              backgroundColor: "#1E1E1E",
              borderTopColor: "#2D2D2D",
              paddingBottom: 10,
            },
          }),
          tabBarItemStyle: {
            paddingTop: 12,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="house" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="track"
          options={{
            title: "Track",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="chart-simple" size={20} color={color} />
            ),
            tabBarLabelStyle: {
              fontFamily: "font-sans-bold",
              fontSize: 12, // Adjust font size if needed
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="user-large" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
