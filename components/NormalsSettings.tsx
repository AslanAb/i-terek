import { View, Text, Dimensions } from "react-native";
import Input2Card from "./Input2Card";
import { storage } from "@/app/_layout";
import { useMMKVObject } from "react-native-mmkv";
import { useEffect, useState } from "react";
import { INormals } from "@/types";
import { defaultNormals } from "@/constants/settings";
import ElevationCard from "./ElevationCard";
import { scale } from "react-native-size-matters";
import { useForm } from "react-hook-form";
import NormalInput from "./NormalInput";
const { width } = Dimensions.get("window");

export default function NormalsSettings() {
  const theme = storage.getString("theme");
  const [normals, setNormals] = useMMKVObject<INormals>("normals");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: normals,
  });
  const onSubmit = (data: any) => console.log(data);

  return (
    <View
      style={{
        width: width,
        alignItems: "center",
        paddingHorizontal: 30,
        gap: 15,
      }}
    >
      <NormalInput control={control} errors={errors} theme={theme} inputName="pressure" formName="pressure" secondInput />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="pressure's changing"
        formName="pressureChangingIn6Hours"
        secondInput
      />
      <NormalInput control={control} errors={errors} theme={theme} inputName="solar activity" formName="solar_activity" secondInput />
      <NormalInput control={control} errors={errors} theme={theme} inputName="magnetic field" formName="kp_index" secondInput />
      <NormalInput control={control} errors={errors} theme={theme} inputName="temperature" formName="temp" secondInput />
      <NormalInput control={control} errors={errors} theme={theme} inputName="air pollution" formName="pm2_5" secondInput />
      <NormalInput control={control} errors={errors} theme={theme} inputName="wind speed" formName="wind" secondInput />
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
            setNormals(defaultNormals);
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
