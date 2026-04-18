import { Router } from "express";
import { User } from "./user.model.js";
import { logger } from "../../config/logger.js";

export const userRouter = Router();

// Update user settings (deviceId, isMonitoringActive)
userRouter.patch("/settings", async (req, res) => {
  try {
    const userId = req.body.userId; // In a real app, this comes from JWT but keeping it simple for now
    const { deviceId, isMonitoringActive } = req.body;

    const updateData: any = {};
    if (deviceId !== undefined) updateData.deviceId = deviceId;
    if (isMonitoringActive !== undefined) updateData.isMonitoringActive = isMonitoringActive;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.json({ ok: true, data: updatedUser });
  } catch (err) {
    logger.error({ err }, "Update settings error");
    res.status(500).json({ ok: false, message: "Failed to update settings" });
  }
});
