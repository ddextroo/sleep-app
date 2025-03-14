import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import {
  LogOut,
  ChevronRight,
  Plus,
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  Coins,
} from "lucide-react-native";
import { Button } from "~/components/ui/button";
import MenuItem from "~/components/home/profile/MenuItem";
import { useEffect, useState } from "react";
import { useAuthSessionStore } from "../store/authStore";
import { getUserDetails, signOut } from "../service/authService";
import { router } from "expo-router";
import { useAssets } from "expo-asset";
import { blurhash } from "../utils/blurhash";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const { session, initSession } = useAuthSessionStore();
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    initSession();
  }, []);
  const handleSignOut = async () => {
    signOut();
    router.replace("/(auth)/login");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getUserDetails();
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);
  const [assets] = useAssets([
    require("../../assets/images/hagoc_avatar_male.png"),
    require("../../assets/images/hagoc_avatar_female.png"),
  ]);

  return (
    <LinearGradient
      colors={["#121212", "#1E1E30", "#231B36", "#1E1E30", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="px-5 py-5">
          <Text className="text-foreground font-sans-bold text-3xl py-5">
            Your Profile
          </Text>
          {session && (
            <View className="w-full  rounded-lg p-5 flex flex-row items-center gap-x-3 mb-5">
              <View className="w-20 bg-primary h-20 rounded-full">
                <Image
                  source={
                    !assets
                      ? ""
                      : assets[userDetails?.profile?.gender === "Male" ? 0 : 1]
                  }
                  style={{ width: "100%", height: "100%" }}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  contentPosition={"top"}
                  transition={1000}
                />
              </View>
              <View>
                <Text className="text-foreground font-sans-bold text-lg">
                  @{session.user.user_metadata.display_name}
                </Text>
                <Text className="text-muted-foreground font-sans text-sm">
                  {session.user.email}
                </Text>
              </View>
            </View>
          )}

          <View className="w-full  rounded-lg mb-5">
            <View className="flex flex-row items-center justify-between mb-2">
              <View className="flex flex-row items-center gap-x-2">
                <Coins color="#FFD700" size={24} />
                <Text className="text-foreground font-sans-bold text-lg">
                  Your Kowens
                </Text>
              </View>
              <TouchableOpacity className="bg-green-500 rounded-xl p-2 flex flex-row items-center gap-x-1">
                <Plus color="white" size={18} />
              </TouchableOpacity>
            </View>
            <View className="bg-secondary rounded-lg p-4 flex flex-row items-center justify-between">
              <Text className="font-sans-bold text-foreground text-2xl">
                30
              </Text>
              <Text className="text-muted-foreground font-sans">
                Available kowens
              </Text>
            </View>
          </View>

          <View className="w-full  rounded-lg overflow-hidden mb-5">
            <MenuItem
              icon={<Settings size={20} color="#666" />}
              title="Account Settings"
            />
            <MenuItem
              icon={<CreditCard size={20} color="#666" />}
              title="Payment Methods"
            />
            <MenuItem
              icon={<HelpCircle size={20} color="#666" />}
              title="Privacy Policy"
            />
          </View>

          <Button
            className="flex flex-row justify-between"
            variant="destructive"
            onPress={handleSignOut}
          >
            <View className="flex flex-row gap-x-3 items-center">
              <LogOut color="white" size={20} />
              <Text className="font-sans-medium text-foreground">Sign out</Text>
            </View>
            <ChevronRight color="white" size={20} />
          </Button>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
