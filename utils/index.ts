import { months } from "@/constants/months";
import { getAirPolution, getCurrentWeather, getKPIndex, getSolarActivity, tomorrow } from "@/services/wheather";
import { INormals, IWeather, IWeightOfVariables } from "@/types";
import { useMMKVObject } from "react-native-mmkv";

const getDate = () => {
  const date = new Date();
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} года`;
};

const solarFlareToIntensity = (flareClass: any) => {
  const basePowers = {
    A: 1e-8,
    B: 1e-7,
    C: 1e-6,
    M: 1e-5,
    X: 1e-4,
  };

  // Извлечение буквенной и числовой части классификации
  const letterPart: "A | B | C | M | X" = flareClass.charAt(0);
  const numberPart = parseFloat(flareClass.slice(1));

  // Получение базовой мощности для данного класса вспышек
  const basePower = basePowers[letterPart as keyof typeof basePowers];

  // Расчет и возвращение итоговой мощности вспышки в Вт/м²
  return basePower * numberPart;
};

const getWeatherAllIn = async (latitude: number, longitude: number) => {
  try {
    const currentWeatherAll = await getCurrentWeather(latitude, longitude);

    const weatherTomorror = await tomorrow(`${latitude}, ${longitude}`, "1h");

    const pressure = (
      weatherTomorror.timelines.hourly[weatherTomorror.timelines.hourly.length - 1].values.pressureSurfaceLevel / 1.333
    ).toFixed(0);

    const pressure3HoursBefore = (
      weatherTomorror.timelines.hourly[weatherTomorror.timelines.hourly.length - 4].values.pressureSurfaceLevel / 1.333
    ).toFixed(0);

    const airPolution = await getAirPolution(latitude, longitude);

    const kp_index = await getKPIndex();

    const solarActivity = await getSolarActivity();
    const solarActivityInWtM2 = solarFlareToIntensity(solarActivity[0].current_class);

    const currentWeather: IWeather = {
      temp: currentWeatherAll.main.temp.toFixed(0),
      pressure: pressure,
      pressureChangingIn3Hours: +pressure - +pressure3HoursBefore,
      wind: currentWeatherAll.wind.speed.toFixed(0),
      dt: currentWeatherAll.dt,
      pm2_5: airPolution.list[0].components.pm2_5,
      kp_index: kp_index[kp_index.length - 1][1],
      solar_activity: solarActivity[0].current_class,
    };
    return currentWeather;
  } catch (error) {
    console.error("  --->", error);
  }
};

export const defaultVariables: IWeightOfVariables = {
  temp: 10,
  pressure: 10,
  pressureChangingIn3Hours: 10,
  wind: 10,
  pm2_5: 10,
  kp_index: 10,
  solar_activity: 10,
};

const checkAndSetVariables = () => {
  const [weightOfVariables, setWeightOfVariables] = useMMKVObject<IWeightOfVariables>("weightOfVariables");

  if (!weightOfVariables) {
    setWeightOfVariables(defaultVariables);
  }
};

export const defaultNormals: INormals = {
  temp: {
    from: -10,
    to: 25,
  },
  pressure: {
    from: 720,
    to: 730,
  },
  pressureChangingIn3Hours: {
    from: -5,
    to: 5,
  },
  wind: {
    from: 0,
    to: 10,
  },
  pm2_5: {
    from: 0,
    to: 10,
  },
  kp_index: {
    from: 0,
    to: 3,
  },
  solar_activity: {
    from: 1e-7,
    to: 1e-6,
  },
};

const checkAndSetNormals = () => {
  const [normals, setNormals] = useMMKVObject<INormals>("normals");

  if (!normals) {
    setNormals(defaultNormals);
  }
};

export { getDate, getWeatherAllIn, checkAndSetVariables, checkAndSetNormals };
