import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Link, useRouter } from "expo-router";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { useFetchWeatherForecast } from "../../hooks/useFetchWeatherForecast";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
function AddCityPage() {
  const [weather, setWeather] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const params = useLocalSearchParams();
  const cityNameParam = params.cityName;
  const countryName = params.countryName;

  let cityName = cityNameParam;
  if (cityName !== undefined) {
    cityName = cityName + ", " + countryName;
    const {
      weatherForecastData,
      isWeatherForecastLoading,
      weatherForecastError,
    } = useFetchWeatherForecast({ cityName, days: "7" });
    useEffect(() => {
      if (weatherForecastData) setWeather(weatherForecastData);
    }, [weatherForecastData]);

    console.log("weatherForecastData", weatherForecastData);

    const daysForecast = weather?.forecast?.forecastday;
    // console.log("weather", daysForecast);
    // console.log("daysForecast", daysForecast);
    let dailyData = [];
    if (daysForecast) {
      dailyData = daysForecast.map((day) => ({
        date: day.date,
        icon: day.day.condition.icon,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        maxWind: day.day.maxwind_kph,
      }));
    }

    // Prepare chart data for max and min temperatures
    const maxTempChartData = dailyData.map((item) => ({
      value: item.maxTemp,
      dataPointText: `${item.maxTemp}\u00b0`,
      label: format(new Date(item.date), "dd/MM"),
    }));

    const minTempChartData = dailyData.map((item) => ({
      value: item.minTemp,
      dataPointText: `${item.minTemp}\u00b0`,
      label: format(new Date(item.date), "dd/MM"),
    }));

    // Calculate max and min values for chart scaling
    const allTemps = [
      ...maxTempChartData.map((d) => d.value),
      ...minTempChartData.map((d) => d.value),
    ];
    const maxTempValue = Math.max(...allTemps);
    const minTempValue = Math.min(...allTemps);
    const dayWidth = 100;
    const totalChartWidth = dayWidth * (daysForecast?.length || 7);
    // Initialize favorites in AsyncStorage if it does not exist
    const initializeFavorites = async () => {
      try {
        const favorites = await AsyncStorage.getItem("favorites");
        if (favorites === null) {
          await AsyncStorage.setItem("favorites", JSON.stringify([]));
        }
      } catch (error) {
        console.log("Error initializing favorites", error);
      }
    };

    useEffect(() => {
      // Initialize favorites when the app loads
      initializeFavorites();
      checkIfFavorite(); // Check if the current city is a favorite
    }, []);

    // Function to check if the city is already a favorite
    const checkIfFavorite = async () => {
      try {
        const favorites = await AsyncStorage.getItem("favorites");
        if (favorites) {
          const favoriteList = JSON.parse(favorites);
          const isCityInFavorites = favoriteList.includes(cityName);
          setIsFavorite(isCityInFavorites);
        }
      } catch (error) {
        console.log("Error reading favorites", error);
      }
    };

    // Function to add city to the favorite list
    const handleFavorite = async () => {
      try {
        const favorites = await AsyncStorage.getItem("favorites");
        const favoriteList = favorites ? JSON.parse(favorites) : [];

        // Add the city to the favorite list if not already there
        if (!favoriteList.includes(cityName)) {
          favoriteList.push(cityName);
          await AsyncStorage.setItem("favorites", JSON.stringify(favoriteList));
          setIsFavorite(true); // Mark as favorite
        }
      } catch (error) {
        console.log("Error adding to favorites", error);
      }
    };
    const router = useRouter();
    const navigateToHome = (cityName) => {
      if (cityName) {
        router.push({
          pathname: "/",
          params: { cityName },
        });
      }
    };
    return (
      <View className="flex-1 p-4 bg-white-100 ">
        <View className="flex flex-row items-center justify-between mt-2 mb-4">
          <Text className="text-3xl font-semibold text-gray-800">
            {cityNameParam}
            {", "}
            <Text className="text-3xl font-semibold text-gray-500">
              {countryName}
            </Text>
          </Text>
        </View>

        <View className="mt-4">
          {/* Temperature Chart */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={dayWidth}
            decelerationRate="fast"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              {/* Day Labels Above the Chart */}
              <View className="flex-row mt-4 ml-2">
                {dailyData.map((item, index) => (
                  <View key={index} style={{ width: dayWidth }}>
                    <Text
                      style={{
                        color: "gray",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    >
                      {format(new Date(item.date), "dd/MM")}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="h-[300px]">
                <LineChart
                  data={maxTempChartData}
                  data2={minTempChartData}
                  height={300}
                  width={totalChartWidth}
                  spacing={dayWidth}
                  color="#FF6315" // Max temp color
                  color2="#4169D2" // Min temp color
                  thickness={3}
                  areaChart
                  startFillColor="rgba(255, 255, 255, 0.8)" // Semi-transparent white
                  endFillColor="rgba(255, 255, 255, 0.8)" // Semi-transparent white
                  secondaryStartFillColor="rgba(255, 255, 255, 0.8)" // Semi-transparent white for min temp
                  secondaryEndFillColor="rgba(255, 255, 255, 0.8)"
                  startOpacity={0.6}
                  endOpacity={0.1}
                  initialSpacing={20}
                  hideYAxisText
                  hideXAxisText
                  yAxisColor="transparent"
                  xAxisColor="transparent"
                  dataPointsColor="#FF6347"
                  dataPointsColor2="#4169E1"
                  dataPointsRadius={5}
                  yAxisLabelWidth={0}
                  xAxisLabelsHeight={0}
                  textColor1="#FF6315"
                  textColor2="#4169D2"
                  textShiftY={20}
                  textFontSize={12}
                  dataPointsHeight={8}
                  dataPointsWidth={8}
                  maxValue={Math.ceil(maxTempValue * 1.1)}
                  minValue={Math.floor(minTempValue * 0.9)}
                  noOfSections={3}
                  overflowTop={50}
                  stepHeight={70}
                  hideRules
                />
              </View>
              <View className="flex-row mt-0">
                {dailyData.map((item, index) => (
                  <View key={index} style={{ width: dayWidth }}>
                    <Text className="text-gray-500">
                      {item.maxWind.toFixed(1)} km/h
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
        {/* Add to Favorites Button */}
        <View className="items-center justify-center">
          <TouchableOpacity
            onPress={() => {
              if (isFavorite) {
                navigateToHome(cityName);
              } else {
                handleFavorite();
              }
            }}
            className="bg-[#4F8BFF] w-20 h-20 rounded-full items-center justify-center mb-2 mt-20"
          >
            <Feather
              name={isFavorite ? "chevron-right" : "plus"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text className="text-lg font-bold text-[#6C7B8B] text-center">
            {isFavorite ? "Added to favorites" : "Add to favorite list"}
          </Text>
        </View>
      </View>
    ); // Add to favorite list
  }

  return (
    <View className="flex-1 p-4 bg-white-100">
      <Text>Loading or no city selected</Text>
    </View>
  );
}

export default AddCityPage;
