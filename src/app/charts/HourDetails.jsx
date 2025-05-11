import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import Feather from "react-native-vector-icons/Feather";

const WeatherTemperatureChart = () => {
  const screenWidth = Dimensions.get("window").width;

  // Số giờ hiển thị cùng lúc trên màn hình
  const visibleHours = 6;

  // Kích thước của mỗi ô giờ (độ rộng)
  const hourWidth = 80;

  // Tổng chiều rộng của chart
  const totalChartWidth = hourWidth * 12; // 12 giờ

  // Dữ liệu giả cho biểu đồ nhiệt độ theo giờ - 12 giờ
  const hourlyData = [
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
  ];

  // Dữ liệu đã định dạng cho LineChart
  const chartData = hourlyData.map((item) => ({
    value: item.value,
    dataPointText: `${item.value}°`,
    label: item.label,
  }));

  // Các tab tùy chọn cho biểu đồ
  const [selectedTab, setSelectedTab] = useState("Temperature");
  const tabs = [
    { id: "Temperature", icon: "thermometer", color: "#10B981" },
    { id: "Rain/Snow", icon: "cloud-rain", color: "#6B7280" },
    { id: "UV", icon: "sun", color: "#6B7280" },
    { id: "Wind speed", icon: "wind", color: "#6B7280" },
    { id: "Humidity", icon: "droplet", color: "#6B7280" },
    { id: "Dew point", icon: "thermometer", color: "#6B7280" },
    { id: "Cloud cover", icon: "cloud", color: "#6B7280" },
    { id: "Pressure", icon: "compass", color: "#6B7280" },
  ];

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
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 p-4 bg-slate-800">
      <View className="mt-2 mb-4">
        <Text className="text-lg font-semibold text-white">New York, USA</Text>
        <Text className="mt-4 text-lg text-white">SUN, 11 MAY</Text>
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-lg text-white">
          <Feather name="thermometer" size={20} color="white" /> Temperature
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
              <View className="flex-row mt-4">
                {hourlyData.map((item, index) => (
                  <View
                    key={index}
                    className="items-center justify-start"
                    style={{ width: hourWidth }}
                  >
                    <View className="px-3 py-1 mb-2 rounded-lg bg-slate-100/25">
                      <Text className="text-sm font-medium text-white">
                        {item.label}
                      </Text>
                    </View>
                    {renderWeatherIcon(item.weatherIcon)}
                  </View>
                ))}
              </View>

              {/* Biểu đồ nhiệt độ */}
              <View className="h-48 p-6 mt-2">
                <LineChart
                  data={chartData}
                  height={150}
                  width={totalChartWidth}
                  noOfSections={4}
                  spacing={hourWidth}
                  color="#FFD700"
                  thickness={3}
                  startFillColor="rgba(255, 215, 0, 0.3)"
                  endFillColor="rgba(255, 215, 0, 0.01)"
                  startOpacity={0.6}
                  endOpacity={0.1}
                  initialSpacing={10}
                  endSpacing={10}
                  hideRules
                  hideYAxisText
                  hideXAxisText
                  yAxisColor="transparent"
                  xAxisColor="transparent"
                  dataPointsColor="#FFD700"
                  dataPointsRadius={4}
                  textColor="white"
                  textShiftY={-20}
                  textFontSize={12}
                  showTextOnDataPoints
                />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Hiển thị chỉ báo cuộn (dot indicators) */}
        <View className="flex-row justify-center mt-2 mb-6">
          {Array(Math.ceil(hourlyData.length / visibleHours))
            .fill(0)
            .map((_, index) => (
              <View
                key={index}
                className="w-2 h-2 mx-1 rounded-full"
                style={{
                  backgroundColor:
                    index === 0 ? "#FFD700" : "rgba(255, 255, 255, 0.3)",
                }}
              />
            ))}
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
              onPress={() => setSelectedTab(tab.id)}
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
              onPress={() => setSelectedTab(tab.id)}
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
