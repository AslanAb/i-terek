import { View, Text, ScrollView } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { detailsText, IDetailsText } from "@/constants/text";
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import ElevationCard from "@/components/ElevationCard";
import { useState } from "react";
import { IWeather } from "@/types";
import { storage } from "./_layout";

export default function Details() {
  const theme = storage.getString("theme");
  const [details, setDetails] = useState<IDetailsText>(detailsText[0]);
  const [weather, setWeather] = useMMKVObject<IWeather>("weather");

  const detailsHandler = (name: IDetailsText["name"]) => {
    const selectedDetails = detailsText.find((item) => item.name === name);
    if (selectedDetails) {
      setDetails(selectedDetails);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: -10,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      />
      <View style={{ flex: 1, marginHorizontal: 30, marginTop: 55, marginBottom: 30, justifyContent: "center" }}>
        <ElevationCard theme={theme} mh="100%" w="100%" gradient>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                color: "white",
                fontFamily: "Podkova-SemiBold",
                fontSize: scale(22),
                textAlign: "center",
                padding: 15,
              }}
            >
              {details.title}
            </Text>
            <Text
              style={{
                color: "white",
                fontFamily: "Podkova-Regular",
                fontSize: scale(16),
                textAlign: "justify",
                paddingHorizontal: 10,
                paddingBottom: 10,
              }}
            >
              {details.description}
            </Text>
          </ScrollView>
        </ElevationCard>
      </View>
      <View style={{ flex: 1, marginHorizontal: 30, marginBottom: 30, gap: 10 }}>
        <View style={{ gap: 10, flexDirection: "row", justifyContent: "center" }}>
          <ElevationCard theme={theme} h={90} p={10} w={scale(170)} onPress={() => detailsHandler("pressure")} elevation gradient>
            <View style={{ flex: 1 }}>
              <FontAwesome6 name="tent-arrows-down" size={scale(30)} color="white" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", flex: 1, gap: 5 }}>
              <Text style={styles.font14}>мм. рт. ст.</Text>
              <Text style={styles.font22}>{weather?.pressure}</Text>
            </View>
          </ElevationCard>
          <ElevationCard
            theme={theme}
            h={90}
            p={10}
            w={scale(100)}
            onPress={() => detailsHandler("pressure's changing")}
            elevation
            gradient
          >
            <View style={{ flex: 1 }}>
              <Feather name="trending-up" size={scale(30)} color="white" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", flex: 1, gap: 5 }}>
              <Text style={styles.font14}>за 3 ч.</Text>
              <Text style={styles.font22}>{weather?.pressureChangingIn6Hours}</Text>
            </View>
          </ElevationCard>
        </View>
        <View style={{ gap: 10, flexDirection: "row", justifyContent: "center" }}>
          <ElevationCard theme={theme} h={90} p={10} w={scale(100)} onPress={() => detailsHandler("solar activity")} elevation gradient>
            <View style={{ flex: 1 }}>
              <MaterialCommunityIcons name="sun-wireless-outline" size={scale(30)} color="white" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", flex: 1, gap: 5 }}>
              <Text style={styles.font22}>{weather?.solar_activity}</Text>
            </View>
          </ElevationCard>
          <ElevationCard theme={theme} h={90} p={10} w={scale(100)} onPress={() => detailsHandler("magnetic field")} elevation gradient>
            <View style={{ flex: 1 }}>
              <Ionicons name="magnet-sharp" size={scale(30)} color="white" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", flex: 1, gap: 5 }}>
              <Text style={styles.font14}>КР-i</Text>
              <Text style={styles.font22}>{weather?.kp_index}</Text>
            </View>
          </ElevationCard>
          <ElevationCard theme={theme} h={90} p={10} w={scale(100)} onPress={() => detailsHandler("temperature")} elevation gradient>
            <View style={{ flex: 1 }}>
              <FontAwesome6 name="temperature-three-quarters" size={scale(30)} color="white" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", flex: 1, gap: 5 }}>
              <Text style={styles.font22}>{weather?.temp} ℃</Text>
            </View>
          </ElevationCard>
        </View>
        <View style={{ gap: 10, flexDirection: "row", justifyContent: "center" }}>
          <ElevationCard theme={theme} h={90} p={10} w={scale(170)} onPress={() => detailsHandler("air pollution")} elevation gradient>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="masks" size={scale(35)} color="white" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", flex: 1, gap: 5 }}>
              <Text style={styles.font14}>мкг/м3</Text>
              <Text style={styles.font22}>{weather?.pm2_5}</Text>
            </View>
          </ElevationCard>
          <ElevationCard theme={theme} h={90} p={10} w={scale(100)} onPress={() => detailsHandler("wind speed")} elevation gradient>
            <View style={{ flex: 1 }}>
              <MaterialCommunityIcons name="weather-windy" size={scale(30)} color="white" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", flex: 1, gap: 5 }}>
              <Text style={styles.font14}>м/с</Text>
              <Text style={styles.font22}>{weather?.wind}</Text>
            </View>
          </ElevationCard>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  font14: {
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(12),
    lineHeight: scale(22),
    height: "100%",
    textAlignVertical: "bottom",
  },
  font22: {
    color: "white",
    fontFamily: "Podkova-Bold",
    fontSize: scale(24),
    lineHeight: scale(22),
    height: "100%",
    textAlignVertical: "bottom",
  },
});
