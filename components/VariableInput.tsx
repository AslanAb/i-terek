import { View, Text } from "react-native";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IDetailsText, IWeightOfVariables } from "@/types";
import InputCard from "./InputCard";
import { AntDesign } from "@expo/vector-icons";
import { scale, ScaledSheet } from "react-native-size-matters";

const VariableInput = (props: {
  control: Control<IWeightOfVariables> | undefined;
  errors: FieldErrors<IWeightOfVariables>;
  theme: string | undefined;
  inputName: IDetailsText["name"];
  formName: keyof IWeightOfVariables;
  disabled?: boolean;
}) => {
  return (
    <View style={{ width: "100%", minHeight: 90 }}>
      <Controller
        control={props.control}
        rules={{
          required: "Обязательное поле",
          validate: {
            notEmpty: (value) => value.trim() !== "" || "Обязательное поле",
            isNumber: (value) => !isNaN(Number(value)) || "Значение должно быть числом",
            noSpaces: (value) => !/\s/.test(value) || "Значение не должно содержать пробелы",
            isInteger: (value) =>
              (Number.isInteger(Number(value)) && !value.includes(".") && !/^0[0-9]+$/.test(value)) ||
              "Значение должно быть целым числом в промежутке от 0 до 10",
            minValue: (value) => Number(value) >= 0 || "Значение должно быть в промежутке от 0 до 10",
            maxValue: (value) => Number(value) <= 10 || "Значение должно быть в промежутке от 0 до 10",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputCard
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            theme={props.theme}
            name={props.inputName}
            h={90}
            disabled={props.disabled}
          />
        )}
        name={props.formName}
      />
      {props.errors[props.formName] && (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 5 }}>
          <AntDesign name="warning" size={scale(18)} color="white" />
          <Text style={styles.text}>{props.errors[props.formName]?.message}</Text>
        </View>
      )}
    </View>
  );
};

export default VariableInput;
const styles = ScaledSheet.create({
  text: {
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(18),
    textAlign: "center",
    height: "100%",
  },
});
