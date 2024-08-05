import { INormals, IWeightOfVariables } from "@/types";

export const defaultVariables: IWeightOfVariables = {
  temp: 10,
  pressure: 10,
  pressureChangingIn3Hours: 10,
  wind: 10,
  pm2_5: 10,
  kp_index: 10,
  solar_activity: 10,
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
