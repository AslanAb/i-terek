import axios from "axios";

const getCurrentWeather = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: process.env.EXPO_PUBLIC_APPID,
    units: "metric",
  };

  const response = await axios.get(process.env.EXPO_PUBLIC_URL + "/data/2.5/weather", { params });
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const getWeatherForecast5day3hour = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: process.env.EXPO_PUBLIC_APPID,
    units: "metric",
    cnt: 1,
  };

  const response = await axios.get(process.env.EXPO_PUBLIC_URL + "/data/2.5/forecast", { params });
  if (response.status !== 200) {
    return new Error("Can't get weather forecast");
  }

  return response.data;
};

const getCurrentWeatherOneCall = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: process.env.EXPO_PUBLIC_APPID,
    units: "metric",
  };

  const response = await axios.get(process.env.EXPO_PUBLIC_URL + "/data/3.0/onecall", { params });
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const getCurrentWeatherOneCallTimestamp = async (latitude: number, longitude: number, time: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: process.env.EXPO_PUBLIC_APPID,
    units: "metric",
    dt: time,
  };

  const response = await axios.get(process.env.EXPO_PUBLIC_URL + "/data/3.0/onecall/timemachine", { params });
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const tomorrow = async (location: string, timesteps: string) => {
  const params = {
    location: location,
    apikey: process.env.EXPO_PUBLIC_API_KEY_TOMORROW,
    units: "metric",
    timesteps: timesteps,
  };

  const response = await axios.get("https://api.tomorrow.io/v4/weather/history/recent", { params });
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const getAirPolution = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: process.env.EXPO_PUBLIC_APPID,
    units: "metric",
  };

  const response = await axios.get(process.env.EXPO_PUBLIC_URL + "/data/2.5/air_pollution", { params });
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const getKPIndex = async () => {
  const response = await axios.get("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json");
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const getSolarActivity = async () => {
  const response = await axios.get("https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json");
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

export {
  getCurrentWeather,
  getWeatherForecast5day3hour,
  getCurrentWeatherOneCall,
  getCurrentWeatherOneCallTimestamp,
  tomorrow,
  getAirPolution,
  getKPIndex,
  getSolarActivity
};
