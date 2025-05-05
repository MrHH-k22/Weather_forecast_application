import { View, Text } from "react-native";
import React from "react";

function DayDetail() {
  return (
    <View className="flex-1">
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
          <View style={{ height: 56 }} className="mx-4 ">
            <Text className="text-2xl font-bold text-white">
              Hello everyone
            </Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

export default DayDetail;
