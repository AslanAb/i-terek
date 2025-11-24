import { getCityAndCountry, getCurrentLocation } from "@/services/location";
import { checkIfSixHoursPassed } from "@/utils";
import { useCallback, useEffect, useState, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { useMMKVNumber, useMMKVObject, useMMKVString } from "@/mmkv";

const useLocation = () => {
  const [city, setCity] = useMMKVString("city");
  const [country, setCountry] = useMMKVString("country");
  const [locationDate, setLocationDate] = useMMKVNumber("locationDate");
  const [location, setLocation] = useMMKVObject<{ latitude: number, longitude: number }>("location");
  const [isLocationError, setIsLocationError] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const ifSixHoursPassed = checkIfSixHoursPassed(locationDate);
    if (ifSixHoursPassed || !location) {
      fetchLocationData();
    } else {
      setIsLocationLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const ifSixHoursPassed = checkIfSixHoursPassed(locationDate);
      if (ifSixHoursPassed && !isFetchingRef.current) {
        fetchLocationData();
      }
    }, [locationDate])
  );
  
  const fetchLocationData = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

    try {
      const locationResult = await getCurrentLocation();
      if (!locationResult.success || !locationResult.data) {
        throw new Error(locationResult.error);
      }

      setLocation(locationResult.data);

      const cityAndCountryResult = await getCityAndCountry(locationResult.data.latitude, locationResult.data.longitude);
      if (!cityAndCountryResult.success || !cityAndCountryResult.data) {
        throw new Error(cityAndCountryResult.error);
      }
      console.log('cityAndCountry');

      setCity(cityAndCountryResult.data.city);
      setCountry(cityAndCountryResult.data.country);
      setLocationDate(new Date().getTime());
    } catch (error) {
      console.error('error get location', error);
      setIsLocationError(true);
    } finally {
      setIsLocationLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  return { isLocationError, isLocationLoading };
};

export default useLocation;
