import { defaultExtremes, defaultNormals, defaultVariables, solarActivityIndexies } from "@/constants/settings";
import { IExtremes, INormals, IWeather, IWeightOfVariables } from "@/types";
import { findClosestIndex } from "@/utils";
import { useEffect, useState } from "react";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";

const useTheme = (props: { isWeatherLoading: boolean; isWeatherError: boolean }) => {
  const [theme, setTheme] = useMMKVString("theme");
  const [weather, setWeather] = useMMKVObject<IWeather>("weather");
  const [weightOfVariables, setWeightOfVariables] = useMMKVObject<IWeightOfVariables>("weightOfVariables");
  const [normals, setNormals] = useMMKVObject<INormals>("normals");
  const [extremes, setExtremes] = useMMKVObject<IExtremes>("extremes");
  const [isThemeLoading, setIsThemeLoading] = useState(true);
  const [isThemeError, setIsThemeError] = useState(false);

  if (!weightOfVariables || !normals || !extremes) {
    setWeightOfVariables(defaultVariables);
    setNormals(defaultNormals);
    setExtremes(defaultExtremes);
  }

  useEffect(() => {
    if (props.isWeatherError) {
      setTheme(undefined);
      setIsThemeError(true);
      setIsThemeLoading(false);
      return;
    }
    if (!props.isWeatherLoading && weather && normals && extremes && weightOfVariables) {
      const appTheme = setThemeFn();
      if (appTheme) {
        setTheme(appTheme);
        setIsThemeLoading(false);
      } else {
        setTheme(undefined);
        setIsThemeError(true);
        setIsThemeLoading(false);
      }
    }
  }, [props.isWeatherError, props.isWeatherLoading, normals, extremes, weightOfVariables, weather]);

  const setThemeFn = () => {
    if (!weather || !normals || !extremes || !weightOfVariables) return undefined;
    // 1="green"
    // 2="yellow"
    // 3="red"
    let pressure;
    if (+weather.pressure < +extremes.pressure.to) {
      if (+weather.pressure <= +normals.pressure.to) {
        if (+weather.pressure < +normals.pressure.from) {
          if (+weather.pressure < +extremes.pressure.from) {
            pressure = 3;
          } else {
            pressure = 2;
          }
        } else {
          pressure = 1;
        }
      } else {
        pressure = 2;
      }
    } else {
      pressure = 3;
    }

    let pressureChangingIn6Hours;
    if (+weather.pressureChangingIn6Hours < +extremes.pressureChangingIn6Hours.to) {
      if (+weather.pressureChangingIn6Hours <= +normals.pressureChangingIn6Hours.to) {
        if (+weather.pressureChangingIn6Hours < +normals.pressureChangingIn6Hours.from) {
          if (+weather.pressureChangingIn6Hours < +extremes.pressureChangingIn6Hours.from) {
            pressureChangingIn6Hours = 3;
          } else {
            pressureChangingIn6Hours = 2;
          }
        } else {
          pressureChangingIn6Hours = 1;
        }
      } else {
        pressureChangingIn6Hours = 2;
      }
    } else {
      pressureChangingIn6Hours = 3;
    }

    let kp_index;
    if (+weather.kp_index < +extremes.kp_index.to) {
      if (+weather.kp_index <= +normals.kp_index.to) {
        kp_index = 1;
      } else {
        kp_index = 2;
      }
    } else {
      kp_index = 3;
    }

    let temp;
    if (+weather.temp < +extremes.temp.to) {
      if (+weather.temp <= +normals.temp.to) {
        if (+weather.temp < +normals.temp.from) {
          if (+weather.temp < +extremes.temp.from) {
            temp = 3;
          } else {
            temp = 2;
          }
        } else {
          temp = 1;
        }
      } else {
        temp = 2;
      }
    } else {
      temp = 3;
    }

    let pm2_5;
    if (+weather.pm2_5 < +extremes.pm2_5.to) {
      if (+weather.pm2_5 <= +normals.pm2_5.to) {
        pm2_5 = 1;
      } else {
        pm2_5 = 2;
      }
    } else {
      pm2_5 = 3;
    }

    let wind;
    if (+weather.wind < +extremes.wind.to) {
      if (+weather.wind <= +normals.wind.to) {
        wind = 1;
      } else {
        wind = 2;
      }
    } else {
      wind = 3;
    }

    let solar_activity;
    const resusolar_activity_in_arr = findClosestIndex(weather.solar_activity, solarActivityIndexies);
    if (resusolar_activity_in_arr) {
      const { index } = resusolar_activity_in_arr;
      if (index < solarActivityIndexies.indexOf(extremes.solar_activity.to)) {
        if (index <= solarActivityIndexies.indexOf(normals.solar_activity.to)) {
          solar_activity = 1;
        } else {
          solar_activity = 2;
        }
      } else {
        solar_activity = 3;
      }
    }
    if (!solar_activity) return undefined;

    const sumOfWeights =
      +weightOfVariables.pressure +
      +weightOfVariables.pressureChangingIn6Hours +
      +weightOfVariables.solar_activity +
      +weightOfVariables.kp_index +
      +weightOfVariables.temp +
      +weightOfVariables.pm2_5 +
      +weightOfVariables.wind;

    const result = Math.round(
      (pressure * +weightOfVariables.pressure +
        pressureChangingIn6Hours * +weightOfVariables.pressureChangingIn6Hours +
        solar_activity * +weightOfVariables.solar_activity +
        kp_index * +weightOfVariables.kp_index +
        temp * +weightOfVariables.temp +
        pm2_5 * +weightOfVariables.pm2_5 +
        wind * +weightOfVariables.wind) /
        sumOfWeights
    );

    if (!result) return undefined;
    if (result === 1) return "green";
    if (result === 2) return "yellow";
    if (result === 3) return "red";
  };

  return { isThemeLoading, isThemeError };
};

export default useTheme;
