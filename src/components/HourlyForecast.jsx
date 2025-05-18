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

function HourlyForecast({
  hourly12h,
  todayForecast,
  location,
  getWeatherImage,
  displayTemperature,
}) {
  return (
    <View className="mb-4 space-y-3">
      <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2 ">
        <CalendarDaysIcon size="22" color="white" />
        <Text className="text-lg font-semibold text-white">
          Hourly forecast
        </Text>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 15 }}
        showsHorizontalScrollIndicator={false}
      >
        {hourly12h.map((item, index) => {
          const hour = new Date(item.time).getHours();
          const hourLabel = `${hour}:00`;
          return (
            <View
              key={index}
              className="flex items-center justify-center w-24 py-3 mr-4 space-y-1 bg-black/55 backdrop-blur-smrounded-3xl"
            >
              <Image
                source={getWeatherImage(item.condition.text)}
                className="w-11 h-11"
              />

              <Text className="text-white">{hourLabel}</Text>
              <Text className="text-2xl font-semibold text-white">
                {displayTemperature(item.temp_c)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <View className="mx-5 mt-4">
        <Link
          href={{
            pathname: `/charts/HoursDetails`,
            params: {
              todayForecast: JSON.stringify(todayForecast),
              location: JSON.stringify(location),
            },
          }}
          asChild
        >
          <TouchableOpacity className="flex items-center justify-center w-full py-4 bg-teal-500 shadow-md rounded-3xl shadow-black">
            <View className="flex-row items-center">
              <Text className="text-lg font-semibold text-white">
                24 Hours forecast
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

export default HourlyForecast;
