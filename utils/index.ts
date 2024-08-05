import { months } from "@/constants/months";
import { defaultNormals, defaultVariables } from "@/constants/settings";
import { getAirPolution, getKPIndex, getSolarActivity, tomorrow } from "@/services/wheather";
import { INormals, IWeather, IWeightOfVariables } from "@/types";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";

const changeTheme = (theme: any, setTheme: any) => {
  if (theme === "green") {
    setTheme("yellow");
  } else if (theme === "yellow") {
    setTheme("red");
  } else if (theme === "red") {
    setTheme("green");
  } else {
    setTheme("green");
  }
  console.log("changeTheme");
};

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

export { changeTheme, getDate, solarFlareToIntensity };
