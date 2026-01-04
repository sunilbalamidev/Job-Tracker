import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/**
 * Helpers
 */
const safeEmail = (email) => (email || "").trim().toLowerCase();

/**
 * Always read JWT_SECRET at runtime (IMPORTANT)
 */
const signToken = (userId) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};

/**
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  const name = (req.body.name || "").trim();
  const email = safeEmail(req.body.email);
  const password = req.body.password;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);

    return res.status(500).json({
      error: "Server error during registration",
      details: err.message,
    });
  }
});

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  const email = safeEmail(req.body.email);
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      error: "Server error during login",
      details: err.message,
    });
  }
});

/**
 * POST /api/auth/google/token
 * body: { token: "<google_id_token>" }
 */
router.post("/google/token", async (req, res) => {
  const googleToken = req.body?.token;
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: "Google login not configured" });
  }

  if (!googleToken) {
    return res.status(400).json({ error: "Google token is required" });
  }

  try {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = safeEmail(payload?.email);
    const name = (payload?.name || "").trim();
    const googleId = payload?.sub;

    if (!email || !googleId) {
      return res.status(401).json({ error: "Invalid Google token payload" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email,
        googleId,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (!user.name && name) user.name = name;
      await user.save();
    }

    const token = signToken(user._id);

    return res.status(200).json({
      message: "Google login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Google token login error:", err);

    return res.status(401).json({
      error: "Invalid Google token",
      details: err.message,
    });
  }
});

export default router;
