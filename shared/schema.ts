import { z } from "zod";

export const weatherQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  location: z.string().optional(),
  simulateFail: z.enum(["true", "false", ""]).optional().transform((val) => val === "true"),
});

export type WeatherQuery = z.infer<typeof weatherQuerySchema>;

export const weatherResponseSchema = z.object({
  temperature: z.number(),
  condition: z.string(),
  location: z.string(),
  humidity: z.number(),
  windSpeed: z.number(),
  isDay: z.boolean().default(true),
  feelsLike: z.number(),
  precipitation: z.number(),
  cloudCover: z.number(),
  visibility: z.number(),
  pressure: z.number(),
  uvIndex: z.number(),
  dewPoint: z.number(),
  lat: z.number(),
  lon: z.number(),
});

export type WeatherResponse = z.infer<typeof weatherResponseSchema>;
