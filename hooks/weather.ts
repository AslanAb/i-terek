import { getWeatherAllIn } from "@/services/wheather";
import { IWeather } from "@/types";
import { checkIfHourPassed } from "@/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useMMKVObject } from "react-native-mmkv";

const useGetAndSetWeather = (isLocationError: boolean, isLocationLoading: boolean) => {
  const [weather, setWeather] = useMMKVObject<IWeather>("weather");
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isWeatherError, setIsWeatherError] = useState(false);
  const [location, setLocation] = useMMKVObject<{ latitude: number, longitude: number }>("location");
  const isFetchingRef = useRef(false);

  const fetchWeatherData = async () => {
    if (isFetchingRef.current) {
      console.log('Weather fetch already in progress, skipping');
      return;
    }

    isFetchingRef.current = true;
    console.log('fetchWeatherData: ', fetchWeatherData);

    try {
      if (isLocationError || !location) {
        throw new Error('Location error or no location data');
      }

      const needsUpdate = !weather || checkIfHourPassed(weather.dt);

      if (needsUpdate) {
        console.log("Fetching new weather data");
        const weatherResult = await getWeatherAllIn(location.latitude, location.longitude);
        console.log("weatherData");
        if (!weatherResult.success) {
          setWeather(undefined);
          throw new Error(weatherResult.error);
        }
        setWeather(weatherResult.data);
      } else {
        console.log("Using cached weather data");
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      setIsWeatherLoading(false);
      setIsWeatherError(true);
    } finally {
      setIsWeatherLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (isLocationError) {
      setIsWeatherLoading(false);
      setIsWeatherError(true);
      return;
    }
    if (!isLocationLoading && location  && !isFetchingRef.current) {
      fetchWeatherData();
    }
  }, [isLocationLoading, location, isLocationError]);

  // Проверяем актуальность погоды при каждом возвращении на экран
  useFocusEffect(
    useCallback(() => {
      if (!isLocationError && !isLocationLoading && location) {
        const needsUpdate = !weather || checkIfHourPassed(weather.dt);
        if (needsUpdate && !isFetchingRef.current) {
          console.log('Weather check on screen focus - updating data');
          fetchWeatherData();
        }
      }
    }, [weather, location, isLocationError, isLocationLoading])
  );

  return { isWeatherLoading, isWeatherError };
};

export default useGetAndSetWeather;
