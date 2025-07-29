// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
// Route imports
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import googleAuthRoutes from "./routes/auth.js";

// Passport config (must be imported after passport)
import "./config/passport.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// -----------------------------
// 🌐 Middleware
// -----------------------------
app.use(cors());
app.use(express.json());

// ⚠️ Session must come before passport middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// -----------------------------
// 🛣️ API Routes
// -----------------------------
app.use("/api", jobRoutes); // Jobs CRUD
app.use("/api/auth", authRoutes); // Auth, including Google OAuth
app.use("/api/users", userRoutes); // User settings
app.use("/api/auth", googleAuthRoutes); // Google` OAuth routes

// -----------------------------
// 🔗 MongoDB Connection
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -----------------------------
// 🧪 Test Route
// -----------------------------
app.get("/", (req, res) => {
  res.send("Job Tracker API is running...");
});

// -----------------------------
// 🚀 Start Server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
