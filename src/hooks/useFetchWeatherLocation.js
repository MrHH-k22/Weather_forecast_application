import { useQuery } from "@tanstack/react-query";
import { featchWeatherLocation } from "../services/weatherService";

export function useFetchWeatherLocation(params) {
  const { cityName, enabled } = params;
  const {
    data: weatherLocationData,
    isLoading: isWeatherLocationLoading,
    error: weatherLocationError,
  } = useQuery({
    queryKey: ["weatherLocation", cityName],
    queryFn: () => featchWeatherLocation(cityName),
    enabled: enabled,
  });
  return {
    weatherLocationData,
    isWeatherLocationLoading,
    weatherLocationError,
  };
}
