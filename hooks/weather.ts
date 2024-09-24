import { getWeatherAllIn } from "@/services/wheather";
import { ILocation, IWeather } from "@/types";
import { checkIfHourPassed } from "@/utils";
import { useEffect, useState } from "react";
import { useMMKVObject } from "react-native-mmkv";

const useGetAndSetWeather = (location: ILocation | undefined, isLocationError: boolean, isLocationLoading: boolean) => {
  const [weather, setWeather] = useMMKVObject<IWeather>("weather");
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isWeatherError, setIsWeatherError] = useState(false);

  const fetchWeatherData = async () => {
    try {
      if (isLocationError || !location) {
        throw new Error();
      }
      if (weather) {
        const ifHourPassed = checkIfHourPassed((weather.dt * 1000).toString());
        if (ifHourPassed) {
          const weatherData = await getWeatherAllIn(location.latitude, location.longitude);
          if (weatherData instanceof Error) {
            setWeather(undefined);
            throw new Error();
          }
          return setWeather(weatherData);
        }
      } else {
        const weatherData = await getWeatherAllIn(location.latitude, location.longitude);
        if (weatherData instanceof Error) {
          throw new Error();
        }
        return setWeather(weatherData);
      }
    } catch (error) {
      console.error("error get weather");
      setIsWeatherError(true);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    if (isLocationError) {
      setIsWeatherLoading(false);
      setIsWeatherError(true);
      return
    }
    if (!isLocationLoading && location) {
      fetchWeatherData();
    }
  }, [isLocationLoading, location, isLocationError]);

  return { isWeatherLoading, isWeatherError };
};

export default useGetAndSetWeather;
