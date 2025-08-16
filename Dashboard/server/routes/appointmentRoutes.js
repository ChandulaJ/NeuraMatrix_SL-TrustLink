const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

// Get all appointments (optionally with service details)
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("service");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: Get aggregated data for dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const services = await Service.find();
    const result = [];

    for (let service of services) {
      const total = await Appointment.countDocuments({ service: service._id });
      const pending = await Appointment.countDocuments({
        service: service._id,
        status: "pending",
      });
      const completed = await Appointment.countDocuments({
        service: service._id,
        status: "completed",
      });
      const cancelled = await Appointment.countDocuments({
        service: service._id,
        status: "cancelled",
      });

      result.push({
        serviceName: service.serviceName,
        totalAppointments: total,
        pendingAppointments: pending,
        completedAppointments: completed,
        cancelledAppointments: cancelled,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
