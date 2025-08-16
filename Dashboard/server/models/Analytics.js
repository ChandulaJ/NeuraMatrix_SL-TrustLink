const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  peakHours: [String], // e.g., ["09:00-11:00", "14:00-16:00"]
  dailyLoad: [Number], // appointments per day
  noShowRate: Number, // e.g., 0.1 = 10%
  avgProcessingTime: Number, // in minutes
});

module.exports = mongoose.model("Analytics", analyticsSchema);
