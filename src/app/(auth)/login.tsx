import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAssets } from "expo-asset";
import { blurhash } from "../utils/blurhash";
import { Image } from "expo-image";
import Button from "../components/ui/button";

export default function Login() {
  const [assets] = useAssets([require("../../assets/images/login.png")]);

  return (
    <SafeAreaView className="bg-primary">
      <View className="h-full flex flex-col justify-center items-center">
        <View className="flex  w-full px-10">
          <Text className="text-light text-3xl font-sans-bold">
            Welcome to Hagoc
          </Text>
          <Text className="text-secondary text-lg font-sans">
            Sign in to continue your sleep journey
          </Text>
        </View>
        <Button
          variant="primary"
          label="Sign in with Google"
          className="w-full px-10 mt-5"
          onPress={() => console.log("sadasas")}
        ></Button>
      </View>
    </SafeAreaView>
  );
}
