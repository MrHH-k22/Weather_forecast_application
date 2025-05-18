import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

export const useNotificationSetup = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      // Request permissions for both iOS and Android
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      console.log("Current notification permission status:", existingStatus);

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("New notification permission status:", finalStatus);
      }

      if (finalStatus !== "granted") {
        console.log("Permission not granted for notifications");
        return;
      }

      // Configure notification appearance
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
