import { months } from "@/constants/months";

const getDate = () => {
  const date = new Date();
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} года`;
};

export { getDate };
