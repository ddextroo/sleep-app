import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
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
    loading,
    setLoading,
    error,
    setError,
    clearError,
  } = useAuthStore();

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const validateInputs = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSignIn = async () => {
    clearError();

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      const response = await signInWithEmail(email, password);

      // Check if user is null instead of checking for error property
      if (!response.user) {
        const errorMessage = "Login failed. Please check your credentials.";
        setError(errorMessage);
        Alert.alert("Login Failed", errorMessage);
        return;
      }

      // If we have a user, proceed with navigation
      router.push("/(tabs)");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
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
              onChangeText={(text) => {
                setEmail(text);
                if (validationErrors.email) {
                  setValidationErrors({ ...validationErrors, email: "" });
                }
              }}
            />
            {validationErrors.email ? (
              <Text className="text-red-500 text-sm">
                {validationErrors.email}
              </Text>
            ) : null}
          </View>

          <View className="w-full gap-y-5 mt-5 flex">
            <Label nativeID="password" className="font-sans">
              Password
            </Label>
            <Input
              className="w-full font-sans"
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (validationErrors.password) {
                  setValidationErrors({ ...validationErrors, password: "" });
                }
              }}
            />
            {validationErrors.password ? (
              <Text className="text-red-500 text-sm">
                {validationErrors.password}
              </Text>
            ) : null}
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

          <Button
            className="w-full mt-5"
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-foreground font-sans-medium">Sign in</Text>
            )}
          </Button>

          <Button
            className="w-full mt-5"
            variant="outline"
            onPress={() => router.push("/(auth)/signup")}
            disabled={loading}
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
