import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1),
  DEVICE_TOKEN_HEADER: z.string().default("x-device-token"),
  DEVICE_OFFLINE_MINUTES: z.coerce.number().int().positive().default(10),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
