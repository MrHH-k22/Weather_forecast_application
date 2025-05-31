import {
  Text,
  View,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import { Link } from "expo-router";
import React from "react";

import { GlobeAltIcon, BeakerIcon } from "react-native-heroicons/outline";

import { airQualityImages } from "../../constants/index";
import { airQualityLevels } from "../../constants/string"; // Importing air quality levels

function AirQuality({ weather }) {
  const airQuality = weather?.current.air_quality; // 11.5

  // Hàm lấy thông tin theo us-epa-index
  function getAirQualityInfo(epaIndex) {
    return airQualityLevels.find((level) => level.index === epaIndex);
  }

  // Sử dụng:
  const airQualityIndex = airQuality?.["us-epa-index"];
  const airQualityInfo = getAirQualityInfo(airQualityIndex);

  // Truy cập category và healthAdvice
  const airQualityCategory = airQualityInfo?.category || "Unknown";
  const airQualityHHealthAdvice =
    airQualityInfo?.healthAdvice || "No data available";
  const airQualityColor = airQualityInfo?.color || "#000"; // Mặc định là màu đen nếu không tìm thấy
  const airQualityImageSource =
    airQualityImages[airQualityIndex] || airQualityImages[2];

  return (
    <View className="mb-4 space-y-3">
      <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
        <GlobeAltIcon size="22" color="white" />
        <Text className="text-lg font-semibold text-white">Air Quality</Text>
      </View>
      <View className="p-4 px-6 mx-5 bg-black/55 backdrop-blur-smrounded-3xl">
        <View className="flex flex-row mt-3 mb-6">
          <Image
            source={airQualityImageSource}
            className="w-20 h-20 bg-white rounded-3xl"
            resizeMode="cover"
          />
          <View className="flex flex-col justify-between ml-4">
            <Text
              className="text-5xl font-bold text-white"
              style={{ color: airQualityColor }}
            >
              {airQualityIndex}
            </Text>
            <Text className="text-lg font-semibold text-white">
              {airQualityCategory}
            </Text>
          </View>
        </View>
        <Text className="mb-3 text-lg text-justify text-white">
          {airQualityHHealthAdvice}
          {/* Ẹnoy outdoor activities. Open your windows to bring clean, fresh air to indoors */}
        </Text>
      </View>
    </View>
  );
}

export default AirQuality;
