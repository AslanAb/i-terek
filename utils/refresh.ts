import { setThemeFn } from "@/hooks/theme";
import { getCityAndCountry, getCurrentLocation } from "@/services/location";
import { getWeatherAllIn } from "@/services/wheather";
import { IExtremes, INormals, IWeather, IWeightOfVariables } from "@/types";

export const refreshAll = async (
  weather: IWeather | undefined,
  normals: INormals | undefined,
  extremes: IExtremes | undefined,
  weightOfVariables: IWeightOfVariables | undefined,
  forceRefresh: boolean = false
) => {
  try {
    const locationResult = await getCurrentLocation();
    if (!locationResult.success) {
      throw new Error(locationResult.error);
    }

    const cityAndCountryResult = await getCityAndCountry(locationResult.data!.latitude, locationResult.data!.longitude);
    if (!cityAndCountryResult.success) {
      throw new Error(cityAndCountryResult.error);
    }

    const weatherResult = await getWeatherAllIn(locationResult.data!.latitude, locationResult.data!.longitude);
    if (!weatherResult.success) {
      throw new Error(weatherResult.error);
    }

    const appTheme = setThemeFn(weatherResult.data!, normals, extremes, weightOfVariables);
    return {
      success: true,
      data: {
        cityAndCountry: cityAndCountryResult.data!,
        weatherData: weatherResult.data!,
        appTheme
      }
    };
  } catch (error) {
    return { success: false, error: `Can't refresh data: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};
