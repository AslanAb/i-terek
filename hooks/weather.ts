import { getWeatherAllIn } from "@/services/wheather";
import { ILocation, IWeather } from "@/types";
import { checkIfHourPassed } from "@/utils";
import { useEffect, useState } from "react";
import { useMMKVObject } from "react-native-mmkv";

const useGetAndSetWeather = (isLocationError: boolean, isLocationLoading: boolean) => {
  console.log('isLocationLoading: 2', isLocationLoading);
  const [weather, setWeather] = useMMKVObject<IWeather>("weather");
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isWeatherError, setIsWeatherError] = useState(false);
  const [location, setLocation] = useMMKVObject<{ latitude: number, longitude: number }>("location");

  const fetchWeatherData = async () => {
    console.log('fetchWeatherData: ', fetchWeatherData);
    try {
      if (isLocationError || !location) {
        throw new Error();
      }
      if (weather) {
        console.log("weather");
        const ifHourPassed = checkIfHourPassed(weather.dt);
        if (ifHourPassed) {
          console.log("ifHourPassed");
          const weatherData = await getWeatherAllIn(location.latitude, location.longitude);
          console.log("weatherData");
          if (weatherData instanceof Error) {
            setWeather(undefined);
            throw new Error();
          }
          return setWeather(weatherData);
        }
      } else {
        const weatherData = await getWeatherAllIn(location.latitude, location.longitude);
        console.log("weatherData");
        if (weatherData instanceof Error) {
          setWeather(undefined);
          throw new Error();
        }
        return setWeather(weatherData);
      }
    } catch (error) {
      setIsWeatherLoading(false);
      setIsWeatherError(true);
    } finally {
      setIsWeatherLoading(false);
    }
  };
  console.log('location: ', location);

  useEffect(() => {
    if (isLocationError) {
      setIsWeatherLoading(false);
      setIsWeatherError(true);
      return;
    }
    if (!isLocationLoading && location) {
      console.log('!isLocationLoading && location: ', !isLocationLoading && location);
      fetchWeatherData();
    }
  }, [isLocationLoading, location, isLocationError]);

  return { isWeatherLoading, isWeatherError };
};

export default useGetAndSetWeather;
