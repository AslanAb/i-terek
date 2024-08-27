import axios from "axios";
import * as Location from "expo-location";
import API from "@/api";
const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return new Error("Permission to access location was denied");
  }
  const currentLocation = await Location.getCurrentPositionAsync({});
  return {
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
  };
};

const getCity = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: API.openweathermapAppid,
    limit: 5,
  };

  const response = await axios.get(API.openweathermapUrl + "/geo/1.0/reverse", { params });
  console.log('response: ', response);
  if (response.status !== 200) {
    return new Error("Can't get city");
  }
  return {
    city: response.data[0].local_names.ru,
    country: response.data[0].country,
  };
};

export { getCurrentLocation, getCity };
