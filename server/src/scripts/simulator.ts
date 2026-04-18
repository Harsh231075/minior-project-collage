import { User } from "../modules/users/user.model.js";
import { SensorReadingModel } from "../modules/readings/reading.model.js";
import { logger } from "../config/logger.js";

/**
 * Simulates realistic sensor data for all registered devices
 */
export async function startDataSimulator() {
  logger.info("Starting Data Simulator (1 minute interval)...");

  // Run every 60 seconds
  setInterval(async () => {
    try {
      const users = await User.find({ deviceId: { $ne: null } });
      
      if (users.length === 0) return;

      for (const user of users) {
        if (!user.deviceId) continue;

        // Fetch the very last reading to make transitions realistic
        const lastReading = await SensorReadingModel.findOne({ deviceId: user.deviceId }).sort({ timestamp: -1 });

        // Generate realistic variations
        const tempBase = lastReading?.temperature || 28;
        const moistureBase = lastReading?.soilMoisture || 40;
        const humidityBase = lastReading?.humidity || 60;

        // Logic: 
        // 1. Temp varies by +/- 0.5 degrees
        // 2. Moisture drops slowly (-0.1%) unless it "rained"
        // 3. 5% chance of rain
        const isRaining = Math.random() > 0.95 ? 1 : 0;
        
        const newReading = {
          deviceId: user.deviceId,
          timestamp: new Date(),
          temperature: Math.max(10, Math.min(50, tempBase + (Math.random() - 0.5))),
          humidity: Math.max(20, Math.min(100, humidityBase + (Math.random() - 0.5) * 2)),
          soilMoisture: isRaining 
            ? Math.min(100, moistureBase + 10) // Rain increases moisture
            : Math.max(0, moistureBase - 0.05), // Natural drying
          phValue: 6.5 + (Math.random() - 0.5),
          rain: isRaining
        };

        await SensorReadingModel.create(newReading);
        logger.debug({ deviceId: user.deviceId }, "Simulated reading created");

        // CLEANUP: Keep only the latest 100 readings per device
        const count = await SensorReadingModel.countDocuments({ deviceId: user.deviceId });
        if (count > 100) {
          const toDelete = count - 100;
          const oldestRecords = await SensorReadingModel.find({ deviceId: user.deviceId })
            .sort({ timestamp: 1 }) // Safest to delete by actual timestamp
            .limit(toDelete);
          
          if (oldestRecords.length > 0) {
            const idsToDelete = oldestRecords.map(doc => doc._id);
            await SensorReadingModel.deleteMany({ _id: { $in: idsToDelete } });
            logger.debug({ deviceId: user.deviceId, deletedCount: idsToDelete.length }, "Old readings purged");
          }
        }
      }
    } catch (err) {
      logger.error({ err }, "Data Simulator Error");
    }
  }, 60000); 
}
