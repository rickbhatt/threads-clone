import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useUserProfile } from "./useUserProfile";
import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export const usePush = () => {
  const { userProfile } = useUserProfile();
  const updateUser = useMutation(api.users.updateUser);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const router = useRouter();

  useEffect(() => {
    if (!Device.isDevice) return;
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token && userProfile?._id) {
          updateUser({
            pushToken: token,
            _id: userProfile?._id as Id<"users">,
          });
        }
      })
      .catch((error: any) => console.log("Error getting a push token", error));

    // Recieved notification
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log("🚀recieved notification", notification);
      });

    // Tapped on notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const threadId = response.notification.request.content.data.threadId;
        router.push(`/feed/${threadId}`);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [userProfile?._id]);
  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("social", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!"
        );
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError(
        "Must use physical device for push notifications"
      );
    }
  }
};
