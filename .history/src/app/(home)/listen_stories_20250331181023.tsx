import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import React, { useState } from 'react'
import { LinearGradient } from "expo-linear-gradient";  
import { Play, Pause, ChevronLast, ChevronLeft } from "lucide-react-native"
import { dj} from '../../assets/listen_stories'

const tabOneMusic = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    coverImage: "https://via.placeholder.com/60",
  },
  {
    id: "2",
    title: "Save Your Tears",
    artist: "The Weeknd",
    duration: "3:35",
    coverImage: "https://via.placeholder.com/60",
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    duration: "3:23",
    coverImage: "https://via.placeholder.com/60",
  },
]

const tabTwoMusic = [
  {
    id: "4",
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    duration: "2:57",
    coverImage: "https://via.placeholder.com/60",
  },
  {
    id: "5",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    duration: "2:58",
    coverImage: "https://via.placeholder.com/60",
  },
]

const MusicItem = ({ item, isPlaying, onTogglePlay }) => {
  return (
    <View className="flex-row items-center bg-[#1E1E30] rounded-xl p-3 mb-3">
      <Image source={{ uri: item.coverImage }} className="w-14 h-14 rounded-lg" />
      <View className="flex-1 ml-3">
        <Text className="text-white font-sans-semibold text-base">{item.title}</Text>
        <Text className="text-gray-400 font-sans text-sm">{item.artist}</Text>
      </View>
      <Text className="text-gray-400 mr-3">{item.duration}</Text>
      <TouchableOpacity
        onPress={() => onTogglePlay(item.id)}
        className="w-10 h-10 bg-[#2A2A40] rounded-full items-center justify-center"
      >
        {isPlaying ? <Pause size={18} color="#FFFFFF" /> : <Play size={18} color="#FFFFFF" fill="#FFFFFF" />}
      </TouchableOpacity>
    </View>
  )
}

const Tab = ({ title, isActive, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${isActive ? "bg-[#5D3FD3]" : "bg-[#2A2A40]"}`}
    >
      <Text className={`font-sans-medium ${isActive ? "text-white" : "text-gray-400"}`}>{title}</Text>
    </TouchableOpacity>
  )
}

const ListenStories = () => {
  const [playingId, setPlayingId] = useState(null)
  const [activeTab, setActiveTab] = useState("tab1")

  const handleTogglePlay = (id) => {
    setPlayingId(playingId === id ? null : id)
  }

  return (
    <LinearGradient
      colors={["#121212", "#1E1E30", "#231B36", "#1E1E30", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="px-5 py-5">
          <View className="flex flex-row items-center gap-x-5"><ChevronLeft color='white'/>
            <Text className="text-foreground font-sans-bold text-3xl py-5">Listen Stories</Text>
          </View>
          
          {/* Tab Navigation */}
          <View className="flex-row space-x-3 mb-5">
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
            {activeTab === "tab1"
              ? tabOneMusic.map((item) => (
                  <MusicItem
                    key={item.id}
                    item={item}
                    isPlaying={playingId === item.id}
                    onTogglePlay={handleTogglePlay}
                  />
                ))
              : tabTwoMusic.map((item) => (
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
  )
}

export default ListenStories;