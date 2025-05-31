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
import React from "react";

function CurrentWeather({
  location,
  current,
  getWeatherImage,
  displayTemperature,
  convertWindSpeed,
  getWindSpeedUnit,
  windSpeed,
  humidity,
}) {
  return (
    <View
      className="flex justify-around flex-1 mt-8 mb-2"
      style={{ height: 500 }}
    >
      <Text className="text-3xl font-bold text-center text-white">
        {location?.name}
        <Text className="text-2xl font-semibold text-gray-300">
          {", " + location?.country}
        </Text>
      </Text>
      {/* weather image */}
      <View className="flex-row justify-center">
        <Image
          source={getWeatherImage(current?.condition?.text)}
          className="w-52 h-52"
        />
      </View>
      {/* Degree celcius */}
      <View className="space-y-2">
        <Text className="ml-5 text-6xl font-bold text-center text-white">
          {displayTemperature(current?.temp_c)}
        </Text>
        <Text className="text-xl tracking-widest text-center text-white">
          {current?.condition?.text}
        </Text>
      </View>
      {/* Other stats */}
      <View className="flex-row justify-around mx-4">
        <View className="flex flex-row items-center space-x-2">
          <Image
            source={require("../../assets/icons/wind.png")}
            className="w-6 h-6"
          />
          <Text className="font-semibold text-white textbase">
            {" "}
            {Math.round(convertWindSpeed(windSpeed))} {getWindSpeedUnit()}
          </Text>
        </View>
        <View className="flex flex-row items-center space-x-2">
          <Image
            source={require("../../assets/icons/drop.png")}
            className="w-6 h-6"
          />
          <Text className="font-semibold text-white textbase">
            {" "}
            {humidity} %
          </Text>
        </View>
        <View className="flex flex-row items-center space-x-2">
          <Image
            source={require("../../assets/icons/sun.png")}
            className="w-6 h-6"
          />
          <Text className="font-semibold text-white textbase">
            {" "}
            {location?.localtime
              ? new Date(location.localtime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default CurrentWeather;
