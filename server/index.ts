import express, { NextFunction } from "express";
import appointmentRoutes from "./src/routes/AppointmentRoutes";
import { seedDummyUser, seedDummyDepartment, seedDummyService } from "./src/infrastructure/database/seed";
import logger from "./src/shared/logger";

const app = express();
app.use(express.json());

app.use("/appointments", appointmentRoutes);

const PORT = 3000;

async function startServer() {
  try {
      await seedDummyUser();
      await seedDummyDepartment();
      await seedDummyService();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Error during server startup:", error);
    console.error("Failed to start server", error);
  }
}

startServer();