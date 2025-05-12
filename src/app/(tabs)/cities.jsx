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
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import { Link, useRouter } from "expo-router";
import SearchBar from "../../components/SearchBar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function Cities() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState([
    {
      id: 1,
      location: "Biên Hòa",
      city: null,
      temperature: 28,
      condition: "Mưa nhỏ",
      high: 32,
      low: 26,
      time: null,
      bgColor: "bg-slate-500",
      selected: false,
    },
    {
      id: 2,
      location: "Thủ Đức",
      city: null,
      temperature: 29,
      condition: "Mưa",
      high: 32,
      low: 26,
      time: null,
      bgColor: "bg-slate-500",
      selected: false,
    },
    {
      id: 3,
      location: "Singapore",
      city: null,
      temperature: 27,
      condition: "Nhiều mây",
      high: 28,
      low: 19,
      time: null,
      bgColor: "bg-indigo-500",
      selected: false,
    },
    {
      id: 4,
      location: "London",
      city: null,
      temperature: 6,
      condition: "Quang",
      high: 19,
      low: 5,
      time: null,
      bgColor: "bg-blue-500",
      selected: false,
    },
  ]);
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites !== null) {
        setFavorites(JSON.parse(favorites));  // Update state with the fetched favorites
      } else {
        setFavorites([]);  // If no favorites, set as empty array
      }
    } catch (error) {
      console.log('Error retrieving favorites from AsyncStorage:', error);
    }
  };

  // useFocusEffect will trigger the fetchFavorites function every time this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();  // Fetch favorites when the screen is focused
    }, [])  // Empty dependency array means it runs on every screen focus
  );
  console.log("favorites", favorites);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const toggleSelection = (id) => {
    const updatedData = weatherData.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setWeatherData(updatedData);

    // Update selected items
    const selectedId = updatedData.find((item) => item.id === id).selected
      ? id
      : null;
    if (selectedId) {
      setSelectedItems([...selectedItems.filter((i) => i !== id), id]);
    } else {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    }
  };

  const deleteSelected = () => {
    const filteredData = weatherData.filter((item) => !item.selected);
    setWeatherData(filteredData);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const handleLongPress = () => {
    setIsSelectionMode(true);
  };

  const cancelSelection = () => {
    const resetData = weatherData.map((item) => ({ ...item, selected: false }));
    setWeatherData(resetData);
    setSelectedItems([]);
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

  const selectedCount = weatherData.filter((item) => item.selected).length;

  // Thêm các hàm mới để xử lý trạng thái tìm kiếm
  const handleSearchStateChange = (isActive) => {
    setIsSearchActive(isActive);

    // Nếu người dùng bắt đầu tìm kiếm, thoát khỏi chế độ chọn
    if (isActive && isSelectionMode) {
      cancelSelection();
    }
  };
  const nagivteToAddCity = (cityName, countryName) => {
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
    // const passLocation = location.name + ", " + location.country;
    const cityName = location.name;
    const countryName = location.country;
    nagivteToAddCity(cityName, countryName);
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

        {/* Chỉ hiển thị danh sách thành phố khi không tìm kiếm */}
        {!isSearchActive && (
          <ScrollView
            className="flex-1 mt-5"
            showsVerticalScrollIndicator={false}
          >
            {weatherData.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  isSelectionMode
                    ? toggleSelection(item.id)
                    : navigateToHome(item.location)
                }
                onLongPress={handleLongPress}
                activeOpacity={0.8}
              >
                <View
                  className={`${item.bgColor} rounded-3xl mb-4 p-4 ${
                    item.selected ? "border-2 border-white" : ""
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View>
                      <Text className="text-lg font-semibold text-white">
                        {item.location}
                      </Text>
                      {item.city && (
                        <Text className="text-sm text-white">{item.city}</Text>
                      )}
                      {item.condition && (
                        <Text className="text-sm text-white">
                          {item.condition}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-5xl font-light text-white">
                        {item.temperature}°
                      </Text>
                      {isSelectionMode && (
                        <View
                          className={`w-6 h-6 rounded-full mr-2 items-center justify-center ${
                            item.selected
                              ? "bg-blue-500"
                              : "bg-white bg-opacity-30"
                          }`}
                        >
                          {item.selected && (
                            <CheckIcon color="white" size={16} />
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                  <View className="flex-row items-start justify-between mt-1">
                    <Text className="text-white">{item.condition}</Text>
                    <View className="flex-row items-center justify-end flex-1">
                      <Text className="text-white">H:{item.high}° </Text>
                      <Text className="text-white">L:{item.low}°</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
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
