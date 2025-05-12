import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Stack, useNavigation } from "expo-router";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { useUnitsContext } from "../../context/UnitsContext";

export default function Settings() {
  const navigation = useNavigation();
  const { units } = useUnitsContext();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#1c2732",
          },
          headerTintColor: "#fff",
          headerTitle: "Settings",
        }}
      />

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unit Settings</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("settings/units")}
          >
            <View>
              <Text style={styles.menuTitle}>Units</Text>
              <Text style={styles.menuDescription}>
                {units === "metric"
                  ? "Metric (°C, km/h, mm)"
                  : "Imperial (°F, mph, in)"}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c2732",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  menuTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: "#9ca3af",
  },
});
