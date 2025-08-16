const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  totalAppointments: { type: Number, default: 0 },
  pendingAppointments: { type: Number, default: 0 },
  completedAppointments: { type: Number, default: 0 },
});

module.exports = mongoose.model("Service", serviceSchema);
