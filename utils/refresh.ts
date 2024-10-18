import { setThemeFn } from "@/hooks/theme";
import { getCityAndCountry, getCurrentLocation } from "@/services/location";
import { getWeatherAllIn } from "@/services/wheather";
import { IExtremes, INormals, IWeather, IWeightOfVariables } from "@/types";

export const refreshAll = async (
  weather: IWeather | undefined,
  normals: INormals | undefined,
  extremes: IExtremes | undefined,
  weightOfVariables: IWeightOfVariables | undefined
) => {
  try {
    const locationData = await getCurrentLocation();
    if (locationData instanceof Error) {
      throw new Error();
    }

    const cityAndCountry = await getCityAndCountry(locationData.latitude, locationData.longitude);
    if (cityAndCountry instanceof Error) {
      throw new Error();
    }

    const weatherData = await getWeatherAllIn(locationData.latitude, locationData.longitude);
    if (weatherData instanceof Error) {
      throw new Error();
    }
    const appTheme = setThemeFn(weatherData, normals, extremes, weightOfVariables);
    return { cityAndCountry, weatherData, appTheme };
  } catch (error) {
    return new Error("Can't get current weather");
  }
};
