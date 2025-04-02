import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const ListenStories = () => {
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

          <View className="flex flex-row justify-between mb-4">
            <Text className="font-sans text-muted-foreground text-base">Recommended</Text>
            <TouchableOpacity>
              <Text className="font-sans text-purple-500 text-base">See All</Text>
            </TouchableOpacity>
          </View>

          {/* Music List */}
          <View className="mt-2">
            {musicData.map((item) => (
              <MusicItem key={item.id} item={item} isPlaying={playingId === item.id} onTogglePlay={handleTogglePlay} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default ListenStories;