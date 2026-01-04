import dotenv from "dotenv";
dotenv.config();
console.log("JWT_SECRET loaded?", !!process.env.JWT_SECRET);
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

/**
 * Middleware
 */
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.send("Job Tracker API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

/**
 * Start
 */
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables.");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server start error:", err.message);
    process.exit(1);
  }
};

start();
