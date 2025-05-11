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
import { Link } from "expo-router";

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
import { weatherBackgroundImages } from "../../../constants/index";
import FadeInView from "../../components/FadeInView";
import { useFetchWeatherForecast } from "../../hooks/useFetchWeatherForecast";
import { useFetchWeatherLocation } from "../../hooks/useFetchWeatherLocation";

// icons
import { MapPinIcon } from "react-native-heroicons/solid";
import { SunIcon } from "react-native-heroicons/solid";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

//Notification Services
import { scheduleWeatherNotification } from "../../services/scheduleWeatherNotification";
import { useNotificationSetup } from "../../services/useNotificationSetup";

// Trong component của bạn
<MaterialCommunityIcons name="gauge" size={30} color="#007AFF" />;

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
  1: require("../../../assets/images/greenAirQuality.png"),
  2: require("../../../assets/images/yellowAirQuality.png"),
  3: require("../../../assets/images/brownAirQuality.png"),
  4: require("../../../assets/images/redAirQuality.png"),
  5: require("../../../assets/images/purpleAirQuality.png"),
  6: require("../../../assets/images/darkredAirQuality.png"),
};

const UVIndexLevels = [
  { min: 0, max: 1.9, level: "Low", color: "#00FF00" },
  { min: 2, max: 4.9, level: "Moderate", color: "#FFFF00" },
  { min: 5, max: 6.9, level: "High", color: "#FFA500" },
  { min: 7, max: 9.9, level: "Very High", color: "#FF0000" },
  { min: 10, max: 100, level: "Extreme", color: "#800080" },
];

export default function Index() {
  const [cityName, setCityName] = useState("singapore");
  const [searchCity, setSearchCity] = useState("");
  const [locations, setLocations] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [weather, setWeather] = useState(null);

  const {
    weatherForecastData,
    isWeatherForecastLoading,
    weatherForecastError,
  } = useFetchWeatherForecast({ cityName, days: "7" });

  const {
    weatherLocationData,
    isWeatherLocationLoading,
    weatherLocationError,
  } = useFetchWeatherLocation({
    cityName: searchCity,
    enabled: !!searchCity && searchCity.length > 2, // chỉ fetch khi có searchCity đủ dài
  });

  // khi có dữ liệu từ API, set lại giá trị cho weather

  function handleLocation(loc) {
    // console.log("handleLocation", loc);
    setLocations([]);
    setCityName(loc.name);
    setShowSearch(false);
  }

  function handleSearch(value) {
    setSearchCity(value);
  }

  useEffect(() => {
    if (weatherForecastData) setWeather(weatherForecastData);
  }, [weatherForecastData]);

  useEffect(() => {
    if (weatherLocationData) {
      setLocations(weatherLocationData);
    }
  }, [weatherLocationData]);

  function getWeatherImage(condition) {
    if (!condition) return weatherImages.other;
    // Chuẩn hóa: loại bỏ khoảng trắng dư, viết hoa chữ cái đầu mỗi từ
    const key = condition.trim();
    return weatherImages[key] || weatherImages.other;
  }
  function getWeatherBackground(condition) {
    if (!condition) return weatherBackgroundImages.other;
    // Chuẩn hóa: loại bỏ khoảng trắng dư, viết hoa chữ cái đầu mỗi từ
    const key = condition.trim();
    return weatherBackgroundImages[key] || weatherBackgroundImages.other;
  }

  const current = weather?.current;
  const location = weather?.location;

  //chỉ gọi hàm tìm kiếm sau khi người dùng ngừng gõ một khoảng thời gian
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  // ---------------- Fetch Hourly forecast data ------------------
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // "2025-05-03"
  // console.log("formattedDate", formattedDate);

  const now = new Date(weather?.location.localtime);
  const nowHour = now.getHours();

  // console.log("now", now);

  // console.log("weather.forecast.forecastday", weather?.forecast.forecastday);
  // Tìm forecastday đúng ngày hôm nay
  const todayForecast = weather?.forecast.forecastday.find(
    (item) => item.date === formattedDate
  );

  // console.log("todayForecast", todayForecast);

  // Nếu tìm thấy, lọc các giờ từ giờ hiện tại trở đi, lấy tối đa 12 tiếng
  let hourly12h = [];
  if (todayForecast) {
    hourly12h = todayForecast.hour
      .filter((h) => {
        const hDate = new Date(h.time);
        return hDate.getHours() >= nowHour;
      })
      .slice(0, 12);
  }
  // console.log("hourly12h", hourly12h);

  // --------------- Fetch Daily forecast data ------------------

  // Giả sử weather là object bạn đã lấy từ API
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Lấy 7 ngày đầu tiên (nếu có đủ)
  const dailyForecast = weather?.forecast?.forecastday
    .slice(0, 7)
    .map((item) => {
      const dateObj = new Date(item.date);
      return {
        day: daysOfWeek[dateObj.getDay()], // Tên viết tắt ngày trong tuần
        icon: item.day.condition.text, // Đường dẫn icon thời tiết
        lowTemp: Math.round(item.day.mintemp_c), // Nhiệt độ thấp nhất
        highTemp: Math.round(item.day.maxtemp_c), // Nhiệt độ cao nhất
      };
    });

  // console.log("dailyForecast", dailyForecast);

  // --------------- Fetch Wind information data ------------------

  const windSpeed = weather?.current.wind_kph; // 11.5

  const windDirText = weather?.current.wind_dir;

  const windDirDegree = weather?.current.wind_degree; // 200

  // --------------- Fetch Air Quality data ------------------

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

  // --------------- Fetch Other information data ------------------
  //UV Index
  function getUVIndexInfo(index) {
    // Đảm bảo index là số
    const uv = Number(index);
    // console.log(uv);
    const uvindex = UVIndexLevels.find(
      (level) => uv >= level.min && uv <= level.max
    );
    return uvindex;
  }
  const uvIndex = Number(weather?.current?.uv) || 0; // ví dụ: 5.5

  const uvInfo = getUVIndexInfo(uvIndex);

  const uvLevel = uvInfo?.level || "Unknown";
  const uvColor = uvInfo?.color || "#000";

  //humidity
  const humidity = weather?.current?.humidity; // ví dụ: 81
  //pressure
  const pressure = weather?.current?.pressure_in; // ví dụ: 29.82 inHg
  //Feel likes
  const feelLikes = weather?.current?.feelslike_c; // ví dụ: 29.82 inHg
  //cloud
  const cloud = weather?.current?.cloud; // ví dụ: 29.82 inHg
  //rain level
  const rainLevel = weather?.current?.precip_mm; // ví dụ: 29.82 inHg

  // Notification setup
  useNotificationSetup();
  useEffect(() => {
    const setupNotification = async () => {
      if (weather) {
        scheduleWeatherNotification(weather);
      }
    };
    setupNotification();
  }, [current]);

  return (
    <View className="flex-1">
      {/* <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      /> */}

      {isWeatherForecastLoading ? (
        <View className="flex-row items-center justify-center flex-1">
          <Progress.CircleSnail thickness={10} size={140} color={["#0bb3b2"]} />
        </View>
      ) : (
        <>
          <View className="absolute top-0 left-0 w-full h-full">
            <Image
              blurRadius={2}
              source={getWeatherBackground(current?.condition?.text)}
              className="absolute top-0 left-0 w-full h-full"
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.42)",
              }}
            />
          </View>
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
                    className="p-3 rounded-full bg-black/55 backdrop-blur-sm"
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
                className="flex justify-around flex-1 mx-4 mb-2 "
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
                  {hourly12h.map((item, index) => {
                    const hour = new Date(item.time).getHours();
                    const hourLabel = `${hour}:00`;

                    // let date = new Date(item.date);
                    // let options = { weekday: "long" };
                    // let dayName = date.toLocaleDateString("en-US", options);
                    // dayName = dayName.split(",")[0];
                    // // console.log("item.day.condition.text", item.day.condition.text);
                    // return (
                    //   <View
                    //     key={index}
                    //     className="flex items-center justify-center w-24 py-3 mr-4 space-y-1 bg-black/55 backdrop-blur-smrounded-3xl"
                    //   >
                    //     <Image
                    //       source={getWeatherImage(item.condition.text)}
                    //       className="w-11 h-11"
                    //     />

                    //     <Text className="text-white">{item.date}</Text>
                    //     <Text className="text-2xl font-semibold text-white">
                    //       {item?.day?.avgtemp_c}&#176;
                    //     </Text>
                    //   </View>
                    // );
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
                          {item.temp_c}&#176;
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
                <View className="flex flex-col max-w-md p-4 mx-5 bg-black/55 backdrop-blur-smrounded-3xl">
                  <View className="flex flex-col">
                    {dailyForecast?.map((item, index) => (
                      <Link href={`/day/${index}`} key={index} asChild>
                        <TouchableOpacity className="flex flex-col w-full">
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
                                source={getWeatherImage(item.icon)}
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
                        </TouchableOpacity>
                      </Link>
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
                  <View className="p-6 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[48%] flex flex-col justify-between items-center">
                    <Image
                      source={require("../../../assets/icons/pinwheel.png")}
                      className="w-20 h-20"
                      resizeMode="cover"
                    />
                    <Text className="text-lg text-center text-white">
                      Wind speed
                    </Text>
                    <Text className="text-xl font-semibold text-center text-white">
                      {windSpeed} kph
                    </Text>
                  </View>
                  <View className="p-6 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[48%] flex flex-col justify-between items-center">
                    <Image
                      source={require("../../../assets/icons/compass.png")}
                      className="w-20 h-20"
                      resizeMode="cover"
                    />
                    <Text className="text-lg text-center text-white">
                      Wind direction
                    </Text>
                    <Text className="text-xl font-semibold text-center text-white">
                      {windDirText}, {windDirDegree}&deg;
                    </Text>
                  </View>

                  {/* <View className="p-4 bg-black/55 backdrop-blur-smaspect-square rounded-3xl">
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
              {/* Other info */}
              <View className="mb-4 space-y-3">
                <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
                  <CalendarDaysIcon size="22" color="white" />
                  <Text className="text-lg font-semibold text-white">
                    Other Information
                  </Text>
                </View>
                <View className="flex flex-row flex-wrap justify-between mx-5">
                  <View className="p-4 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[48%] flex flex-col justify-between items-start">
                    <View className="flex flex-row items-center gap-1">
                      <SunIcon color="#d1d5db" size={18} />
                      <Text className="text-lg text-center text-gray-300">
                        UV Index
                      </Text>
                    </View>
                    <Text className="text-3xl font-bold text-center text-white">
                      {uvIndex}
                    </Text>
                    <Text className="text-3xl font-semibold text-center text-white">
                      {uvLevel}
                    </Text>
                    <View className="w-full">
                      <Progress.Bar
                        progress={uvIndex / 10}
                        width={null}
                        height={15}
                        color={uvColor}
                        borderRadius={20}
                      />
                    </View>
                  </View>
                  <View className="p-4 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start">
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
                      {humidity}%
                    </Text>
                    <Text className="font-semibold text-white text-md">
                      The dew point is 23.4&#176; right now.
                    </Text>
                  </View>
                  <View className="p-4 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start">
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
                      {pressure} inHg
                    </Text>
                    <Text className="font-semibold text-white text-md">
                      The dew point is 23.4&#176; right now.
                    </Text>
                  </View>
                  <View className="p-4 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start">
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
                      {feelLikes}&#176; C
                    </Text>
                    <Text className="font-semibold text-white text-md">
                      Humidity is making it fell warmer.
                    </Text>
                  </View>
                  <View className="p-4 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start">
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
                      {cloud}%
                    </Text>
                    <Text className="font-semibold text-white text-md">
                      The dew point is 23.4&#176; right now.
                    </Text>
                  </View>

                  <View className="p-4 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start">
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
                      {rainLevel} mm
                    </Text>
                    <Text className="font-semibold text-white text-md">
                      The dew point is 23.4&#176; right now.
                    </Text>
                  </View>

                  {/* <View className="p-4 bg-black/55 backdrop-blur-smaspect-square rounded-3xl">
                  <Text className="text-lg font-semibold text-white">
                    Daily forecast
                  </Text>
                </View> */}
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </>
      )}
    </View>
  );
}
