import crypto from "crypto";

import { connectDb } from "../config/db.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

import { DeviceModel } from "../modules/devices/device.model.js";
import { SensorReadingModel } from "../modules/readings/reading.model.js";
import { AlertModel } from "../modules/alerts/alert.model.js";
import { RecommendationModel } from "../modules/recommendations/recommendation.model.js";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type SeedDevice = {
  deviceId: string;
  name: string;
  seed: number;
};

const DEVICES: SeedDevice[] = [
  { deviceId: "farm_1", name: "Farm 1 - North Field", seed: 101 },
  { deviceId: "farm_2", name: "Farm 2 - South Field", seed: 202 },
];

async function ensureDevice(params: { deviceId: string; name: string; reset: boolean }) {
  const existing = await DeviceModel.findOne({ deviceId: params.deviceId }).lean();

  if (existing && !params.reset) {
    // Keep existing tokenHash (we cannot recover raw token).
    await DeviceModel.updateOne(
      { deviceId: params.deviceId },
      { $set: { name: params.name } }
    );
    return { deviceId: params.deviceId, deviceToken: null as string | null, reused: true };
  }

  const rawToken = crypto.randomBytes(24).toString("hex");
  const tokenHash = hashToken(rawToken);

  await DeviceModel.updateOne(
    { deviceId: params.deviceId },
    {
      $set: {
        deviceId: params.deviceId,
        name: params.name,
        tokenHash,
        status: "online",
        lastSeen: new Date(),
      },
    },
    { upsert: true }
  );

  return { deviceId: params.deviceId, deviceToken: rawToken, reused: false };
}

async function seedReadings(params: { deviceId: string; seed: number; now: Date; reset: boolean }) {
  const rng = mulberry32(params.seed);

  const stepMinutes = 15;
  const points = Math.floor((24 * 60) / stepMinutes) + 1; // 24h + start point
  const startMs = params.now.getTime() - 24 * 60 * 60 * 1000;

  if (params.reset) {
    await SensorReadingModel.deleteMany({
      deviceId: params.deviceId,
      timestamp: { $gte: new Date(startMs - 60_000), $lte: params.now },
    });
  }

  const docs = [] as Array<{
    deviceId: string;
    timestamp: Date;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    phValue: number;
    rain: 0 | 1;
  }>;

  for (let i = 0; i < points; i++) {
    const t = i / points;
    const timestamp = new Date(startMs + i * stepMinutes * 60 * 1000);

    // Daily oscillation
    const tempBase = 28 + 6 * Math.sin(2 * Math.PI * t);
    const humidityBase = 65 + 12 * Math.cos(2 * Math.PI * t);

    // Make farm_1 slightly drier
    const moistureBase = params.deviceId === "farm_1" ? 520 : 640;

    // Add noise
    const temperature = clamp(tempBase + (rng() - 0.5) * 2.2, 15, 45);
    const humidity = clamp(humidityBase + (rng() - 0.5) * 6, 20, 98);

    // Simulate moisture dropping then rising a bit (like irrigation)
    const moistureTrend = moistureBase - i * (params.deviceId === "farm_1" ? 1.2 : 0.8) + (i % 24 === 0 ? 80 : 0);
    const soilMoisture = Math.round(clamp(moistureTrend + (rng() - 0.5) * 20, 250, 900));

    const phValue = clamp(6.6 + (rng() - 0.5) * 0.4, 5.5, 7.8);

    // Occasional rain for farm_2
    const rainChance = params.deviceId === "farm_2" ? 0.05 : 0.02;
    const rain = (rng() < rainChance ? 1 : 0) as 0 | 1;

    docs.push({
      deviceId: params.deviceId,
      timestamp,
      temperature,
      humidity,
      soilMoisture,
      phValue,
      rain,
    });
  }

  // Insert ignoring duplicates (unique index: deviceId + timestamp)
  try {
    await SensorReadingModel.insertMany(docs, { ordered: false });
  } catch (e) {
    // ignore duplicate key errors in non-reset mode
  }

  return { insertedAttempted: docs.length };
}

async function seedAlertsAndRecommendations(now: Date, reset: boolean) {
  if (reset) {
    await AlertModel.deleteMany({});
    await RecommendationModel.deleteMany({});
  }

  // Minimal demo alerts
  await AlertModel.create([
    {
      deviceId: "farm_1",
      type: "LOW_MOISTURE",
      severity: "critical",
      status: "active",
      title: "Low soil moisture detected",
      message: "Zone is trending dry. Moisture is below safe threshold.",
      suggestedAction: "Irrigate for 10–15 minutes, then re-check after 20 minutes.",
      createdAt: new Date(now.getTime() - 20 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 20 * 60 * 1000),
    },
    {
      deviceId: "farm_2",
      type: "RAIN_DETECTED",
      severity: "info",
      status: "active",
      title: "Rain detected",
      message: "Rain sensor detected water. Irrigation should be paused.",
      suggestedAction: "Pause irrigation and monitor moisture for the next 2 hours.",
      createdAt: new Date(now.getTime() - 55 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 55 * 60 * 1000),
    },
  ]);

  await RecommendationModel.create([
    {
      deviceId: "farm_1",
      status: "active",
      title: "Irrigation recommended",
      action: "Start irrigation for 15 minutes",
      confidence: 92,
      reasons: [
        "Soil moisture trend is decreasing over last 2 hours",
        "No rain detected",
        "Temperature is high, evaporation risk increased",
      ],
      basedOnTimestamp: now,
    },
    {
      deviceId: "farm_2",
      status: "active",
      title: "Hold irrigation",
      action: "Pause irrigation for 2 hours",
      confidence: 84,
      reasons: ["Rain detected recently", "Moisture level is stable", "Avoid overwatering"],
      basedOnTimestamp: now,
    },
  ]);
}

async function main() {
  const reset = process.argv.includes("--reset");

  if (reset && env.NODE_ENV === "production") {
    throw new Error("Refusing to seed with --reset in production");
  }

  await connectDb();

  const now = new Date();

  logger.info({ reset }, "Seeding database with dummy AgroSense data");

  const tokenOutput: Array<{ deviceId: string; tokenHeader: string; deviceToken: string | null; note?: string }> = [];

  for (const d of DEVICES) {
    const ensured = await ensureDevice({ deviceId: d.deviceId, name: d.name, reset });
    tokenOutput.push({
      deviceId: d.deviceId,
      tokenHeader: env.DEVICE_TOKEN_HEADER,
      deviceToken: ensured.deviceToken,
      note: ensured.reused ? "Device existed; token not regenerated (use existing token). Run with --reset to regenerate." : undefined,
    });

    await seedReadings({ deviceId: d.deviceId, seed: d.seed, now, reset });
  }

  await seedAlertsAndRecommendations(now, reset);

  const deviceCount = await DeviceModel.countDocuments();
  const readingCount = await SensorReadingModel.countDocuments();
  const alertCount = await AlertModel.countDocuments();
  const recommendationCount = await RecommendationModel.countDocuments();

  logger.info(
    { deviceCount, readingCount, alertCount, recommendationCount },
    "Seed complete"
  );

  // Print tokens for convenience (only shown when newly created)
  // eslint-disable-next-line no-console
  console.log("\n=== Seeded devices (tokens) ===");
  // eslint-disable-next-line no-console
  console.table(tokenOutput);

  process.exit(0);
}

main().catch((err) => {
  logger.error({ err }, "Seed failed");
  process.exit(1);
});
