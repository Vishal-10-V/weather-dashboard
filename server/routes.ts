import type { Express } from "express";
import { type Server } from "http";
import { api } from "@shared/routes";
import { weatherQuerySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.weather.get.path, async (req, res) => {
    try {
      const query = weatherQuerySchema.parse(req.query);

      if (query.simulateFail) {
        return res.status(500).json({ message: "Internal Server Errorrr" });
      }

      // Determine coordinates and location name
      let lat = query.lat ?? 40.7128; // Default to NYC
      let lon = query.lon ?? -74.006;
      let locationName = query.location || "New York";

      // If location string is provided but coords are not, search for it
      if (query.location && (query.lat === undefined || query.lon === undefined)) {
        const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.location)}&count=1&language=en&format=json`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        
        if (searchData.results && searchData.results.length > 0) {
          const place = searchData.results[0];
          lat = place.latitude;
          lon = place.longitude;
        }
      }

      // Fetch comprehensive weather data from Open-Meteo
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_80m,dew_point_2m,visibility,uv_index,uv_index_clear_sky,apparent_temperature,weather_code&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&pressure_unit=hpa&timezone=auto`;
      
      const weatherRes = await fetch(weatherUrl);
      
      if (!weatherRes.ok) {
        return res.status(500).json({ message: "Failed to fetch weather data from external API" });
      }

      const weatherData = await weatherRes.json();
      
      // Parse the open-meteo response into our schema
      const current = weatherData.current;
      
      // Map WMO weather codes to conditions
      const weatherConditions: Record<number, string> = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Freezing fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail",
      };

      const condition = weatherConditions[current.weather_code] || "Unknown";

      const responseData = {
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        isDay: current.is_day === 1,
        condition,
        location: locationName,
        feelsLike: current.apparent_temperature,
        precipitation: current.precipitation || 0,
        cloudCover: current.cloud_cover || 0,
        visibility: (current.visibility || 10000) / 1000, // Convert to km
        pressure: current.pressure_msl || current.surface_pressure || 1013,
        uvIndex: current.uv_index || 0,
        dewPoint: current.dew_point_2m || 0,
        lat,
        lon,
      };

      res.status(200).json(responseData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.weather.search.path, async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== "string" || q.trim().length === 0) {
        return res.status(400).json({ message: "Search query required" });
      }

      const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&language=en&format=json`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      const results = (searchData.results || []).map((place: any) => ({
        name: place.name,
        lat: place.latitude,
        lon: place.longitude,
        country: place.country,
        admin1: place.admin1,
      }));

      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
