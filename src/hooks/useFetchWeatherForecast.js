import { useQuery } from "@tanstack/react-query";
import { featchWeatherForecast } from "../services/weatherService";

export function useFetchWeatherForecast(params) {
  const { cityName, days } = params;
  const {
    data: weatherForecastData,
    isLoading: isWeatherForecastLoading,
    error: weatherForecastError,
  } = useQuery({
    queryKey: ["weatherForecast", cityName, days],
    queryFn: () => featchWeatherForecast(cityName, days),
  });
  return {
    weatherForecastData,
    isWeatherForecastLoading,
    weatherForecastError,
  };
}
