import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useAuth, useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen = () => {
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });

  const { isSignedIn } = useAuth();

  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      if (isSignedIn) {
        router.replace("/(auth)/(tabs)/feed");
      }

      const { createdSessionId, setActive } = await startGoogleOAuthFlow();
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.log("🚀 ~ handleGoogleLogin ~ error:", error);
    }
  };

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/login.png")}
          style={styles.loginImage}
        />
        <ScrollView
          style={{
            width: "100%",
            paddingHorizontal: 20,
          }}
          contentContainerStyle={styles.scrollContainer}
        >
          <Text style={styles.title}>How would like to use Threads?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton}>
              <View style={styles.loginButtonContent}>
                <Image
                  source={require("@/assets/images/instagram_icon.webp")}
                  style={styles.loginButtonImage}
                />
                <Text style={styles.loginButtonText}>
                  Log in with Instagram
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.border}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPressIn={handleGoogleLogin}
              style={styles.loginButton}
            >
              <View style={styles.loginButtonContent}>
                <Text style={styles.loginButtonText}>Continue with Google</Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.border}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Link
                href="/(public)/deep"
                style={styles.switchAccountButtonText}
              >
                Switch Accounts
              </Link>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    gap: 20,
  },
  loginImage: {
    width: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 17,
    fontFamily: "DMSans_500Medium",
  },
  buttonContainer: {
    gap: 20,
    marginHorizontal: 20,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
    flex: 1,
  },
  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loginButtonImage: {
    width: 50,
    height: 50,
  },
  loginButtonSubtitle: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: "#acacac",
    marginTop: 5,
  },
  switchAccountButtonText: {
    fontSize: 14,
    color: Colors.border,
    alignSelf: "center",
  },
});
export default LoginScreen;
