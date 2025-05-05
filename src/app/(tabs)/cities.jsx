import { View, Image, StatusBar, Text, TextInput, Platform, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
function cities() {
  const weatherData = [
    {
      id: 1,
      location: 'My Location',
      city: 'Ho Chi Minh City',
      temperature: 35,
      condition: 'Cloudy',
      high: 35,
      low: 27,
      time: null,
      bgColor: 'bg-gray-500',
    },
    {
      id: 2,
      location: 'Hồ Chí Minh',
      city: null,
      temperature: 35,
      condition: 'Cloudy',
      high: 35,
      low: 28,
      time: '14:27',
      bgColor: 'bg-gray-500',
    },
    {
      id: 3,
      location: 'New Delhi',
      city: null,
      temperature: 36,
      condition: 'Mostly Sunny',
      high: 37,
      low: 26,
      time: '12:57',
      bgColor: 'bg-blue-500',
    },
    {
      id: 4,
      location: 'New Delhi',
      city: null,
      temperature: 36,
      condition: 'Mostly Sunny',
      high: 37,
      low: 26,
      time: '12:57',
      bgColor: 'bg-blue-500',
    },
    {
      id: 5,
      location: 'New Delhi',
      city: null,
      temperature: 36,
      condition: 'Mostly Sunny',
      high: 37,
      low: 26,
      time: '12:57',
      bgColor: 'bg-blue-500',
    },
    {
      id: 6,
      location: 'New Delhi',
      city: null,
      temperature: 36,
      condition: 'Mostly Sunny',
      high: 37,
      low: 26,
      time: '12:57',
      bgColor: 'bg-blue-500',
    },
    {
      id: 7,
      location: 'New Delhi',
      city: null,
      temperature: 36,
      condition: 'Mostly Sunny',
      high: 37,
      low: 26,
      time: '12:57',
      bgColor: 'bg-blue-500',
    },
    {
      id: 8,
      location: 'New Delhi',
      city: null,
      temperature: 36,
      condition: 'Mostly Sunny',
      high: 37,
      low: 26,
      time: '12:57',
      bgColor: 'bg-blue-500',
    },
    {
      id: 9,
      location: 'New Delhi',
      city: null,
      temperature: 36,
      condition: 'Mostly Sunny',
      high: 37,
      low: 26,
      time: '12:57',
      bgColor: 'bg-blue-500',
    },
    {
      id: 10,
      location: 'New Delhi',
      city: null,
      temperature: 36,
      condition: 'Mostly Sunny',
      high: 37,
      low: 26,
      time: '12:57',
      bgColor: 'bg-blue-500',
    },
    {
      id: 11,
      location: 'New Delhi',
      city: null,
      temperature: 36,
      condition: 'Mostly Sunny',
      high: 37,
      low: 26,
      time: '12:57',
      bgColor: 'bg-blue-500',
    },
    {
      id: 12,
      location: 'New Delhi',
      city: null,
      temperature: 36,
      condition: 'Mostly Sunny',
      high: 37,
      low: 26,
      time: '12:57',
      bgColor: 'bg-blue-500',
    },
  ];
  return (
    <View className="relative flex-1"
    >
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
      <SafeAreaView className="flex flex-1 px-4"
        style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
        edges={['right', 'bottom', 'left']}
      >
        <View className="relative z-50 mt-4">
          <Text className="text-white text-3xl font-bold">Cities</Text>
          <View className="flex-row items-center px-2 mt-4 rounded-full bg-slate-500 h-14">
            <TextInput
              placeholder="Search city"
              placeholderTextColor={"lightgray"}
              className="flex-1 p-3 text-white"
            />
            <TouchableOpacity
              className="p-3 rounded-full bg-slate-600"
            >
              <MagnifyingGlassIcon color="white" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="mt-5 flex-1" showsVerticalScrollIndicator={false}>
          {weatherData.map((item) => (
            <View
              key={item.id}
              className={`${item.bgColor} rounded-3xl mb-4 p-4`}
            >
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-white text-lg font-semibold">{item.location}</Text>
                  {item.city && (
                    <Text className="text-white text-sm">{item.city}</Text>
                  )}
                  {item.time && (
                    <Text className="text-white text-sm">{item.time}</Text>
                  )}
                </View>
                <Text className="text-white text-6xl font-light">{item.temperature}°</Text>
              </View>
              <View className="flex-row mt-1 justify-between items-start">
                <Text className="text-white">{item.condition}</Text>
                <View className="flex-1 flex-row justify-end items-center">
                  <Text className="text-white">H:{item.high}° </Text>
                  <Text className="text-white">L:{item.low}°</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default cities;
