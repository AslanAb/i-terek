import { View, Text, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import { scale, ScaledSheet, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";
import ElevationCard from "@/components/ElevationCard";
import { useCallback, useEffect, useState } from "react";
import { getDate } from "@/utils";
import { useLocation } from "@/hooks/location";
import { useGetAndSetWeather } from "@/hooks/weather";
import { useTheme } from "@/hooks/theme";
import Spinner from "react-native-loading-spinner-overlay";

export default function Home() {
  const location = useLocation();
  const { isWeatherLoading, isWeatherError } = useGetAndSetWeather(location.location, location.isLocationError, location.isLocationLoading);
  const { isThemeLoading, isThemeError } = useTheme({ isWeatherLoading, isWeatherError });
  const [theme, setTheme] = useMMKVString("theme");
  const [city, setCity] = useMMKVString("city");
  const [country, setCountry] = useMMKVString("country");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useMMKVBoolean("isLoading");
  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const formattedDate = getDate();
      setDate(formattedDate);
    }, [])
  );

  useEffect(() => {
    if (!isThemeLoading) {
      setIsLoading(false);
    }
  }, [isThemeLoading]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    setRefreshing(false);
  }, []);

  if (isThemeLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <Spinner
          visible={true}
          // cancelable
          // textContent={"Загрузка..."}
          // textStyle={{ textAlign: "center", color: "white", fontFamily: "Podkova-Regular", fontSize: scale(20) }}
          size="large"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.center}>
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
      >
        <View style={styles.titleWrapper}>
          <Text style={styles.city}>
            {city}, {country}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <TouchableOpacity style={styles.wrapper} onPress={() => router.push("/details")}>
          <ElevationCard theme={theme} transparency={1} gradient>
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
        </TouchableOpacity>
      </ScrollView>
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
});
