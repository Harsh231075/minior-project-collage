import crypto from "crypto";
import { env } from "../../config/env.js";
import { DeviceModel } from "../devices/device.model.js";
import { SensorReadingModel } from "./reading.model.js";
import { User } from "../users/user.model.js";
import { toDate } from "../shared/time.js";

export class DeviceAuthError extends Error { }

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function verifyDeviceOrThrow(deviceId: string, token: string | undefined) {
  // Token logic removed as per user request to simplify development
  let device = await DeviceModel.findOne({ deviceId }).lean();

  // Auto-register if device doesn't exist
  if (!device) {
    console.log(`Auto-registering new device: ${deviceId}`);
    await DeviceModel.create({
      deviceId,
      name: `Auto Registered Device (${deviceId})`,
      tokenHash: "DISABLED", // No longer checked
      status: "online",
      lastSeen: new Date(),
    });
  }

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

  // Find user to check if monitoring is active
  const user = await User.findOne({ deviceId: params.deviceId });

  // If monitoring is disabled (Sleep Mode), skip storing the history
  if (user && !user.isMonitoringActive) {
    await DeviceModel.updateOne(
      { deviceId: params.deviceId },
      { $set: { lastSeen: new Date(), status: "online" } }
    );
    
    return { 
      deviceId: params.deviceId, 
      storedAt: null, 
      isMonitoringActive: false 
    };
  }

  // Store reading only if active
  const reading = await SensorReadingModel.create({
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

  return {
    deviceId: params.deviceId,
    storedAt: reading.timestamp.toISOString(),
    isMonitoringActive: true
  };
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
