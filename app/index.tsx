import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMMKVString } from "react-native-mmkv";
import ElevationCard from "@/components/ElevationCard";

export default function Home(props: { theme: string }) {
  const [theme, setTheme] = useMMKVString("theme");

  const changeTheme = () => {
    if (theme === "green") {
      setTheme("yellow");
    } else if (theme === "yellow") {
      setTheme("red");
    } else {
      setTheme("green");
    }
  };

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
          Астана, Казахстан
        </Text>
        <Text
          style={{
            color: "white",
            fontFamily: "Podkova-Regular",
            fontSize: scale(20),
            width: "100%",
          }}
        >
          Пятница, 15 марта
        </Text>
      </View>
      <TouchableOpacity
        style={{ width: "100%", paddingHorizontal: 30, alignItems: "center", marginBottom: 60, zIndex: 100 }}
        onPress={() => router.push("/details")}
      >
        <ElevationCard theme={theme} >
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
              : "Сегодня лучше отдохнуть"}
          </Text>
        </ElevationCard>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
