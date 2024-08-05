import { getCity, getCurrentLocation } from "@/services/location";

const useLocation = async () => {
  try {
    const location = await getCurrentLocation();
    if (location instanceof Error) {
      throw new Error("Can't get location");
    }
    const cityAndCounrty = await getCity(location.latitude, location.longitude);
    if (cityAndCounrty instanceof Error) {
      throw new Error("Can't get location");
    }
    return { location, cityAndCounrty };
  } catch (error) {
    console.error("🚨error --->", error);
    return new Error("Can't get location");
  }
};

export { useLocation };
