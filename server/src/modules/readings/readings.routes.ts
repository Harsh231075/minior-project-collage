import { Router } from "express";
import { SensorReadingModel } from "./reading.model.js";
import { logger } from "../../config/logger.js";

export const readingsRouter = Router();

// Get latest reading for a device
readingsRouter.get("/latest/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const reading = await SensorReadingModel.findOne({ deviceId })
      .sort({ timestamp: -1 });

    if (!reading) {
      return res.status(404).json({ ok: false, message: "No readings found for this device" });
    }

    res.json({ ok: true, data: reading });
  } catch (err) {
    logger.error({ err }, "Fetch latest reading error");
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

// Get history (last 50 readings)
readingsRouter.get("/history/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const readings = await SensorReadingModel.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({ ok: true, data: readings });
  } catch (err) {
    logger.error({ err }, "Fetch history error");
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});
