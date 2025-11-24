import { View, Text, Dimensions } from "react-native";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { IExtremes, INormals } from "@/types";
import { defaultNormals } from "@/constants/settings";
import ElevationCard from "./ElevationCard";
import { scale, ScaledSheet } from "react-native-size-matters";
import { useForm } from "react-hook-form";
import NormalInput from "./NormalInput";
import { useAlert } from "@/hooks/useAlert";
import CustomAlert from "./CustomAlert";
import { useState, useEffect, useCallback, useRef, RefObject } from "react";
import { useFocusEffect } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { width } = Dimensions.get("window");

interface NormalsSettingsProps {
  scrollViewRef?: RefObject<KeyboardAwareScrollView>;
}

export default function NormalsSettings({ scrollViewRef }: NormalsSettingsProps) {
  console.log("NormalsSettings");
  const [theme, setTheme] = useMMKVString("theme");
  const [normals, setNormals] = useMMKVObject<INormals>("normals");
  const [extremes, setExtremes] = useMMKVObject<IExtremes>("extremes");
  const [isEditing, setIsEditing] = useState(false);
  const [originalValues, setOriginalValues] = useState<INormals | null>(null);
  const isResettingNormalsRef = useRef(false);

  const { isVisible, alertConfig, hideAlert, showSuccess, showInfo } = useAlert();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: normals,
    mode: "onChange",
  });

  useEffect(() => {
    if (normals && !isEditing) {
      reset(normals);
    }
  }, [normals, reset, isEditing]);

  const startEditing = () => {
    setOriginalValues(normals || null);
    setIsEditing(true);
    scrollViewRef?.current?.scrollToEnd(true);
  };

  const cancelEditing = () => {
    if (originalValues) {
      reset(originalValues);
      for (const key in originalValues) {
        setValue(key as keyof INormals, originalValues[key as keyof INormals]);
      }
    }
    setIsEditing(false);
    setOriginalValues(null);
    showInfo("Изменения отменены", "Возвращены предыдущие значения");
  };

  const onSubmit = (data: any) => {
    try {
      setNormals(data);
      reset(data);
      setIsEditing(false);
      setOriginalValues(null);
      showSuccess("Настройки сохранены", "Нормальные значения успешно обновлены");
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
    isResettingNormalsRef.current = true;
    for (const key in defaultNormals) {
      setValue(key as keyof INormals, defaultNormals[key as keyof INormals]);
    }
    setNormals(defaultNormals);
    setIsEditing(false);
    setOriginalValues(null);
    showSuccess("Изменения сохранены", "Восстановлены стандартные значения");
    setTimeout(() => {
      isResettingNormalsRef.current = false;
    }, 100);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (isEditing && !isResettingNormalsRef.current) {
          cancelEditing();
        }
      };
    }, [isEditing])
  );

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
        disabled={!isEditing}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="pressure's changing"
        formName="pressureChangingIn6Hours"
        secondInput
        extremes={extremes}
        disabled={!isEditing}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="solar activity"
        formName="solar_activity"
        secondInput
        extremes={extremes}
        disabled={!isEditing}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="magnetic field"
        formName="kp_index"
        secondInput
        extremes={extremes}
        disabled={!isEditing}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="temperature"
        formName="temp"
        secondInput
        extremes={extremes}
        disabled={!isEditing}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="air pollution"
        formName="pm2_5"
        secondInput
        extremes={extremes}
        disabled={!isEditing}
      />
      <NormalInput
        control={control}
        errors={errors}
        theme={theme}
        inputName="wind speed"
        formName="wind"
        secondInput
        extremes={extremes}
        disabled={!isEditing}
      />
      <View style={styles.center}>
        {!isEditing ? (
          <View style={styles.bottomRow}>
            <ElevationCard theme={theme} w={"100%"} gradient elevation onPress={startEditing}>
              <Text style={styles.font22}>Изменить</Text>
            </ElevationCard>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <View style={styles.topRow}>
              <View style={{ width: "48%" }}>
                <ElevationCard theme={theme} w={"100%"} gradient elevation onPress={cancelEditing}>
                  <Text style={styles.font22}>Отмена</Text>
                </ElevationCard>
              </View>
              <View style={{ width: "48%" }}>
                <ElevationCard theme={theme} w={"100%"} gradient elevation onPress={handleSave}>
                  <Text style={styles.font22}>Сохранить</Text>
                </ElevationCard>
              </View>
            </View>
            <View style={styles.bottomRow}>
              <ElevationCard theme={theme} w={"100%"} gradient elevation onPress={resetToDefaults}>
                <Text style={styles.font22}>Вернуть значения по умолчанию</Text>
              </ElevationCard>
            </View>
          </View>
        )}
      </View>

      <CustomAlert
        visible={isVisible}
        title={alertConfig?.title || ''}
        message={alertConfig?.message}
        theme={theme}
        type={alertConfig?.type}
        onClose={hideAlert}
      />
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
