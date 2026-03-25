import { Schema, model } from "mongoose";

export const alertSchema = new Schema(
  {
    deviceId: { type: String, required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: [
        "LOW_MOISTURE",
        "HIGH_TEMPERATURE",
        "ABNORMAL_PH",
        "RAIN_DETECTED",
        "DEVICE_OFFLINE",
        "SENSOR_FAULT",
      ],
      index: true,
    },
    severity: { type: String, required: true, enum: ["info", "warn", "critical"], index: true },
    status: { type: String, required: true, enum: ["active", "ack", "resolved", "archived"], default: "active", index: true },

    title: { type: String, required: true },
    message: { type: String, required: true },
    suggestedAction: { type: String },

    // Simple audit fields
    acknowledgedAt: { type: Date },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

alertSchema.index({ deviceId: 1, status: 1, severity: 1, createdAt: -1 });

export const AlertModel = model("Alert", alertSchema);
