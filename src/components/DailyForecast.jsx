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

function DailyForecast({
  dailyForecast,
  weather,
  location,
  getWeatherImage,
  displayTemperature,
}) {
  return (
    <View className="mb-4 space-y-3">
      <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
        <CalendarDaysIcon size="22" color="white" />
        <Text className="text-lg font-semibold text-white">Daily forecast</Text>
      </View>
      <View className="flex flex-col max-w-md p-4 mx-5 bg-black/55 backdrop-blur-smrounded-3xl">
        <View className="flex flex-col">
          {dailyForecast?.map((item, index) => (
            <View
              key={index}
              className="flex flex-row items-center justify-between py-4 border-b border-gray-400"
              style={{ alignItems: "center" }}
            >
              {/* Ngày */}
              <Text
                className="text-xl font-bold text-left text-white"
                style={{ width: 45 }}
              >
                {item.day}
              </Text>

              {/* Icon thời tiết */}
              <View style={{ width: 28, alignItems: "center" }}>
                <Image
                  source={getWeatherImage(item.icon)}
                  style={{ width: 24, height: 24 }}
                />
              </View>

              {/* Nhiệt độ thấp */}
              <Text
                className="text-base text-right text-white"
                style={{ width: 36 }}
              >
                {displayTemperature(item.lowTemp)}
              </Text>

              {/* Thanh khoảng nhiệt độ */}
              <View
                className="relative h-1 mx-4 overflow-hidden bg-teal-500 rounded-full"
                style={{ width: 110 }}
              >
                <View
                  className="absolute h-full bg-orange-500 rounded-full"
                  style={{
                    width: `${((item.highTemp - item.lowTemp) / 15) * 100}%`,
                  }}
                />
              </View>

              {/* Nhiệt độ cao */}
              <Text
                className="text-base text-right text-white"
                style={{ width: 36 }}
              >
                {displayTemperature(item.highTemp)}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View className="mx-5 mt-4">
        <Link
          href={{
            pathname: `/charts/DaysDetails`,
            params: {
              daysForecast: JSON.stringify(weather?.forecast?.forecastday),
              location: JSON.stringify(location),
            },
          }}
          asChild
        >
          <TouchableOpacity className="flex items-center justify-center w-full py-4 bg-teal-500 shadow-md rounded-3xl shadow-black">
            <View className="flex-row items-center">
              <Text className="text-lg font-semibold text-white">
                7 days forecast
              </Text>
              <ChevronRightIcon
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

export default DailyForecast;
