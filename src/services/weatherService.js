import axios from "axios";

const API_KEY = "3f66cc9bf4fc4f6d80621226250105";

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
    console.log("weather data: ", response.data);
    return response.data;
  } catch (err) {
    console.log("error: ", err);
    return null;
  }
};

export const featchWeatherForecast = async (cityName, days) => {
  let forecastUrl = forecastEndpoint({ cityName, days });
  return apiCall(forecastUrl);
};

export const featchWeatherLocation = async (cityName) => {
  let locationUrl = locationEndpoint({ cityName });
  // console.log("locationUrl", locationUrl);
  return apiCall(locationUrl);
};
