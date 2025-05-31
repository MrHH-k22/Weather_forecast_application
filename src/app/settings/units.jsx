import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { useUnitsContext } from "../../context/UnitsContext";
import UnitSelector from "../../components/UnitSelector";

export default function UnitsSettings() {
  const navigation = useNavigation();
  const {
    temperatureUnit,
    setTemperatureUnit,
    windSpeedUnit,
    setWindSpeedUnit,
    precipitationUnit,
    setPrecipitationUnit,
  } = useUnitsContext();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const temperatureOptions = [
    { value: "celsius", label: "°C" },
    { value: "fahrenheit", label: "°F" },
  ];

  const windSpeedOptions = [
    { value: "kmh", label: "km/h" },
    { value: "mph", label: "mph" },
  ];

  const precipitationOptions = [
    { value: "mm", label: "mm" },
    { value: "in", label: "in" },
  ];

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
        <View className="flex-row relative z-50 mt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3"
          >
            <ChevronLeftIcon size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white">Units Settings</Text>
        </View>

        <UnitSelector
          title="Temperature"
          options={temperatureOptions}
          selectedValue={temperatureUnit}
          onValueChange={setTemperatureUnit}
        />

        <UnitSelector
          title="Wind Speed"
          options={windSpeedOptions}
          selectedValue={windSpeedUnit}
          onValueChange={setWindSpeedUnit}
        />

        <UnitSelector
          title="Precipitation"
          options={precipitationOptions}
          selectedValue={precipitationUnit}
          onValueChange={setPrecipitationUnit}
        />
      </SafeAreaView>
    </View>
  );
}
