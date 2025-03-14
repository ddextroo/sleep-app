import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAssets } from "expo-asset";
import { blurhash } from "../utils/blurhash";
import { Image } from "expo-image";
import { Button } from "../../components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuthSignup } from "../store/authStore";
import { Label } from "~/components/ui/label";
import { signUpWithEmail } from "../service/authService";
import { router } from "expo-router";

export default function Signup() {
  const [assets] = useAssets([require("../../assets/images/icon_hagoc.png")]);
  const { username, email, password, setUsername, setEmail, setPassword } =
    useAuthSignup();
  const handleSignup = async () => {
    try {
      await signUpWithEmail(email, password);
      router.push("/(home)/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="h-full flex flex-col px-4">
        <View className="flex justify-center items-center w-full px-8">
          <Image
            source={assets ? assets[0] : ""}
            style={{ width: "40%", height: "40%" }}
            placeholder={{ blurhash }}
            contentFit="contain"
            transition={1000}
          />
          <Text className="text-foreground text-3xl font-sans-bold mb-8">
            Sign up to Hagoc
          </Text>

          <View className="w-full gap-y-5 flex">
            <Label nativeID="username" className="font-sans">
              Username
            </Label>
            <Input
              className="w-full"
              inputMode="text"
              placeholder="e.g juandelagwapo"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View className="w-full gap-y-5 flex">
            <Label nativeID="email_address" className="font-sans">
              Email Address
            </Label>
            <Input
              className="w-full"
              inputMode="email"
              placeholder="e.g juandelacruz@gmail.com"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View className="w-full gap-y-5 mt-5 flex">
            <Label nativeID="email_address" className="font-sans">
              Password
            </Label>
            <Input
              className="w-full font-sans"
              placeholder="Enter your password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Button className="w-full mt-5" onPress={() => handleSignup()}>
            <Text className="text-foreground font-sans-medium">Sign up</Text>
          </Button>
          <Button
            className="w-full mt-5"
            variant="outline"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-foreground font-sans-medium">Go back</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
