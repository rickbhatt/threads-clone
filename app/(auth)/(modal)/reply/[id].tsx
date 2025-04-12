import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Thread from "@/components/Thread";
import ThreadComposer from "../create";
import { api } from "@/convex/_generated/api";

const Reply = () => {
  const { id } = useLocalSearchParams();
  const thread = useQuery(api.messages.getThreadById, {
    messageId: id as Id<"messages">,
  });

  return (
    <View style={{ flex: 1 }}>
      {thread ? (
        <Thread
          thread={thread as Doc<"messages"> & { creator: Doc<"users"> }}
        />
      ) : (
        <ActivityIndicator />
      )}

      <ThreadComposer isReply={true} threadId={id as Id<"messages">} />
    </View>
  );
};

export default Reply;

const styles = StyleSheet.create({});
