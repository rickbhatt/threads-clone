import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Profile from "@/components/Profile";
import { Id } from "@/convex/_generated/dataModel";

const CreatorProfile = () => {
  const { id } = useLocalSearchParams();

  return <Profile userId={id as Id<"users">} showBackButton />;
};

export default CreatorProfile;

const styles = StyleSheet.create({});
