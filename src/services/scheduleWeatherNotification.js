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
        seconds: 1, // Show immediately
        repeats: false, // Don't repeat
      },
    });
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

// Function to schedule periodic weather updates
export const schedulePeriodicWeatherUpdates = async (weather) => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Weather Update",
        body: `Current temperature is ${weather.temp_c}°C with ${weather.condition.text}`,
        data: { weather },
      },
      trigger: {
        seconds: 3600, // Update every hour
        repeats: true,
      },
    });
  } catch (error) {
    console.error("Error scheduling periodic updates:", error);
  }
};
