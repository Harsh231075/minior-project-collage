import crypto from "crypto";
import { env } from "../../config/env.js";
import { DeviceModel } from "../devices/device.model.js";
import { SensorReadingModel } from "./reading.model.js";
import { toDate } from "../shared/time.js";

export class DeviceAuthError extends Error { }

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function verifyDeviceOrThrow(deviceId: string, token: string | undefined) {
  if (!token) throw new DeviceAuthError("Missing device token");

  const tokenHash = hashToken(token);
  const device = await DeviceModel.findOne({ deviceId }).lean();

  if (!device) throw new DeviceAuthError("Unknown deviceId");
  if (device.tokenHash !== tokenHash) throw new DeviceAuthError("Invalid device token");

  return { deviceId };
}

export async function ingestReading(params: {
  deviceId: string;
  token: string | undefined;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  phValue: number;
  rain: 0 | 1;
  timestamp?: string;
}) {
  await verifyDeviceOrThrow(params.deviceId, params.token);

  const timestamp = params.timestamp ? toDate(params.timestamp) : new Date();

  // Store reading
  await SensorReadingModel.create({
    deviceId: params.deviceId,
    timestamp,
    temperature: params.temperature,
    humidity: params.humidity,
    soilMoisture: params.soilMoisture,
    phValue: params.phValue,
    rain: params.rain,
  });

  // Update device lastSeen and status
  await DeviceModel.updateOne(
    { deviceId: params.deviceId },
    { $set: { lastSeen: new Date(), status: "online" } }
  );

  return { deviceId: params.deviceId, storedAt: timestamp.toISOString() };
}

export async function registerDevice(params: { deviceId: string; name?: string }) {
  const rawToken = crypto.randomBytes(24).toString("hex");
  const tokenHash = hashToken(rawToken);

  await DeviceModel.create({
    deviceId: params.deviceId,
    name: params.name,
    tokenHash,
    status: "offline",
  });

  return { deviceId: params.deviceId, deviceToken: rawToken, tokenHeader: env.DEVICE_TOKEN_HEADER };
}
