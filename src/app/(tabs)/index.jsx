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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import * as Progress from "react-native-progress";
// local imports
import { weatherImages } from "../../../constants/index";
import { weatherBackgroundImages } from "../../../constants/index";
import { useFetchWeatherForecast } from "../../hooks/useFetchWeatherForecast";
import { useFetchWeatherLocation } from "../../hooks/useFetchWeatherLocation";

//components
import HourlyForecast from "../../components/HourlyForecast";

// icons
import { MapPinIcon } from "react-native-heroicons/solid";
import { SunIcon } from "react-native-heroicons/solid";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";

//Notification Services
import { scheduleWeatherNotification } from "../../services/scheduleWeatherNotification";
import { useNotificationSetup } from "../../services/useNotificationSetup";
import {
  startBackgroundTask,
  stopBackgroundTask,
} from "../../services/backgroundTask";

import { useUnitsContext } from "../../context/UnitsContext";
import DailyForecast from "../../components/DailyForecast";
import AirQuality from "../../components/AirQuality";
import WindCard from "../../components/WindCard";
import UVCard from "../../components/UVCard";
import WeatherMetricCard from "../../components/WeatherMetricCard";

export default function Index() {
  const [cityName, setCityName] = useState("singapore");
  const [searchCity, setSearchCity] = useState("");
  const [locations, setLocations] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric"); // Thêm state cho đơn vị đo
  const params = useLocalSearchParams();
  const cityNameParam = params.cityName;
  const router = useRouter(); // Đảm bảo có useRouter được import

  const {
    convertTemperature,
    convertWindSpeed,
    convertPrecipitation,
    getTemperatureUnit,
    getWindSpeedUnit,
    getPrecipitationUnit,
  } = useUnitsContext();

  // Thay đổi cách hiển thị nhiệt độ
  const displayTemperature = (temp) => {
    if (temp === undefined || temp === null) {
      return `0${getTemperatureUnit()}`;
    }
    return `${Math.round(convertTemperature(temp))}${getTemperatureUnit()}`;
  };

  // Đối với tốc độ gió
  const displayWindSpeed = (speed) => {
    if (speed === undefined || speed === null) {
      return `0 ${getWindSpeedUnit()}`;
    }
    return `${Math.round(convertWindSpeed(speed))} ${getWindSpeedUnit()}`;
  };

  // Đối với lượng mưa - hiển thị với 3 chữ số thập phân
  const displayPrecipitation = (precip) => {
    if (precip === undefined || precip === null) {
      return `0.000 ${getPrecipitationUnit()}`;
    }
    return `${convertPrecipitation(precip, 3).toFixed(
      3
    )} ${getPrecipitationUnit()}`;
  };

  useEffect(() => {
    if (cityNameParam && cityName !== cityNameParam) {
      setCityName(cityNameParam);
    }
  }, [cityNameParam, cityName]);
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

  // Tải đơn vị đo từ AsyncStorage khi component mount
  useEffect(() => {
    const loadUnits = async () => {
      try {
        const savedUnits = await AsyncStorage.getItem("units");
        if (savedUnits) {
          setUnits(savedUnits);
        }
      } catch (error) {
        console.error("Error loading units:", error);
      }
    };

    loadUnits();
  }, []);

  // Lưu đơn vị đo vào AsyncStorage khi thay đổi
  useEffect(() => {
    const saveUnits = async () => {
      try {
        await AsyncStorage.setItem("units", units);
      } catch (error) {
        console.error("Error saving units:", error);
      }
    };

    saveUnits();
  }, [units]);

  // khi có dữ liệu từ API, set lại giá trị cho weather

  function handleLocation(loc) {
    // console.log("handleLocation", loc);
    setLocations([]);
    setCityName(loc.name);
    setShowSearch(false);

    // Lưu thành phố đã chọn để background task có thể sử dụng
    AsyncStorage.setItem("lastCity", loc.name);
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

  // --------------- Fetch Other information data ------------------
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
    // Lần đầu tiên mở app
    const hasShownInitialNotification = async () => {
      const hasShown = await AsyncStorage.getItem("initialNotificationShown");
      if (!weather) return;
      if (!hasShown || hasShown === null) {
        try {
          // Chỉ hiển thị thông báo và lưu trạng thái nếu chưa hiển thị
          await scheduleWeatherNotification(weather);
          await AsyncStorage.setItem("initialNotificationShown", "true");
        } catch (error) {
          console.error("Error scheduling notification:", error);
        }
      }

      // Đảm bảo background task được đăng ký (vẫn giữ lại)
      startBackgroundTask();
    };

    hasShownInitialNotification();

    return () => {
      // Dọn dẹp khi component unmount
      stopBackgroundTask();
    };
  }, [weather]);
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
                  <View
                    style={{
                      position: "absolute",
                      top: 64, // hoặc top: 56/60 tùy chiều cao thanh search
                      left: 0,
                      width: "100%",
                      zIndex: 100, // Đảm bảo cao hơn các thành phần khác
                      elevation: 10, // Thêm cho Android
                      borderRadius: 24,
                      backgroundColor: "#e5e7eb", // bg-gray-300
                    }}
                  >
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
                    {displayTemperature(current?.temp_c)}
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
                      {Math.round(convertWindSpeed(windSpeed))}{" "}
                      {getWindSpeedUnit()}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center space-x-2">
                    <Image
                      source={require("../../../assets/icons/drop.png")}
                      className="w-6 h-6"
                    />
                    <Text className="font-semibold text-white textbase">
                      {" "}
                      {humidity}
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
              <HourlyForecast
                hourly12h={hourly12h}
                todayForecast={todayForecast}
                location={location}
                getWeatherImage={getWeatherImage}
                displayTemperature={displayTemperature}
              />
              {/* Daily forecast */}
              <DailyForecast
                dailyForecast={dailyForecast}
                weather={weather}
                location={location}
                getWeatherImage={getWeatherImage}
                displayTemperature={displayTemperature}
              />
              {/* Wind information */}
              <View className="mb-4 space-y-3">
                <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
                  <CalendarDaysIcon size="22" color="white" />
                  <Text className="text-lg font-semibold text-white">
                    Wind information
                  </Text>
                </View>
                <View className="flex flex-row flex-wrap justify-between mx-5">
                  {/* Wind speed */}
                  <WindCard
                    weather={weather}
                    location={location}
                    imageSource={require("../../../assets/icons/pinwheel.png")}
                    title="Wind speed"
                    value={Math.round(convertWindSpeed(windSpeed))}
                    unit={getWindSpeedUnit()}
                    pathname="/charts/DaysDetails"
                    tabName="Wind speed"
                  />

                  {/* Wind direction */}
                  <WindCard
                    weather={weather}
                    location={location}
                    imageSource={require("../../../assets/icons/compass.png")}
                    title="Wind direction"
                    value={`${windDirText}, ${windDirDegree}°`}
                    unit="" // Để trống vì đã đưa ° vào giá trị
                    pathname="/charts/DaysDetails"
                    tabName="Wind speed" // Vẫn dùng "Wind speed" vì tab giống với component trên
                  />
                </View>
              </View>
              {/* Air Quality */}
              <AirQuality weather={weather} />
              {/* Other info */}
              <View className="mb-4 space-y-3">
                <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
                  <CalendarDaysIcon size="22" color="white" />
                  <Text className="text-lg font-semibold text-white">
                    Other Information
                  </Text>
                </View>
                <View className="flex flex-row flex-wrap justify-between mx-5">
                  {/* UV Index */}
                  <UVCard weather={weather} location={location} />
                  {/* // Component Humidity - sẽ tự động có
                  pathname="/charts/DaysDetails" */}
                  <WeatherMetricCard
                    iconName="water-percent"
                    title="Humidity"
                    value={humidity}
                    description="The dew point is 23.4° right now."
                    forecastData={weather?.forecast?.forecastday}
                    locationData={location}
                    tabName="Humidity"
                  />
                  {/* // Component Cloud - sẽ tự động có
                  pathname="/charts/DaysDetails" */}
                  <WeatherMetricCard
                    iconName="cloud"
                    title="Cloud"
                    value={cloud}
                    description="The dew point is 23.4° right now."
                    forecastData={weather?.forecast?.forecastday}
                    locationData={location}
                    tabName="Cloud cover"
                  />
                  {/* // Component Rain level - sẽ tự động có
                  pathname="/charts/DaysDetails" */}
                  <WeatherMetricCard
                    iconName="weather-rainy"
                    title="Rain level"
                    value={displayPrecipitation(rainLevel)}
                    unit=""
                    description="The dew point is 23.4° right now."
                    forecastData={weather?.forecast?.forecastday}
                    locationData={location}
                    tabName="Rain level"
                  />

                  <WeatherMetricCard
                    iconName="gauge"
                    title="Pressure"
                    value={`${pressure} inHg`}
                    description="The dew point is 23.4° right now."
                  />
                  <WeatherMetricCard
                    iconName="thermometer"
                    title="Feel likes"
                    value={displayTemperature(feelLikes)}
                    unit=""
                    description="Humidity is making it fell warmer."
                  />
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </>
      )}
    </View>
  );
}
