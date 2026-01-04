import express from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * GET /api/jobs/stats
 */
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await Job.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const out = { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 };
    stats.forEach((s) => {
      if (out[s._id] !== undefined) out[s._id] = s.count;
    });

    return res.status(200).json(out);
  } catch (err) {
    console.error("Stats Error:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

/**
 * POST /api/jobs
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const job = await Job.create({ ...req.body, createdBy: userId });
    return res.status(201).json(job);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/jobs
 * query: status, jobType, sort, search, page, limit
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      status = "all",
      jobType = "all",
      sort = "latest",
      search = "",
      page = 1,
      limit = 50,
    } = req.query;

    const queryObject = { createdBy: userId };

    if (status !== "all") queryObject.status = status;
    if (jobType !== "all") queryObject.jobType = jobType;

    if (search?.trim()) {
      const s = search.trim();
      queryObject.$or = [
        { position: { $regex: s, $options: "i" } },
        { company: { $regex: s, $options: "i" } },
      ];
    }

    let result = Job.find(queryObject);

    if (sort === "latest") result = result.sort("-createdAt");
    else if (sort === "oldest") result = result.sort("createdAt");
    else if (sort === "a-z") result = result.sort("position");
    else if (sort === "z-a") result = result.sort("-position");

    const safeLimit = Math.max(1, Number(limit) || 50);
    const safePage = Math.max(1, Number(page) || 1);
    const skip = (safePage - 1) * safeLimit;

    const totalJobs = await Job.countDocuments(queryObject);
    const jobs = await result.skip(skip).limit(safeLimit);
    const numOfPages = Math.ceil(totalJobs / safeLimit) || 0;

    return res.status(200).json({
      jobs,
      totalJobs,
      numOfPages,
      currentPage: safePage,
    });
  } catch (err) {
    console.error("Fetch Jobs Error:", err);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

/**
 * GET /api/jobs/:id
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!job) return res.status(404).json({ error: "Job not found" });

    return res.status(200).json(job);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/jobs/:id
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Job not found" });

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/jobs/:id
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!deleted) return res.status(404).json({ error: "Job not found" });

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
