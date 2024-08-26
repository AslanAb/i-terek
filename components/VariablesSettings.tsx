import { Dimensions, View, Text } from "react-native";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { IWeightOfVariables } from "@/types";
import { defaultVariables } from "@/constants/settings";
import ElevationCard from "./ElevationCard";
import { scale } from "react-native-size-matters";
import { useForm } from "react-hook-form";
import VariableInput from "./VariableInput";
const { width } = Dimensions.get("window");

export default function VariablesSettings() {
  const [theme, setTheme] = useMMKVString("theme");
  const [weightOfVariables, setWeightOfVariables] = useMMKVObject<IWeightOfVariables>("weightOfVariables");
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: weightOfVariables,
  });
  const onSubmit = (data: any) => setWeightOfVariables(data);

  return (
    <View
      style={{
        width: width,
        alignItems: "center",
        paddingHorizontal: 30,
        gap: 15,
      }}
    >
      <VariableInput control={control} theme={theme} errors={errors} inputName="pressure" formName="pressure" />
      <VariableInput control={control} theme={theme} errors={errors} inputName="pressure's changing" formName="pressureChangingIn6Hours" />
      <VariableInput control={control} theme={theme} errors={errors} inputName="solar activity" formName="solar_activity" />
      <VariableInput control={control} theme={theme} errors={errors} inputName="magnetic field" formName="kp_index" />
      <VariableInput control={control} theme={theme} errors={errors} inputName="temperature" formName="temp" />
      <VariableInput control={control} theme={theme} errors={errors} inputName="air pollution" formName="pm2_5" />
      <VariableInput control={control} theme={theme} errors={errors} inputName="wind speed" formName="wind" />
      <View style={{ alignItems: "center", width: "100%", gap: 15 }}>
        <ElevationCard theme={theme} w={"100%"} gradient elevation onPress={handleSubmit(onSubmit)}>
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
        <ElevationCard
          theme={theme}
          w={"100%"}
          gradient
          elevation
          onPress={() => {
            for (const key in defaultVariables) {
              setValue(key as keyof IWeightOfVariables, defaultVariables[key as keyof IWeightOfVariables]);
            }
          }}
        >
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
            Вернуть значения по умолчанию
          </Text>
        </ElevationCard>
      </View>
    </View>
  );
}
