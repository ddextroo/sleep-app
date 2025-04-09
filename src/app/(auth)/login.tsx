import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import { useAssets } from "expo-asset";
import { blurhash } from "../utils/blurhash";
import { Image } from "expo-image";
import { Button } from "../../components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuthStore, useAuthSessionStore } from "../store/authStore";
import { Label } from "~/components/ui/label";
import { signInWithEmail } from "../service/authService";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

export default function Login() {
  const [assets] = useAssets([require("../../assets/images/icon_hagoc.png")]);
  const {
    email,
    password,
    setEmail,
    setPassword,
    showPassword,
    setShowPassword,
  } = useAuthStore();

  const handleSignIn = async () => {
    try {
      const response = await signInWithEmail(email, password);
      if (response.user) {
        router.push("/(tabs)");
      }
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
            Sign in to Hagoc
          </Text>

          <View className="w-full gap-y-5 flex">
            <Label nativeID="email_address" className="font-sans">
              Email Address
            </Label>
            <Input
              className="w-full font-sans"
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
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              className="absolute right-3 top-12"
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Feather name="eye-off" size={20} color="#666" />
              ) : (
                <Feather name="eye" size={20} color="#666" />
              )}
            </TouchableOpacity>
          </View>

          <Button className="w-full mt-5" onPress={() => handleSignIn()}>
            <Text className="text-foreground font-sans-medium">Sign in</Text>
          </Button>
          <Button
            className="w-full mt-5"
            variant="outline"
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text className="text-foreground font-sans-medium">
              Create new account
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
