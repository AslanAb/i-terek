import { View, Text, TextInput } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import ElevationCard from "./ElevationCard";
import { IDetailsText } from "@/constants/text";
import { INormals } from "@/types";
import { UseFormRegister } from "react-hook-form";
import SelectDropdown from "react-native-select-dropdown";
import { solarActivityIndexiesArray } from "@/constants/settings";

export default function SelectCard(props: {
  theme: string | undefined;
  name: IDetailsText["name"];
  h?: number;
  secondInput?: boolean;
  value: { from: string; to: string } | undefined;
  onBlur?: any;
  onChange?: any;
  formName: keyof INormals;
}) {
  return (
    <ElevationCard theme={props.theme} p={15} w={"100%"} transparency={1} h={props.h} gradient>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
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
        <Text style={{ flex: 4, textAlign: "center", color: "white", fontFamily: "Podkova-Regular", fontSize: scale(16) }}>
          {props.name === "pressure" && "Атмосферное давление"}
          {props.name === "pressure's changing" && "Изменения давления"}
          {props.name === "solar activity" && "Солнечная активность"}
          {props.name === "magnetic field" && "Магнитное поле"}
          {props.name === "temperature" && "Температура воздуха"}
          {props.name === "air pollution" && "Загрязнение воздуха"}
          {props.name === "wind speed" && "Скорость ветра"}
        </Text>
        <SelectDropdown
          data={solarActivityIndexiesArray}
          defaultValue={props.value?.from}
          onSelect={(selectedItem, index) => {
            props.onChange({ ...props.value, from: selectedItem.title });
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
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
                  flex: 2,
                  padding: 5,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", color: "white", fontFamily: "Podkova-Regular", fontSize: scale(20) }}>
                  {props.value?.from}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  backgroundColor: item.color,
                  flex: 2,
                  padding: 5,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", color: "white", fontFamily: "Podkova-Regular", fontSize: scale(20) }}>
                  {item.title}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={{
            backgroundColor:
              props.theme === "green"
                ? "rgb(33, 37, 23)"
                : props.theme === "yellow"
                ? "#582f0e"
                : props.theme === "red"
                ? "#370617"
                : "blue",
                borderRadius: 10,
                padding: 50,
          }}
        />
        {props.secondInput && (
          <SelectDropdown
            data={solarActivityIndexiesArray}
            defaultValue={props.value?.to}
            onSelect={(selectedItem, index) => {
              props.onChange({ ...props.value, to: selectedItem.title });
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
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
                    flex: 2,
                    padding: 5,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ textAlign: "center", color: "white", fontFamily: "Podkova-Regular", fontSize: scale(20) }}>
                    {props.value?.to}
                  </Text>
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    backgroundColor: item.color,
                    flex: 2,
                    padding: 5,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ textAlign: "center", color: "white", fontFamily: "Podkova-Regular", fontSize: scale(20) }}>
                    {item.title}
                  </Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            // dropdownStyle={styles.dropdownMenuStyle}
          />
        )}
      </View>
    </ElevationCard>
  );
}
