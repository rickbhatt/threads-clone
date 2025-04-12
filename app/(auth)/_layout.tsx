import { usePush } from "@/hooks/usePush";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";

const AuthLayout = () => {
  const router = useRouter();
  usePush();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#fff",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/create"
        options={{
          presentation: "modal",
          animation: "fade_from_bottom",
          title: "New Thread",
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerRight: () => (
            <TouchableOpacity
              onPressIn={() => Alert.alert("Pressed three dots!")}
            >
              <Ionicons name="ellipsis-horizontal-circle" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modal)/edit-profile"
        options={{
          presentation: "modal",
          animation: "fade_from_bottom",
          title: "Edit Profile",
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPressIn={() => router.dismiss()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modal)/image/[url]"
        options={{
          presentation: "fullScreenModal",
          animation: "fade_from_bottom",
          headerBackVisible: false,
          title: "",
          headerStyle: {
            backgroundColor: "#000",
          },
          headerLeft: () => (
            <TouchableOpacity onPressIn={() => router.dismiss()}>
              <Ionicons name="close" size={24} color={"white"} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPressIn={() => router.dismiss()}>
              <Ionicons
                name="ellipsis-horizontal-circle"
                size={24}
                color={"white"}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modal)/reply/[id]"
        options={{
          presentation: "modal",
          title: "Reply",
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPressIn={() => router.dismiss()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
