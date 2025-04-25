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
import { audioFiles, audioCategories } from "../../constants/audioData";
import * as Linking from "expo-linking";

const SoundItem = ({ item, isPlaying, onTogglePlay }) => (
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

const CalmSound = () => {
  const [playingId, setPlayingId] = useState(null);
  const [activeTab, setActiveTab] = useState("nature");
  const [sound, setSound] = useState(null);
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const [imageAssets] = useAssets([
    require("~/assets/images/nature.jpg"),
    require("~/assets/images/sleeeepp.jpg"),
    require("~/assets/images/med.jpg"),
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

      const soundData = [
        {
          id: "1",
          title: "One Summer's Day",
          artist: "knoa Piano Music",
          category: "nature",
          coverImage: imageAssets[0],
          assetIndex: 0,
          uri: audioFiles[0],
        },
        {
          id: "2",
          title: "The Path of Wind",
          artist: "knoa Piano Music",
          category: "nature",
          coverImage: imageAssets[0],
          assetIndex: 1,
          uri: audioFiles[1],
        },
        {
          id: "3",
          title: "Carrying You",
          artist: "knoa Piano Music",
          category: "nature",
          coverImage: imageAssets[0],
          assetIndex: 2,
          uri: audioFiles[2],
        },
        {
          id: "4",
          title: "If I Could Be The Ocean",
          artist: "knoa Piano Music",
          category: "nature",
          coverImage: imageAssets[0],
          assetIndex: 3,
          uri: audioFiles[3],
        },
        {
          id: "5",
          title: "My Humble Cottage",
          artist: "knoa Piano Music",
          category: "nature",
          coverImage: imageAssets[0],
          assetIndex: 4,
          uri: audioFiles[4],
        },
        {
          id: "6",
          title: "Euphorbia",
          artist: "Spatial Dreams",
          category: "meditation",
          coverImage: imageAssets[2],
          assetIndex: 5,
          uri: audioFiles[5],
        },
        {
          id: "7",
          title: "Enigma",
          artist: "Prophétique",
          category: "meditation",
          coverImage: imageAssets[2],
          assetIndex: 6,
          uri: audioFiles[6],
        },
        {
          id: "8",
          title: "Sleepwalk For",
          artist: "knoa Piano Music",
          category: "sleep",
          coverImage: imageAssets[1],
          assetIndex: 7,
          uri: audioFiles[7],
        },
        {
          id: "9",
          title: "Let Rise",
          artist: "knoa Piano Music",
          category: "sleep",
          coverImage: imageAssets[1],
          assetIndex: 8,
          uri: audioFiles[8],
        },
        {
          id: "10",
          title: "Jewel Ambitious",
          artist: "knoa Piano Music",
          category: "sleep",
          coverImage: imageAssets[1],
          assetIndex: 9,
          uri: audioFiles[9],
        },
      ];

      const updatedAudioList = await Promise.all(
        soundData.map(async (item) => {
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

      setAudioList(updatedAudioList);
      setLoading(false);
    };

    loadAudioMetadata();
  }, [imageAssets]);

  const formatDuration = (millis) => {
    if (!millis) return "0:00";
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTogglePlay = async (item) => {
    try {
      if (playingId === item.id) {
        setPlayingId(null);
        if (sound) await sound.pauseAsync();
        return;
      }

      if (sound) {
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

      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: item.uri,
      });

      // Add onPlaybackStatusUpdate to handle when audio completes
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (
          status.isLoaded &&
          status.positionMillis === status.durationMillis &&
          status.durationMillis > 0
        ) {
          setPlayingId(null);
          newSound.unloadAsync().catch((e) => console.error(e));
        }
      });

      setSound(newSound);
      setPlayingId(item.id);
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
            <Feather
              name="chevron-left"
              size={24}
              color="white"
              onPress={() => router.back()}
            />
            <Text className="text-foreground font-sans-bold text-3xl py-5">
              Calm Sounds
            </Text>
          </View>

          {loading ? (
            <TabsSkeleton />
          ) : (
            <View className="flex-row space-x-3 mb-5 gap-x-3">
              <Tab
                title="Nature"
                isActive={activeTab === "nature"}
                onPress={() => setActiveTab("nature")}
              />
              <Tab
                title="Meditation"
                isActive={activeTab === "meditation"}
                onPress={() => setActiveTab("meditation")}
              />
              <Tab
                title="Sleep"
                isActive={activeTab === "sleep"}
                onPress={() => setActiveTab("sleep")}
              />
            </View>
          )}

          {loading
            ? renderSkeletons()
            : audioList
                .filter((item) => item.category === activeTab)
                .map((item) => (
                  <SoundItem
                    key={item.id}
                    item={item}
                    isPlaying={playingId === item.id}
                    onTogglePlay={handleTogglePlay}
                  />
                ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CalmSound;
