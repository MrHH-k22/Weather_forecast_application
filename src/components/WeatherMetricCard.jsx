// WeatherMetricCard.jsx
import { TouchableOpacity, Text, View } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WeatherMetricCard = ({
  iconName,
  title,
  value,
  unit = "",
  description,
  forecastData,
  locationData,
  tabName,
  customStyle = {},
  pathname = "", // Pathname mặc định để trống
  useLink = true, // Flag để quyết định có sử dụng Link hay không
}) => {
  // Thiết lập pathname dựa trên tiêu đề (title)
  let actualPathname = pathname;
  if (title === "Humidity" || title === "Cloud" || title === "Rain level") {
    actualPathname = "/charts/DaysDetails";
  }

  // Nếu không sử dụng Link hoặc pathname trống
  if (!useLink || !actualPathname) {
    return (
      <TouchableOpacity
        className="p-4 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start"
        style={customStyle}
      >
        <View className="flex flex-row items-center gap-1">
          <MaterialCommunityIcons name={iconName} size={18} color="#d1d5db" />
          <Text className="text-lg text-center text-gray-300">{title}</Text>
        </View>
        <Text className="text-3xl font-bold text-center text-white">
          {value}
          {unit}
        </Text>
        <Text className="font-semibold text-white text-md">{description}</Text>
      </TouchableOpacity>
    );
  }

  // Sử dụng Link khi pathname có giá trị
  return (
    <Link
      href={{
        pathname: actualPathname,
        params: {
          daysForecast: JSON.stringify(forecastData),
          location: JSON.stringify(locationData),
          tab: tabName,
        },
      }}
      asChild
    >
      <TouchableOpacity
        className="p-4 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[48%] flex flex-col gap-4 justify-between items-start"
        style={customStyle}
      >
        <View className="flex flex-row items-center gap-1">
          <MaterialCommunityIcons name={iconName} size={18} color="#d1d5db" />
          <Text className="text-lg text-center text-gray-300">{title}</Text>
        </View>
        <Text className="text-3xl font-bold text-center text-white">
          {value}
          {unit}
        </Text>
        <Text className="font-semibold text-white text-md">{description}</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default WeatherMetricCard;
