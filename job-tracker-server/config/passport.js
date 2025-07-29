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

// ✅ Correct Passport config file
import "./config/passport.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// -----------------------------
// 🌐 Middleware
// -----------------------------

// ✅ CORS setup (allows cookies/session from frontend)
app.use(
  cors({
    origin: true, // later replace with "https://your-frontend.vercel.app"
    credentials: true,
  })
);

// Parses incoming JSON
app.use(express.json());

// ✅ Session setup (needed before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    },
  })
);

// ✅ Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// -----------------------------
// 🛣️ API Routes
// -----------------------------
app.use("/api", jobRoutes); // Job CRUD
app.use("/api/auth", authRoutes); // Auth, incl. Google OAuth
app.use("/api/users", userRoutes); // User profile, delete

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
// 🧪 Root Route
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
