import React from "react";
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
import { BarChart } from "react-native-gifted-charts";

const weatherData = [
  {
    day: "SUN",
    date: "04",
    icon: require("../../../assets/images/cloud.png"),
    high: 19,
    low: 16,
    color: "#FFB300",
  },
  {
    day: "MON",
    date: "05",
    icon: require("../../../assets/images/cloud.png"),
    high: 18,
    low: 15,
    color: "#4ABFF4",
  },
  {
    day: "TUE",
    date: "06",
    icon: require("../../../assets/images/cloud.png"),
    high: 17,
    low: 14,
    color: "#4ABFF4",
  },
  {
    day: "WED",
    date: "07",
    icon: require("../../../assets/images/cloud.png"),
    high: 22,
    low: 13,
    color: "#FFB300",
  },
  {
    day: "THU",
    date: "08",
    icon: require("../../../assets/images/cloud.png"),
    high: 18,
    low: 10,
    color: "#4ABFF4",
  },
  {
    day: "FRI",
    date: "09",
    icon: require("../../../assets/images/cloud.png"),
    high: 13,
    low: 7,
    color: "#00D2C2",
  },
  {
    day: "SAT",
    date: "10",
    icon: require("../../../assets/images/cloud.png"),
    high: 16,
    low: 13,
    color: "#4ABFF4",
  },
  {
    day: "SUN",
    date: "11",
    icon: require("../../../assets/images/cloud.png"),
    high: 15,
    low: 11,
    color: "#FFB300",
  },
];

// Chuẩn bị dữ liệu cho BarChart
// Chuẩn bị dữ liệu cho BarChart
const barData = weatherData.map((item, idx) => ({
  value: item.high,
  label: item.day,
  spacing: 32,
  frontColor: "#FFB300",
  barBorderRadius: 8,
  topLabelComponent: () => (
    <Text className="mb-1 text-xs font-bold text-white">{item.high}°</Text>
  ),
  customDataPoint: () => (
    <View className="items-center mb-1">
      <Image
        source={item.icon}
        style={{ width: 24, height: 24, marginBottom: 2 }}
      />
      <Text className="text-[10px] text-white">{item.low}°</Text>
    </View>
  ),
}));

function DayDetail() {
  return (
    <View className="flex-1">
      <View className="absolute top-0 left-0 w-full h-full">
        <Image
          blurRadius={20}
          source={require("../../../assets/images/bg.png")}
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
            <Text className="text-2xl font-bold text-white">
              Hello everyone
            </Text>
            <View className="p-4 mx-4 mt-6 bg-white/10 rounded-3xl">
              <Text className="mb-2 text-lg font-bold text-white">
                8 days forecast
              </Text>
              <View className="flex-row items-center justify-between mb-2">
                {weatherData.map((item, idx) => (
                  <View key={idx} className="items-center flex-1">
                    <Text className="text-xs font-bold text-white">
                      {item.day}
                    </Text>
                    <Text className="text-[10px] text-white">{item.date}</Text>
                    <Image
                      source={item.icon}
                      style={{ width: 20, height: 20, marginVertical: 2 }}
                    />
                  </View>
                ))}
              </View>
              <BarChart
                data={barData}
                barWidth={12}
                height={120}
                yAxisThickness={0}
                xAxisThickness={0}
                noOfSections={5}
                barBorderRadius={8}
                initialSpacing={16}
                hideRules
                gradientColor={"#FFB300"}
                hideYAxisText
                xAxisLabelTextStyle={{
                  color: "#fff",
                  fontSize: 12,
                  marginTop: 8,
                }}
                isAnimated
              />
              <View className="flex-row justify-between mt-2">
                {weatherData.map((item, idx) => (
                  <Text
                    key={idx}
                    className="w-8 text-xs text-center text-white"
                  >
                    {item.low}°
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

export default DayDetail;
