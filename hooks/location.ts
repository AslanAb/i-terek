import { countryNameByISOCodes } from "@/constants/country_name_by_iso_codes";
import { getCity, getCurrentLocation } from "@/services/location";
import { useCallback, useEffect, useState } from "react";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";

const useLocation = () => {
  const [city, setCity] = useMMKVString("city");
  const [country, setCountry] = useMMKVString("country");
  const [locationDate, setLocationDate] = useMMKVString("locationDate");
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [isLocationError, setIsLocationError] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isLoading, setIsLoading] = useMMKVBoolean("isLoading");

  const fetchLocationData = useCallback(async () => {
    try {
      const locationData = await getCurrentLocation();
      if (locationData instanceof Error) {
        throw new Error();
      }
      const cityAndCountry = await getCity(locationData.latitude, locationData.longitude);
      console.log("cityAndCountry: ", cityAndCountry);
      if (cityAndCountry instanceof Error) {
        throw new Error();
      }
      setLocation(locationData);
      setCity(cityAndCountry.city);
      setCountry(countryNameByISOCodes(cityAndCountry.country));
      setLocationDate(new Date().toDateString());
    } catch (error) {
      console.error("🚨error --->", error);
      setIsLocationError(true);
    } finally {
      setIsLocationLoading(false);
    }
  }, []);

  const checkIfHourPassed = (currentDate: Date, locationDateString: string | undefined): boolean => {
    if (!locationDateString) return true;
    const oldLocationDate = new Date(locationDateString);
    const differenceInMilliseconds = currentDate.getTime() - oldLocationDate.getTime();
    const differenceInHours = differenceInMilliseconds / (1000 * 60);
    if (differenceInHours > 60) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const time = checkIfHourPassed(new Date(), locationDate);
    if (time) {
      setIsLoading(true);
      fetchLocationData();
    } else {
      setIsLoading(true);
      setIsLocationLoading(false);
    }
  }, []);
  return { location, isLocationError, isLocationLoading };
};

export { useLocation };
