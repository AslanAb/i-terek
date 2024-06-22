import axios from "axios";

const getCity = async (latitude: number, longitude: number) => {
  const params = {
    lat: latitude,
    lon: longitude,
    appid: process.env.EXPO_PUBLIC_APPID,
    limit: 5,
  };

  try {
    const response = await axios.get(process.env.EXPO_PUBLIC_URL + "/geo/1.0/reverse", { params });
    if (response.status !== 200) {
      throw new Error("Can't get city");
    }
    const location = { city: response.data[0].local_names.ru, country: response.data[0].country };
    return location;
  } catch (error) {
    console.log(error);
  }
};

export { getCity };
