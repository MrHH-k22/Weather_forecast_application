import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const scheduleWeatherNotification = async (weather) => {
  try {
    if (!weather) {
      console.error("No weather data provided for notification");
      return;
    }

    // Lấy đơn vị nhiệt độ đã lưu
    const tempUnit =
      (await AsyncStorage.getItem("temperatureUnit")) || "celsius";
    const temperature =
      tempUnit === "celsius"
        ? Math.round(weather.current.temp_c)
        : Math.round((weather.current.temp_c * 9) / 5 + 32);

    const tempUnitSymbol = tempUnit === "celsius" ? "°C" : "°F";
    // Cancel any existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    // Schedule a new local notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Weather Update",
        body: `Current temperature is ${temperature}${tempUnitSymbol} with ${weather.current.condition.text} in ${weather.location.name}`,
        data: { weather },
        sound: true,
        priority: "high",
      },
      trigger: {
        seconds: 5,
        repeats: false,
      },
    });
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};
