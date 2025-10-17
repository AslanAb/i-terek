import axios from "axios";
import * as Location from "expo-location";
import API from "@/api";
import { countryNameByISOCodes } from "@/utils";

const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return new Error("Permission to access location was denied");
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    if (!currentLocation?.coords) {
      return new Error("Can't get current coordinates");
    }
    console.log('get lat & lon: ', currentLocation.coords.latitude, currentLocation.coords.longitude);
    return {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };
  } catch (error) {
    return new Error("Can't get current coordinates");
  }
};

const getCityAndCountry = async (latitude: number, longitude: number) => {
  try {
    if (!API.openweathermapAppid) {
      return new Error("OpenWeather API key is missing");
    }

    const params = {
      lat: latitude,
      lon: longitude,
      appid: API.openweathermapAppid,
      limit: 5,
    };

    const response = await axios.get(API.openweathermapUrl + "/geo/1.0/reverse", { params });
    if (response.status !== 200 || !Array.isArray(response.data) || response.data.length === 0) {
      return new Error("Can't get city");
    }

    const first = response.data[0];
    const countryCode = first?.country;
    const countryRu = countryCode ? countryNameByISOCodes(countryCode) : undefined;
    const cityRu = first?.local_names?.ru || first?.name;

    if (!cityRu || !countryRu) {
      return new Error("Can't resolve city or country");
    }

    console.log('get city: ', cityRu);
    return {
      city: cityRu,
      country: countryRu,
    };
  } catch (error) {
    return new Error("Can't get city");
  }
};

export { getCurrentLocation, getCityAndCountry };
