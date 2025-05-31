import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import React from "react";
import { SunIcon } from "react-native-heroicons/outline";
import * as Progress from "react-native-progress"; // Importing Progress for the progress bar
import { UVIndexLevels } from "../../constants/string"; // Importing UV index levels

function UVCard({ weather, location }) {
  function getUVIndexInfo(index) {
    // Đảm bảo index là số
    const uv = Number(index);
    // console.log(uv);
    const uvindex = UVIndexLevels.find(
      (level) => uv >= level.min && uv <= level.max
    );
    return uvindex;
  }
  const uvIndex = Number(weather?.current?.uv) || 0; // ví dụ: 5.5

  const uvInfo = getUVIndexInfo(uvIndex);

  const uvLevel = uvInfo?.level || "Unknown";
  const uvColor = uvInfo?.color || "#000";
  return (
    <Link
      href={{
        pathname: `/charts/DaysDetails`,
        params: {
          daysForecast: JSON.stringify(weather?.forecast?.forecastday),
          location: JSON.stringify(location),
          tab: "UV",
        },
      }}
      asChild
    >
      <TouchableOpacity className="p-4 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[170] flex flex-col justify-between items-start">
        <View className="flex flex-row items-center gap-1">
          <SunIcon color="#d1d5db" size={18} />
          <Text className="text-lg text-center text-gray-300">UV Index</Text>
        </View>
        <Text className="text-3xl font-bold text-center text-white">
          {uvIndex}
        </Text>
        <Text className="text-3xl font-semibold text-center text-white">
          {uvLevel}
        </Text>
        <View className="w-full">
          <Progress.Bar
            progress={uvIndex / 10}
            width={null}
            height={15}
            color={uvColor}
            borderRadius={20}
          />
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default UVCard;
