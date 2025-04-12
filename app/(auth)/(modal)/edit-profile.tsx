import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  const { biostring, linkstring, userId, imageUrl } = useLocalSearchParams<{
    biostring: string;
    linkstring: string;
    userId: string;
    imageUrl: string;
  }>();
  const router = useRouter();

  const [bio, setBio] = useState(biostring);
  const [link, setLink] = useState(linkstring);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const onDone = async () => {
    let storageId = null;

    if (selectedImage) {
      storageId = await updateProfilePicture();
    }

    const toUpdate: any = {
      _id: userId as Id<"users">,
      bio,
      websiteUrl: link,
    };

    if (storageId) {
      toUpdate.imageUrl = storageId;
    }

    await updateUser(toUpdate);

    router.dismiss();
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const updateProfilePicture = async () => {
    const uploadUrl = await generateUploadUrl();

    const response = await fetch(selectedImage!.uri);
    const blob = await response.blob();
    const result = await fetch(uploadUrl, {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": selectedImage!.mimeType!,
      },
    });

    const { storageId } = await result.json();

    return storageId;
  };

  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPressIn={onDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TouchableOpacity onPressIn={selectImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Write a bio..."
          numberOfLines={4}
          multiline
          textAlignVertical="top"
          style={styles.bioInput}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={link}
          onChangeText={setLink}
          placeholder="https://yourwebsite.com"
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    padding: 8,
    margin: 16,
  },
  bioInput: {
    height: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.submit,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
});
