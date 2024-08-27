import { View, Text } from "react-native";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IExtremes, INormals } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { scale, ScaledSheet } from "react-native-size-matters";
import { IDetailsText } from "@/constants/text";
import Input2Card from "./Input2Card";
import SelectCard from "./SelectCard";
import { solarActivityIndexies } from "@/constants/settings";

export default function ExtremeInput(props: {
  control: Control<IExtremes> | undefined;
  errors: FieldErrors<IExtremes>;
  theme: string | undefined;
  inputName: IDetailsText["name"];
  formName: keyof IExtremes;
  secondInput?: boolean;
  displayOnlyMax?: boolean;
  normals?: INormals | undefined;
}) {
  return (
    <View style={{ width: "100%" }}>
      <Controller
        control={props.control}
        rules={{
          required: "Обязательное поле",
          validate: {
            notUndefined: (value) => {
              if ("from" in value) {
                if (value.from !== undefined && value.to !== undefined) return true;
                return "Обязательное поле";
              }
              return value.to !== undefined || "Обязательное поле";
            },
            notEmpty: (value) => {
              if ("from" in value) {
                if (value.from.trim() !== "" && value.to.trim() !== "") return true;
                return "Обязательное поле";
              }
              return value.to.trim() !== "" || "Обязательное поле";
            },
            noSpaces: (value) => {
              if ("from" in value) {
                if (!/\s/.test(value.from) && !/\s/.test(value.to)) return true;
                return "Значение не должно содержать пробелы";
              }
              return !/\s/.test(value.to) || "Значение не должно содержать пробелы";
            },
            isNumber: (value) => {
              if (props.inputName === "solar activity") return true;
              if ("from" in value) {
                if (!isNaN(Number(value.from)) && !isNaN(Number(value.to))) return true;
                return "Значение должно быть числом";
              }
              return !isNaN(Number(value.to)) || "Значение должно быть числом";
            },
            isInteger: (value) => {
              if (props.inputName === "solar activity" || props.inputName === "magnetic field" || props.inputName === "air pollution")
                return true;
              if ("from" in value) {
                if (Number.isInteger(Number(value.from)) && Number.isInteger(Number(value.to))) return true;
                return "Значение должно быть целым числом";
              }
              return Number.isInteger(Number(value.to)) || "Значение должно быть целым числом";
            },
            isIncludeDot: (value) => {
              if (props.inputName === "solar activity" || props.inputName === "magnetic field" || props.inputName === "air pollution")
                return true;
              if ("from" in value) {
                if (!value.from.includes(".") && !value.to.includes(".")) return true;
                return "Значение не должно содержать точку";
              }
              return !value.to.includes(".") || "Значение не должно содержать точку";
            },
            minValue: (value) => {
              if (props.normals === undefined) return true;
              if ("from" in value) {
                if (Number(value.from) < Number(props.normals.pressure.from) - 1) return true;
                return "Первое значение должно быть меньше значения минимума из норм. значений на 1 единицу";
              }
            },
            maxValue: (value) => {
              if (props.normals === undefined) return true;
              if (props.inputName === "pressure") {
                if (Number(value.to) > Number(props.normals.pressure.to) + 1) return true;
                return "Второе значение должно быть больше значения максимума из норм. значений на 1 единицу";
              }
              if (props.inputName === "pressure's changing") {
                if (Number(value.to) > Number(props.normals.pressureChangingIn6Hours.to) + 1) return true;
                return "Второе значение должно быть больше значения максимума из норм. значений на 1 единицу";
              }
              if (props.inputName === "solar activity") {
                if (solarActivityIndexies.indexOf(value.to) > solarActivityIndexies.indexOf(props.normals.solar_activity.to) + 1)
                  return true;
                return "Второе значение должно быть больше значения максимума из норм. значений на 1 единицу";
              }
              if (props.inputName === "magnetic field") {
                if (Number(value.to) > Number(props.normals.kp_index.to) + 0.1) return true;
                return "Второе значение должно быть больше значения максимума из норм. значений на 0.1 единицу";
              }
              if (props.inputName === "temperature") {
                if (Number(value.to) > Number(props.normals.temp.to) + 1) return true;
                return "Второе значение должно быть больше значения максимума из норм. значений на 1 единицу";
              }
              if (props.inputName === "air pollution") {
                if (Number(value.to) > Number(props.normals.pm2_5.to) + 0.1) return true;
                return "Второе значение должно быть больше значения максимума из норм. значений на 0.1 единицу";
              }
              if (props.inputName === "wind speed") {
                if (Number(value.to) > Number(props.normals.wind.to) + 1) return true;
                return "Второе значение должно быть больше значения максимума из норм. значений на 1 единицу";
              }
            },
            insideValueRelations: (value) => {
              if (props.normals === undefined) return true;
              if ("from" in value) {
                if (Number(value.from) < Number(value.to)) return true;
                return "Первое значение должно быть меньше второго значения";
              }
            },
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            {props.inputName === "solar activity" ? (
              <SelectCard
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                theme={props.theme}
                name={props.inputName}
                h={90}
                secondInput={props.secondInput}
                formName={props.formName}
                displayOnlyMax={props.displayOnlyMax}
              />
            ) : (
              <Input2Card
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                theme={props.theme}
                name={props.inputName}
                h={90}
                secondInput={props.secondInput}
                formName={props.formName}
                displayOnlyMax={props.displayOnlyMax}
              />
            )}
          </>
        )}
        name={props.formName}
      />
      {props.errors[props.formName] && (
        <View style={styles.center}>
          <AntDesign name="warning" size={scale(18)} color="white" />
          <Text style={styles.font18}>{props.errors[props.formName]?.message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = ScaledSheet.create({
  center: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 5 },
  font18: {
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(18),
    textAlign: "center",
    height: "100%",
  },
});
