import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const UnitSelector = ({ title, options, selectedValue, onValueChange }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selectedValue === option.value && styles.activeOption,
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option.value && styles.activeText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default UnitSelector;
