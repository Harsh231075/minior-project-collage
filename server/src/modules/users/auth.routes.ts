import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./user.model.js";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

export const authRouter = Router();

// Register
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, deviceId } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ ok: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      deviceId,
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      ok: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, deviceId: user.deviceId },
        token,
      },
    });
  } catch (err) {
    logger.error({ err }, "Register error");
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      ok: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, deviceId: user.deviceId },
        token,
      },
    });
  } catch (err) {
    logger.error({ err }, "Login error");
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});
