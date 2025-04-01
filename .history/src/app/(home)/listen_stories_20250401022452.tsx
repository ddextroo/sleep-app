import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Play, Pause, ChevronLeft } from "lucide-react-native";
import { Audio } from "expo-av";
import { useAssets } from "expo-asset";
import { router } from 'expo-router';

const MusicItem = ({ item, isPlaying, onTogglePlay }) => (
  <View className="flex-row items-center bg-[#1E1E30] rounded-xl p-3 mb-3">
    <Image source={item.coverImage} className="w-14 h-14 rounded-lg" />
    <View className="flex-1 ml-3">
      <Text className="text-white font-sans-semibold text-base">{item.title}</Text>
      <Text className="text-gray-400 font-sans text-sm">{item.artist}</Text>
    </View>
    <Text className="text-gray-400 mr-3">{item.duration || "Loading..."}</Text>
    <TouchableOpacity
      onPress={() => onTogglePlay(item)}
      className="w-10 h-10 bg-[#2A2A40] rounded-full items-center justify-center"
    >
      {isPlaying ? <Pause size={18} color="#FFFFFF" /> : <Play size={18} color="#FFFFFF" fill="#FFFFFF" />}
    </TouchableOpacity>
  </View>
);

const Tab = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full ${isActive ? "bg-[#5D3FD3]" : "bg-[#2A2A40]"}`}
  >
    <Text className={`font-sans-medium ${isActive ? "text-white" : "text-gray-400"}`}>{title}</Text>
  </TouchableOpacity>
);

const ListenStories = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tab1");
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioList, setAudioList] = useState([]);
  const [imageAssets] = useAssets([
    require("~/assets/images/loveradio.png"),
    require("~/assets/images/loveradio.png"),
    require("~/assets/images/loveradio.png"),
    require("~/assets/images/reddit.jpg"),
    require("~/assets/images/reddit.jpg"),
    require("~/assets/images/horror.png"),
    require("~/assets/images/horror.png"),
    require("~/assets/images/bedtime.png"),
  ]);
  const [assets] = useAssets([
    require("~/assets/listen_stories/djraqi1.mp3"),
    require("~/assets/listen_stories/djraqi2.mp3"),
    require("~/assets/listen_stories/djraqi3.mp3"),
    require("~/assets/listen_stories/reddit1.mp3"),
    require("~/assets/listen_stories/reddit2.mp3"),
    require("~/assets/listen_stories/parkinglot.mp3"),
    require("~/assets/listen_stories/dalampasigan.mp3"),
    require("~/assets/listen_stories/firefly.mp3"),
    require("~/assets/listen_stories/elephant.mp3"),
  ]);

  useEffect(() => {
    const loadAudioMetadata = async () => {
      if (!assets) return;

      const audioData = [
        { id: "1", title: "He was my favorite 'Hello' and my hardest 'Goodbye'", artist: "Love Radio Manila", coverImage: imageAssets[0], assetIndex: 0, category: "general" },
        { id: "2", title: "Kinuha akong ninong ni EX!", artist: "Love Radio Manila", coverImage: imageAssets[1], assetIndex: 1, category: "general" },
        { id: "3", title: "Pinagpalit niya ang 8 years sa babaeng kakakilala lang niya", artist: "Love Radio Manila", coverImage: imageAssets[2], assetIndex: 2, category: "general" },
        { id: "4", title: "Excluded From My Sisters Wedding", artist: "Narrator", coverImage: imageAssets[3], assetIndex: 3, category: "reddit" },
        { id: "5", title: "Wife Left Me And Came Back With A Baby, Begging For A Second Chance", artist: "Narrator", coverImage: imageAssets[4], assetIndex: 4, category: "reddit" },
        { id: "6", title: "The Whispering Shadows", artist: "Horror Tales", coverImage: imageAssets[5], assetIndex: 5, category: "horror" },
        { id: "7", title: "Something's Watching Me At Night", artist: "Creepy Narrator", coverImage: imageAssets[6], assetIndex: 6, category: "horror" },
        { id: "8", title: "It's A Firefly Night!", artist: "Kids Storytime", coverImage: imageAssets[7], assetIndex: 7, category: "kids" }, // New Kids Category
        { id: "9", title: "The Little Bunny's Big Day", artist: "Kids Narrator", coverImage: imageAssets[7], assetIndex: 8, category: "kids" } // New Kids Category
      ];

      const updatedAudioList = await Promise.all(
        audioData.map(async (item) => {
          try {
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync(assets[item.assetIndex]);
            const status = await soundObject.getStatusAsync();
            await soundObject.unloadAsync();
            return { ...item, duration: formatDuration(status.durationMillis) };
          } catch (error) {
            console.error(`Error loading ${item.title}:`, error);
            return { ...item, duration: "N/A" }; // Fallback for failed assets
          }
        })
      );

      setAudioList(updatedAudioList);
    };

    loadAudioMetadata();
  }, [assets]);

  const formatDuration = (millis: number | undefined) => {
    if (!millis) return "0:00";
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTogglePlay = async (item) => {
    try {
      // Pause if the same item is tapped
      if (playingId === item.id) {
        console.log(`Pausing: ${item.title}`);
        setPlayingId(null);
        if (sound) await sound.pauseAsync();
        return;
      }

      // Stop and unload any previous sound
      if (sound) {
        console.log(`Stopping previous audio before playing ${item.title}`);
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // Request permissions and set audio mode
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
      const { sound: newSound } = await Audio.Sound.createAsync(
        assets[item.assetIndex]
      );

      setSound(newSound);
      setPlayingId(item.id);
      console.log(`Playing: ${item.title}`);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  return (
    <LinearGradient colors={["#121212", "#1E1E30", "#231B36", "#1E1E30", "#121212"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <ScrollView className="px-5 py-5">
          <View className="flex flex-row items-center gap-x-5" >
            <TouchableOpacity onPress={() => router.back()}>
              <View className="p-1">
                <ChevronLeft color="white"/>
              </View>
            </TouchableOpacity>
            <Text className="text-foreground font-sans-bold text-3xl py-5">Listen Stories</Text>
          </View>

          {/* Tab Navigation */}
          <View className="flex-row space-x-3 mb-5 gap-x-3">
            <Tab title="For You" isActive={activeTab === "tab1"} onPress={() => setActiveTab("tab1")} />
            <Tab title="For Kids" isActive={activeTab === "tab4"} onPress={() => setActiveTab("tab4")} /> {/* New Tab */}
            <Tab title="Reddit Stories" isActive={activeTab === "tab2"} onPress={() => setActiveTab("tab2")} />
            <Tab title="Horror" isActive={activeTab === "tab3"} onPress={() => setActiveTab("tab3")} />
          </View>
          <View className="flex flex-row justify-between mb-4">
            <Text className="font-sans text-muted-foreground text-base">
              {activeTab === "tab1" ? "Recommended" : "Trending"}
            </Text>
            <TouchableOpacity>
              <Text className="font-sans text-purple-500 text-base">See All</Text>
            </TouchableOpacity>
          </View>

          {/* Music List based on active tab */}
          <View className="mt-2">
            {audioList
              .filter((item) => {
                if (activeTab === "tab1") return item.category === "general";
                if (activeTab === "tab2") return item.category === "reddit";
                if (activeTab === "tab3") return item.category === "horror";
                if (activeTab === "tab4") return item.category === "kids";
                return false;
              })
              .map((item) => (
                <MusicItem key={item.id} item={item} isPlaying={playingId === item.id} onTogglePlay={handleTogglePlay} />
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ListenStories;
