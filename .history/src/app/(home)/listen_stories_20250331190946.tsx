import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Play, Pause, ChevronLeft } from "lucide-react-native";
import { Audio } from "expo-av";
import { useAssets } from "expo-asset";

const MusicItem = ({ item, isPlaying, onTogglePlay }) => (
  <View className="flex-row items-center bg-[#1E1E30] rounded-xl p-3 mb-3">
    <Image source={{ uri: item.coverImage }} className="w-14 h-14 rounded-lg" />
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

  const [assets] = useAssets([
    require("~/assets/listen_stories/djraqi1.mp3"),
    require("~/assets/listen_stories/djraqi2.mp3"),
    require("~/assets/listen_stories/djraqi3.mp3"),
    require("~/assets/listen_stories/reddit1.mp3"),
    require("~/assets/listen_stories/reddit2.mp3"),
  ]);

  useEffect(() => {
    const loadAudioMetadata = async () => {
      if (!assets) return;

      const audioData = [
        { id: "1", title: "DJ Raqi 1", artist: "Love Radio Manila", coverImage: "https://via.placeholder.com/60", assetIndex: 0 },
        { id: "2", title: "DJ Raqi 2", artist: "Love Radio Manila", coverImage: "https://via.placeholder.com/60", assetIndex: 1 },
        { id: "3", title: "DJ Raqi 3", artist: "Love Radio Manila", coverImage: "https://via.placeholder.com/60", assetIndex: 2 },
        { id: "4", title: "Reddit Story 1", artist: "Narrator", coverImage: "https://via.placeholder.com/60", assetIndex: 3 },
        { id: "5", title: "Reddit Story 2", artist: "Narrator", coverImage: "https://via.placeholder.com/60", assetIndex: 4 },
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
      if (playingId === item.id) {
        console.log(`Pausing: ${item.title}`);
        setPlayingId(null);
        if (sound) await sound.pauseAsync();
        return;
      }
  
      // Stop and unload previous sound
      if (sound) {
        console.log(`Stopping previous audio before playing ${item.title}`);
        await sound.stopAsync();
        await sound.unloadAsync();
      }
  
      // Create a new Sound instance
      const newSound = new Audio.Sound();
  
      console.log(`Loading audio: ${item.title}`);
      await newSound.loadAsync(assets[item.assetIndex]); // ✅ Ensure sound is loaded
      await newSound.playAsync(); // ✅ Play the sound after loading
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
  
      setSound(newSound);
      setPlayingId(item.id);
      console.log(`Playing: ${item.title}`);
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
          <View className="flex flex-row items-center gap-x-5">
            <ChevronLeft color="white" />
            <Text className="text-foreground font-sans-bold text-3xl py-5">Listen Stories</Text>
          </View>

          {/* Tab Navigation */}
          <View className="flex-row space-x-3 mb-5 gap-x-3">
            <Tab title="For You" isActive={activeTab === "tab1"} onPress={() => setActiveTab("tab1")} />
            <Tab title="Reddit Stories" isActive={activeTab === "tab2"} onPress={() => setActiveTab("tab2")} />
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
              .filter((item) => (activeTab === "tab1" ? item.id <= "3" : item.id > "3"))
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
