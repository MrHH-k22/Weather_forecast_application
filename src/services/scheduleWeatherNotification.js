import * as Notifications from "expo-notifications";

export const scheduleWeatherNotification = async (weather) => {
  try {
    // Cancel any existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    // Schedule a new local notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Weather Update",
        body: `Current temperature is ${weather.current.temp_c}°C with ${weather.current.condition.text} in ${weather.location.name}`,
        data: { weather },
        sound: true,
        priority: "high",
      },
      trigger: {
        seconds: 3600,
        repeats: true,
      },
    });
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};
