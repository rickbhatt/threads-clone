import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const FeedLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Thread",
          headerShadowVisible: false,
          headerRight: () => (
            <Ionicons name="notifications-outline" size={24} color="black" />
          ),
          headerTintColor: "black",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
};

export default FeedLayout;
