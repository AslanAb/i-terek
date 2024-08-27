import { View, Text, Dimensions } from "react-native";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { IExtremes, INormals } from "@/types";
import { defaultExtremes } from "@/constants/settings";
import ElevationCard from "./ElevationCard";
import { scale } from "react-native-size-matters";
import { useForm } from "react-hook-form";
import ExtremeInput from "./ExtremeInput";
const { width } = Dimensions.get("window");

export default function ExtremesSettings() {
  const [theme, setTheme] = useMMKVString("theme");
  const [extremes, setExtremes] = useMMKVObject<IExtremes>("extremes");
  const [normals, setNormals] = useMMKVObject<INormals>("normals");
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: extremes,
  });
  const onSubmit = (data: any) => setExtremes(data);

  return (
    <View
      style={{
        width: width,
        alignItems: "center",
        paddingHorizontal: 30,
        gap: 15,
      }}
    >
      <ExtremeInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="pressure"
        formName="pressure"
        secondInput
        normals={normals}
      />
      <ExtremeInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="pressure's changing"
        formName="pressureChangingIn6Hours"
        secondInput
        normals={normals}
      />
      <ExtremeInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="solar activity"
        formName="solar_activity"
        secondInput
        displayOnlyMax
        normals={normals}
      />
      <ExtremeInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="magnetic field"
        formName="kp_index"
        secondInput
        displayOnlyMax
        normals={normals}
      />
      <ExtremeInput control={control} errors={errors} theme={theme} inputName="temperature" formName="temp" secondInput normals={normals} />
      <ExtremeInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="air pollution"
        formName="pm2_5"
        secondInput
        displayOnlyMax
        normals={normals}
      />
      <ExtremeInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="wind speed"
        formName="wind"
        secondInput
        displayOnlyMax
        normals={normals}
      />
      <View style={{ alignItems: "center", marginBottom: 30, width: "100%", gap: 15 }}>
        <ElevationCard theme={theme} w={"100%"} onPress={handleSubmit(onSubmit)} gradient elevation>
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
          onPress={() => {
            for (const key in defaultExtremes) {
              setValue(key as keyof IExtremes, defaultExtremes[key as keyof IExtremes]);
            }
          }}
          gradient
          elevation
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
