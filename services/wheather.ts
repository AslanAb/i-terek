import API from "@/api";
import { IAirPolution, IOpenweathermapWeather, ISolarActivity, ITomorrowWeather, IWeather, IResult } from "@/types";
import axios from "axios";

const openweathermapApiWeather = async (latitude: number, longitude: number): Promise<IResult<IOpenweathermapWeather>> => {
  try {
    const params = {
      lat: latitude,
      lon: longitude,
      appid: API.openweathermapAppid,
      units: "metric",
    };

    const response = await axios.get<IOpenweathermapWeather>(API.openweathermapUrl + "/data/2.5/weather", { params });
    if (response.status !== 200) {
      return { success: false, error: "Can't get current weather" };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: `Failed to fetch current weather: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

const tomorrow = async (location: string, timesteps: string): Promise<IResult<ITomorrowWeather>> => {
  try {
    const params = {
      location: location,
      apikey: API.tomorrowAppid,
      units: "metric",
      timesteps: timesteps,
    };

    const response = await axios.get<ITomorrowWeather>(API.tomorrowUrl + "/v4/weather/history/recent", { params });
    if (response.status !== 200) {
      return { success: false, error: "Can't get tomorrow weather" };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: `Failed to fetch tomorrow weather: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

const getAirPolution = async (latitude: number, longitude: number): Promise<IResult<IAirPolution>> => {
  try {
    const params = {
      lat: latitude,
      lon: longitude,
      appid: API.openweathermapAppid,
      units: "metric",
    };

    const response = await axios.get<IAirPolution>(API.openweathermapUrl + "/data/2.5/air_pollution", { params });
    if (response.status !== 200) {
      return { success: false, error: "Can't get air pollution data" };
    }

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: `Failed to fetch air pollution data: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

const getKPIndex = async (): Promise<IResult<[string[]]>> => {
  try {
    const response = await axios.get<[string[]]>("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json");
    if (response.status !== 200) {
      return { success: false, error: "Can't get KP index data" };
    }

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: `Failed to fetch KP index: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

const getSolarActivity = async (): Promise<IResult<ISolarActivity[]>> => {
  try {
    const response = await axios.get<ISolarActivity[]>("https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json");
    if (response.status !== 200) {
      return { success: false, error: "Can't get solar activity data" };
    }

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: `Failed to fetch solar activity: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

const getWeatherAllIn = async (latitude: number, longitude: number): Promise<IResult<IWeather>> => {
  try {
    // Выполняем все запросы параллельно для оптимизации производительности
    const [
      currentWeatherResult,
      weatherTomorrowResult,
      airPollutionResult,
      kpIndexResult,
      solarActivityResult
    ] = await Promise.allSettled([
      openweathermapApiWeather(latitude, longitude),
      tomorrow(`${latitude}, ${longitude}`, "1h"),
      getAirPolution(latitude, longitude),
      getKPIndex(),
      getSolarActivity()
    ]);

    // Проверяем результаты и извлекаем данные или собираем ошибки
    const currentWeatherAll = currentWeatherResult.status === 'fulfilled' && currentWeatherResult.value.success
      ? currentWeatherResult.value.data : null;
    const weatherTomorror = weatherTomorrowResult.status === 'fulfilled' && weatherTomorrowResult.value.success
      ? weatherTomorrowResult.value.data : null;
    const airPolution = airPollutionResult.status === 'fulfilled' && airPollutionResult.value.success
      ? airPollutionResult.value.data : null;
    const kp_index = kpIndexResult.status === 'fulfilled' && kpIndexResult.value.success
      ? kpIndexResult.value.data : null;
    const solarActivity = solarActivityResult.status === 'fulfilled' && solarActivityResult.value.success
      ? solarActivityResult.value.data : null;

    // Собираем ошибки для логирования
    const errors = [];
    if (!currentWeatherAll) errors.push('current weather');
    if (!weatherTomorror) errors.push('tomorrow weather');
    if (!airPolution) errors.push('air pollution');
    if (!kp_index) errors.push('KP index');
    if (!solarActivity) errors.push('solar activity');

    if (errors.length > 0) {
      return { success: false, error: `Failed to fetch: ${errors.join(', ')}` };
    }

    // Дополнительные проверки на null/undefined после того, как мы убедились что данные получены
    if (!weatherTomorror?.timelines?.hourly || weatherTomorror.timelines.hourly.length < 7) {
      return { success: false, error: 'Invalid tomorrow weather data structure' };
    }
    if (!currentWeatherAll?.main || !currentWeatherAll.wind) {
      return { success: false, error: 'Invalid current weather data structure' };
    }
    if (!airPolution?.list?.[0]?.components) {
      return { success: false, error: 'Invalid air pollution data structure' };
    }
    if (!kp_index || kp_index.length <= 0) {
      return { success: false, error: 'Invalid KP index data' };
    }
    if (!solarActivity || solarActivity.length === 0) {
      return { success: false, error: 'Invalid solar activity data' };
    }

    const pressure = weatherTomorror.timelines.hourly[weatherTomorror.timelines.hourly.length - 1].values.pressureSurfaceLevel / 1.333;

    const pressure6HoursBefore =
      weatherTomorror.timelines.hourly[weatherTomorror.timelines.hourly.length - 7].values.pressureSurfaceLevel / 1.333;

    const currentWeather: IWeather = {
      temp: Math.round(currentWeatherAll.main.temp).toFixed(0),
      pressure: Math.round(pressure).toFixed(0),
      pressureChangingIn6Hours: Math.round(pressure - pressure6HoursBefore).toFixed(0),
      wind: Math.round(currentWeatherAll.wind.speed).toFixed(0),
      dt: new Date().getTime(),
      pm2_5: airPolution.list[0].components.pm2_5,
      kp_index: kp_index[kp_index.length - 1][1],
      solar_activity: solarActivity[0].current_class,
    };
    return { success: true, data: currentWeather };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { success: false, error: `Can't get current weather: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

export { tomorrow, getAirPolution, getKPIndex, getSolarActivity, getWeatherAllIn };
