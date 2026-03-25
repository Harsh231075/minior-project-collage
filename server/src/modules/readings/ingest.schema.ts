import { z } from "zod";

export const ingestReadingSchema = z.object({
  deviceId: z.string().min(1),
  temperature: z.number(),
  humidity: z.number(),
  soilMoisture: z.number().int(),
  phValue: z.number(),
  rain: z.number().int().refine((v: number) => v === 0 || v === 1, "rain must be 0 or 1"),
  timestamp: z.string().datetime().optional(),
});

export type IngestReadingInput = z.infer<typeof ingestReadingSchema>;
