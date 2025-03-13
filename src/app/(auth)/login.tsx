import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAssets } from "expo-asset";
import { blurhash } from "../utils/blurhash";
import { Image } from "expo-image";
import Button from "../components/ui/button";
import { supabase } from "../utils/supabase";
import { handleSignIn } from "../service/authService";

export default function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

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
        <Image
          source={assets ? assets[0] : ""}
          style={{ width: "50%", height: "50%" }}
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={1000}
        />
        <Button
          variant="primary"
          label="Sign in with Google"
          onPress={() => {
            handleSignIn();
          }}
          className="w-full px-10 mt-5"
        ></Button>
      </View>
    </SafeAreaView>
  );
}
