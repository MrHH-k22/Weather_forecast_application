import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { featchWeatherForecast } from "./weatherService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_FETCH_TASK = "background-weather-fetch";
const HOUR_IN_SECONDS = 60 * 60; // 60 phút = 3600 giây

// Define the task handler
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Lấy thời tiết từ vị trí mặc định hoặc được lưu trữ
    const cityName = (await AsyncStorage.getItem("lastCity")) || "singapore";
    const weatherData = await featchWeatherForecast(cityName, "1");

    if (weatherData) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Cập nhật thời tiết",
          body: `Hiện tại ${weatherData.current.temp_c}°C với ${weatherData.current.condition.text} tại ${weatherData.location.name}`,
          sound: true,
        },
        trigger: false, // Send immediately
      });
    }

    // Return success
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log("Background task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register the background task
export const startBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: HOUR_IN_SECONDS, // 1 giờ (3600 giây)
      stopOnTerminate: false, // Tiếp tục hoạt động khi app đóng
      startOnBoot: true, // Khởi động khi thiết bị bật lên
    });
    console.log("Background task registered successfully");
  } catch (error) {
    console.log("Error registering background task:", error);
  }
};

// Unregister the background task
export const stopBackgroundTask = async () => {
  try {
    // Kiểm tra xem task có tồn tại trước khi hủy đăng ký
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log("Background task unregistered successfully");
    } else {
      console.log("Background task was not registered");
    }
  } catch (error) {
    console.log("Error unregistering background task:", error);
  }
};
