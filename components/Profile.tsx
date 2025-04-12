import { Colors } from "@/constants/Colors";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserProfile from "./UserProfile";
import Tabs from "./Tabs";
import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Thread from "./Thread";
import { Link } from "expo-router";

type ProfileProps = {
  showBackButton?: boolean;
  userId?: Id<"users">;
};

const Profile = ({ userId, showBackButton = false }: ProfileProps) => {
  const { userProfile } = useUserProfile();
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("Threads");

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    { userId: userId || userProfile?._id },
    { initialNumItems: 5 }
  );

  const router = useRouter();
  const { signOut } = useAuth();

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <Link href={`/feed/${item._id}`} asChild>
            <TouchableOpacity>
              <Thread
                thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
              />
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.tabContentText}>
            You haven't posted anything yet.
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        ListHeaderComponent={
          <>
            {/* top button header */}
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPressIn={() => router.back()}
                >
                  <Ionicons name="chevron-back" size={24} color="black" />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name="web" size={24} />
              )}

              <View style={styles.headerIcons}>
                <Ionicons name="logo-instagram" size={24} color={"black"} />
                <TouchableOpacity onPressIn={() => signOut()}>
                  <Ionicons name="log-out-outline" size={24} color={"black"} />
                </TouchableOpacity>
              </View>
            </View>
            {/* user profile container */}

            {userId && <UserProfile userId={userId} />}
            {!userId && userProfile && (
              <UserProfile userId={userProfile?._id} />
            )}
            <Tabs onTabChange={handleTabChange} />
          </>
        }
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  tabContentText: {
    fontSize: 16,
    marginVertical: 16,
    color: Colors.border,
    alignSelf: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    fontSize: 16,
  },
});
