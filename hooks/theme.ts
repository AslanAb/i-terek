import { defaultExtremes, defaultNormals, defaultVariables, solarActivityIndexies } from "@/constants/settings";
import { IExtremes, INormals, IWeather, IWeightOfVariables } from "@/types";
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

  const splitString = (input: string): { letterPart: string; numberPart: number } | null => {
    const match = input.match(/^([A-Za-z]+)([\d.]+)$/);
    if (match) {
      return {
        letterPart: match[1],
        numberPart: parseFloat(match[2]),
      };
    } else {
      return null;
    }
  };

  const findClosestIndex = (target: string, array: string[]): { closestValue: string; index: number } | null => {
    const splitResult = splitString(target);

    if (!splitResult) {
      return null;
    }

    const { letterPart, numberPart } = splitResult;

    let closestIndex = -1;
    let closestDifference = Infinity;

    array.forEach((item, index) => {
      const itemSplit = splitString(item);
      if (itemSplit && itemSplit.letterPart === letterPart) {
        const difference = Math.abs(itemSplit.numberPart - numberPart);
        if (difference < closestDifference) {
          closestDifference = difference;
          closestIndex = index;
        }
      }
    });

    if (closestIndex === -1 || closestDifference === Infinity) {
      return null;
    }

    return {
      closestValue: array[closestIndex],
      index: closestIndex,
    };
  };

  const setThemeFn = () => {
    let vars = weightOfVariables;
    let nors = normals;
    let exts = extremes;
    console.log("exts: ", exts);
    if (!vars || !nors || !exts) {
      vars = defaultVariables;
      nors = defaultNormals;
      exts = defaultExtremes;
      setWeightOfVariables(defaultVariables);
      setNormals(defaultNormals);
      setExtremes(defaultExtremes);
    }
    if (!weather) return undefined;
    // 1="green"
    // 2="yellow"
    // 3="red"
    let pressure;
    if (+weather.pressure < +exts.pressure.to) {
      if (+weather.pressure <= +nors.pressure.to) {
        if (+weather.pressure < +nors.pressure.from) {
          if (+weather.pressure < +exts.pressure.from) {
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
    if (+weather.pressureChangingIn6Hours < +exts.pressureChangingIn6Hours.to) {
      if (+weather.pressureChangingIn6Hours <= +nors.pressureChangingIn6Hours.to) {
        if (+weather.pressureChangingIn6Hours < +nors.pressureChangingIn6Hours.from) {
          if (+weather.pressureChangingIn6Hours < +exts.pressureChangingIn6Hours.from) {
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
    if (+weather.kp_index < +exts.kp_index.to) {
      if (+weather.kp_index <= +nors.kp_index.to) {
        kp_index = 1;
      } else {
        kp_index = 2;
      }
    } else {
      kp_index = 3;
    }

    let temp;
    if (+weather.temp < +exts.temp.to) {
      if (+weather.temp <= +nors.temp.to) {
        if (+weather.temp < +nors.temp.from) {
          if (+weather.temp < +exts.temp.from) {
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
    if (+weather.pm2_5 < +exts.pm2_5.to) {
      if (+weather.pm2_5 <= +nors.pm2_5.to) {
        pm2_5 = 1;
      } else {
        pm2_5 = 2;
      }
    } else {
      pm2_5 = 3;
    }

    let wind;
    if (+weather.wind < +exts.wind.to) {
      if (+weather.wind <= +nors.wind.to) {
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
      if (index < solarActivityIndexies.indexOf(exts.solar_activity.to)) {
        if (index <= solarActivityIndexies.indexOf(nors.solar_activity.to)) {
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
      +vars.pressure + +vars.pressureChangingIn6Hours + +vars.solar_activity + +vars.kp_index + +vars.temp + +vars.pm2_5 + +vars.wind;

    const result = Math.round(
      (pressure * +vars.pressure +
        pressureChangingIn6Hours * +vars.pressureChangingIn6Hours +
        solar_activity * +vars.solar_activity +
        kp_index * +vars.kp_index +
        temp * +vars.temp +
        pm2_5 * +vars.pm2_5 +
        wind * +vars.wind) /
        sumOfWeights
    );

    if (!result) return undefined;
    if (result === 1) return "green";
    if (result === 2) return "yellow";
    if (result === 3) return "red";
  };

  useEffect(() => {
    if (props.isWeatherError) {
      setIsThemeError(true);
      setIsThemeLoading(false);
      return;
    }
    if (!props.isWeatherLoading) {
      const appTheme = setThemeFn();
      if (appTheme) {
        setTheme(appTheme);
        setIsThemeLoading(false);
      } else {
        setIsThemeError(true);
        setIsThemeLoading(false);
      }
    }
  }, [props.isWeatherError, props.isWeatherLoading, normals, extremes, weightOfVariables, weather]);

  return { theme, isThemeLoading, isThemeError };
};

export { useTheme };
