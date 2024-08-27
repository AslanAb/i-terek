import { View, Text, Dimensions } from "react-native";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { IExtremes, INormals } from "@/types";
import { defaultNormals } from "@/constants/settings";
import ElevationCard from "./ElevationCard";
import { scale, ScaledSheet } from "react-native-size-matters";
import { useForm } from "react-hook-form";
import NormalInput from "./NormalInput";
const { width } = Dimensions.get("window");

export default function NormalsSettings() {
  const [theme, setTheme] = useMMKVString("theme");
  const [normals, setNormals] = useMMKVObject<INormals>("normals");
  const [extremes, setExtremes] = useMMKVObject<IExtremes>("extremes");
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: normals,
  });
  const onSubmit = (data: any) => setNormals(data);

  return (
    <View style={styles.wrapper}>
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="pressure"
        formName="pressure"
        secondInput
        extremes={extremes}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="pressure's changing"
        formName="pressureChangingIn6Hours"
        secondInput
        extremes={extremes}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="solar activity"
        formName="solar_activity"
        secondInput
        extremes={extremes}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="magnetic field"
        formName="kp_index"
        secondInput
        extremes={extremes}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="temperature"
        formName="temp"
        secondInput
        extremes={extremes}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="air pollution"
        formName="pm2_5"
        secondInput
        extremes={extremes}
      />
      <NormalInput control={control} errors={errors} theme={theme} inputName="wind speed" formName="wind" secondInput extremes={extremes} />
      <View style={styles.center}>
        <ElevationCard theme={theme} w={"100%"} onPress={handleSubmit(onSubmit)} gradient elevation>
          <Text style={styles.font22}>Сохранить</Text>
        </ElevationCard>
        <ElevationCard
          theme={theme}
          w={"100%"}
          onPress={() => {
            for (const key in defaultNormals) {
              setValue(key as keyof INormals, defaultNormals[key as keyof INormals]);
            }
          }}
          gradient
          elevation
        >
          <Text style={styles.font22}>Вернуть значения по умолчанию</Text>
        </ElevationCard>
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  wrapper: {
    width: width,
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 15,
  },
  center: { alignItems: "center", marginBottom: 30, width: "100%", gap: 15 },
  font22: {
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(22),
    textAlign: "center",
    padding: 10,
    width: width - 60,
  },
});
