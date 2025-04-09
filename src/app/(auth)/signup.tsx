import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import { Button } from "../../components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuthSignup } from "../store/authStore";
import { Label } from "~/components/ui/label";
import { signUpWithEmail } from "../service/authService";
import { router } from "expo-router";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

export default function Signup() {
  const {
    username,
    email,
    password,
    gender = "Male",
    showPassword,
    setShowPassword,
    setUsername,
    setEmail,
    setPassword,
    setGender,
  } = useAuthSignup();

  function onLabelPress(label: string) {
    return () => {
      setGender(label);
    };
  }

  const handleSignup = async () => {
    try {
      await signUpWithEmail(email, password, username, gender);
      router.push("/(tabs)");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="h-full flex flex-col px-4">
        <View className="flex justify-center h-full w-full px-8">
          <Text className="text-foreground text-3xl font-sans-bold mt-4">
            Sign up to Hagoc
          </Text>
          <Text className="text-muted-foreground text-left mt-2 font-sans">
            Create an account to get started with Hagoc
          </Text>

          <View className="w-full gap-y-5 flex mt-5">
            <Label nativeID="username" className="font-sans">
              Username
            </Label>
            <Input
              className="w-full font-sans"
              inputMode="text"
              placeholder="e.g juandelagwapo"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View className="w-full gap-y-5 flex mt-5">
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
          <View className="flex flex-col py-5">
            <Label nativeID="email_address" className="font-sans mb-5">
              Choose Gender
            </Label>
            <View>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="gap-3"
              >
                <RadioGroupItemWithLabel
                  value="Male"
                  onLabelPress={onLabelPress("Male")}
                />
                <RadioGroupItemWithLabel
                  value="Female"
                  onLabelPress={onLabelPress("Female")}
                />
              </RadioGroup>
            </View>
          </View>

          <Button className="w-full mt-5" onPress={() => handleSignup()}>
            <Text className="text-foreground font-sans-medium">Sign up</Text>
          </Button>
          <View className="flex-row justify-center mt-4">
            <Text className="text-foreground font-sans-medium">
              Already have an account?
            </Text>
            <Text
              className="text-primary font-sans-medium ml-1"
              onPress={() => router.push("/(auth)/login")}
            >
              Log in
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <View className={"flex-row gap-2 items-center"}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}
