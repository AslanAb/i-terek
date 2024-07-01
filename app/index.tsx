import { View, Text, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import ElevationCard from "@/components/ElevationCard";
import { useEffect, useState } from "react";
import { countryNameByISOCodes } from "@/constants/country_name_by_iso_codes";
import { getCity, getCurrentLocation } from "@/services/location";
import { IWeather, IWeightOfVariables } from "@/types";
import { checkAndSetNormals, checkAndSetVariables, getDate, getWeatherAllIn } from "@/utils";

export default function Home() {
  const [theme, setTheme] = useMMKVString("theme");
  const [weather, setWeather] = useMMKVObject<IWeather>("weather");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [latAndLong, setLatAndLong] = useState<{
    latitude: number;
    longitude: number;
  }>();
  checkAndSetVariables();
  checkAndSetNormals();
  const changeTheme = () => {
    if (theme === "green") {
      setTheme("yellow");
    } else if (theme === "yellow") {
      setTheme("red");
    } else if (theme === "red") {
      setTheme("green");
    } else {
      setTheme("green");
    }
    console.log("changeTheme");
  };

  useEffect(() => {
    (async () => {
      try {
        const location = await getCurrentLocation();
        if (location instanceof Error) {
          throw new Error("Can't get location");
        }
        const cityAndCounrty = await getCity(location.latitude, location.longitude);
        if (cityAndCounrty instanceof Error) {
          throw new Error("Can't get city and country");
        }

        if (weather) {
          const dtDate: Date = new Date(weather.dt * 1000);
          const currentTime: Date = new Date();
          const differenceInMinutes: number = (currentTime.getTime() - dtDate.getTime()) / (1000 * 60);

          if (differenceInMinutes >= 60) {
            const weatherData = await getWeatherAllIn(location.latitude, location.longitude);
            setWeather(weatherData);
          }
        } else {
          const weatherData = await getWeatherAllIn(location.latitude, location.longitude);
          setWeather(weatherData);
        }
        setLatAndLong(location);
        setCity(cityAndCounrty.city);
        setCountry(countryNameByISOCodes(cityAndCounrty.country));
      } catch (error) {
        console.error("🚨error --->", error);
      }
    })();
  }, []);

  const formattedDate = getDate();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "60%",
          alignSelf: "flex-start",
          marginLeft: 30,
          marginTop: verticalScale(30),
        }}
      >
        <Text
          onPress={changeTheme}
          style={{
            color: "white",
            fontFamily: "Podkova-Medium",
            fontSize: scale(35),
            width: "100%",
          }}
        >
          {city}, {country}
        </Text>
        <Text
          style={{
            color: "white",
            fontFamily: "Podkova-Regular",
            fontSize: scale(20),
            width: "100%",
          }}
        >
          {formattedDate}
        </Text>
      </View>
      {/* <Text
        style={{
          color: "white",
          fontFamily: "Podkova-Regular",
          fontSize: scale(20),
          width: "100%",
        }}
        onPress={() => RNRestart.restart()}
      >
        {formattedDate}
      </Text> */}
      <TouchableOpacity
        style={{
          width: "100%",
          paddingHorizontal: 30,
          alignItems: "center",
          marginBottom: 60,
          zIndex: 100,
        }}
        onPress={() => router.push("/details")}
      >
        <ElevationCard theme={theme} transparency={1} gradient>
          <Text
            style={{
              color: "white",
              fontFamily: "Podkova-Regular",
              fontSize: scale(22),
              textAlign: "center",
              padding: 10,
            }}
          >
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
    </SafeAreaView>
  );
}
