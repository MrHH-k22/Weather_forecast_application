import {
  Text,
  View,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { featchWeatherForecast, fetchLocation } from "../api/weather";

import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { weatherImages } from "../constants/index";
import * as Progress from "react-native-progress";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
  forecast: {
    forecastday: {
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        maxwind_mph: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        totalsnow_cm: number;
        avgvis_km: number;
        avgvis_miles: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
    }[];
  };
}

export default function Index() {
  const [locations, setLocations] = useState<
    { name: string; country: string }[]
  >([]);

  const [showSearch, setShowSearch] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  function handleLocation(loc: any) {
    // console.log("Location selected:", location);
    setLocations([]);
    setLoading(true);
    featchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      // console.log("Weather data:", data);
      setLoading(false);
    });
  }

  function handleSearch(value: string) {
    // console.log("Search value:", value);
    if (value.length > 2) {
      fetchLocation({ cityName: value }).then((data) => {
        // console.log("Fetched locations:", data);
        setLocations(data);
      });
    }
  }

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const current = weather?.current;
  const location = weather?.location;

  function fetchMyWeatherData() {
    // console.log("Fetching weather data first time");
    featchWeatherForecast({
      cityName: "singapore",
      days: "7",
    }).then((data) => {
      setWeather(data);
      // console.log("Weather data:", data);
      // console.log("Weather condition:", current?.condition?.text);
      // console.log("Image source:", weatherImages[]);

      setLoading(false);
    });
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  // console.log("Weather data:", weather);

  return (
    <View className="relative flex-1">
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        className="absolute top-0 left-0 w-full h-full"
      />
      {loading ? (
        <View className="flex-row items-center justify-center flex-1">
          <Progress.CircleSnail thickness={10} size={140} color={["#0bb3b2"]} />
        </View>
      ) : (
        <SafeAreaView
          className="flex flex-1"
          style={{
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
          edges={["right", "bottom", "left"]}
        >
          <View style={{ height: "7%" }} className="relative z-50 mx-4">
            <View className="flex-row items-center px-2 rounded-full bg-slate-500">
              <TextInput
                placeholder="Search city"
                onChangeText={handleTextDebounce}
                placeholderTextColor={"lightgray"}
                className="flex-1 p-3 text-white"
                onFocus={() => setShowSearch(true)}
              />
              <TouchableOpacity
                onPress={() => setShowSearch(false)}
                className="p-3 rounded-full bg-slate-600"
              >
                <MagnifyingGlassIcon color="white" size={20} />
              </TouchableOpacity>
            </View>

            {locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderclass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      className={
                        "flex-row items-center border-0 p-3 px-4 mb-1 " +
                        borderclass
                      }
                    >
                      <MapPinIcon size={20} color="gray" />
                      <Text className="ml-2 text-lg text-black">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          {/* forecast section */}
          <View className="flex justify-around flex-1 mx-4 mb-2">
            <Text className="text-2xl font-bold text-center text-white">
              {location?.name}
              <Text className="text-lg font-semibold text-gray-300">
                {", " + location?.country}
              </Text>
            </Text>
            {/* weather image */}
            <View className="flex-row justify-center">
              {/*  source={{ uri: "https:" + current?.condition?.icon }} */}
              <Image
                source={
                  current?.condition?.text &&
                  weatherImages[current.condition.text]
                    ? weatherImages[current.condition.text]
                    : require("../assets/images/sun.png")
                }
                className="w-52 h-52"
              />
            </View>
            {/* Degree celcius */}
            <View className="space-y-2">
              <Text className="ml-5 text-6xl font-bold text-center text-white">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-xl tracking-widest text-center text-white">
                {current?.condition?.text}
              </Text>
            </View>
            {/* Other stats */}
            <View className="flex-row justify-between mx-4">
              <View className="flex flex-row items-center space-x-2">
                <Image
                  source={require("../assets/icons/wind.png")}
                  className="w-6 h-6"
                />
                <Text className="font-semibold text-white textbase">
                  {" "}
                  {current?.wind_kph}
                </Text>
              </View>
              <View className="flex flex-row items-center space-x-2">
                <Image
                  source={require("../assets/icons/drop.png")}
                  className="w-6 h-6"
                />
                <Text className="font-semibold text-white textbase">
                  {" "}
                  {current?.humidity}
                </Text>
              </View>
              <View className="flex flex-row items-center space-x-2">
                <Image
                  source={require("../assets/icons/sun.png")}
                  className="w-6 h-6"
                />
                <Text className="font-semibold text-white textbase">
                  {" "}
                  10:12am
                </Text>
              </View>
            </View>
          </View>
          {/* forecast for the week */}
          <View className="mb-2 space-y-3">
            <View className="flex-row items-center gap-1 mx-5 space-x-2">
              <CalendarDaysIcon size="22" color="white" />
              <Text className="text-lg font-semibold text-white">
                Daily forecast
              </Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map(
                (
                  item: WeatherData["forecast"]["forecastday"][number],
                  index: number
                ) => {
                  let date = new Date(item.date);
                  let options = { weekday: "long" } as const;
                  let dayName = date.toLocaleDateString("en-US", options);
                  dayName = dayName.split(",")[0];
                  return (
                    <View
                      key={index}
                      className="flex items-center justify-center w-24 py-3 mr-4 space-y-1 rounded-3xl bg-slate-100/20"
                    >
                      <Image
                        source={
                          current?.condition?.text &&
                          weatherImages[current.condition.text]
                            ? weatherImages[current.condition.text]
                            : require("../assets/images/sun.png")
                        }
                        className="w-11 h-11"
                      />
                      <Text className="text-white">{item.date}</Text>
                      <Text className="text-2xl font-semibold text-white">
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                    </View>
                  );
                }
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
