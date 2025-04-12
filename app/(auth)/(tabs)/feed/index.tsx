import Thread from "@/components/Thread";
import ThreadComposer from "@/components/ThreadComposer";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { Link, useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

const Feed = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    { initialNumItems: 5 }
  );

  const router = useRouter();

  const { top } = useSafeAreaInsets();
  const [isRrefreshing, setIsRrefreshing] = useState(false);

  // ANIMATION
  const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  const updateTabBar = () => {
    let newMarginBottom = 0;

    if (scrollOffset.value >= 0 && scrollOffset.value <= tabBarHeight) {
      newMarginBottom = -scrollOffset.value;
    } else if (scrollOffset.value > tabBarHeight) {
      newMarginBottom = -tabBarHeight;
    }
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        marginBottom: newMarginBottom,
      },
    });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isFocused) {
        scrollOffset.value = event.contentOffset.y;
        runOnJS(updateTabBar)();
      }
    },
  });

  const onLoadMore = () => {
    loadMore(5);
  };

  const onRefresh = () => {
    setIsRrefreshing(true);
    setTimeout(() => {
      setIsRrefreshing(false);
    }, 2000);
  };

  return (
    <Animated.FlatList
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      data={results}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Link href={`/feed/${item._id}`} asChild>
          <TouchableOpacity>
            <Thread
              thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
            />
          </TouchableOpacity>
        </Link>
      )}
      keyExtractor={(item) => item._id}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={isRrefreshing} onRefresh={onRefresh} />
      }
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: Colors.border,
          }}
        />
      )}
      contentContainerStyle={{
        paddingVertical: top,
        backgroundColor: "white",
      }}
      ListHeaderComponent={
        <View style={{ paddingBottom: 16 }}>
          <Image
            source={require("@/assets/images/threads-logo-black.png")}
            style={{ width: 40, height: 40, alignSelf: "center" }}
          />

          <TouchableOpacity
            onPressIn={() => router.push("/(auth)/(modal)/create")}
            touchSoundDisabled={true}
            style={{
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              height: "auto",
              pointerEvents: "box-only",
            }}
          >
            <ThreadComposer isPreview />
          </TouchableOpacity>
        </View>
      }
    />
  );
};

export default Feed;
