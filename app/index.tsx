import { View, Text, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import { scale, ScaledSheet, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useMMKVNumber, useMMKVObject, useMMKVString } from "@/mmkv";
import ElevationCard from "@/components/ElevationCard";
import { useCallback, useState, useEffect } from "react";
import { getDate } from "@/utils";
import CustomLoader from "@/components/CustomLoader";
import useLocation from "@/hooks/location";
import useGetAndSetWeather from "@/hooks/weather";
import useTheme from "@/hooks/theme";
import { useAlert } from "@/hooks/useAlert";
import CustomAlert from "@/components/CustomAlert";
import { IExtremes, INormals, IWeather, IWeightOfVariables } from "@/types";
import { defaultExtremes, defaultNormals, defaultVariables } from "@/constants/settings";
import { refreshAll } from "@/utils/refresh";

export default function Home() {
  console.log("Home")
  const [theme, setTheme] = useMMKVString("theme");
  const [city, setCity] = useMMKVString("city");
  const [country, setCountry] = useMMKVString("country");
  const [date, setDate] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [weather, setWeather] = useMMKVObject<IWeather>("weather");
  const [weightOfVariables, setWeightOfVariables] = useMMKVObject<IWeightOfVariables>("weightOfVariables");
  const [normals, setNormals] = useMMKVObject<INormals>("normals");
  const [extremes, setExtremes] = useMMKVObject<IExtremes>("extremes");
  const [locationDate, setLocationDate] = useMMKVNumber("locationDate");

  const { isLocationError, isLocationLoading, isLocationDefault } = useLocation();
  const { isWeatherLoading, isWeatherError } = useGetAndSetWeather(isLocationError, isLocationLoading);
  const { isThemeLoading, isThemeError } = useTheme({ isWeatherLoading, isWeatherError });

  const { isVisible, alertConfig, hideAlert, showSuccess, showError, showInfo } = useAlert();

  useEffect(() => {
    if (!isLocationLoading && !isWeatherLoading && !isThemeLoading && isLocationDefault) {
      showInfo("Геолокация недоступна", "Не удалось определить ваше местоположение. Показана погода в Астане.");
    }
  }, [isLocationLoading, isWeatherLoading, isThemeLoading, isLocationDefault]);

  useFocusEffect(
    useCallback(() => {
      const formattedDate = getDate();
      setDate(formattedDate);
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (!weightOfVariables || !normals || !extremes) {
      setWeightOfVariables(defaultVariables);
      setNormals(defaultNormals);
      setExtremes(defaultExtremes);
    }
    try {
      // При принудительном обновлении (pull-to-refresh) игнорируем кеш
      const refreshResult = await refreshAll(weather, normals, extremes, weightOfVariables, true)
      if (!refreshResult.success) {
        throw new Error(refreshResult.error);
      }
      const refreshedData = refreshResult.data;
      setCity(refreshedData?.cityAndCountry?.city);
      setCountry(refreshedData?.cityAndCountry?.country);
      setLocationDate(new Date().getTime());
      setWeather(refreshedData?.weatherData);
      setTheme(refreshedData?.appTheme)
      
      if (refreshedData?.isLocationDefault) {
        showInfo("Геолокация недоступна", "Не удалось определить ваше местоположение. Показана обновленная погода в Астане.");
      } else {
        showSuccess("Данные успешно обновлены");
      }
      
    } catch (error) {
      console.error('Refresh error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes("Network request failed") || errorMessage.includes("axios") || errorMessage.includes("timeout")) {
        showError("Нет интернета", "Проверьте соединение и попробуйте снова");
      } else {
        showError("Ошибка при обновлении", "попробуйте снова!");
      }
    }
    setRefreshing(false);
  }, [weightOfVariables, normals, extremes, weather]);

  if (isThemeLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <CustomLoader />
      </SafeAreaView>
    );
  }
  if (isThemeError) {
    return (
      <SafeAreaView style={styles.center}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Упс, что-то пошло не так</Text>
          <Text style={styles.errorText}>Не удалось загрузить данные. Проверьте интернет и перезапустите приложение.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            // @ts-ignore
            size="large"
            progressViewOffset={20}
            progressBackgroundColor={
              theme === "green" ? "#477304" : theme === "yellow" ? "#9C4A1A" : theme === "red" ? "#9d0208" : "transparent"
            }
            colors={["white"]}
          />
        }
        style={styles.scroll}
        contentContainerStyle={styles.center}
      >
        <View style={styles.titleWrapper}>
          <Text style={styles.city}>
            {city}, {country}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.wrapper}>
          <ElevationCard h={60} theme={theme} transparency={1} gradient onPress={() => router.push("/details")}>
            <Text style={styles.font22}>
              {theme === "green"
                ? "Сегодня всё нормально"
                : theme === "yellow"
                  ? "Сегодня внимательнее"
                  : theme === "red"
                    ? "Сегодня лучше отдохнуть"
                    : ""}
            </Text>
          </ElevationCard>
        </View>
      </ScrollView>

      <CustomAlert
        visible={isVisible}
        title={alertConfig?.title || ''}
        message={alertConfig?.message}
        theme={theme}
        type={alertConfig?.type}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  center: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleWrapper: {
    width: "60%",
    alignSelf: "flex-start",
    marginLeft: 30,
    marginTop: verticalScale(30),
  },
  city: {
    color: "white",
    fontFamily: "Podkova-Medium",
    fontSize: scale(35),
    width: "100%",
  },
  date: {
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(20),
    width: "100%",
  },
  wrapper: {
    width: "100%",
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 60,
    zIndex: 100,
  },
  font22: {
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(22),
    textAlign: "center",
    padding: 10,
  },
  scroll: {
    width: "100%",
    height: "100%",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: scale(20),
    backgroundColor: "rgba(238, 128, 128, 0.5)",
    marginTop: verticalScale(100),
  },
  errorTitle: {
    fontSize: scale(24),
    fontFamily: "Podkova-Bold",
    color: "white",
    marginBottom: verticalScale(10),
  },
  errorText: {
    fontSize: scale(16),
    fontFamily: "Podkova-Regular",
    color: "white",
    textAlign: "center",
  },
});
