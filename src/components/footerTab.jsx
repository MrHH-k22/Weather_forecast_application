import React from "react";
import { View, Text, Image } from "react-native";
import { Link } from "expo-router";

export default function FooterTab() {
  return (
    <View>
      {/* Other tabs */}
      <View className="flex-row justify-between mt-4 bg-gray-50 p-4">
        <Link href="/">
          <View className="flex flex-col space-x-2 items-center">
            <Image
              source={require("../../assets/icons/weather.png")}
              style={{ tintColor: "#0d759e" }}
              className="h-6 w-6"
            />
            <Text className="text-[#0d759e] font-semibold text-base">
              Weather
            </Text>
          </View>
        </Link>

        <Link href="/">
          <View className="flex flex-col space-x-2 items-center">
            <Image
              source={require("../../assets/icons/city.png")}
              className="h-6 w-6"
            />
            <Text className="font-semibold text-base">Favorite Cities</Text>
          </View>
        </Link>

        <Link href="/account">
          <View className="flex flex-col space-x-2 items-center">
            <Image
              source={require("../../assets/icons/account.png")}
              className="h-6 w-6"
            />
            <Text className="font-semibold text-base">Account</Text>
          </View>
        </Link>
      </View>
    </View>
  );
}
