import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js"; // ✅ ADD THIS
import { verifyToken } from "../middleware/verifyToken.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// 🔹 Update Profile (name + email)
router.put("/update-profile", verifyToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.status(200).json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// 🔹 Update Password
router.put("/update-password", verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    user.password = newPassword; // This triggers the pre-save hashing
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔥 Delete account and jobs
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await User.findByIdAndDelete(userId);
    await Job.deleteMany({ createdBy: userId }); // ✅ works now

    res
      .status(200)
      .json({ message: "Account and all jobs deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete account" });
  }
});

export default router;
