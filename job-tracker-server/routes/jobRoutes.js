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

// ✅ Get all jobs with filters, sort, search
router.get("/jobs", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, jobType, sort, search } = req.query;

    const queryObject = { createdBy: userId };

    if (status && status !== "all") {
      queryObject.status = status;
    }

    if (jobType && jobType !== "all") {
      const normalizedType = jobType.charAt(0).toUpperCase() + jobType.slice(1); // "full-time" -> "Full-time"
      queryObject.jobType = normalizedType;
    }

    if (search) {
      queryObject.$or = [
        { position: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    let result = Job.find(queryObject);

    // ✅ Sorting
    if (sort === "latest") {
      result = result.sort("-createdAt");
    } else if (sort === "oldest") {
      result = result.sort("createdAt");
    } else if (sort === "a-z") {
      result = result.sort("position");
    } else if (sort === "z-a") {
      result = result.sort("-position");
    }

    const jobs = await result;
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
