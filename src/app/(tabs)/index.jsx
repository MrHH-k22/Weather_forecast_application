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
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import * as Progress from "react-native-progress";
// local imports
import { featchWeatherForecast, fetchLocation } from "../../../api/weather";
import { weatherImages } from "../../../constants/index";
import FadeInView from "../../components/FadeInView";

// icons
import { MapPinIcon } from "react-native-heroicons/solid";
import { SunIcon } from "react-native-heroicons/solid";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Trong component của bạn
<MaterialCommunityIcons name="gauge" size={30} color="#007AFF" />;

const forecast = [
  { day: "Today", icon: "sun", lowTemp: 27, highTemp: 37 },
  { day: "Fri", icon: "cloudsun", lowTemp: 26, highTemp: 36 },
  { day: "Sat", icon: "cloud", lowTemp: 25, highTemp: 37 },
  { day: "Sun", icon: "cloud", lowTemp: 25, highTemp: 35 },
  { day: "Mon", icon: "cloud", lowTemp: 25, highTemp: 33 },
  { day: "Tue", icon: "cloudsun", lowTemp: 25, highTemp: 35 },
  { day: "Wed", icon: "cloudsun", lowTemp: 25, highTemp: 34 },
  { day: "Thu", icon: "cloudsun", lowTemp: 26, highTemp: 35 },
  { day: "Fri", icon: "cloudsun", lowTemp: 26, highTemp: 36 },
];

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
    <View className="flex-1">
      {/* <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      /> */}
      <Image
        blurRadius={70}
        source={require("../../../assets/images/bg.png")}
        className="absolute top-0 left-0 w-full h-full"
        resizeMode="cover"
      />
      {loading ? (
        <View className="flex-row items-center justify-center flex-1">
          <Progress.CircleSnail thickness={10} size={140} color={["#0bb3b2"]} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            minHeight: "100%",
            paddingBottom: 10,
          }}
          className="flex-1 px-2"
          showsVerticalScrollIndicator={false}
          vertical
        >
          <SafeAreaView
            className="flex flex-1"
            edges={["right", "bottom", "left", "top"]}
          >
            <View style={{ height: 56 }} className="mx-4 ">
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
            <View
              className="flex justify-around flex-1 mx-4 mb-2"
              style={{ height: 500 }}
            >
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
                    source={require("../../../assets/icons/wind.png")}
                    className="w-6 h-6"
                  />
                  <Text className="font-semibold text-white textbase">
                    {" "}
                    {current?.wind_kph}
                  </Text>
                </View>
                <View className="flex flex-row items-center space-x-2">
                  <Image
                    source={require("../../../assets/icons/drop.png")}
                    className="w-6 h-6"
                  />
                  <Text className="font-semibold text-white textbase">
                    {" "}
                    {current?.humidity}
                  </Text>
                </View>
                <View className="flex flex-row items-center space-x-2">
                  <Image
                    source={require("../../../assets/icons/sun.png")}
                    className="w-6 h-6"
                  />
                  <Text className="font-semibold text-white textbase">
                    {" "}
                    10:12am
                  </Text>
                </View>
              </View>
            </View>

            {/* Hourly forecast */}
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
                {weather?.forecast?.forecastday?.map((item, index) => {
                  let date = new Date(item.date);
                  let options = { weekday: "long" };
                  let dayName = date.toLocaleDateString("en-US", options);
                  dayName = dayName.split(",")[0];
                  // console.log("item.day.condition.text", item.day.condition.text);
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
            {/* Daily forecast */}
            <View className="mb-4 space-y-3">
              <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
                <CalendarDaysIcon size="22" color="white" />
                <Text className="text-lg font-semibold text-white">
                  Daily forecast
                </Text>
              </View>
              <View className="flex flex-col max-w-md p-4 mx-5 rounded-3xl bg-slate-100/20">
                <View className="flex flex-col">
                  {forecast.map((item, index) => (
                    <View
                      key={index}
                      className="flex flex-row items-center justify-between py-4 border-b border-blue-400"
                      style={{ alignItems: "center" }}
                    >
                      {/* Ngày */}
                      <Text
                        className="text-xl font-bold text-left text-white"
                        style={{ width: 48 }}
                      >
                        {item.day}
                      </Text>

                      {/* Icon thời tiết */}
                      <View style={{ width: 32, alignItems: "center" }}>
                        <Image
                          source={
                            weatherImages[item.icon] || weatherImages.other
                          }
                          style={{ width: 24, height: 24 }}
                        />
                      </View>

                      {/* Nhiệt độ thấp */}
                      <Text
                        className="text-xl text-right text-white"
                        style={{ width: 36 }}
                      >
                        {item.lowTemp}°
                      </Text>

                      {/* Thanh khoảng nhiệt độ */}
                      <View
                        className="relative h-1 mx-4 overflow-hidden bg-blue-400 rounded-full"
                        style={{ width: 120 }}
                      >
                        <View
                          className="absolute h-full bg-orange-500 rounded-full"
                          style={{
                            width: `${
                              ((item.highTemp - item.lowTemp) / 15) * 100
                            }%`,
                          }}
                        />
                      </View>

                      {/* Nhiệt độ cao */}
                      <Text
                        className="text-xl text-right text-white"
                        style={{ width: 36 }}
                      >
                        {item.highTemp}°
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            {/* Wind information */}
            <View className="mb-4 space-y-3">
              <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
                <CalendarDaysIcon size="22" color="white" />
                <Text className="text-lg font-semibold text-white">
                  Wind information
                </Text>
              </View>
              <View className="flex flex-row flex-wrap justify-between mx-5">
                <View className="p-6 rounded-3xl bg-slate-100/20 mb-6 h-[160] w-[48%] flex flex-col justify-between items-center">
                  <Image
                    source={require("../../../assets/icons/pinwheel.png")}
                    className="w-20 h-20"
                    resizeMode="cover"
                  />
                  <Text className="text-lg text-center text-white">
                    Wind speed
                  </Text>
                  <Text className="text-xl font-semibold text-center text-white">
                    6.8kph
                  </Text>
                </View>
                <View className="p-6 rounded-3xl bg-slate-100/20 mb-6 h-[160] w-[48%] flex flex-col justify-between items-center">
                  <Image
                    source={require("../../../assets/icons/compass.png")}
                    className="w-20 h-20"
                    resizeMode="cover"
                  />
                  <Text className="text-lg text-center text-white">
                    Wind direction
                  </Text>
                  <Text className="text-xl font-semibold text-center text-white">
                    South west, 45&#176;
                  </Text>
                </View>

                {/* <View className="p-4 aspect-square rounded-3xl bg-slate-100/20">
                  <Text className="text-lg font-semibold text-white">
                    Daily forecast
                  </Text>
                </View> */}
              </View>
            </View>
            {/* Air Quality */}
            <View className="mb-4 space-y-3">
              <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
                <CalendarDaysIcon size="22" color="white" />
                <Text className="text-lg font-semibold text-white">
                  Air Quality
                </Text>
              </View>
              <View className="p-4 px-6 mx-5 rounded-3xl bg-slate-100/20">
                <Text className="mb-4 text-lg font-semibold text-white">
                  Air Quality Index
                </Text>
                <View className="flex flex-row my-2">
                  <Image
                    source={require("../../../assets/icons/pinwheel.png")}
                    className="w-20 h-20"
                    resizeMode="cover"
                  />
                  <View className="flex flex-col justify-between ml-4">
                    <Text className="text-3xl font-bold text-white">57</Text>
                    <Text className="text-lg text-white">Moderate</Text>
                  </View>
                </View>
                <Text className="text-lg font-semibold text-justify text-white">
                  People unusually sensitive to air pollution. Plan strenuous
                  outdoor activities when air quality is better
                  {/* Ẹnoy outdoor activities. Open your windows to bring clean, fresh air to indoors */}
                </Text>
              </View>
            </View>
            {/* Other info */}
            <View className="mb-4 space-y-3">
              <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
                <CalendarDaysIcon size="22" color="white" />
                <Text className="text-lg font-semibold text-white">
                  Other Information
                </Text>
              </View>
              <View className="flex flex-row flex-wrap justify-between mx-5">
                <View className="p-4 rounded-3xl bg-slate-100/20 mb-6 h-[160] w-[48%] flex flex-col justify-between items-start">
                  <View className="flex flex-row items-center gap-1">
                    <SunIcon color="#d1d5db" size={18} />
                    <Text className="text-lg text-center text-gray-300">
                      UV Index
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-center text-white">
                    0
                  </Text>
                  <Text className="text-3xl font-semibold text-center text-white">
                    Low
                  </Text>
                  <Progress.Bar
                    progress={0.3}
                    width={140}
                    height={15}
                    color={"yellow"}
                    borderRadius={20}
                  />
                </View>
                <View className="p-4 rounded-3xl bg-slate-100/20 mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start">
                  <View className="flex flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="water-percent"
                      size={18}
                      color="#d1d5db"
                    />
                    <Text className="text-lg text-center text-gray-300">
                      Humidity
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-center text-white">
                    81%
                  </Text>
                  <Text className="font-semibold text-white text-md">
                    The dew point is 23.4&#176; right now.
                  </Text>
                </View>
                <View className="p-4 rounded-3xl bg-slate-100/20 mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start">
                  <View className="flex flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="gauge"
                      size={18}
                      color="#d1d5db"
                    />
                    <Text className="text-lg text-center text-gray-300">
                      Pressure
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-center text-white">
                    29.82 inHg
                  </Text>
                  <Text className="font-semibold text-white text-md">
                    The dew point is 23.4&#176; right now.
                  </Text>
                </View>
                <View className="p-4 rounded-3xl bg-slate-100/20 mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start">
                  <View className="flex flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="thermometer"
                      size={18}
                      color="#d1d5db"
                    />
                    <Text className="text-lg text-center text-gray-300">
                      Feel likes
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-center text-white">
                    29&#176;
                  </Text>
                  <Text className="font-semibold text-white text-md">
                    Humidity is making it fell warmer.
                  </Text>
                </View>
                <View className="p-4 rounded-3xl bg-slate-100/20 mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start">
                  <View className="flex flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="cloud"
                      size={18}
                      color="#d1d5db"
                    />
                    <Text className="text-lg text-center text-gray-300">
                      Cloud
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-center text-white">
                    25%
                  </Text>
                  <Text className="font-semibold text-white text-md">
                    The dew point is 23.4&#176; right now.
                  </Text>
                </View>

                <View className="p-4 rounded-3xl bg-slate-100/20 mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start">
                  <View className="flex flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="weather-rainy"
                      size={18}
                      color="#d1d5db"
                    />
                    <Text className="text-lg text-center text-gray-300">
                      Rain level
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-center text-white">
                    400 mm
                  </Text>
                  <Text className="font-semibold text-white text-md">
                    The dew point is 23.4&#176; right now.
                  </Text>
                </View>

                {/* <View className="p-4 aspect-square rounded-3xl bg-slate-100/20">
                  <Text className="text-lg font-semibold text-white">
                    Daily forecast
                  </Text>
                </View> */}
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      )}
    </View>
  );
}
