import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import User from "../models/User.js";

const router = express.Router();

// DELETE /api/users/delete - Delete the logged-in user's account
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const userId = req.user; // ✅ Extracted from verifyToken middleware

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Account deletion error:", err);
    res.status(500).json({ error: "Server error while deleting account" });
  }
});

export default router;
