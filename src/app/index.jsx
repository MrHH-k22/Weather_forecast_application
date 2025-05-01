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
import { featchWeatherForecast, fetchLocation } from "../../api/weather";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { weatherImages } from "../../constants/index";
import * as Progress from "react-native-progress";
import FooterTab from "../components/footerTab";

export default function Index() {
  const [locations, setLocations] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleLocation(loc) {
    setLocations([]);
    setLoading(true);
    featchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  }

  function handleSearch(value) {
    if (value.length > 2) {
      fetchLocation({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  }

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  function getWeatherImage(condition) {
    if (!condition) return weatherImages.other;
    // Chuẩn hóa: loại bỏ khoảng trắng dư, viết hoa chữ cái đầu mỗi từ
    const key = condition.trim();
    return weatherImages[key] || weatherImages.other;
  }

  const current = weather?.current;
  const location = weather?.location;

  function fetchMyWeatherData() {
    featchWeatherForecast({
      cityName: "singapore",
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  return (
    <View className="relative flex-1">
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <Image
        blurRadius={70}
        source={require("../../assets/images/bg.png")}
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
              <Image
                source={getWeatherImage(current?.condition?.text)}
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
                  source={require("../../assets/icons/wind.png")}
                  className="w-6 h-6"
                />
                <Text className="font-semibold text-white textbase">
                  {" "}
                  {current?.wind_kph}
                </Text>
              </View>
              <View className="flex flex-row items-center space-x-2">
                <Image
                  source={require("../../assets/icons/drop.png")}
                  className="w-6 h-6"
                />
                <Text className="font-semibold text-white textbase">
                  {" "}
                  {current?.humidity}
                </Text>
              </View>
              <View className="flex flex-row items-center space-x-2">
                <Image
                  source={require("../../assets/icons/sun.png")}
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
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let options = { weekday: "long" };
                let dayName = date.toLocaleDateString("en-US", options);
                dayName = dayName.split(",")[0];
                console.log("item.day.condition.text", item.day.condition.text);
                return (
                  <View
                    key={index}
                    className="flex items-center justify-center w-24 py-3 mr-4 space-y-1 rounded-3xl bg-slate-100/20"
                  >
                    <Image
                      source={getWeatherImage(item.day.condition.text)}
                      className="w-11 h-11"
                    />

                    <Text className="text-white">{item.date}</Text>
                    <Text className="text-2xl font-semibold text-white">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <FooterTab />
        </SafeAreaView>
      )}
    </View>
  );
}
