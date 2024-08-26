import { IAirPolution, IOpenweathermapWeather, ISolarActivity, ITomorrowWeather, IWeather } from "@/types";
import axios from "axios";
import { API } from "@/api";

const openweathermapApiWeather = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: API.openweathermapAppid,
    units: "metric",
  };

  const response = await axios.get<IOpenweathermapWeather>(API.openweathermapUrl + "/data/2.5/weather", { params });
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  console.log('wheather: ', response.data);

  return response.data;
};

const tomorrow = async (location: string, timesteps: string) => {
  const params = {
    location: location,
    apikey: API.tomorrowAppid,
    units: "metric",
    timesteps: timesteps,
  };

  const response = await axios.get<ITomorrowWeather>(API.tomorrowUrl + "/v4/weather/history/recent", { params });
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }
  console.log('tomorrow: ', response.data);
  return response.data;
};

const getAirPolution = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: API.openweathermapAppid,
    units: "metric",
  };

  const response = await axios.get<IAirPolution>(API.openweathermapUrl + "/data/2.5/air_pollution", { params });
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const getKPIndex = async () => {
  const response = await axios.get<[string[]]>("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json");
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const getSolarActivity = async () => {
  const response = await axios.get<ISolarActivity[]>("https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json");
  if (response.status !== 200) {
    return new Error("Can't get current weather");
  }

  return response.data;
};

const getWeatherAllIn = async (latitude: number, longitude: number) => {
  try {
    const currentWeatherAll = await openweathermapApiWeather(latitude, longitude);

    const weatherTomorror = await tomorrow(`${latitude}, ${longitude}`, "1h");

    const airPolution = await getAirPolution(latitude, longitude);

    const kp_index = await getKPIndex();

    const solarActivity = await getSolarActivity();

    if (
      currentWeatherAll instanceof Error ||
      weatherTomorror instanceof Error ||
      airPolution instanceof Error ||
      kp_index instanceof Error ||
      solarActivity instanceof Error
    ) {
      throw new Error("Can't get current weather");
    }

    const pressure = (
      weatherTomorror.timelines.hourly[weatherTomorror.timelines.hourly.length - 1].values.pressureSurfaceLevel / 1.333
    )

    const pressure6HoursBefore = (
      weatherTomorror.timelines.hourly[weatherTomorror.timelines.hourly.length - 7].values.pressureSurfaceLevel / 1.333
    );

    const currentWeather: IWeather = {
      temp: Math.round(currentWeatherAll.main.temp).toFixed(0),
      pressure: Math.round(pressure).toFixed(0),
      pressureChangingIn6Hours: Math.round(pressure - pressure6HoursBefore).toFixed(0),
      wind: Math.round(currentWeatherAll.wind.speed).toFixed(0),
      dt: currentWeatherAll.dt,
      pm2_5: airPolution.list[0].components.pm2_5,
      kp_index: kp_index[kp_index.length - 1][1],
      solar_activity: solarActivity[0].current_class,
    };
    return currentWeather;
  } catch (error) {
    console.error("  --->", error);
    return new Error("Can't get current weather");
  }
};

export { tomorrow, getAirPolution, getKPIndex, getSolarActivity, getWeatherAllIn };