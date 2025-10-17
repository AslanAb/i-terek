import { Dimensions, View, Text } from "react-native";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { IWeightOfVariables } from "@/types";
import { defaultVariables } from "@/constants/settings";
import ElevationCard from "./ElevationCard";
import { scale, verticalScale, ScaledSheet } from "react-native-size-matters";
import { useForm } from "react-hook-form";
import VariableInput from "./VariableInput";
import { useAlert } from "@/hooks/useAlert";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
const { width } = Dimensions.get("window");

export default function VariablesSettings() {
  const [theme, setTheme] = useMMKVString("theme");
  const [weightOfVariables, setWeightOfVariables] =
    useMMKVObject<IWeightOfVariables>("weightOfVariables");
  const [isEditing, setIsEditing] = useState(false);
  const [originalValues, setOriginalValues] =
    useState<IWeightOfVariables | null>(null);

  const { showSuccess, showInfo } = useAlert();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: weightOfVariables,
    mode: "onChange", // Валидация при изменении
  });

  // Для отладки - получаем текущие значения формы
  const getCurrentFormValues = () => {
    return watch();
  };

  // Обновляем форму при изменении weightOfVariables
  useEffect(() => {
    if (weightOfVariables && !isEditing) {
      reset(weightOfVariables);
    }
  }, [weightOfVariables, reset, isEditing]);

  // Сохраняем оригинальные значения при входе в режим редактирования
  const startEditing = () => {
    setOriginalValues(weightOfVariables || null);
    setIsEditing(true);
  };

  // Выход из режима редактирования без сохранения
  const cancelEditing = () => {
    if (originalValues) {
      reset(originalValues); // Восстанавливаем оригинальные значения в форме
      for (const key in originalValues) {
        setValue(
          key as keyof IWeightOfVariables,
          originalValues[key as keyof IWeightOfVariables]
        );
      }
    }
    setIsEditing(false);
    setOriginalValues(null);
    showInfo("Изменения отменены", "Возвращены предыдущие значения");
  };

  const onSubmit = (data: any) => {
    console.log("onSubmit called with data:", data);
    console.log("Validation errors:", errors);
    console.log("Current weightOfVariables before save:", weightOfVariables);

    try {
      // Сохраняем данные в MMKV
      setWeightOfVariables(data);
      console.log("Data saved to MMKV successfully");

      // Принудительно обновляем форму с новыми данными
      reset(data);
      console.log("Form reset with new data");

      setIsEditing(false);
      setOriginalValues(null);
      showSuccess(
        "Настройки сохранены",
        "Весовые коэффициенты успешно обновлены"
      );
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleSave = () => {
    const currentValues = getCurrentFormValues();
    console.log("handleSave called");
    console.log("Current form values:", currentValues);
    console.log("Form errors:", errors);
    console.log("Has errors:", Object.keys(errors).length > 0);

    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors, cannot save");
      return;
    }

    handleSubmit(onSubmit)();
  };

  const resetToDefaults = () => {
    for (const key in defaultVariables) {
      setValue(
        key as keyof IWeightOfVariables,
        defaultVariables[key as keyof IWeightOfVariables]
      );
    }
    setWeightOfVariables(defaultVariables);
    setIsEditing(false);
    setOriginalValues(null);
    showSuccess("Сброшено по умолчанию", "Восстановлены стандартные значения");
  };

  // Обработка потери фокуса (пользователь уходит с экрана)
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Этот колбек вызывается при потере фокуса
        if (isEditing) {
          cancelEditing();
        }
      };
    }, [isEditing])
  );

  return (
    <View style={styles.wrapper}>
      <VariableInput
        control={control}
        theme={theme}
        errors={errors}
        inputName="pressure"
        formName="pressure"
        disabled={!isEditing}
      />
      <VariableInput
        control={control}
        theme={theme}
        errors={errors}
        inputName="pressure's changing"
        formName="pressureChangingIn6Hours"
        disabled={!isEditing}
      />
      <VariableInput
        control={control}
        theme={theme}
        errors={errors}
        inputName="solar activity"
        formName="solar_activity"
        disabled={!isEditing}
      />
      <VariableInput
        control={control}
        theme={theme}
        errors={errors}
        inputName="magnetic field"
        formName="kp_index"
        disabled={!isEditing}
      />
      <VariableInput
        control={control}
        theme={theme}
        errors={errors}
        inputName="temperature"
        formName="temp"
        disabled={!isEditing}
      />
      <VariableInput
        control={control}
        theme={theme}
        errors={errors}
        inputName="air pollution"
        formName="pm2_5"
        disabled={!isEditing}
      />
      <VariableInput
        control={control}
        theme={theme}
        errors={errors}
        inputName="wind speed"
        formName="wind"
        disabled={!isEditing}
      />

      <View style={styles.center}>
        {!isEditing ? (
          // Режим просмотра - показываем кнопку "Изменить"
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
          // Режим редактирования
          <View style={styles.buttonContainer}>
            {/* Верхний ряд: Сохранить и Отмена */}
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

            {/* Нижний ряд: Вернуть по умолчанию на всю ширину */}
            <View style={styles.bottomRow}>
              <ElevationCard
                theme={theme}
                w={"100%"}
                gradient
                elevation
                onPress={resetToDefaults}
              >
                <Text style={styles.font22}>Вернуть значения по умолчанию</Text>
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
  center: {
    alignItems: "center",
    width: "100%",
    gap: 15,
    marginBottom: verticalScale(0),
  },
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
