import { View, Text, Dimensions, Pressable } from "react-native";
import ElevationCard from "./ElevationCard";
import { storage } from "@/app/_layout";
import { scale } from "react-native-size-matters";
const { width } = Dimensions.get("window");

export default function RedSettings() {
  const theme = storage.getString("theme");

  return (
    <View
      style={{
        width: width,
        alignItems: "center",
        paddingHorizontal: 30,
        gap: 15,
      }}
    >
      {/* <Input2Card theme={theme} name="pressure" h={90} secondInput />
    <Input2Card theme={theme} name="pressure's changing" h={90} />
    <Input2Card theme={theme} name="solar activity" h={90} />
    <Input2Card theme={theme} name="magnetic field" h={90} />
    <Input2Card theme={theme} name="temperature" h={90} secondInput />
    <Input2Card theme={theme} name="air pollution" h={90} />
    <Input2Card theme={theme} name="wind speed" h={90} /> */}
      <Pressable style={{ alignItems: "center", marginBottom: 30, width: "100%" }}>
        <ElevationCard theme={theme} w={"100%"} onPress={() => {}} gradient elevation>
          <Text
            style={{
              color: "white",
              fontFamily: "Podkova-Regular",
              fontSize: scale(22),
              textAlign: "center",
              padding: 10,
              width: width - 60,
            }}
          >
            Сохранить
          </Text>
        </ElevationCard>
      </Pressable>
    </View>
  );
}
