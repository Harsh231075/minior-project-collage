import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    deviceId: { type: String, required: true }, // The AS-XXXX-XXXX ID
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
