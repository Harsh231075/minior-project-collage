import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../modules/users/user.model.js";
import { SensorReadingModel } from "../modules/readings/reading.model.js";
import { connectDb } from "../config/db.js";
import { logger } from "../config/logger.js";

async function seed() {
  try {
    await connectDb();
    logger.info("Connected to database for seeding...");

    // 1. Clean database
    await User.deleteMany({});
    await SensorReadingModel.deleteMany({});
    logger.info("Database cleaned.");

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 2. Create User 1
    const user1 = await User.create({
      name: "Ramesh Kumar",
      email: "ramesh@agrosense.ai",
      password: hashedPassword,
      deviceId: "AS-2024-0001",
    });
    logger.info("Created User 1: Ramesh Kumar");

    // 3. Create User 2
    const user2 = await User.create({
      name: "Suresh Singh",
      email: "suresh@agrosense.ai",
      password: hashedPassword,
      deviceId: "AS-2024-0002",
    });
    logger.info("Created User 2: Suresh Singh");

    // 4. Feed readings for User 1
    const readings1 = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
        readings1.push({
            deviceId: user1.deviceId,
            timestamp: new Date(now.getTime() - i * 3600000), // Every hour back
            temperature: 25 + Math.random() * 10,
            humidity: 60 + Math.random() * 20,
            soilMoisture: 30 + Math.random() * 40,
            phValue: 6.5 + Math.random(),
            rain: Math.random() > 0.8 ? 1 : 0,
        });
    }
    await SensorReadingModel.insertMany(readings1);
    logger.info(`Inserted ${readings1.length} readings for User 1`);

    // 5. Feed readings for User 2
    const readings2 = [];
    for (let i = 0; i < 30; i++) {
        readings2.push({
            deviceId: user2.deviceId,
            timestamp: new Date(now.getTime() - i * 3600000), // Every hour back
            temperature: 20 + Math.random() * 10,
            humidity: 50 + Math.random() * 20,
            soilMoisture: 20 + Math.random() * 40,
            phValue: 5.5 + Math.random(),
            rain: Math.random() > 0.9 ? 1 : 0,
        });
    }
    await SensorReadingModel.insertMany(readings2);
    logger.info(`Inserted ${readings2.length} readings for User 2`);

    logger.info("Seeding completed successfully.");
    process.exit(0);
  } catch (err) {
    logger.error({ err }, "Seeding failed");
    process.exit(1);
  }
}

seed();
