const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes"); // <-- new
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI =
  "mongodb+srv://nisalmicro:micro1234@microcluster.w872zhn.mongodb.net/dashboardDB?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes); // <-- new
app.use("/api/analytics", analyticsRoutes);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
