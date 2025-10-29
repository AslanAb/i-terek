import { View, Text, Dimensions } from "react-native";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { IExtremes, INormals } from "@/types";
import { defaultExtremes } from "@/constants/settings";
import ElevationCard from "./ElevationCard";
import { scale, ScaledSheet } from "react-native-size-matters";
import { useForm } from "react-hook-form";
import ExtremeInput from "./ExtremeInput";
import { useAlert } from "@/hooks/useAlert";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
const { width } = Dimensions.get("window");

export default function ExtremesSettings() {
  console.log("ExtremesSettings");
  const [theme, setTheme] = useMMKVString("theme");
  const [extremes, setExtremes] = useMMKVObject<IExtremes>("extremes");
  const [normals, setNormals] = useMMKVObject<INormals>("normals");
  const [isEditing, setIsEditing] = useState(false);
  const [originalValues, setOriginalValues] = useState<IExtremes | null>(null);

  const { showSuccess, showInfo } = useAlert();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: extremes,
    mode: "onChange",
  });

  useEffect(() => {
    if (extremes && !isEditing) {
      reset(extremes);
    }
  }, [extremes, reset, isEditing]);

  const startEditing = () => {
    setOriginalValues(extremes || null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (originalValues) {
      reset(originalValues);
      for (const key in originalValues) {
        setValue(
          key as keyof IExtremes,
          originalValues[key as keyof IExtremes]
        );
      }
    }
    setIsEditing(false);
    setOriginalValues(null);
    showInfo("Изменения отменены", "Возвращены предыдущие значения");
  };

  const onSubmit = (data: any) => {
    try {
      setExtremes(data);
      reset(data);
      setIsEditing(false);
      setOriginalValues(null);
      showSuccess(
        "Настройки сохранены",
        "Экстремальные значения успешно обновлены"
      );
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleSave = () => {
    if (Object.keys(errors).length > 0) {
      return;
    }
    handleSubmit(onSubmit)();
  };

  const resetToDefaults = () => {
    for (const key in defaultExtremes) {
      setValue(
        key as keyof IExtremes,
        defaultExtremes[key as keyof IExtremes]
      );
    }
    setExtremes(defaultExtremes);
    setIsEditing(false);
    setOriginalValues(null);
    showSuccess("Сброшено по умолчанию", "Восстановлены стандартные значения");
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (isEditing) {
          cancelEditing();
        }
      };
    }, [isEditing])
  );

  return (
    <View style={styles.wrapper}>
      <ExtremeInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="pressure"
        formName="pressure"
        secondInput
        normals={normals}
        disabled={!isEditing}
      />
      <ExtremeInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="pressure's changing"
        formName="pressureChangingIn6Hours"
        secondInput
        normals={normals}
        disabled={!isEditing}
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
        disabled={!isEditing}
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
        disabled={!isEditing}
      />
      <ExtremeInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="temperature"
        formName="temp"
        secondInput
        normals={normals}
        disabled={!isEditing}
      />
      <ExtremeInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="air pollution"
        formName="pm2_5"
        secondInput
        displayOnlyMax
        normals={normals}
        disabled={!isEditing}
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
        disabled={!isEditing}
      />
      <View style={styles.center}>
        {!isEditing ? (
          <View style={styles.bottomRow}>
            <ElevationCard
              theme={theme}
              w={"100%"}
              gradient
              elevation
              onPress={startEditing}
            >
              <Text style={styles.font22}>Изменить</Text>
            </ElevationCard>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <View style={styles.topRow}>
              <View style={{ width: "48%" }}>
                <ElevationCard
                  theme={theme}
                  w={"100%"}
                  gradient
                  elevation
                  onPress={cancelEditing}
                >
                  <Text style={styles.font22}>Отмена</Text>
                </ElevationCard>
              </View>
              <View style={{ width: "48%" }}>
                <ElevationCard
                  theme={theme}
                  w={"100%"}
                  gradient
                  elevation
                  onPress={handleSave}
                >
                  <Text style={styles.font22}>Сохранить</Text>
                </ElevationCard>
              </View>
            </View>
            <View style={styles.bottomRow}>
              <ElevationCard
                theme={theme}
                w={"100%"}
                gradient
                elevation
                onPress={resetToDefaults}
              >
                <Text style={styles.font22}>
                  Вернуть значения по умолчанию
                </Text>
              </ElevationCard>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  wrapper: {
    width: width,
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 10,
  },
  center: { alignItems: "center", width: "100%", gap: 15 },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  bottomRow: {
    width: "100%",
  },
  font22: {
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(22),
    textAlign: "center",
    padding: 10,
    width: "100%",
  },
});
