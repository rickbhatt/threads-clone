import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const ImagePreview = () => {
  const { url } = useLocalSearchParams<{ url: string }>();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageZoom
          uri={url}
          minScale={0.5}
          maxScale={5}
          doubleTapScale={2}
          isSingleTapEnabled
          isDoubleTapEnabled
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default ImagePreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
