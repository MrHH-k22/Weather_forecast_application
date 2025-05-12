import { useQuery } from "@tanstack/react-query";
import { featchWeatherForecast } from "../services/weatherService";

export function useFetchWeatherForecast(params) {
  const { cityName, days } = params;
  console.log("cityName", cityName);
  const {
    data: weatherForecastData,
    isLoading: isWeatherForecastLoading,
    error: weatherForecastError,
  } = useQuery({
    queryKey: ["weatherForecast", cityName, days],
    queryFn: () => featchWeatherForecast(cityName, days),
  });
  // console.log("weatherForecastData", weatherForecastData);
  return {
    weatherForecastData,
    isWeatherForecastLoading,
    weatherForecastError,
  };
}
