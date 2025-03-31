import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";  

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
          <Text className="text-foreground font-sans-bold text-3xl py-5">Discover</Text>

          {/* Tab Navigation */}
          <View className="flex-row space-x-3 mb-5">
            <Tab title="For You" isActive={activeTab === "tab1"} onPress={() => setActiveTab("tab1")} />
            <Tab title="Popular" isActive={activeTab === "tab2"} onPress={() => setActiveTab("tab2")} />
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