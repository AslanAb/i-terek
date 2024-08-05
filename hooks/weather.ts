import { getWeatherAllIn } from "@/services/wheather";
import { ILocation, IWeather } from "@/types";

const getAndSetWeather = async (latAndLong: ILocation, weather: any, setWeather: any) => {
  try {
    if (weather) {
      const dtDate: Date = new Date(weather.dt * 1000);
      const currentTime: Date = new Date();
      const differenceInMinutes: number = (currentTime.getTime() - dtDate.getTime()) / (1000 * 60);

      if (differenceInMinutes >= 60) {
        const weatherData = await getWeatherAllIn(latAndLong.latitude, latAndLong.longitude);
        if (weatherData instanceof Error) {
          setWeather({
            temp: 0,
            pressure: 0,
            pressureChangingIn3Hours: 0,
            wind: 0,
            dt: 0,
            pm2_5: 0,
            kp_index: 0,
            solar_activity: 0,
          });
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
    return new Error("Can't get current weather");
  }
};

export { getAndSetWeather };
