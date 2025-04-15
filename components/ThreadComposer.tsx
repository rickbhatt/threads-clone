import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ThreadComposerProps = {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<"messages">;
};

const ThreadComposer = ({
  threadId,
  isPreview,
  isReply,
}: ThreadComposerProps) => {
  const router = useRouter();
  const { userProfile } = useUserProfile();
  const addThread = useMutation(api.messages.addThreadMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const [threadContent, setThreadContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<ImagePicker.ImagePickerAsset[]>(
    []
  );

  const handleSubmit = async () => {
    const mediaStorageIds = await Promise.all(mediaFiles.map(uploadMediaFile));

    addThread({
      threadId,
      content: threadContent,
      mediaFiles: mediaStorageIds,
    });

    setThreadContent("");
    setMediaFiles([]);
    router.dismiss();
  };

  const removeThread = () => {
    setThreadContent("");
    setMediaFiles([]);
  };

  const handleCancel = () => {
    if (!threadContent && mediaFiles.length === 0) return router.dismiss();
    Alert.alert("Discard thread?", "", [
      {
        text: "Discard",
        onPress: () => router.dismiss(),
        style: "destructive",
      },
      {
        text: "Save Draft",
        onPress: () => {
          setThreadContent("");
          setMediaFiles([]);
        },
        style: "cancel",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const selectImage = async (type: "camera" | "library") => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
    };

    let result;

    if (type == "library") {
      const mediaPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync(false);
      console.log("Media permission result:", mediaPermission);
      if (mediaPermission.status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Photo library access is required to select images"
        );
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      console.log("Camera permission result:", cameraPermission);
      if (cameraPermission.status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Camera access is required to take photos"
        );
        return;
      }
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.canceled) {
      setMediaFiles([result.assets[0], ...mediaFiles]);
    }
  };

  const uploadMediaFile = async (image: ImagePicker.ImagePickerAsset) => {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(image!.uri);
    const blob = await response.blob();
    const result = await fetch(uploadUrl, {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": image!.mimeType!,
      },
    });
    const { storageId } = await result.json();
    return storageId;
  };

  const removeImage = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Stack.Screen
          options={{
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPressIn={handleCancel}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.topRow}>
          <Image
            source={{ uri: userProfile?.imageUrl as string }}
            style={styles.avatar}
          />
          <View style={styles.centerContainer}>
            <Text style={styles.name}>
              {userProfile?.first_name} {userProfile?.last_name}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={isReply ? "Reply to thread" : "What's new?"}
              value={threadContent}
              onChangeText={setThreadContent}
              multiline
              autoFocus={!isPreview}
            />
            {mediaFiles.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {mediaFiles.map((file, index) => (
                  <View key={index} style={styles.mediaContainer}>
                    <Image
                      source={{ uri: file.uri }}
                      style={styles.mediaImage}
                    />
                    <TouchableOpacity
                      style={styles.deleteIconContainer}
                      onPressIn={() => removeImage(index)}
                    >
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPressIn={() => selectImage("library")}
              >
                <Ionicons
                  name="images-outline"
                  size={24}
                  color={Colors.border}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPressIn={() => selectImage("camera")}
              >
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={Colors.border}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="gif" size={24} color={Colors.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="mic-outline" size={24} color={Colors.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome6 name="hashtag" size={24} color={Colors.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons
                  name="stats-chart-outline"
                  size={24}
                  color={Colors.border}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPressIn={removeThread}
            style={[styles.cancelButton, { opacity: isPreview ? 0 : 1 }]}
          >
            <Ionicons name="close" size={24} color={Colors.border} />
          </TouchableOpacity>
        </View>

        {!isPreview && (
          <View style={[styles.keyboardAccessory]}>
            <Text style={styles.keyboardAccessoryText}>
              {isReply
                ? "Everyone can reply and quote"
                : "Anyone can reply and quote"}
            </Text>
            <TouchableOpacity
              style={
                !threadContent && mediaFiles.length === 0
                  ? styles.submitButtonDisabled
                  : styles.submitButton
              }
              onPressIn={handleSubmit}
              disabled={!threadContent && mediaFiles.length === 0}
            >
              <Text
                style={
                  !threadContent && mediaFiles.length === 0
                    ? styles.submitButtonTextDisabled
                    : styles.submitButtonText
                }
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ThreadComposer;

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  centerContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  cancelButton: {
    marginLeft: 12,
    alignSelf: "flex-start",
  },
  iconRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  iconButton: {
    marginRight: 16,
  },
  keyboardAccessory: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingLeft: 64,
    gap: 12,
    marginTop: "auto",
  },
  keyboardAccessoryText: {
    flex: 1,
    color: Colors.border,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#BDBDBD",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  submitButtonTextDisabled: {
    color: "#616161",
    fontWeight: "bold",
  },
  mediaContainer: {
    position: "relative",
    marginRight: 10,
    marginTop: 10,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 4,
  },
  mediaImage: {
    width: 100,
    height: 200,
    borderRadius: 6,
    marginRight: 10,
    marginTop: 10,
  },
});
