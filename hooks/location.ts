import { countryNameByISOCodes } from "@/constants/country_name_by_iso_codes";
import { getCity, getCurrentLocation } from "@/services/location";
import { useCallback, useEffect, useState } from "react";
import { useMMKVString } from "react-native-mmkv";

const useLocation = () => {
  const [city, setCity] = useMMKVString("city");
  const [country, setCountry] = useMMKVString("country");
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [isLocationError, setIsLocationError] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  const fetchLocationData = useCallback(async () => {
    try {
      const locationData = await getCurrentLocation();
      if (locationData instanceof Error) {
        throw new Error();
      }
      const cityAndCountry = await getCity(locationData.latitude, locationData.longitude);
      console.log('cityAndCountry: ', cityAndCountry);
      if (cityAndCountry instanceof Error) {
        throw new Error();
      }
      setLocation(locationData);
      setCity(cityAndCountry.city);
      setCountry(countryNameByISOCodes(cityAndCountry.country));
    } catch (error) {
      console.error("🚨error --->", error);
      setIsLocationError(true);
    } finally {
      setIsLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocationData();
  }, []);
  return { location, isLocationError, isLocationLoading };
};

export { useLocation };
