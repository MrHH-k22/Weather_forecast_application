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
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";

const airQualityLevels = [
  {
    index: 1,
    category: "Very Good",
    color: "#39FF13",
    healthAdvice:
      "Enjoy outdoor activities. Open your windows to bring clean, fresh air to indoors",
  },
  {
    index: 2,
    category: "Good",
    color: "#FDFF00",
    healthAdvice:
      "Enjoy outdoor activities. Open your windows to bring clean, fresh air to indoors",
  },
  {
    index: 3,
    category: "Fair",
    color: "#FE6900",
    healthAdvice:
      "People unusually sensitive to air pollution: Plan strenuous outdoor activities when air quality is better",
  },
  {
    index: 4,
    category: "Poor",
    color: "#ef4444",
    healthAdvice:
      "Sensitive groups: Cut back or reschedule strenuous outdoor activities",
  },
  {
    index: 5,
    category: "Very Poor",
    color: "##7F4699",
    healthAdvice:
      "Sensitive groups: Avoid strenuous outdoor activities\nEveryone: Cut back or reschedule strenuous outdoor activities",
  },
  {
    index: 6,
    category: "Hazardous",
    color: "#800000",
    healthAdvice:
      "Sensitive groups: Avoid all outdoor physical activities\nEveryone: Significantly cut back on outdoor physical activities",
  },
];

const airQualityImages = {
  1: require("../../assets/images/greenAirQuality.png"),
  2: require("../../assets/images/yellowAirQuality.png"),
  3: require("../../assets/images/brownAirQuality.png"),
  4: require("../../assets/images/redAirQuality.png"),
  5: require("../../assets/images/purpleAirQuality.png"),
  6: require("../../assets/images/darkredAirQuality.png"),
};

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
        <CalendarDaysIcon size="22" color="white" />
        <Text className="text-lg font-semibold text-white">Air Quality</Text>
      </View>
      <View className="p-4 px-6 mx-5 bg-black/55 backdrop-blur-smrounded-3xl">
        <View className="flex flex-row my-2">
          <Image
            source={airQualityImageSource}
            className="w-20 h-20 bg-white rounded-3xl"
            resizeMode="cover"
          />
          <View className="flex flex-col justify-between ml-4">
            <Text
              className="text-5xl font-bold text-white "
              style={{ color: airQualityColor }}
            >
              {airQualityIndex}
            </Text>
            <Text className="text-lg font-semibold text-white">
              {airQualityCategory}
            </Text>
          </View>
        </View>
        <Text className="text-lg text-justify text-white">
          {airQualityHHealthAdvice}
          {/* Ẹnoy outdoor activities. Open your windows to bring clean, fresh air to indoors */}
        </Text>
      </View>
    </View>
  );
}

export default AirQuality;
