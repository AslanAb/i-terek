import { View, Text } from "react-native";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IExtremes, INormals } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import { IDetailsText } from "@/constants/text";
import Input2Card from "./Input2Card";
import SelectCard from "./SelectCard";
import { solarActivityIndexies } from "@/constants/settings";

const NormalInput = (props: {
  control: Control<INormals> | undefined;
  errors: FieldErrors<INormals>;
  theme: string | undefined;
  inputName: IDetailsText["name"];
  formName: keyof INormals;
  secondInput?: boolean;
  extremes?: IExtremes | undefined;
}) => {
  return (
    <View style={{ width: "100%" }}>
      <Controller
        control={props.control}
        rules={{
          required: "Обязательное поле",
          validate: {
            notEmpty: (value) => (value.from.trim() !== "" && value.to.trim() !== "") || "Обязательное поле",
            noSpaces: (value) => (!/\s/.test(value.from) && !/\s/.test(value.to)) || "Значение не должно содержать пробелы",
            isNumber: (value) => {
              if (props.inputName === "solar activity") return true;
              if (!isNaN(Number(value.from)) && !isNaN(Number(value.to))) return true;
              return "Значение должно быть числом";
            },
            isInteger: (value) => {
              if (props.inputName === "solar activity" || props.inputName === "magnetic field" || props.inputName === "air pollution")
                return true;
              if (Number.isInteger(Number(value.from)) && Number.isInteger(Number(value.to))) return true;
              return "Значение должно быть целым числом";
            },
            isIncludeDot: (value) => {
              if (props.inputName === "solar activity" || props.inputName === "magnetic field" || props.inputName === "air pollution")
                return true;
              if (!value.from.includes(".") && !value.to.includes(".")) return true;
              return "Значение не должно содержать точку";
            },
            minValue: (value) => {
              if (props.extremes === undefined) return true;
              if (props.inputName === "pressure") {
                if (Number(value.from) > Number(props.extremes.pressure.from) + 1) return true;
              }
              if (props.inputName === "pressure's changing") {
                if (Number(value.from) > Number(props.extremes.pressureChangingIn6Hours.from) + 1) return true;
              }
              if (props.inputName === "temperature") {
                if (Number(value.from) > Number(props.extremes.temp.from) + 1) return true;
              }
              if (
                props.inputName === "wind speed" ||
                props.inputName === "air pollution" ||
                props.inputName === "magnetic field" ||
                props.inputName === "solar activity"
              ) {
                return true;
              }
              return "Первое занчение должно быть больше значения минимума из экстремумов на 1 единицу";
            },
            maxValue: (value) => {
              if (props.extremes === undefined) return true;
              if (props.inputName === "pressure") {
                if (Number(value.to) < Number(props.extremes.pressure.to) - 1) return true;
                return "Второе значение должно быть меньше значения максимума из экстремумов на 1 единицу";
              }
              if (props.inputName === "pressure's changing") {
                if (Number(value.to) < Number(props.extremes.pressureChangingIn6Hours.to) - 1) return true;
                return "Второе значение должно быть меньше значения максимума из экстремумов на 1 единицу";
              }
              if (props.inputName === "temperature") {
                if (Number(value.to) < Number(props.extremes.temp.to) - 1) return true;
                return "Второе значение должно быть меньше значения максимума из экстремумов на 1 единицу";
              }
              if (props.inputName === "wind speed") {
                if (Number(value.to) < Number(props.extremes.wind.to) - 1) return true;
                return "Второе значение должно быть меньше значения максимума из экстремумов на 1 единицу";
              }
              if (props.inputName === "air pollution") {
                if (Number(value.to) < Number(props.extremes.pm2_5.to) - 0.1) return true;
                return "Второе значение должно быть меньше значения максимума из экстремумов на 0.1 единицу";
              }
              if (props.inputName === "magnetic field") {
                if (Number(value.to) < Number(props.extremes.kp_index.to) - 0.1) return true;
                return "Второе значение должно быть меньше значения максимума из экстремумов на 0.1 единицу";
              }
              if (props.inputName === "solar activity") {
                if (solarActivityIndexies.indexOf(value.to) < solarActivityIndexies.indexOf(props.extremes.solar_activity.to) - 1)
                  return true;
                return "Второе значение должно быть меньше значения максимума из экстремумов на 1 единицу";
              }
            },
            insideValueRelations: (value) => {
              if (props.extremes === undefined) return true;
              if (props.inputName === "solar activity") {
                if (solarActivityIndexies.indexOf(value.from) < solarActivityIndexies.indexOf(value.to)) return true;
                return "Первое значение должно быть меньше второго значения";
              }
              if (Number(value.from) < Number(value.to)) return true;
              return "Первое значение должно быть меньше второго значения";
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
              />
            )}
          </>
        )}
        name={props.formName}
      />
      {props.errors[props.formName] && (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 5 }}>
          <AntDesign name="warning" size={scale(18)} color="white" />
          <Text
            style={{
              color: "white",
              fontFamily: "Podkova-Regular",
              fontSize: scale(18),
              textAlign: "center",
              height: "100%",
            }}
          >
            {props.errors[props.formName]?.message}
          </Text>
        </View>
      )}
    </View>
  );
};

export default NormalInput;
