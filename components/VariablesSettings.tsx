import { Dimensions, View, Text } from "react-native";
import { useMMKVObject, useMMKVString } from "@/mmkv";
import { IWeightOfVariables } from "@/types";
import { defaultVariables } from "@/constants/settings";
import ElevationCard from "./ElevationCard";
import { scale, verticalScale, ScaledSheet } from "react-native-size-matters";
import { useForm } from "react-hook-form";
import VariableInput from "./VariableInput";
import { useAlert } from "@/hooks/useAlert";
import CustomAlert from "./CustomAlert";
import { useState, useEffect, useCallback, useRef, RefObject } from "react";
import { useFocusEffect } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { width } = Dimensions.get("window");

interface VariablesSettingsProps {
  scrollViewRef?: RefObject<KeyboardAwareScrollView | null>;
}

export default function VariablesSettings({ scrollViewRef }: VariablesSettingsProps) {
  const [theme, setTheme] = useMMKVString("theme");
  const [weightOfVariables, setWeightOfVariables] =
    useMMKVObject<IWeightOfVariables>("weightOfVariables");
  const [isEditing, setIsEditing] = useState(false);
  const [originalValues, setOriginalValues] =
    useState<IWeightOfVariables | null>(null);
  const isResettingRef = useRef(false);

  const { isVisible, alertConfig, hideAlert, showSuccess, showInfo } = useAlert();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: weightOfVariables,
    mode: "onChange", // Валидация при изменении
  });

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
    // Прокручиваем страницу вниз при входе в режим редактирования
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd(true);
    }, 100);
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
    try {
      // Сохраняем данные в MMKV
      setWeightOfVariables(data);

      // Принудительно обновляем форму с новыми данными
      reset(data);

      setIsEditing(false);
      setOriginalValues(null);
      showSuccess(
        "Настройки сохранены",
        "Вес показателей обновлен"
      );
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleSave = () => {
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors, cannot save");
      return;
    }

    handleSubmit(onSubmit)();
  };

  const resetToDefaults = () => {
    isResettingRef.current = true;
    for (const key in defaultVariables) {
      setValue(
        key as keyof IWeightOfVariables,
        defaultVariables[key as keyof IWeightOfVariables]
      );
    }
    setWeightOfVariables(defaultVariables);
    setIsEditing(false);
    setOriginalValues(null);
    showSuccess("Изменения сохранены", "Восстановлены стандартные значения");
    setTimeout(() => {
      isResettingRef.current = false;
    }, 100);
  };

  // Обработка потери фокуса (пользователь уходит с экрана)
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (isEditing && !isResettingRef.current) {
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
  center: {
    alignItems: "center",
    width: "100%",
    gap: 15,
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
