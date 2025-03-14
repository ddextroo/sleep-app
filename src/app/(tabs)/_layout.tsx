import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChartIcon } from "~/components/icons/ChartIcon";
import { UserIcon } from "~/components/icons/UserIcon";
import { HomeIcon } from "~/components/icons/HomeIcon";

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
              height: height * 0.1,
              backgroundColor: "#1E1E1E",
              paddingBottom: insets.bottom > 0 ? 20 : 10,
            },
            default: {
              height: height * 0.1,
              backgroundColor: "#1E1E1E",
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
            tabBarIcon: ({ color, focused }) => (
              <HomeIcon size={24} color={color} filled={focused} />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: "Poppins-Medium",
            },
          }}
        />
        <Tabs.Screen
          name="track"
          options={{
            title: "Track",
            tabBarIcon: ({ color, focused }) => (
              <ChartIcon size={24} color={color} filled={focused} />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: "Poppins-Medium",
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <UserIcon size={24} color={color} filled={focused} />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: "Poppins-Medium",
            },
          }}
        />
      </Tabs>
    </>
  );
}
