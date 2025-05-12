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

const WeatherTemperatureChart = () => {
  // Lấy todayForecast từ params URL
  const params = useLocalSearchParams();
  const todayForecast = params.todayForecast
    ? JSON.parse(params.todayForecast)
    : null;
  const location = params.location ? JSON.parse(params.location) : null;

  // console.log("todayForecast", todayForecast);

  // Số giờ hiển thị cùng lúc trên màn hình
  const visibleHours = 6;

  // Kích thước của mỗi ô giờ (độ rộng)
  const hourWidth = 80;

  // Tổng chiều rộng của chart cho 24 giờ
  const totalChartWidth = hourWidth * 24;

  // Các tab tùy chọn cho biểu đồ với màu sắc và đơn vị tương ứng
  const [selectedTab, setSelectedTab] = useState("Temperature");
  const tabs = [
    {
      id: "Temperature",
      icon: "thermometer",
      color: "#6B7280",
      chartColor: "#FFD700",
      unit: "°",
    },
    {
      id: "Rain/Snow",
      icon: "cloud-rain",
      color: "#6B7280",
      chartColor: "#3B82F6",
      unit: "mm",
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
      unit: "km/h",
    },
    {
      id: "Humidity",
      icon: "droplet",
      color: "#6B7280",
      chartColor: "#0EA5E9",
      unit: "%",
    },
    {
      id: "Dew point",
      icon: "thermometer",
      color: "#6B7280",
      chartColor: "#8B5CF6",
      unit: "°",
    },
    {
      id: "Cloud cover",
      icon: "cloud",
      color: "#6B7280",
      chartColor: "#94A3B8",
      unit: "%",
    },
    {
      id: "Pressure",
      icon: "compass",
      color: "#6B7280",
      chartColor: "#EC4899",
      unit: "mb",
    },
  ];

  // Cấu hình tab hiện tại
  const currentTab = tabs.find((tab) => tab.id === selectedTab);

  // Xử lý khi chuyển tab
  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
  };

  // Lấy dữ liệu tương ứng với tab được chọn
  const getTabData = (hourData, tabId) => {
    switch (tabId) {
      case "Temperature":
        return Math.round(hourData.temp_c);
      case "Rain/Snow":
        return hourData.snow_cm > 0 ? hourData.snow_cm : hourData.precip_mm;
      case "UV":
        return hourData.uv;
      case "Wind speed":
        return Math.round(hourData.wind_kph);
      case "Humidity":
        return hourData.humidity;
      case "Dew point":
        return Math.round(hourData.dewpoint_c);
      case "Cloud cover":
        return hourData.cloud;
      case "Pressure":
        return Math.round(hourData.pressure_mb);
      default:
        return Math.round(hourData.temp_c);
    }
  };

  // Dữ liệu mẫu đầy đủ 24 giờ từ 00:00 đến 23:00
  const defaultHourlyData = [
    { value: 15, label: "00:00", weatherIcon: "night-cloud" },
    { value: 15, label: "01:00", weatherIcon: "night-cloud" },
    { value: 15, label: "02:00", weatherIcon: "night-cloud" },
    { value: 15, label: "03:00", weatherIcon: "night-cloud" },
    { value: 15, label: "04:00", weatherIcon: "night-cloud" },
    { value: 15, label: "05:00", weatherIcon: "night-cloud" },
    { value: 15, label: "06:00", weatherIcon: "day-cloud" },
    { value: 16, label: "07:00", weatherIcon: "day-cloud" },
    { value: 17, label: "08:00", weatherIcon: "day" },
    { value: 18, label: "09:00", weatherIcon: "day" },
    { value: 19, label: "10:00", weatherIcon: "day" },
    { value: 20, label: "11:00", weatherIcon: "day" },
    { value: 21, label: "12:00", weatherIcon: "day" },
    { value: 22, label: "13:00", weatherIcon: "day" },
    { value: 22, label: "14:00", weatherIcon: "day" },
    { value: 22, label: "15:00", weatherIcon: "day" },
    { value: 21, label: "16:00", weatherIcon: "day" },
    { value: 20, label: "17:00", weatherIcon: "day" },
    { value: 19, label: "18:00", weatherIcon: "day" },
    { value: 18, label: "19:00", weatherIcon: "day-cloud" },
    { value: 17, label: "20:00", weatherIcon: "night-cloud" },
    { value: 16, label: "21:00", weatherIcon: "night-cloud" },
    { value: 16, label: "22:00", weatherIcon: "night-cloud" },
    { value: 15, label: "23:00", weatherIcon: "night-cloud" },
  ];

  // Xử lý dữ liệu giờ từ todayForecast
  let hourlyData = [];

  if (todayForecast?.hour) {
    hourlyData = todayForecast.hour.map((hourItem) => {
      const timeStr = hourItem.time.split(" ")[1];

      // Xác định biểu tượng thời tiết
      let weatherIcon;
      if (hourItem.is_day === 0) {
        weatherIcon = hourItem.cloud > 30 ? "night-cloud" : "night";
      } else {
        weatherIcon = hourItem.cloud > 30 ? "day-cloud" : "day";
      }

      // Lưu trữ dữ liệu gốc để có thể truy cập khi đổi tab
      return {
        originalData: hourItem,
        value: getTabData(hourItem, selectedTab),
        label: timeStr,
        weatherIcon: weatherIcon,
      };
    });
  }

  // Sử dụng dữ liệu từ API nếu có, nếu không thì dùng dữ liệu mẫu
  const displayData = hourlyData.length > 0 ? hourlyData : defaultHourlyData;

  // Dữ liệu đã định dạng cho LineChart dựa trên tab đang chọn
  const chartData = displayData.map((item) => {
    // Nếu có dữ liệu gốc, lấy giá trị tương ứng với tab hiện tại
    const value = item.originalData
      ? getTabData(item.originalData, selectedTab)
      : selectedTab === "Temperature"
      ? item.value
      : 0;

    return {
      value: value,
      dataPointText: `${value}${currentTab.unit}`,
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
      case "night-cloud":
        return (
          <View className="flex items-center justify-center w-8 h-8">
            <Feather name="moon" size={20} color="#FFD700" />
            <View className="absolute right-0 top-3">
              <Feather name="cloud" size={14} color="#A0C4FF" />
            </View>
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
      case "night":
        return (
          <View className="flex items-center justify-center w-8 h-8">
            <Feather name="moon" size={20} color="#FFD700" />
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
        <Text className="text-lg text-white">{currentDate}</Text>
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-lg text-white">
          <Feather name={currentTab.icon} size={20} color="white" />{" "}
          {selectedTab}
        </Text>

        {/* Kết hợp ScrollView duy nhất cho cả giờ, biểu tượng và biểu đồ */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={hourWidth}
            decelerationRate="fast"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              {/* Hiển thị giờ và biểu tượng thời tiết */}
              <View className="flex-row mt-4 mb-6">
                {displayData.map((item, index) => (
                  <View
                    key={index}
                    className="items-center justify-center"
                    style={{ width: hourWidth }}
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

              {/* Biểu đồ nhiệt độ */}
              <View className="mt-2 h-[240px] pt-4">
                <LineChart
                  data={chartData}
                  height={200} /* Giảm từ 240 xuống 200 */
                  width={totalChartWidth}
                  spacing={hourWidth}
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
                  maxValue={getMaxValueForTab(
                    chartData,
                    selectedTab
                  )} /* Hàm tùy chỉnh theo tab */
                  minValue={getMinValueForTab(
                    chartData,
                    selectedTab
                  )} /* Hàm tùy chỉnh theo tab */
                  noOfSections={3}
                  overflowTop={50} /* Tăng từ 20 lên 30 */
                  stepHeight={40} /* Thêm để cố định kích thước các bước */
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
