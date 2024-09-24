import axios from "axios";
import * as Location from "expo-location";
import API from "@/api";
import { countryNameByISOCodes } from "@/utils";

const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return new Error("Permission to access location was denied");
  }
  const currentLocation = await Location.getCurrentPositionAsync({});
  console.log('get lat & lon: ', currentLocation.coords.latitude, currentLocation.coords.longitude);
  return {
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
  };
};

const getCityAndCountry = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: API.openweathermapAppid,
    limit: 5,
  };

  const response = await axios.get(API.openweathermapUrl + "/geo/1.0/reverse", { params });
  if (response.status !== 200) {
    return new Error("Can't get city");
  }
  const countryRu = countryNameByISOCodes(response.data[0].country)

  console.log('get city: ', response.data[0].local_names.ru);
  return {
    city: response.data[0].local_names.ru,
    country: countryRu,
  };
};

export { getCurrentLocation, getCityAndCountry };
