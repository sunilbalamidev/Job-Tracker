import express from "express";
import Job from "../models/Job.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Create a new job
router.post("/jobs", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const job = await Job.create({ ...req.body, createdBy: userId });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all jobs for the logged-in user
router.get("/jobs", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobs = await Job.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single job by ID (ownership check)
router.get("/jobs/:id", verifyToken, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found or access denied" });
    }

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a job by ID (only if user is creator)
router.put("/jobs/:id", verifyToken, async (req, res) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found or access denied" });
    }

    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a job by ID (only if user is creator)
router.delete("/jobs/:id", verifyToken, async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found or access denied" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
