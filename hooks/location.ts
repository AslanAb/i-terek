import { getCityAndCountry, getCurrentLocation } from "@/services/location";
import { checkIfHourPassed } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { useMMKVNumber, useMMKVObject, useMMKVString } from "react-native-mmkv";

const useLocation = () => {
  const [city, setCity] = useMMKVString("city");
  const [country, setCountry] = useMMKVString("country");
  const [locationDate, setLocationDate] = useMMKVNumber("locationDate");
  const [location, setLocation] = useMMKVObject<{ latitude: number, longitude: number }>("location");
  const [isLocationError, setIsLocationError] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  useEffect(() => {
    const ifHourPassed = checkIfHourPassed(locationDate);
    console.log('ifHourPassed: ', ifHourPassed);
    if (ifHourPassed || !location) {
      fetchLocationData();
    } else {
      setIsLocationLoading(false);
    }
  }, []);
  
  const fetchLocationData = useCallback(async () => {
    try {
      const locationData = await getCurrentLocation();
      if (locationData instanceof Error) {
        throw locationData;
      }
      console.log('locationData');

      setLocation(locationData);

      const cityAndCountry = await getCityAndCountry(locationData.latitude, locationData.longitude);
      if (cityAndCountry instanceof Error) {
        throw cityAndCountry;
      }
      console.log('cityAndCountry');

      setCity(cityAndCountry.city);
      setCountry(cityAndCountry.country);
      setLocationDate(new Date().getTime());
    } catch (error) {
      console.error('error get location', error);
      setIsLocationError(true);
    } finally {
      setIsLocationLoading(false);
    }
  }, []);

  return { isLocationError, isLocationLoading };
};

export default useLocation;
