import axios from "axios";
import * as Location from "expo-location";
import API from "@/api";
import { countryNameByISOCodes } from "@/utils";
import { IResult } from "@/types";

const getCurrentLocation = async (): Promise<IResult<{ latitude: number, longitude: number }>> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return { success: false, error: "Permission to access location was denied" };
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    if (!currentLocation?.coords) {
      return { success: false, error: "Can't get current coordinates" };
    }
    console.log('get lat & lon: ', currentLocation.coords.latitude, currentLocation.coords.longitude);
    return {
      success: true,
      data: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      }
    };
  } catch (error) {
    return { success: false, error: `Can't get current coordinates: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

const getCityAndCountry = async (latitude: number, longitude: number): Promise<IResult<{ city: string, country: string }>> => {
  try {
    if (!API.openweathermapAppid) {
      return { success: false, error: "OpenWeather API key is missing" };
    }

    const params = {
      lat: latitude,
      lon: longitude,
      appid: API.openweathermapAppid,
      limit: 5,
    };

    const response = await axios.get(API.openweathermapUrl + "/geo/1.0/reverse", { params });
    if (response.status !== 200 || !Array.isArray(response.data) || response.data.length === 0) {
      return { success: false, error: "Can't get city data" };
    }

    const first = response.data[0];
    const countryCode = first?.country;
    const countryRu = countryCode ? countryNameByISOCodes(countryCode) : undefined;
    const cityRu = first?.local_names?.ru || first?.name;

    if (!cityRu || !countryRu) {
      return { success: false, error: "Can't resolve city or country" };
    }

    console.log('get city: ', cityRu);
    return {
      success: true,
      data: {
        city: cityRu,
        country: countryRu,
      }
    };
  } catch (error) {
    return { success: false, error: `Can't get city: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

export { getCurrentLocation, getCityAndCountry };
