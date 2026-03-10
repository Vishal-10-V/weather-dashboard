import { z } from "zod";
import { weatherResponseSchema } from "./schema";

export const errorSchemas = {
  internal: z.object({
    message: z.string(),
  }),
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  weather: {
    get: {
      method: "GET" as const,
      path: "/api/weather" as const,
      responses: {
        200: weatherResponseSchema,
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    search: {
      method: "GET" as const,
      path: "/api/weather/search" as const,
      responses: {
        200: z.array(z.object({
          name: z.string(),
          lat: z.number(),
          lon: z.number(),
          country: z.string().optional(),
          admin1: z.string().optional(),
        })),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type GetWeatherResponse = z.infer<typeof api.weather.get.responses[200]>;
export type LocationSearchResponse = z.infer<typeof api.weather.search.responses[200]>;
