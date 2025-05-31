import axios from "axios";

const API_KEY = "082197e1ec564a5aa2415141253105";

const forecastEndpoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}&aqi=yes&alerts=no`;

const locationEndpoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };
  try {
    const response = await axios.request(options);

    return response.data;
  } catch (err) {
    console.log("error: ", err);
    return null;
  }
};

export const featchWeatherForecast = async (cityName, days) => {
  let forecastUrl = forecastEndpoint({ cityName, days });
  // console.log("forecastUrl", forecastUrl);
  return apiCall(forecastUrl);
};

export const featchWeatherLocation = async (cityName) => {
  let locationUrl = locationEndpoint({ cityName });
  // console.log("locationUrl", locationUrl);
  return apiCall(locationUrl);
};
