import { Text, View, ScrollView, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native";
import { useAssets } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { RECOMMENDED_DATA, RECENT_DATA } from "../dto/home";
import { Item } from "~/components/home/index/Item";

export default function HomeScreen() {
  const [assets] = useAssets([
    require("../../assets/images/calming_sounds.png"),
    require("../../assets/images/listen_stories.png"),
    require("../../assets/images/sleep_journal.png"),
    require("../../assets/images/sleep_facts.png"),
    require("../../assets/images/how_to_sleep.png"),
    require("../../assets/images/insomnia.png"),
  ]);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 32 - 16) / 2;

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
            Discover
          </Text>

          <View className="flex flex-row justify-between mb-4">
            <Text className="font-sans text-muted-foreground text-base">
              Recommended
            </Text>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RECOMMENDED_DATA}
            renderItem={({ item }) => (
              <Item
                title={item.title}
                id={item.id}
                icon={item.icon}
                description={item.description}
                assets={assets || []}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            className="mb-8"
            contentContainerStyle={{ paddingRight: 16 }}
          />

          <View className="flex flex-row justify-between mb-4">
            <Text className="font-sans text-muted-foreground text-base">
              Recent
            </Text>
          </View>

          <FlatList
            data={RECENT_DATA}
            renderItem={({ item }) => (
              <Item
                title={item.title}
                size="small"
                width={cardWidth}
                id={item.id}
                icon={item.icon}
                assets={assets || []}
                pathName={item.pathName}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingVertical: 8,
            }}
            scrollEnabled={false}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
