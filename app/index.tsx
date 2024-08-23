import { View, Text, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import ElevationCard from "@/components/ElevationCard";
import { useCallback, useEffect, useState } from "react";
import { IExtremes, INormals, IWeightOfVariables } from "@/types";
import { changeTheme, getDate } from "@/utils";
import { useLocation } from "@/hooks/location";
import { useGetAndSetWeather } from "@/hooks/weather";
import { defaultExtremes, defaultNormals, defaultVariables } from "@/constants/settings";
import { useTheme } from "@/hooks/theme";

export default function Home() {
  const [theme, setTheme] = useMMKVString("theme");
  const [date, setDate] = useState("");
  const [weightOfVariables, setWeightOfVariables] = useMMKVObject<IWeightOfVariables>("weightOfVariables");
  const [normals, setNormals] = useMMKVObject<INormals>("normals");
  const [extremes, setExtremes] = useMMKVObject<IExtremes>("extremes");
  const { location, city, country, isLocationError, isLocationLoading } = useLocation();
  const { isWeatherLoading, isWeatherError } = useGetAndSetWeather(location, isLocationError, isLocationLoading);
  const t = useTheme({ isWeatherLoading, isWeatherError });
  useEffect(() => {
    if (!weightOfVariables) {
      setWeightOfVariables(defaultVariables);
    }

    if (!normals) {
      setNormals(defaultNormals);
    }

    if (!extremes) {
      setExtremes(defaultExtremes);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const formattedDate = getDate();
      setDate(formattedDate);
    }, [])
  );

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
          // onPress={() => changeTheme(theme, setTheme)}
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
          {date}
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
