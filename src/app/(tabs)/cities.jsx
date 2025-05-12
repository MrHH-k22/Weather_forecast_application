import { View, Image, StatusBar, Text, TextInput, Platform, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import { Link, useRouter } from "expo-router";

function Cities() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState([
    {
      id: 1,
      location: 'Biên Hòa',
      city: null,
      temperature: 28,
      condition: 'Mưa nhỏ',
      high: 32,
      low: 26,
      time: null,
      bgColor: 'bg-slate-500',
      selected: false,
    },
    {
      id: 2,
      location: 'Thủ Đức',
      city: null,
      temperature: 29,
      condition: 'Mưa',
      high: 32,
      low: 26,
      time: null,
      bgColor: 'bg-slate-500',
      selected: false,
    },
    {
      id: 3,
      location: 'Singapore, Singapore',
      city: null,
      temperature: 27,
      condition: 'Nhiều mây',
      high: 28,
      low: 19,
      time: null,
      bgColor: 'bg-indigo-500',
      selected: false,
    },
    {
      id: 4,
      location: 'London, United Kingdom',
      city: null,
      temperature: 6,
      condition: 'Quang',
      high: 19,
      low: 5,
      time: null,
      bgColor: 'bg-blue-500',
      selected: false,
    }
  ]);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelection = (id) => {
    const updatedData = weatherData.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setWeatherData(updatedData);

    // Update selected items
    const selectedId = updatedData.find(item => item.id === id).selected ? id : null;
    if (selectedId) {
      setSelectedItems([...selectedItems.filter(i => i !== id), id]);
    } else {
      setSelectedItems(selectedItems.filter(i => i !== id));
    }
  };

  const deleteSelected = () => {
    const filteredData = weatherData.filter(item => !item.selected);
    setWeatherData(filteredData);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const handleLongPress = () => {
    setIsSelectionMode(true);
  };

  const cancelSelection = () => {
    const resetData = weatherData.map(item => ({ ...item, selected: false }));
    setWeatherData(resetData);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const navigateToHome = (cityName) => {
    if (!isSelectionMode) {
      router.push({
        pathname: "/",
        params: { cityName }
      });
    }
  };

  const selectedCount = weatherData.filter(item => item.selected).length;

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
      <SafeAreaView className="flex flex-1 px-4"
        style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
        edges={['right', 'bottom', 'left']}
      >
        {isSelectionMode ? (
          <View className="flex-row justify-between items-center mt-4">
            <TouchableOpacity onPress={cancelSelection}>
              <XMarkIcon color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-lg font-medium">{selectedCount} mục đã chọn</Text>
            <View style={{ width: 24 }} />
          </View>
        ) : (
          <View className="relative z-50 mt-4">
            <Text className="text-white text-3xl font-bold">Cities</Text>
            <View className="flex-row items-center px-2 mt-4 rounded-full bg-slate-500 h-14">
              <TextInput
                placeholder="Search city"
                placeholderTextColor={"lightgray"}
                className="flex-1 p-3 text-white"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity className="p-3 rounded-full bg-slate-600">
                <MagnifyingGlassIcon color="white" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView className="mt-5 flex-1" showsVerticalScrollIndicator={false}>
          {weatherData.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => isSelectionMode ? toggleSelection(item.id) : navigateToHome(item.location)}
              onLongPress={handleLongPress}
              activeOpacity={0.8}
            >
              <View className={`${item.bgColor} rounded-3xl mb-4 p-4 ${item.selected ? 'border-2 border-white' : ''}`}>
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-white text-lg font-semibold">{item.location}</Text>
                    {item.city && (
                      <Text className="text-white text-sm">{item.city}</Text>
                    )}
                    {item.condition && (
                      <Text className="text-white text-sm">{item.condition}</Text>
                    )}
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-white text-5xl font-light">{item.temperature}°</Text>
                    {isSelectionMode && (
                      <View className={`w-6 h-6 rounded-full mr-2 items-center justify-center ${item.selected ? 'bg-blue-500' : 'bg-white bg-opacity-30'}`}>
                        {item.selected && <CheckIcon color="white" size={16} />}
                      </View>
                    )}
                  </View>
                </View>
                <View className="flex-row mt-1 justify-between items-start">
                  <Text className="text-white">{item.condition}</Text>
                  <View className="flex-1 flex-row justify-end items-center">
                    <Text className="text-white">H:{item.high}° </Text>
                    <Text className="text-white">L:{item.low}°</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isSelectionMode && selectedCount > 0 && (
          <View className="py-4">
            <TouchableOpacity
              className="py-4 rounded-full items-center"
              onPress={deleteSelected}
            >
              <TrashIcon color="white" size={24} />
              <Text className="text-white font-medium text-lg">Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

export default Cities;