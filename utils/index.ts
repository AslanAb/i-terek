import { countryISOCodes } from "@/constants/country_name_by_iso_codes";
import { months } from "@/constants/months";
import { setThemeFn } from "@/hooks/theme";
import { getCityAndCountry, getCurrentLocation } from "@/services/location";
import { getWeatherAllIn } from "@/services/wheather";
import { IExtremes, INormals, IWeather, IWeightOfVariables } from "@/types";

export const getDate = () => {
  const date = new Date();
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} года`;
};

export const countryNameByISOCodes = (isoCode: string) => {
  const countryName = countryISOCodes[isoCode];
  return countryName;
};

export const checkIfHourPassed = (oldDate: number | undefined): boolean => {
  if (!oldDate) return true;
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate.getTime() - oldDate;
  const differenceInHours = differenceInMilliseconds / (1000 * 60);
  if (differenceInHours > 60) {
    return true;
  } else {
    return false;
  }
};

const splitString = (input: string): { letterPart: string; numberPart: number } | null => {
  const match = input.match(/^([A-Za-z]+)([\d.]+)$/);
  if (match) {
    return {
      letterPart: match[1],
      numberPart: parseFloat(match[2]),
    };
  } else {
    return null;
  }
};

export const findClosestIndex = (target: string, array: string[]): { closestValue: string; index: number } | null => {
  const splitResult = splitString(target);

  if (!splitResult) {
    return null;
  }

  const { letterPart, numberPart } = splitResult;

  let closestIndex = -1;
  let closestDifference = Infinity;

  array.forEach((item, index) => {
    const itemSplit = splitString(item);
    if (itemSplit && itemSplit.letterPart === letterPart) {
      const difference = Math.abs(itemSplit.numberPart - numberPart);
      if (difference < closestDifference) {
        closestDifference = difference;
        closestIndex = index;
      }
    }
  });

  if (closestIndex === -1 || closestDifference === Infinity) {
    return null;
  }

  return {
    closestValue: array[closestIndex],
    index: closestIndex,
  };
};

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
