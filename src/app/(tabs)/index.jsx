import { Text, View, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { Bars3Icon } from "react-native-heroicons/outline";

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
import CurrentWeather from "../../components/CurrentWeather";
import Feather from "react-native-vector-icons/Feather";

export default function Index() {
  const [cityName, setCityName] = useState("Ho Chi Minh City");
  const [searchCity, setSearchCity] = useState("");
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

  // Fetch dữ liệu thời tiết trực tiếp từ React Query hooks
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

  // Sử dụng trực tiếp weatherForecastData thay vì state weather
  const current = weatherForecastData?.current;
  const location = weatherForecastData?.location;

  // ---------------- Fetch Hourly forecast data ------------------
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // "2025-05-03"

  const now = location ? new Date(location.localtime) : new Date();
  const nowHour = now.getHours();

  // Tìm forecastday đúng ngày hôm nay
  const todayForecast = weatherForecastData?.forecast?.forecastday?.find(
    (item) => item.date === formattedDate
  );

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

  // --------------- Fetch Daily forecast data ------------------

  // Giả sử weather là object bạn đã lấy từ API
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Lấy 7 ngày đầu tiên (nếu có đủ)
  const dailyForecast = weatherForecastData?.forecast?.forecastday
    ?.slice(0, 7)
    ?.map((item) => {
      const dateObj = new Date(item.date);
      return {
        day: daysOfWeek[dateObj.getDay()], // Tên viết tắt ngày trong tuần
        icon: item.day.condition.text, // Đường dẫn icon thời tiết
        lowTemp: Math.round(item.day.mintemp_c), // Nhiệt độ thấp nhất
        highTemp: Math.round(item.day.maxtemp_c), // Nhiệt độ cao nhất
      };
    });

  // --------------- Fetch Wind information data ------------------

  const windSpeed = current?.wind_kph; // 11.5
  const windDirText = current?.wind_dir;
  const windDirDegree = current?.wind_degree; // 200

  // --------------- Fetch Other information data ------------------
  //humidity
  const humidity = current?.humidity; // ví dụ: 81
  //pressure
  const pressure = current?.pressure_in; // ví dụ: 29.82 inHg
  //Feel likes
  const feelLikes = current?.feelslike_c; // ví dụ: 29.82 inHg
  //cloud
  const cloud = current?.cloud; // ví dụ: 29.82 inHg
  //rain level
  const rainLevel = current?.precip_mm; // ví dụ: 29.82 inHg
  //dew point
  const dewPoint = current?.dewpoint_c; // ví dụ: 29.82 inHg

  // Notification setup
  useNotificationSetup();
  useEffect(() => {
    // Lần đầu tiên mở app
    const hasShownInitialNotification = async () => {
      const hasShown = await AsyncStorage.getItem("initialNotificationShown");
      if (!weatherForecastData) return;
      if (!hasShown || hasShown === null) {
        try {
          // Chỉ hiển thị thông báo và lưu trạng thái nếu chưa hiển thị
          await scheduleWeatherNotification(weatherForecastData);
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
  }, [weatherForecastData]);

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
              {/* forecast section */}
              <CurrentWeather
                location={location}
                current={current}
                getWeatherImage={getWeatherImage}
                displayTemperature={displayTemperature}
                convertWindSpeed={convertWindSpeed}
                getWindSpeedUnit={getWindSpeedUnit}
                windSpeed={windSpeed}
                humidity={humidity}
              />
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
                weather={weatherForecastData}
                location={location}
                getWeatherImage={getWeatherImage}
                displayTemperature={displayTemperature}
              />
              {/* Wind information */}
              <View className="mb-4 space-y-3">
                <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
                  <Feather name="wind" size={22} color="white" />
                  <Text className="text-lg font-semibold text-white">
                    Wind information
                  </Text>
                </View>
                <View className="flex flex-row justify-between mx-5">
                  {/* Wind speed */}
                  <WindCard
                    weather={weatherForecastData}
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
                    weather={weatherForecastData}
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
              <AirQuality weather={weatherForecastData} />
              {/* Other info */}
              <View className="mb-4 space-y-3">
                <View className="flex-row items-center gap-1 mx-5 mb-4 space-x-2">
                  <Bars3Icon size="22" color="white" />
                  <Text className="text-lg font-semibold text-white">
                    Other Information
                  </Text>
                </View>
                <View className="flex flex-row flex-wrap justify-between mx-5">
                  {/* UV Index */}
                  <UVCard weather={weatherForecastData} location={location} />
                  {/* // Component Humidity - sẽ tự động có
                  pathname="/charts/DaysDetails" */}
                  <WeatherMetricCard
                    iconName="water-percent"
                    title="Humidity"
                    value={humidity}
                    unit="%"
                    description={`The dew point is ${dewPoint} right now.`}
                    forecastData={weatherForecastData?.forecast?.forecastday}
                    locationData={location}
                    tabName="Humidity"
                  />
                  {/* // Component Cloud - sẽ tự động có
                  pathname="/charts/DaysDetails" */}
                  <WeatherMetricCard
                    iconName="cloud"
                    title="Cloud"
                    value={cloud}
                    unit="%"
                    description="Clouds covering the sky right now"
                    forecastData={weatherForecastData?.forecast?.forecastday}
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
                    description="Rainfall measured at this moment"
                    forecastData={weatherForecastData?.forecast?.forecastday}
                    locationData={location}
                    tabName="Rain level"
                  />

                  <WeatherMetricCard
                    iconName="gauge"
                    title="Pressure"
                    value={`${pressure} inHg`}
                    description="Current atmospheric pressure reading"
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
