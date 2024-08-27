import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MMKV, useMMKVString } from "react-native-mmkv";
import BackgroundImage from "@/components/BackgroundImage";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, ImageBackground } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { scale } from "react-native-size-matters";
import { useLocation } from "@/hooks/location";
import { useGetAndSetWeather } from "@/hooks/weather";
import { useTheme } from "@/hooks/theme";
export { ErrorBoundary } from "expo-router";
import mainBg from "@/assets/images/main_bg_2.jpg";

SplashScreen.preventAutoHideAsync();
export const storage = new MMKV();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Podkova-Regular": require("@/assets/fonts/Podkova_400Regular.ttf"),
    "Podkova-Medium": require("@/assets/fonts/Podkova_500Medium.ttf"),
    "Podkova-SemiBold": require("@/assets/fonts/Podkova_600SemiBold.ttf"),
    "Podkova-Bold": require("@/assets/fonts/Podkova_700Bold.ttf"),
  });
  const location = useLocation();
  const { isWeatherLoading, isWeatherError } = useGetAndSetWeather(location.location, location.isLocationError, location.isLocationLoading);
  const { isThemeLoading, isThemeError } = useTheme({ isWeatherLoading, isWeatherError });

  useEffect(() => {
    if (error) throw error;
    if (isThemeError) throw new Error("Theme error");
  }, [error, isThemeError]);

  useEffect(() => {
    if (loaded && !isThemeLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isThemeLoading]);

  if (!loaded && isThemeLoading) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
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
        {/* <Spinner
          visible={theme ? false : true}
          // cancelable
          textContent={"Загрузка..."}
          textStyle={{ textAlign: "center", color: "white", fontFamily: "Podkova-Regular", fontSize: scale(20) }}
        /> */}
      </SafeAreaProvider>
    </ImageBackground>
  );
}
