import { Schema, model } from "mongoose";

export const recommendationSchema = new Schema(
  {
    deviceId: { type: String, required: true, index: true },
    status: {
      type: String,
      required: true,
      enum: ["active", "dismissed", "applied"],
      default: "active",
      index: true,
    },

    title: { type: String, required: true },
    action: { type: String, required: true },

    confidence: { type: Number, min: 0, max: 100, required: true },
    reasons: { type: [String], default: [] },

    // Optional: link to a reading timestamp for traceability
    basedOnTimestamp: { type: Date },
  },
  { timestamps: true }
);

recommendationSchema.index({ deviceId: 1, status: 1, createdAt: -1 });

export const RecommendationModel = model("Recommendation", recommendationSchema);
