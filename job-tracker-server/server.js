require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware to enable CORS and parse JSON body
app.use(cors());
app.use(express.json());

// Connect to MongoDB using connection string in .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route to check server status
app.get("/", (req, res) => {
  res.send("Job Tracker API is running...");
});

// Start server on port from environment or 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
