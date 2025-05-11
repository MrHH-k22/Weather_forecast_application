import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

export const useNotificationSetup = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      // Request permissions (required for iOS)
      if (Platform.OS === 'ios') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Please enable notifications to get weather updates!");
          return;
        }
      }

      // Configure how notifications appear when the app is in foreground
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
      });
    };

    setupNotifications();
  }, []);
};
