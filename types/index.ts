export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IWeather {
  temp: string;
  pressure: string;
  pressureChangingIn6Hours: string;
  wind: string;
  dt: number;
  pm2_5: number;
  kp_index: string;
  solar_activity: string;
}

export interface IOpenweathermapWeather {
  main: {
    temp: number;
  };
  wind: {
    speed: number;
  };
  dt: number;
}

export interface ITomorrowWeather {
  timelines: {
    hourly: {
      values: {
        pressureSurfaceLevel: number;
      };
    }[];
  };
}

export interface IAirPolution {
  list: {
    components: {
      pm2_5: number;
    };
  }[];
}

export interface ISolarActivity {
  current_class: string;
}

export interface IWeightOfVariables {
  temp: string;
  pressure: string;
  pressureChangingIn6Hours: string;
  wind: string;
  pm2_5: string;
  kp_index: string;
  solar_activity: string;
}

export interface INormals {
  temp: {
    from: string;
    to: string;
  };
  pressure: {
    from: string;
    to: string;
  };
  pressureChangingIn6Hours: {
    from: string;
    to: string;
  };
  wind: {
    from: string;
    to: string;
  };
  pm2_5: {
    from: string;
    to: string;
  };
  kp_index: {
    from: string;
    to: string;
  };
  solar_activity: {
    from: string;
    to: string;
  };
}

export interface IExtremes {
  temp: {
    from: string;
    to: string;
  };
  pressure: {
    from: string;
    to: string;
  };
  pressureChangingIn6Hours: {
    from: string;
    to: string;
  };
  wind: {
    to: string;
  };
  pm2_5: {
    to: string;
  };
  kp_index: {
    to: string;
  };
  solar_activity: {
    to: string;
  };
}