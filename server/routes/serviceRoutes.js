const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// GET all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Insert dummy data (seed)
router.get("/seed", async (req, res) => {
  try {
    await Service.deleteMany({});
    await Service.insertMany([
      {
        serviceName: "Passport Service",
        totalAppointments: 120,
        pendingAppointments: 30,
        completedAppointments: 90,
      },
      {
        serviceName: "Driver's License",
        totalAppointments: 80,
        pendingAppointments: 20,
        completedAppointments: 60,
      },
      {
        serviceName: "National ID",
        totalAppointments: 200,
        pendingAppointments: 50,
        completedAppointments: 150,
      },
    ]);
    res.json({ message: "Dummy data inserted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
