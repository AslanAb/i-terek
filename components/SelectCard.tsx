import { View, Text, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { scale, ScaledSheet } from "react-native-size-matters";
import ElevationCard from "./ElevationCard";
import { IDetailsText, IExtremes, INormals } from "@/types";
import SelectDropdown from "react-native-select-dropdown";
import { solarActivityIndexiesArray } from "@/constants/settings";

export default function SelectCard(props: {
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
    <ElevationCard
      theme={props.theme}
      p={15}
      w={"100%"}
      transparency={1}
      h={props.h}
      gradient
    >
      <View style={styles.wrapper}>
        <MaterialCommunityIcons
          name="sun-wireless-outline"
          size={scale(30)}
          color="white"
          style={{ flex: 1 }}
        />
        <Text style={styles.title}>"Солнечная активность"</Text>
        {!props.displayOnlyMax ? (
          !props.disabled ? (
            <SelectDropdown
              data={solarActivityIndexiesArray}
              defaultValue={props.value?.from || ""}
              disableAutoScroll
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
                      minHeight: scale(35),
                      maxHeight: scale(35),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.value}>{props.value?.from}</Text>
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
                      marginBottom:
                        index === solarActivityIndexiesArray.length - 1 ? 0 : 5,
                    }}
                  >
                    <Text style={styles.value}>{item.title}</Text>
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
                padding: 5,
              }}
            />
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
              <Text
                style={{
                  color: "white",
                  opacity: 1,
                  fontFamily: "Podkova-Regular",
                  fontSize: scale(20),
                  textAlign: "center",
                }}
              >
                {props.value?.from || ""}
              </Text>
            </View>
          )
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
            <Text
              style={{
                color: "white",
                opacity: 1,
                fontFamily: "Podkova-Regular",
                fontSize: scale(20),
                textAlign: "center",
              }}
            >
              {props.value?.from || ""}
            </Text>
          </View>
        )}
        {props.secondInput &&
          (!props.disabled ? (
            <SelectDropdown
              data={solarActivityIndexiesArray}
              defaultValue={props.value?.to || ""}
              disableAutoScroll
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
                      minHeight: scale(35),
                      maxHeight: scale(35),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.value}>{props.value?.to}</Text>
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
                      marginBottom:
                        index === solarActivityIndexiesArray.length - 1 ? 0 : 5
                    }}
                  >
                    <Text style={styles.title}>{item.title}</Text>
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
                padding: 5,
              }}
            />
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
              <Text
                style={{
                  color: "white",
                  opacity: 1,
                  fontFamily: "Podkova-Regular",
                  fontSize: scale(20),
                  textAlign: "center",
                }}
              >
                {props.value?.to || ""}
              </Text>
            </View>
          ))}
      </View>
    </ElevationCard>
  );
}

const styles = ScaledSheet.create({
  wrapper: { flexDirection: "row", alignItems: "center", gap: 5 },
  title: {
    flex: 4,
    textAlign: "center",
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(16),
  },
  value: {
    textAlign: "center",
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(20),
  },
  input: {
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
