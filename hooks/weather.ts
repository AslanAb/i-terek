import { getWeatherAllIn } from "@/services/wheather";
import { ILocation, IWeather } from "@/types";
import { useEffect, useState } from "react";
import { useMMKVObject } from "react-native-mmkv";

const useGetAndSetWeather = (latAndLong: ILocation, isLocationError: boolean, isLocationLoading: boolean) => {
  const [weather, setWeather] = useMMKVObject<IWeather>("weather");
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isWeatherError, setIsWeatherError] = useState(false);

  const fetchWeatherData = async () => {
    try {
      if (isLocationError || isLocationLoading) {
        return;
      }
      if (weather) {
        const dtDate: Date = new Date(weather.dt * 1000);
        const currentTime: Date = new Date();
        const differenceInMinutes: number = (currentTime.getTime() - dtDate.getTime()) / (1000 * 60);

        if (differenceInMinutes >= 60) {
          const weatherData = await getWeatherAllIn(latAndLong.latitude, latAndLong.longitude);
          if (weatherData instanceof Error) {
            setWeather({
              temp: "0",
              pressure: "0",
              pressureChangingIn6Hours: 0,
              wind: "0",
              dt: 0,
              pm2_5: 0,
              kp_index: "0",
              solar_activity: "0",
            });
            throw new Error();
          }
          return setWeather(weatherData);
        }
      } else {
        const weatherData = await getWeatherAllIn(latAndLong.latitude, latAndLong.longitude);
        if (weatherData instanceof Error) {
          throw new Error();
        }
        return setWeather(weatherData);
      }
    } catch (error) {
      console.error("🚨error --->", error);
      setIsWeatherError(true);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [isLocationError, isLocationLoading]);

  return { weather, isWeatherLoading, isWeatherError };
};

export { useGetAndSetWeather };
