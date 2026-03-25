import { Schema, model } from "mongoose";

export const deviceSchema = new Schema(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    tokenHash: { type: String, required: true },
    lastSeen: { type: Date },
    status: { type: String, enum: ["online", "offline"], default: "offline", required: true },
    firmwareVersion: { type: String },
    meta: {
      type: {
        locationLabel: { type: String },
        notes: { type: String },
      },
      default: {},
    },
  },
  { timestamps: true }
);

export const DeviceModel = model("Device", deviceSchema);
