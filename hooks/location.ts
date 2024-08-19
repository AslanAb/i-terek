import { countryNameByISOCodes } from "@/constants/country_name_by_iso_codes";
import { getCity, getCurrentLocation } from "@/services/location";
import { useEffect, useState } from "react";

const useLocation = () => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [isLocationError, setIsLocationError] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationData = await getCurrentLocation();
        if (locationData instanceof Error) {
          throw new Error();
        }
        const cityAndCountry = await getCity(locationData.latitude, locationData.longitude);
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
    };
    fetchLocationData();
  }, []);

  return { location, city, country, isLocationError, isLocationLoading };
};

export { useLocation };
