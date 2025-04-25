import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  BackHandler,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useAssets } from "expo-asset";
import { router } from "expo-router";
import { MusicItemSkeleton, TabsSkeleton } from "./components/skeleton";
import { storyAudioFiles } from "../../constants/storyAudioData";

const MusicItem = ({ item, isPlaying, onTogglePlay }) => (
  <View className="flex-row items-center bg-[#1E1E30] rounded-xl p-3 mb-3">
    <Image source={item.coverImage} className="w-14 h-14 rounded-lg" />
    <View className="flex-1 ml-3">
      <Text className="text-white font-sans-semibold text-base">
        {item.title}
      </Text>
      <Text className="text-gray-400 font-sans text-sm">{item.artist}</Text>
    </View>
    <Text className="text-gray-400 mr-3">{item.duration || "Loading..."}</Text>
    <TouchableOpacity
      onPress={() => onTogglePlay(item)}
      className="w-10 h-10 bg-[#2A2A40] rounded-full items-center justify-center"
    >
      {isPlaying ? (
        <Feather name="pause" size={18} color="#FFFFFF" />
      ) : (
        <Feather name="play" size={18} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  </View>
);

const Tab = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full ${
      isActive ? "bg-[#5D3FD3]" : "bg-[#2A2A40]"
    }`}
  >
    <Text
      className={`font-sans-medium ${
        isActive ? "text-white" : "text-gray-400"
      }`}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

const ListenStories = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tab1");
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const [imageAssets] = useAssets([
    require("~/assets/images/loveradio.png"),
    require("~/assets/images/reddit.jpg"),
    require("~/assets/images/horror.png"),
    require("~/assets/images/bedtime.jpeg"),
  ]);

  // Cleanup function to stop and unload sound
  const cleanupSound = async () => {
    if (sound && isMounted.current) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        if (isMounted.current) {
          setSound(null);
          setPlayingId(null);
        }
      } catch (error) {
        console.error("Error cleaning up sound:", error);
      }
    }
  };

  // Handle component unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (sound) {
        sound
          .stopAsync()
          .then(() => sound.unloadAsync())
          .catch((e) => console.error(e));
      }
    };
  }, [sound]);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      cleanupSound();
      return false; // Let the default back action proceed
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [sound]);

  useEffect(() => {
    const loadAudioMetadata = async () => {
      if (!imageAssets) {
        setLoading(true);
        return;
      }
      setLoading(true);
      const audioData = [
        {
          id: "1",
          title: "He was my favorite 'Hello' and my hardest 'Goodbye'",
          artist: "Love Radio Manila",
          coverImage: imageAssets[0],
          category: "general",
          uri: storyAudioFiles[0],
        },
        {
          id: "2",
          title: "Kinuha akong ninong ni EX!",
          artist: "Love Radio Manila",
          coverImage: imageAssets[0],
          category: "general",
          uri: storyAudioFiles[1],
        },
        {
          id: "3",
          title: "Pinagpalit niya ang 8 years sa babaeng kakakilala lang niya",
          artist: "Love Radio Manila",
          coverImage: imageAssets[0],
          category: "general",
          uri: storyAudioFiles[2],
        },
        {
          id: "4",
          title: "Excluded From My Sisters Wedding",
          artist: "Narrator",
          coverImage: imageAssets[1],
          category: "reddit",
          uri: storyAudioFiles[3],
        },
        {
          id: "5",
          title:
            "Wife Left Me And Came Back With A Baby, Begging For A Second Chance",
          artist: "Narrator",
          coverImage: imageAssets[1],
          category: "reddit",
          uri: storyAudioFiles[4],
        },
        {
          id: "6",
          title: "The Whispering Shadows",
          artist: "Horror Tales",
          coverImage: imageAssets[2],
          category: "horror",
          uri: storyAudioFiles[5],
        },
        {
          id: "7",
          title: "Something's Watching Me At Night",
          artist: "Creepy Narrator",
          coverImage: imageAssets[2],
          category: "horror",
          uri: storyAudioFiles[6],
        },
        {
          id: "8",
          title: "It's A Firefly Night!",
          artist: "Kids Storytime",
          coverImage: imageAssets[3],
          category: "kids",
          uri: storyAudioFiles[7],
        },
        {
          id: "9",
          title: "The Little Bunny's Big Day",
          artist: "Kids Narrator",
          coverImage: imageAssets[3],
          category: "kids",
          uri: storyAudioFiles[8],
        },
      ];

      const updatedAudioList = await Promise.all(
        audioData.map(async (item) => {
          try {
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync({ uri: item.uri });
            const status = await soundObject.getStatusAsync();
            await soundObject.unloadAsync();

            if (!status.isLoaded) {
              throw new Error("Sound failed to load");
            }

            return {
              ...item,
              duration: formatDuration(status.durationMillis || 0),
            };
          } catch (error) {
            console.error(`Error loading ${item.title}:`, error);
            return { ...item, duration: "N/A" };
          }
        })
      );

      if (isMounted.current) {
        setAudioList(updatedAudioList);
        setLoading(false);
      }
    };

    loadAudioMetadata();
  }, [imageAssets]);

  const formatDuration = (millis: number | undefined) => {
    if (!millis) return "0:00";
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTogglePlay = async (item) => {
    try {
      if (playingId === item.id) {
        console.log(`Pausing: ${item.title}`);
        setPlayingId(null);
        if (sound) await sound.pauseAsync();
        return;
      }

      if (sound) {
        console.log(`Stopping previous audio before playing ${item.title}`);
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: item.uri },
        { shouldPlay: false }
      );

      // Add onPlaybackStatusUpdate to handle when audio completes
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (
          status.isLoaded &&
          status.positionMillis === status.durationMillis &&
          isMounted.current
        ) {
          setPlayingId(null);
          newSound.unloadAsync().catch((e) => console.error(e));
        }
      });

      setSound(newSound);
      setPlayingId(item.id);
      console.log(`Playing: ${item.title}`);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => <MusicItemSkeleton key={`skeleton-${index}`} />);
  };

  return (
    <LinearGradient
      colors={["#121212", "#1E1E30", "#231B36", "#1E1E30", "#121212"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="px-5 py-5">
          <View className="flex flex-row items-center gap-x-5">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="p-1">
                <Feather name="chevron-left" size={24} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="text-foreground font-sans-bold text-3xl py-5">
              Listen Stories
            </Text>
          </View>

          {loading ? (
            <TabsSkeleton />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              <View className="flex-row space-x-3 mb-5 gap-x-2">
                <Tab
                  title="For You"
                  isActive={activeTab === "tab1"}
                  onPress={() => setActiveTab("tab1")}
                />
                <Tab
                  title="For Kids"
                  isActive={activeTab === "tab4"}
                  onPress={() => setActiveTab("tab4")}
                />
                <Tab
                  title="Reddit Stories"
                  isActive={activeTab === "tab2"}
                  onPress={() => setActiveTab("tab2")}
                />
                <Tab
                  title="Horror"
                  isActive={activeTab === "tab3"}
                  onPress={() => setActiveTab("tab3")}
                />
              </View>
            </ScrollView>
          )}

          <View className="flex flex-row justify-between mb-4">
            <Text className="font-sans text-muted-foreground text-base">
              {activeTab === "tab1" ? "Recommended" : "Trending"}
            </Text>
            {/* <TouchableOpacity>
              <Text className="font-sans text-purple-500 text-base">See All</Text>
            </TouchableOpacity> */}
          </View>

          <View className="mt-2">
            {loading
              ? renderSkeletons()
              : audioList
                  .filter((item) => {
                    if (activeTab === "tab1")
                      return item.category === "general";
                    if (activeTab === "tab2") return item.category === "reddit";
                    if (activeTab === "tab3") return item.category === "horror";
                    if (activeTab === "tab4") return item.category === "kids";
                    return false;
                  })
                  .map((item) => (
                    <MusicItem
                      key={item.id}
                      item={item}
                      isPlaying={playingId === item.id}
                      onTogglePlay={handleTogglePlay}
                    />
                  ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ListenStories;
