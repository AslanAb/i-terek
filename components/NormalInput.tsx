import { View, Text } from "react-native";
import React from "react";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { INormals, IWeightOfVariables } from "@/types";
import InputCard from "./InputCard";
import { AntDesign } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import { IDetailsText } from "@/constants/text";
import Input2Card from "./Input2Card";

const NormalInput = (props: {
  control: Control<INormals> | undefined;
  errors: FieldErrors<INormals>;
  theme: string | undefined;
  inputName: IDetailsText["name"];
  formName: keyof INormals;
  secondInput?: boolean;
}) => {
  return (
    <View style={{ width: "100%" }}>
      <Controller
        control={props.control}
        rules={{
          required: "Обязательное поле",
          validate: {
            notEmpty: (value) => (value.from.trim() !== "" && value.to.trim() !== "") || "Обязательное поле",
            isNumber: (value) => (!isNaN(Number(value.from)) && !isNaN(Number(value.to))) || "Значение должно быть числом",
            noSpaces: (value) => (!/\s/.test(value.from) && !/\s/.test(value.to)) || "Значение не должно содержать пробелы",
            isInteger: (value) =>
              (Number.isInteger(Number(value.from)) && Number.isInteger(Number(value.to))) || "Значение должно быть целым числом",
            isIncludeDot: (value) => (!value.from.includes(".") && !value.to.includes(".")) || "Значение не должно содержать точку",
            //   minValue: (value) => Number(value) >= 0 || "Значение должно быть в промежутке от 0 до 10",
            //   maxValue: (value) => Number(value) <= 10 || "Значение должно быть в промежутке от 0 до 10",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
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
