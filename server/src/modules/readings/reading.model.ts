import { Schema, model } from "mongoose";

export const sensorReadingSchema = new Schema(
  {
    deviceId: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true, index: true },

    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    soilMoisture: { type: Number, required: true },
    phValue: { type: Number, required: true },
    rain: { type: Number, required: true, enum: [0, 1] },

    validationWarnings: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Prevent duplicates (deviceId + timestamp)
sensorReadingSchema.index({ deviceId: 1, timestamp: 1 }, { unique: true });

export const SensorReadingModel = model("SensorReading", sensorReadingSchema);
