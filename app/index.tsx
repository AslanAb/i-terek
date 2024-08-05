import { View, Text, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import ElevationCard from "@/components/ElevationCard";
import { useEffect, useState } from "react";
import { countryNameByISOCodes } from "@/constants/country_name_by_iso_codes";
import { ILocation, IWeather } from "@/types";
import { changeTheme, getDate } from "@/utils";
import { useLocation } from "@/hooks/location";
import { setDefaultSettings } from "@/services/settings";
import { getAndSetWeather } from "@/hooks/weather";

export default function Home() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // const [latAndLong, setLatAndLong] = useState<ILocation>({
  //   latitude: 51.509865,
  //   longitude: -0.118092,
  // });
  const [theme, setTheme] = useMMKVString("theme");
  const [weather, setWeather] = useMMKVObject<IWeather>("weather");

  useEffect(() => {
    (async () => {
      let latAndLong: ILocation;
      const locationData = await useLocation();
      if (locationData instanceof Error) {
        latAndLong = {
          latitude: 51.509865,
          longitude: -0.118092,
        };
        setCity("Лондон");
        setCountry(countryNameByISOCodes("Англия"));
      } else {
        latAndLong = locationData.location;
        setCity(locationData.cityAndCounrty.city);
        setCountry(countryNameByISOCodes(locationData.cityAndCounrty.country));
      }

      getAndSetWeather(latAndLong, weather, setWeather)
    })();
  }, []);

  const formattedDate = getDate();
  console.log('formattedDate: ', formattedDate);
  setDefaultSettings();

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
          onPress={() => changeTheme(theme, setTheme)}
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
