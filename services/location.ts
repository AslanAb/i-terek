import axios from "axios";
import * as Location from "expo-location";
import Config from "@/Config";
console.log('Config: ', Config.mainUrl);

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
    appid: Config.apiKey,
    limit: 5,
  };

  const response = await axios.get(
    Config.mainUrl + "/geo/1.0/reverse",
    { params }
  );
  if (response.status !== 200) {
    return new Error("Can't get city");
  }

  return {
    city: response.data[0].local_names.ru,
    country: response.data[0].country,
  };
};

export { getCurrentLocation, getCity };
