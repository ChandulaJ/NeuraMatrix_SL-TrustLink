const express = require("express");
const router = express.Router();
const Analytics = require("../models/Analytics");

// GET all analytics
router.get("/", async (req, res) => {
  try {
    const data = await Analytics.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
});

module.exports = router;
