export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IWeather {
  temp: string;
  pressure: string;
  pressureChangingIn3Hours: number;
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
