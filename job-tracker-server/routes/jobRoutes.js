import express from "express";
import mongoose from "mongoose"; // ✅ Required for ObjectId conversion
import Job from "../models/Job.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Get job stats by status (for charts)
router.get("/jobs/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await Job.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const defaultStats = {
      Applied: 0,
      Interview: 0,
      Rejected: 0,
      Offer: 0,
    };

    stats.forEach((stat) => {
      defaultStats[stat._id] = stat.count;
    });

    res.status(200).json(defaultStats);
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

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

// ✅ Get all jobs with filters, search, sort, and pagination
router.get("/jobs", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      status = "all",
      jobType = "all",
      sort = "latest",
      search = "",
      page = 1,
      limit = 10,
    } = req.query;

    const queryObject = { createdBy: userId };

    if (status !== "all") {
      queryObject.status = status;
    }

    if (jobType !== "all") {
      queryObject.jobType =
        jobType.charAt(0).toUpperCase() + jobType.slice(1).toLowerCase();
    }

    if (search) {
      queryObject.$or = [
        { position: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    let result = Job.find(queryObject);

    // Sorting
    if (sort === "latest") result = result.sort("-createdAt");
    else if (sort === "oldest") result = result.sort("createdAt");
    else if (sort === "a-z") result = result.sort("position");
    else if (sort === "z-a") result = result.sort("-position");

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    result = result.skip(skip).limit(Number(limit));

    const totalJobs = await Job.countDocuments(queryObject);
    const jobs = await result;
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(200).json({
      jobs,
      totalJobs,
      numOfPages,
      currentPage: Number(page),
    });
  } catch (err) {
    console.error("Fetch Jobs Error:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// ✅ Get a single job by ID
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

// ✅ Update a job
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

// ✅ Delete a job
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
