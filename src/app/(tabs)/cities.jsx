import {
  View,
  Image,
  StatusBar,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { XMarkIcon, TrashIcon } from "react-native-heroicons/outline";
import { useRouter } from "expo-router";
import SearchBar from "../../components/SearchBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CityWeatherCard from "../../components/CityWeatherCard";

function Cities() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const fetchFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem("favorites");
      if (favoritesData !== null) {
        setFavorites(JSON.parse(favoritesData));
      } else {
        // Set example favorites for demonstration
        const initialFavorites = ["Ho Chi Minh City, Vietnam", "Paris, France"];
        setFavorites(initialFavorites);
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(initialFavorites)
        );
      }
    } catch (error) {
      console.log("Error retrieving favorites from AsyncStorage:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const toggleSelection = (city) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
    }
    setSelectedItems((prev) => ({
      ...prev,
      [city]: !prev[city],
    }));
  };

  const deleteSelected = async () => {
    const newFavorites = favorites.filter((city) => !selectedItems[city]);
    setFavorites(newFavorites);
    setSelectedItems({});
    setIsSelectionMode(false);

    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
    } catch (error) {
      console.log("Error saving favorites to AsyncStorage:", error);
    }
  };

  const cancelSelection = () => {
    setSelectedItems({});
    setIsSelectionMode(false);
  };

  const navigateToHome = (cityName) => {
    if (!isSelectionMode) {
      router.push({
        pathname: "/",
        params: { cityName },
      });
    }
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  const handleSearchStateChange = (isActive) => {
    setIsSearchActive(isActive);
    if (isActive && isSelectionMode) {
      cancelSelection();
    }
  };

  const navigateToAddCity = (cityName, countryName) => {
    if (cityName) {
      router.push({
        pathname: "/cities/AddCityPage",
        params: { cityName, countryName },
      });
    }
    setIsSearchActive(false);
  };

  const handleLocationSelect = (location) => {
    setIsSearchActive(false);
    navigateToAddCity(location.name, location.country);
  };

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
        {isSelectionMode ? (
          <View className="flex-row items-center justify-between mt-4">
            <TouchableOpacity onPress={cancelSelection}>
              <XMarkIcon color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-lg font-medium text-white">
              {selectedCount} mục đã chọn
            </Text>
            <View style={{ width: 24 }} />
          </View>
        ) : (
          <View className="relative z-50 mt-4">
            <Text className="text-3xl font-bold text-white">Cities</Text>
            <SearchBar
              onSearchStateChange={handleSearchStateChange}
              onLocationSelect={handleLocationSelect}
            />
          </View>
        )}

        {!isSearchActive && (
          <ScrollView
            className="flex-1 mt-5"
            showsVerticalScrollIndicator={false}
          >
            {favorites.map((city, index) => (
              <CityWeatherCard
                key={index}
                city={city}
                isSelectionMode={isSelectionMode}
                selected={!!selectedItems[city]}
                onSelect={toggleSelection}
                onNavigate={navigateToHome}
              />
            ))}
          </ScrollView>
        )}

        {isSelectionMode && selectedCount > 0 && !isSearchActive && (
          <View className="py-4">
            <TouchableOpacity
              className="items-center py-4 rounded-full"
              onPress={deleteSelected}
            >
              <TrashIcon color="white" size={24} />
              <Text className="text-lg font-medium text-white">Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

export default Cities;
