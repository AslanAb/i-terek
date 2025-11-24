import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useMMKVString } from "@/mmkv";
import BackgroundImage from "@/components/BackgroundImage";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, ImageBackground } from "react-native";
export { ErrorBoundary } from "expo-router";
import mainBg from "@/assets/images/main_bg_2.jpg";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Podkova-Regular": require("@/assets/fonts/Podkova_400Regular.ttf"),
    "Podkova-Medium": require("@/assets/fonts/Podkova_500Medium.ttf"),
    "Podkova-SemiBold": require("@/assets/fonts/Podkova_600SemiBold.ttf"),
    "Podkova-Bold": require("@/assets/fonts/Podkova_700Bold.ttf"),
  });
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  console.log("RootLayoutNav")
  const [theme, setTheme] = useMMKVString("theme");

  return (
    <ImageBackground source={mainBg} resizeMode="cover" style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }} />
          <Stack.Screen
            name="details"
            options={{
              headerTransparent: true,
              headerTintColor: "white",
              headerTitle: " ",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => router.push("/settings")}
                  hitSlop={{
                    top: 30,
                    right: 30,
                    bottom: 30,
                    left: 30,
                  }}
                >
                  <Ionicons name="settings-sharp" size={24} color="white" />
                </TouchableOpacity>
              ),
              animation: "slide_from_bottom",
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              headerTransparent: true,
              headerTintColor: "white",
              headerTitle: " ",
              animation: "slide_from_right",
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
        </Stack>
        <BackgroundImage theme={theme} />
      </SafeAreaProvider>
    </ImageBackground>
  );
}
