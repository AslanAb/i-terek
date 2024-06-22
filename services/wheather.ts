import axios from "axios";
import { fetchWeatherApi } from "openmeteo";

const getCurrentWeather = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: process.env.EXPO_PUBLIC_APPID,
    units: "metric",
  };

  const response = await axios.get(
    process.env.EXPO_PUBLIC_URL + "/data/2.5/weather",
    { params }
  );
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const getWeatherForecast5day3hour = async (
  latitude: number,
  longitude: number
) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: process.env.EXPO_PUBLIC_APPID,
    units: "metric",
    cnt: 1,
  };

  const response = await axios.get(
    process.env.EXPO_PUBLIC_URL + "/data/2.5/forecast",
    { params }
  );
  if (response.status !== 200) {
    return new Error("Can't get weather forecast");
  }

  return response.data;
};

const getCurrentWeatherOneCall = async (
  latitude: number,
  longitude: number
) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: process.env.EXPO_PUBLIC_APPID,
    units: "metric",
  };

  const response = await axios.get(
    process.env.EXPO_PUBLIC_URL + "/data/3.0/onecall",
    { params }
  );
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const getWeatherFronOpenWeather = async (
  latitude_: number,
  longitude_: number
) => {
  const params = {
    latitude: latitude_,
    longitude: longitude_,
    current: ["temperature_2m", "surface_pressure", "wind_speed_10m"],
    hourly: ["temperature_2m", "surface_pressure", "wind_speed_10m"],
    daily: ["temperature_2m_max", "wind_speed_10m_max"],
    wind_speed_unit: "ms",
    timeformat: "unixtime",
    timezone: "auto",
    past_days: 1,
    forecast_days: 1,
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  console.log("✌️timezone --->", timezone);
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
      surfacePressure: current.variables(1)!.value(),
      windSpeed10m: current.variables(2)!.value(),
    },
    hourly: {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval()
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      surfacePressure: hourly.variables(1)!.valuesArray()!,
      windSpeed10m: hourly.variables(2)!.valuesArray()!,
    },
    daily: {
      time: range(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval()
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      temperature2mMax: daily.variables(0)!.valuesArray()!,
      windSpeed10mMax: daily.variables(1)!.valuesArray()!,
    },
  };

  // `weatherData` now contains a simple structure with arrays for datetime and weather data
  // for (let i = 0; i < weatherData.hourly.time.length; i++) {
  //   console.log(
  //     weatherData.hourly.time[i].toISOString(),
  //     weatherData.hourly.temperature2m[i],
  //     weatherData.hourly.surfacePressure[i],
  //     weatherData.hourly.windSpeed10m[i]
  //   );
  // }
  // for (let i = 0; i < weatherData.daily.time.length; i++) {
  //   console.log(
  //     weatherData.daily.time[i].toISOString(),
  //     weatherData.daily.temperature2mMax[i],
  //     weatherData.daily.windSpeed10mMax[i]
  //   );
  // }
  return weatherData;
};

export {
  getCurrentWeather,
  getWeatherForecast5day3hour,
  getCurrentWeatherOneCall,
  getWeatherFronOpenWeather
};
