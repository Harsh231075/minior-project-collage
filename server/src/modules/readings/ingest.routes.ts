import { Router, type Request, type Response } from "express";
import { ingestReadingSchema } from "./ingest.schema.js";
import { err, ok } from "../shared/http.js";
import { ingestReading, registerDevice, DeviceAuthError } from "./ingest.service.js";
import { env } from "../../config/env.js";

export const ingestRouter = Router();

// Device → Backend (sensor readings)
ingestRouter.post("/readings", async (req: Request, res: Response) => {
  const parsed = ingestReadingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(err("INVALID_PAYLOAD", parsed.error.issues[0]?.message ?? "Invalid payload"));
  }

  try {
    const token = req.header(env.DEVICE_TOKEN_HEADER);
    const result = await ingestReading({
      ...parsed.data,
      rain: parsed.data.rain as 0 | 1,
      token,
    });
    return res.json(ok(result));
  } catch (e) {
    if (e instanceof DeviceAuthError) {
      return res.status(401).json(err("DEVICE_AUTH", e.message));
    }

    // Duplicate timestamp for same device is common. Treat as ok for idempotency.
    if (e && typeof e === "object" && "code" in e && (e as any).code === 11000) {
      return res.json(ok({ stored: false, reason: "DUPLICATE" }));
    }

    throw e;
  }
});

// Admin → Backend (pair/register device)
// Note: User model/auth is intentionally skipped for now.
ingestRouter.post("/devices/register", async (req: Request, res: Response) => {
  const deviceId = String(req.body?.deviceId ?? "").trim();
  const name = req.body?.name ? String(req.body.name) : undefined;
  if (!deviceId) return res.status(400).json(err("INVALID_PAYLOAD", "deviceId is required"));

  try {
    const result = await registerDevice({ deviceId, name });
    return res.status(201).json(ok(result));
  } catch (e) {
    // duplicate key
    if (e && typeof e === "object" && "code" in e && (e as any).code === 11000) {
      return res.status(409).json(err("DEVICE_EXISTS", "deviceId already registered"));
    }
    throw e;
  }
});
