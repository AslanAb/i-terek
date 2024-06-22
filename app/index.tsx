import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMMKVString } from "react-native-mmkv";
import ElevationCard from "@/components/ElevationCard";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { getCity } from "@/services/wheather";
import { countryNameByISOCodes } from "@/constants/country_name_by_iso_codes";
// import RNRestart from "react-native-restart";

export default function Home() {
  const [theme, setTheme] = useMMKVString("theme");
  const [location, setLocation] = useState({});
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
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
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      console.log("location granted");

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      const cityName = await getCity(currentLocation.coords.latitude, currentLocation.coords.longitude);
      setCity(cityName?.city);
      setCountry(countryNameByISOCodes(cityName?.country));

      console.log("city and country setted");
    })();
  }, []);

  const date = new Date();
  console.log("date: ", date.getDate());
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} года`;

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
        style={{ width: "100%", paddingHorizontal: 30, alignItems: "center", marginBottom: 60, zIndex: 100 }}
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
