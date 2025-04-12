import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@clerk/clerk-expo";
import * as Haptics from "expo-haptics";

const CreateTabIcon = ({ color, size }: { color: string; size: number }) => {
  return (
    <View style={styles.createIconContainer}>
      <Ionicons name="add" color={color} size={size} />
    </View>
  );
};

const TabsLayout = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000",
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Crated Threads",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <CreateTabIcon color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Haptics.selectionAsync();
            router.push("/(modal)/create");
          },
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          headerShown: false,
          title: "Favourites",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  logoutText: {
    marginRight: 10,
    color: "blue",
  },
  createIconContainer: {
    backgroundColor: Colors.itemBackground,
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
