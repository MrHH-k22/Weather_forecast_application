import {
  View,
  Image,
  StatusBar,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useNavigation } from "expo-router";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { useUnitsContext } from "../../context/UnitsContext";

export default function Settings() {
  const navigation = useNavigation();
  const { temperatureUnit, windSpeedUnit, precipitationUnit } =
    useUnitsContext();

  return (
    <View className="relative flex-1">
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <Image
        blurRadius={70}
        source={require("../../../assets/images/bg.png")}
        className="absolute top-0 left-0 w-full h-full"
      />
      <SafeAreaView
        className="flex flex-1 px-4"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
        edges={["right", "bottom", "left"]}
      >
        <View className="relative z-50 mt-4">
          <Text className="text-3xl font-bold text-white">Setting</Text>
        </View>
        <ScrollView className="mt-3">
          <View className="p-4 border-b border-[#374151]">
            <TouchableOpacity
              className="flex-row items-center justify-between py-3"
              onPress={() => navigation.navigate("settings/units")}
            >
              <View>
                <Text className="text-lg text-white mb-1">Units</Text>
                <Text className="text-sm text-[#9ca3af]">
                  {temperatureUnit === "celsius" &&
                  windSpeedUnit === "kmh" &&
                  precipitationUnit === "mm"
                    ? "Metric (°C, km/h, mm)"
                    : temperatureUnit === "fahrenheit" &&
                      windSpeedUnit === "mph" &&
                      precipitationUnit === "in"
                    ? "Imperial (°F, mph, in)"
                    : "Custom"}
                </Text>
              </View>
              <ChevronRightIcon size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Các mục cài đặt khác */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
