import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Stack, useNavigation } from "expo-router";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { useUnitsContext } from "../../context/UnitsContext";

export default function Settings() {
  const navigation = useNavigation();
  const { temperatureUnit, windSpeedUnit, precipitationUnit } =
    useUnitsContext();

  return (
    <View className="flex-1 bg-[#1c2732]">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#1c2732",
          },
          headerTintColor: "#fff",
          headerTitle: "Settings",
        }}
      />

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
    </View>
  );
}
