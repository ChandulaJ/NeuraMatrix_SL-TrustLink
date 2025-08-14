import express, { NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import appointmentRoutes from "./src/routes/AppointmentRoutes";
import authRoutes from "./src/routes/authRoutes";
import { seedDummyUser, seedDummyDepartment, seedDummyService } from "./src/infrastructure/database/seed";
import logger from "./src/shared/logger";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/appointments", appointmentRoutes);
app.use("/auth", authRoutes);

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