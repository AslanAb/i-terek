import { View, Text, TextInput } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { scale, ScaledSheet } from "react-native-size-matters";
import ElevationCard from "./ElevationCard";
import { IDetailsText, IExtremes, INormals } from "@/types";

export default function Input2Card(props: {
  theme: string | undefined;
  name: IDetailsText["name"];
  h?: number;
  secondInput?: boolean;
  value: { from?: string; to: string } | undefined;
  onBlur?: any;
  onChange?: any;
  formName: keyof INormals | keyof IExtremes;
  displayOnlyMax?: boolean;
  disabled?: boolean;
}) {
  return (
    <ElevationCard theme={props.theme} p={15} w={"100%"} transparency={1} h={props.h} gradient>
      <View style={styles.wrapper}>
        {props.name === "pressure" && <FontAwesome6 name="tent-arrows-down" size={scale(16)} color="white" style={{ flex: 1 }} />}
        {props.name === "pressure's changing" && <Feather name="trending-up" size={scale(24)} color="white" style={{ flex: 1 }} />}
        {props.name === "solar activity" && (
          <MaterialCommunityIcons name="sun-wireless-outline" size={scale(30)} color="white" style={{ flex: 1 }} />
        )}
        {props.name === "magnetic field" && <Ionicons name="magnet-sharp" size={scale(30)} color="white" style={{ flex: 1 }} />}
        {props.name === "temperature" && (
          <FontAwesome6 name="temperature-three-quarters" size={scale(30)} color="white" style={{ flex: 1 }} />
        )}
        {props.name === "air pollution" && <MaterialIcons name="masks" size={scale(35)} color="white" style={{ flex: 1 }} />}
        {props.name === "wind speed" && <MaterialCommunityIcons name="weather-windy" size={scale(30)} color="white" style={{ flex: 1 }} />}
        <Text style={styles.title}>
          {props.name === "pressure" && "Атмосферное давление"}
          {props.name === "pressure's changing" && "Изменения давления"}
          {props.name === "solar activity" && "Солнечная активность"}
          {props.name === "magnetic field" && "Магнитное поле"}
          {props.name === "temperature" && "Температура воздуха"}
          {props.name === "air pollution" && "Загрязнение воздуха"}
          {props.name === "wind speed" && "Скорость ветра"}
        </Text>
        {!props.displayOnlyMax ? (
          !props.disabled ? <TextInput
            value={props.value?.from || ""}
            onChangeText={(text) => props.onChange({ ...props.value, from: text })}
            keyboardType="numeric"
            style={[
              styles.input1,
              {
                backgroundColor:
                  props.theme === "green"
                    ? "rgb(33, 37, 23)"
                    : props.theme === "yellow"
                    ? "#582f0e"
                    : props.theme === "red"
                    ? "#370617"
                    : "blue",
              },
            ]}
            selectionColor={"white"}
            editable={!props.disabled}
          /> : 
          <View
              style={{
                backgroundColor:
                  props.theme === "green"
                    ? "rgb(33, 37, 23)"
                    : props.theme === "yellow"
                    ? "#582f0e"
                    : props.theme === "red"
                    ? "#370617"
                    : "blue",
                opacity: 1,
                borderRadius: 10,
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
                minHeight: scale(35),
                maxHeight: scale(35),
                flex: 2,
            }}
            >
              <Text style={{
                color: "white",
                opacity: 1,
                fontFamily: "Podkova-Regular",
                fontSize: scale(20),
                textAlign: "center"
              }}>
                {props.value?.from || ""}
              </Text>
        </View>
        ) : (
          <View
              style={{
                backgroundColor:
                  props.theme === "green"
                    ? "rgb(33, 37, 23)"
                    : props.theme === "yellow"
                    ? "#582f0e"
                    : props.theme === "red"
                    ? "#370617"
                    : "blue",
                opacity: 0.6,
                borderRadius: 10,
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
                minHeight: scale(35),
                maxHeight: scale(35),
                flex: 2,
            }}
            >
              <Text style={{
                color: "white",
                opacity: 0.6,
                fontFamily: "Podkova-Regular",
                fontSize: scale(20),
                textAlign: "center"
              }}>
                {""}
              </Text>
          </View>
        )}
        {props.secondInput && (
          !props.disabled ? <TextInput
            value={props.value?.to || ""}
            onChangeText={(text) => props.onChange({ ...props.value, to: text })}
            keyboardType="numeric"
            style={[
              styles.input1,
              {
                backgroundColor:
                  props.theme === "green"
                    ? "rgb(33, 37, 23)"
                    : props.theme === "yellow"
                    ? "#582f0e"
                    : props.theme === "red"
                    ? "#370617"
                    : "blue",
              },
            ]}
            selectionColor={"white"}
          /> : 
          <View
              style={{
                backgroundColor:
                  props.theme === "green"
                    ? "rgb(33, 37, 23)"
                    : props.theme === "yellow"
                    ? "#582f0e"
                    : props.theme === "red"
                    ? "#370617"
                    : "blue",
                opacity: 1,
                borderRadius: 10,
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
                minHeight: scale(35),
                maxHeight: scale(35),
                flex: 2,
            }}
            >
              <Text style={{
                color: "white",
                opacity: 1,
                fontFamily: "Podkova-Regular",
                fontSize: scale(20),
                textAlign: "center"
              }}>
                {props.value?.to || ""}
              </Text>
        </View>
        )}
      </View>
    </ElevationCard>
  );
}

const styles = ScaledSheet.create({
  wrapper: { flexDirection: "row", alignItems: "center", gap: 5 },
  title: { flex: 4, textAlign: "center", color: "white", fontFamily: "Podkova-Regular", fontSize: scale(16) },
  input1: {
    flex: 2,
    padding: 5,
    borderRadius: 10,
    textAlign: "center",
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(20),
  },
  input2: {
    flex: 2,
    padding: 5,
    borderRadius: 10,
    textAlign: "center",
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(20),
    opacity: 0.4,
  },
});
