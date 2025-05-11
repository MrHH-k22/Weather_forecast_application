import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

function _layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          // justifyContent: "center",
          // alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name="weather-partly-cloudy"
              size={size ?? 24}
              color={focused ? "#007AFF" : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cities"
        options={{
          title: "Your Cities",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name="city-variant-outline"
              size={size ?? 24}
              color={focused ? "#007AFF" : "gray"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export default _layout;
