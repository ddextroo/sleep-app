import {
  TouchableOpacity,
  ImageBackground,
  View,
  Image,
  Text,
} from "react-native";
import { LinearGradient } from "react-native-svg";
import { getIcon } from "./getIcon";
import { RelativePathString, router } from "expo-router";

export const Item = ({
  title,
  size = "large",
  width,
  id,
  icon,
  description,
  assets,
  pathName
}: HomeItem) => {
  const imageSource =
    assets && assets[id]
      ? { uri: Image.resolveAssetSource(assets[id]).uri }
      : null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className={`${size === "small" ? "m-1" : "mx-2 my-2"}`}
      style={
        size === "small" ? { width: width ? width - 8 : 160 } : { width: 256 }
      }
      // onPress={()=> router.push(pathName as unknown as RelativePathString)}
      onPress={()=> console}
    >
      <ImageBackground
        source={imageSource}
        className={`${
          size === "large" ? "h-48" : "h-40"
        } rounded-xl overflow-hidden`}
      >
        {/* Gradient overlay to make text more readable */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: size === "large" ? 100 : 80,
          }}
        />

        <View className="flex-1 p-5 justify-end">
          {/* Icon badge */}
          <View className="absolute top-4 right-4 bg-black/40 p-2 rounded-full">
            {icon && getIcon(icon)}
          </View>

          <Text
            className={`text-white font-sans-bold ${
              size === "large" ? "text-2xl" : "text-lg"
            } mb-1`}
          >
            {title}
          </Text>

          {description && size === "large" && (
            <Text className="text-white/80 text-sm font-sans">
              {description}
            </Text>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
