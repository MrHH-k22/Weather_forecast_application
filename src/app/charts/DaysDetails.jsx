import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import Feather from "react-native-vector-icons/Feather";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { getMaxValueForTab, getMinValueForTab } from "../../utils/helper";
import { useUnitsContext } from "../../context/UnitsContext"; // Thêm import useUnitsContext

const WeatherTemperatureChart = () => {
  // Lấy daysForecast từ params URL
  const params = useLocalSearchParams();
  const daysForecast = params.daysForecast
    ? JSON.parse(params.daysForecast)
    : null;
  const location = params.location ? JSON.parse(params.location) : null;

  const tabFromParams = params.tab || "Temperature";

  // Thêm useUnitsContext để sử dụng các hàm chuyển đổi đơn vị
  const {
    convertTemperature,
    convertWindSpeed,
    convertPrecipitation,
    getTemperatureUnit,
    getWindSpeedUnit,
    getPrecipitationUnit,
  } = useUnitsContext();

  // Sử dụng tab từ params hoặc mặc định là "Temperature"
  const [selectedTab, setSelectedTab] = useState(tabFromParams);

  // Kích thước của mỗi ô ngày (độ rộng)
  const dayWidth = 100;

  // Tổng chiều rộng của chart cho tất cả các ngày
  const totalChartWidth = dayWidth * (daysForecast?.length || 7);

  // Các tab tùy chọn cho biểu đồ với màu sắc và đơn vị tương ứng
  const tabs = [
    {
      id: "Temperature",
      icon: "thermometer",
      color: "#6B7280",
      chartColor: "#FFD700",
      unit: getTemperatureUnit(),
    },
    {
      id: "Rain level",
      icon: "cloud-rain",
      color: "#6B7280",
      chartColor: "#3B82F6",
      unit: getPrecipitationUnit(),
    },
    {
      id: "UV",
      icon: "sun",
      color: "#6B7280",
      chartColor: "#F59E0B",
      unit: "",
    },
    {
      id: "Wind speed",
      icon: "wind",
      color: "#6B7280",
      chartColor: "#64748B",
      unit: getWindSpeedUnit(),
    },
    {
      id: "Humidity",
      icon: "droplet",
      color: "#6B7280",
      chartColor: "#0EA5E9",
      unit: "%",
    },
    {
      id: "Cloud cover",
      icon: "cloud",
      color: "#6B7280",
      chartColor: "#94A3B8",
      unit: "%",
    },
  ];

  // Cấu hình tab hiện tại
  const currentTab = tabs.find((tab) => tab.id === selectedTab);

  // Xử lý khi chuyển tab
  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
  };

  // Lấy dữ liệu tương ứng với tab được chọn cho dữ liệu ngày
  const getTabData = (dayData, tabId) => {
    const day = dayData.day;
    // console.log("day", day);
    switch (tabId) {
      case "Temperature":
        return Math.round(convertTemperature(day.avgtemp_c));
      case "Rain level":
        return Number(convertPrecipitation(day.totalprecip_mm).toFixed(3));
      case "UV":
        return day.uv;
      case "Wind speed":
        return Math.round(convertWindSpeed(day.maxwind_kph));
      case "Humidity":
        return day.avghumidity;
      case "Cloud cover":
        // Sử dụng giá trị độ che phủ mây trung bình
        return day.avgvis_km > 9 ? 20 : 60;
      default:
        return Math.round(convertTemperature(day.avgtemp_c));
    }
  };

  // Dữ liệu mẫu cho 7 ngày
  const defaultDailyData = [
    { value: 15, label: "01/05", weatherIcon: "day-cloud" },
    { value: 17, label: "02/05", weatherIcon: "day" },
    { value: 18, label: "03/05", weatherIcon: "day" },
    { value: 16, label: "04/05", weatherIcon: "day-cloud" },
    { value: 14, label: "05/05", weatherIcon: "cloud-rain" },
    { value: 19, label: "06/05", weatherIcon: "day" },
    { value: 20, label: "07/05", weatherIcon: "day" },
  ];

  // Xử lý dữ liệu ngày từ daysForecast
  let dailyData = [];

  if (daysForecast && daysForecast.length > 0) {
    dailyData = daysForecast.map((dayItem) => {
      // Format ngày hiển thị
      const dateStr = dayItem.date;
      const formattedDate = format(new Date(dateStr), "dd/MM");

      // Xác định biểu tượng thời tiết
      let weatherIcon;
      const condition = dayItem.day.condition.text.toLowerCase();

      if (condition.includes("cloud")) {
        weatherIcon = "day-cloud";
      } else if (condition.includes("rain") || condition.includes("shower")) {
        weatherIcon = "cloud-rain";
      } else if (condition.includes("snow")) {
        weatherIcon = "snow";
      } else {
        weatherIcon = "day";
      }

      // Lưu trữ dữ liệu gốc để có thể truy cập khi đổi tab
      return {
        originalData: dayItem,
        value: getTabData(dayItem, selectedTab),
        label: formattedDate,
        weatherIcon: weatherIcon,
      };
    });
  }

  // Sử dụng dữ liệu từ API nếu có, nếu không thì dùng dữ liệu mẫu
  const displayData = dailyData.length > 0 ? dailyData : defaultDailyData;

  // Dữ liệu đã định dạng cho LineChart dựa trên tab đang chọn
  const chartData = displayData.map((item) => {
    // Nếu có dữ liệu gốc, lấy giá trị tương ứng với tab hiện tại
    const value = item.originalData
      ? getTabData(item.originalData, selectedTab)
      : selectedTab === "Temperature"
      ? item.value
      : 0;

    // Định dạng số liệu hiển thị dựa trên loại tab
    let displayValue = value;
    if (selectedTab === "Rain level") {
      // Hiển thị lượng mưa với 3 chữ số thập phân
      displayValue = value.toFixed(3);
    }

    return {
      value: value,
      dataPointText: `${displayValue}${currentTab.unit}`,
      label: item.label,
    };
  });

  // Lấy thông tin vị trí
  const locationName = location?.name || "New York";
  const locationCountry = location?.country || "USA";

  // Lấy ngày hiện tại
  const currentDate = format(new Date(), "EEE, dd MMM").toUpperCase();

  // Render biểu tượng thời tiết dựa trên loại thời tiết
  const renderWeatherIcon = (iconType) => {
    switch (iconType) {
      case "cloud-rain":
        return (
          <View className="flex items-center justify-center w-8 h-8">
            <Feather name="cloud-rain" size={20} color="#A0C4FF" />
          </View>
        );
      case "snow":
        return (
          <View className="flex items-center justify-center w-8 h-8">
            <Feather name="cloud-snow" size={20} color="#E2E8F0" />
          </View>
        );
      case "day-cloud":
        return (
          <View className="flex items-center justify-center w-8 h-8">
            <Feather name="sun" size={20} color="#FFD700" />
            <View className="absolute right-0 top-3">
              <Feather name="cloud" size={14} color="#A0C4FF" />
            </View>
          </View>
        );
      case "day":
        return (
          <View className="flex items-center justify-center w-8 h-8">
            <Feather name="sun" size={20} color="#FFD700" />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 p-4 bg-slate-800">
      <View className="flex flex-row items-center justify-between mt-2 mb-4">
        <Text className="text-lg font-semibold text-white">
          {locationName},
          <Text className="text-lg font-semibold text-gray-300">
            {" "}
            {locationCountry}
          </Text>
        </Text>
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-lg text-white">
          <Feather name={currentTab.icon} size={20} color="white" />{" "}
          {selectedTab}
        </Text>

        {/* Kết hợp ScrollView duy nhất cho cả ngày, biểu tượng và biểu đồ */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={dayWidth}
            decelerationRate="fast"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              {/* Hiển thị ngày và biểu tượng thời tiết */}
              <View className="flex-row mt-4 mb-6">
                {displayData.map((item, index) => (
                  <View
                    key={index}
                    className="items-center justify-center"
                    style={{ width: dayWidth }}
                  >
                    <View className="px-3 py-1 mb-2 rounded-lg bg-slate-200/25">
                      <Text className="text-sm font-medium text-white">
                        {item.label}
                      </Text>
                    </View>

                    {renderWeatherIcon(item.weatherIcon)}
                  </View>
                ))}
              </View>

              <View className="mt-2 h-[240px] pt-4">
                <LineChart
                  data={chartData}
                  height={200}
                  width={totalChartWidth}
                  spacing={dayWidth}
                  color={currentTab.chartColor}
                  thickness={3}
                  areaChart
                  startFillColor={`${currentTab.chartColor}33`}
                  endFillColor={`${currentTab.chartColor}ff`}
                  startOpacity={0.6}
                  endOpacity={0.1}
                  initialSpacing={40}
                  endSpacing={0}
                  hideYAxisText
                  hideXAxisText
                  yAxisColor="transparent"
                  xAxisColor="transparent"
                  dataPointsColor={`${currentTab.chartColor}ff`}
                  dataPointsRadius={5}
                  yAxisLabelWidth={0}
                  xAxisLabelsHeight={0}
                  textColor="white"
                  textShiftY={-20}
                  textFontSize={12}
                  dataPointsHeight={8}
                  dataPointsWidth={8}
                  maxValue={getMaxValueForTab(chartData, selectedTab)}
                  minValue={getMinValueForTab(chartData, selectedTab)}
                  noOfSections={3}
                  overflowTop={50}
                  stepHeight={40}
                  hideRules
                />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Hiển thị chỉ báo cuộn (dot indicators) */}
        <View className="flex-row justify-center pb-4">
          <View
            className="w-[150px] h-1 mx-1 rounded-full"
            style={{
              backgroundColor: currentTab.chartColor,
            }}
          />
        </View>

        {/* Danh sách các tab */}
        <View className="flex-row flex-wrap justify-between mt-2">
          {tabs.slice(0, 4).map((tab) => (
            <TouchableOpacity
              key={tab.id}
              className={`flex-row items-center p-4 rounded-lg ${
                selectedTab === tab.id ? "bg-teal-500" : "bg-slate-700"
              }`}
              style={{ width: "48%", marginBottom: 12 }}
              onPress={() => handleTabChange(tab.id)}
            >
              <Feather
                name={tab.icon}
                size={24}
                color={selectedTab === tab.id ? "white" : tab.color}
              />
              {selectedTab === tab.id && (
                <View className="absolute right-2 top-2">
                  <Feather name="check" size={16} color="white" />
                </View>
              )}
              <Text
                className={`ml-2 ${
                  selectedTab === tab.id ? "text-white" : "text-gray-300"
                }`}
              >
                {tab.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row flex-wrap justify-between">
          {tabs.slice(4).map((tab) => (
            <TouchableOpacity
              key={tab.id}
              className={`flex-row items-center p-4 rounded-lg ${
                selectedTab === tab.id ? "bg-teal-500" : "bg-slate-700"
              }`}
              style={{ width: "48%", marginBottom: 12 }}
              onPress={() => handleTabChange(tab.id)}
            >
              <Feather
                name={tab.icon}
                size={24}
                color={selectedTab === tab.id ? "white" : tab.color}
              />
              {selectedTab === tab.id && (
                <View className="absolute right-2 top-2">
                  <Feather name="check" size={16} color="white" />
                </View>
              )}
              <Text
                className={`ml-2 ${
                  selectedTab === tab.id ? "text-white" : "text-gray-300"
                }`}
              >
                {tab.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default WeatherTemperatureChart;
