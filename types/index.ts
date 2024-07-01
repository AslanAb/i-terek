export interface IWeather {
  temp: string;
  pressure: string;
  pressureChangingIn3Hours: number;
  wind: number;
  dt: number;
  pm2_5: number;
  kp_index: string;
  solar_activity: string;
}

export interface IWeightOfVariables {
  temp: number;
  pressure: number;
  pressureChangingIn3Hours: number;
  wind: number;
  pm2_5: number;
  kp_index: number;
  solar_activity: number;
}

export interface INormals {
  temp: {
    from: number;
    to: number;
  };
  pressure: {
    from: number;
    to: number;
  };
  pressureChangingIn3Hours: {
    from: number;
    to: number;
  };
  wind: {
    from: number;
    to: number;
  };
  pm2_5: {
    from: number;
    to: number;
  };
  kp_index: {
    from: number;
    to: number;
  };
  solar_activity: {
    from: number;
    to: number;
  };
}
