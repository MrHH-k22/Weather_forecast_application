import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  StatusBar,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/outline";
import { useFetchWeatherLocation } from "../hooks/useFetchWeatherLocation";

function SearchBar({ onSearchStateChange, onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [locations, setLocations] = useState([]);

  // Add debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Notify parent component about search state
  useEffect(() => {
    // If search has content, we're in search mode
    onSearchStateChange(searchQuery.length > 0);
  }, [searchQuery, onSearchStateChange]);

  const {
    weatherLocationData,
    isWeatherLocationLoading,
    weatherLocationError,
  } = useFetchWeatherLocation({
    cityName: debouncedQuery,
    enabled: !!debouncedQuery && debouncedQuery.length > 2,
  });

  // Update locations state when data is received
  useEffect(() => {
    if (weatherLocationData && Array.isArray(weatherLocationData)) {
      setLocations(weatherLocationData);
    } else {
      setLocations([]);
    }
  }, [weatherLocationData]);

  function handleSearch(text) {
    setSearchQuery(text);
    // Clear locations if search field is cleared
    if (!text) {
      setLocations([]);
    }
  }

  function handleLocation(location) {
    // Call the parent's callback with the selected location
    if (onLocationSelect) {
      onLocationSelect(location);
    }

    // Clear the dropdown after selection
    setLocations([]);
    setSearchQuery(location.name);
  }

  return (
    <View className="relative z-50">
      <View className="flex-row items-center px-2 mt-4 rounded-full bg-slate-500 h-14">
        <TextInput
          placeholder="Search city"
          placeholderTextColor={"lightgray"}
          className="flex-1 p-3 text-white"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View className="p-3 rounded-full bg-slate-600">
          <MagnifyingGlassIcon color="white" size={20} />
        </View>
      </View>

      {/* Location results dropdown */}
      {locations.length > 0 && (
        <View
          style={{
            left: 0,
            width: "100%",
            zIndex: 100,
            elevation: 10, // For Android shadow
            borderRadius: 24,
            backgroundColor: "#e5e7eb", // bg-gray-300
          }}
        >
          {locations.map((loc, index) => {
            let showBorder = index + 1 != locations.length;
            let borderclass = showBorder ? "border-b-2 border-b-gray-400" : "";
            return (
              <TouchableOpacity
                onPress={() => handleLocation(loc)}
                key={index}
                className={
                  "flex-row items-center border-0 p-3 px-4 mb-1 " + borderclass
                }
              >
                <MapPinIcon size={20} color="gray" />
                <Text className="ml-2 text-lg text-black">
                  {loc?.name}, {loc?.country}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default SearchBar;
