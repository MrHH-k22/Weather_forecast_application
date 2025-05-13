import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CheckIcon } from "react-native-heroicons/outline";
import { useFetchWeatherForecast } from "../hooks/useFetchWeatherForecast";

const CityWeatherCard = ({
  city,
  isSelectionMode,
  selected,
  onSelect,
  onNavigate,
}) => {
  const cityParts = city.split(", ");
  const cityName = cityParts[0];
  const countryName = cityParts[1] || null;

  // Use the hook for this specific city
  const {
    weatherForecastData,
    isWeatherForecastLoading,
    weatherForecastError,
  } = useFetchWeatherForecast({ cityName, days: "7" });

  // Select background color based on temperature
  const getBgColor = (temp) => {
    if (temp >= 30) return "bg-orange-500";
    if (temp >= 25) return "bg-yellow-500";
    if (temp >= 15) return "bg-blue-500";
    return "bg-indigo-500";
  };

  if (isWeatherForecastLoading) {
    return (
      <View className="p-4 mb-4 bg-slate-500 rounded-3xl">
        <Text className="text-white">Loading {cityName}...</Text>
      </View>
    );
  }

  if (weatherForecastError) {
    return (
      <View className="p-4 mb-4 bg-red-500 rounded-3xl">
        <Text className="text-white">Error loading data for {cityName}</Text>
      </View>
    );
  }

  // Extract data from the forecast response
  const current = weatherForecastData?.current || {};
  const forecast = weatherForecastData?.forecast?.forecastday[0]?.day || {};
  const temperature = Math.round(current.temp_c || 0);
  const condition = current.condition?.text || "Unknown";
  const high = Math.round(forecast.maxtemp_c || 0);
  const low = Math.round(forecast.mintemp_c || 0);
  const bgColor = getBgColor(temperature);

  return (
    <TouchableOpacity
      onPress={() => (isSelectionMode ? onSelect(city) : onNavigate(cityName))}
      onLongPress={() => onSelect(city)}
      activeOpacity={0.8}
    >
      <View
        className={`${bgColor} rounded-3xl mb-4 p-4 ${
          selected ? "border-2 border-white" : ""
        }`}
      >
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-lg font-semibold text-white">{cityName}</Text>
            {countryName && (
              <Text className="text-sm text-white">{countryName}</Text>
            )}
            <Text className="text-sm text-white">{condition}</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-5xl font-light text-white">
              {temperature}°
            </Text>
            {isSelectionMode && (
              <View
                className={`w-6 h-6 rounded-full mr-2 items-center justify-center ${
                  selected ? "bg-blue-500" : "bg-white bg-opacity-30"
                }`}
              >
                {selected && <CheckIcon color="white" size={16} />}
              </View>
            )}
          </View>
        </View>
        <View className="flex-row items-start justify-between mt-1">
          <View className="flex-row items-center justify-end flex-1">
            <Text className="text-white">H:{high}° </Text>
            <Text className="text-white">L:{low}°</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CityWeatherCard;
