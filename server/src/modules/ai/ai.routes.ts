import { Router } from "express";
import Groq from "groq-sdk";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import { SensorReadingModel } from "../readings/reading.model.js";

export const aiRouter = Router();

const groq = new Groq({
  apiKey: env.GROQ_API_KEY || "YOUR_GROQ_API_KEY",
});

aiRouter.post("/chat", async (req, res) => {
  try {
    const { messages, deviceId } = req.body;
    logger.info({ messagesCount: messages?.length, deviceId }, "AI Chat request received");

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ ok: false, message: "Messages are required" });
    }

    // Fetch last 20 readings
    let readingsContext = "";
    if (deviceId) {
      const readings = await SensorReadingModel.find({ deviceId })
        .sort({ timestamp: -1 })
        .limit(20);

      readingsContext = readings.length > 0 
        ? "\n\nRecent data from your sensors:\n" + readings.map(r => 
            `- Time: ${r.timestamp.toISOString()}, Temp: ${r.temperature}°C, Humidity: ${r.humidity}%, Soil Moisture: ${r.soilMoisture}%, pH: ${r.phValue}, Rain: ${r.rain === 1 ? 'Yes' : 'No'}`
          ).join("\n")
        : "\n\nNo sensor data available yet for this device.";
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are 'AgroSense AI', a friendly and helpful assistant for farmers. 
          Your goal is to give very simple and clear advice based on sensor data.
          
          Guidelines for your responses:
          1. Use very simple language. Avoid big technical words.
          2. Be direct: Tell them clearly if they should water their crops or not.
          3. Use a respectful and helpful tone, like a knowledgeable friend.
          4. If you see high temperature and low moisture, suggest watering.
          5. If it's raining or moisture is good, tell them they can rest and save water.
          6. Always give one clear 'Next Step' for the farmer.
          
          ${readingsContext}
          
          Give your advice in a way that is easy to understand for someone who works in the fields all day.`,
        },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

    res.json({
      ok: true,
      data: {
        content: reply,
      },
    });
  } catch (err: any) {
    logger.error({ err }, "Groq AI error");
    res.status(500).json({ 
      ok: false, 
      message: "AI assistant is currently unavailable", 
      error: err.message,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});
