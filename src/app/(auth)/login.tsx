import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAssets } from "expo-asset";
import { blurhash } from "../utils/blurhash";
import { Image } from "expo-image";
import { Button } from "../../components/ui/button";
import { Input } from "~/components/ui/input";

export default function Login() {
  const [assets] = useAssets([require("../../assets/images/login.png")]);

  const [value, setValue] = React.useState("");

  const onChangeText = (text: string) => {
    setValue(text);
  };

  return (
    <SafeAreaView className="bg-background">
      <View className="h-full flex flex-col ">
        <View className="flex  w-full px-10">
          <Text className="text-foreground text-3xl font-sans-bold mt-24">
            Welcome to Hagoc
          </Text>
          <Text className="text-muted-foreground text-lg font-sans mb-10">
            Sign in to continue your sleep journey
          </Text>
          <View className="flex gap-y-5">
            <Input
              className="font-sans"
              placeholder="juandelacruz@gmail.com"
              value={value}
              onChangeText={onChangeText}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
            />
            <Input
              className="font-sans"
              placeholder="Write some stuff..."
              value={value}
              onChangeText={onChangeText}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
            />
          </View>
          <Button className="mt-5">
            <Text className="text-foreground font-sans-medium">Sign in</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
