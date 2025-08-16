const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  service: {
    // ObjectId reference to Service
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  customerName: { type: String, required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"], // must match exactly
    default: "pending",
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
