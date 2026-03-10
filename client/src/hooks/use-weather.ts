import { useQuery } from "@tanstack/react-query";
import { api, type GetWeatherResponse, type LocationSearchResponse } from "@shared/routes";

interface UseWeatherParams {
  simulateFail: boolean;
  lat?: number;
  lon?: number;
  location?: string;
}

export function useWeather({ simulateFail, lat, lon, location }: UseWeatherParams) {
  return useQuery({
    queryKey: [api.weather.get.path, simulateFail, lat, lon, location],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (simulateFail) params.append("simulateFail", "true");
      if (lat !== undefined) params.append("lat", String(lat));
      if (lon !== undefined) params.append("lon", String(lon));
      if (location) params.append("location", location);

      const url = `${api.weather.get.path}${params.toString() ? "?" + params.toString() : ""}`;
      const res = await fetch(url, { credentials: "include" });
      
      if (!res.ok) {
        if (res.status === 400 || res.status === 500) {
          const errorData = await res.json().catch(() => ({ message: "An unexpected error occurred" }));
          throw new Error(errorData.message || "Failed to fetch atmospheric data");
        }
        throw new Error("Unable to establish connection with meteorological sensors");
      }
      
      const data = await res.json();
      return api.weather.get.responses[200].parse(data) as GetWeatherResponse;
    },
    retry: false,
  });
}

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: [api.weather.search.path, query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const res = await fetch(`${api.weather.search.path}?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to search locations");
      const data = await res.json();
      return api.weather.search.responses[200].parse(data) as LocationSearchResponse;
    },
    enabled: query.trim().length > 0,
    retry: false,
  });
}
