import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useNavigation, Stack } from "expo-router";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { useUnitsContext } from "../../context/UnitsContext";

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#1c2732" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitle: "Units Settings",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeftIcon size={25} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temperature</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              temperatureUnit === "celsius" && styles.activeOption,
            ]}
            onPress={() => setTemperatureUnit("celsius")}
          >
            <Text
              style={[
                styles.optionText,
                temperatureUnit === "celsius" && styles.activeText,
              ]}
            >
              °C
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              temperatureUnit === "fahrenheit" && styles.activeOption,
            ]}
            onPress={() => setTemperatureUnit("fahrenheit")}
          >
            <Text
              style={[
                styles.optionText,
                temperatureUnit === "fahrenheit" && styles.activeText,
              ]}
            >
              °F
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wind Speed</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              windSpeedUnit === "kmh" && styles.activeOption,
            ]}
            onPress={() => setWindSpeedUnit("kmh")}
          >
            <Text
              style={[
                styles.optionText,
                windSpeedUnit === "kmh" && styles.activeText,
              ]}
            >
              km/h
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              windSpeedUnit === "mph" && styles.activeOption,
            ]}
            onPress={() => setWindSpeedUnit("mph")}
          >
            <Text
              style={[
                styles.optionText,
                windSpeedUnit === "mph" && styles.activeText,
              ]}
            >
              mph
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Precipitation</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              precipitationUnit === "mm" && styles.activeOption,
            ]}
            onPress={() => setPrecipitationUnit("mm")}
          >
            <Text
              style={[
                styles.optionText,
                precipitationUnit === "mm" && styles.activeText,
              ]}
            >
              mm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              precipitationUnit === "in" && styles.activeOption,
            ]}
            onPress={() => setPrecipitationUnit("in")}
          >
            <Text
              style={[
                styles.optionText,
                precipitationUnit === "in" && styles.activeText,
              ]}
            >
              in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c2732",
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 12,
    fontWeight: "500",
  },
  optionsRow: {
    flexDirection: "row",
    backgroundColor: "#2d3a47",
    borderRadius: 12,
    overflow: "hidden",
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeOption: {
    backgroundColor: "#0bb3b2",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
