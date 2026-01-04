import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * PUT /api/users/update-profile
 * body: { name }
 * (keep it simple: name only; email updates cause collisions)
 */
router.put("/update-profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const name = (req.body.name || "").trim();

    if (!name) return res.status(400).json({ error: "Name is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name;
    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

/**
 * PUT /api/users/update-password
 * body: { oldPassword, newPassword }
 */
router.put("/update-password", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old password and new password are required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: "New password must be 6+ chars" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const ok = await user.comparePassword(oldPassword);
    if (!ok)
      return res.status(400).json({ error: "Current password is incorrect" });

    user.password = newPassword; // will be hashed by pre-save
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update password error:", err);
    return res.status(500).json({ error: "Failed to update password" });
  }
});

/**
 * DELETE /api/users/delete
 * deletes user + all jobs
 */
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await Job.deleteMany({ createdBy: userId });
    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ message: "Account and all jobs deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ error: "Failed to delete account" });
  }
});

export default router;
