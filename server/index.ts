import express, { NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import appointmentRoutes from './src/routes/AppointmentRoutes';
import departmentRoutes from './src/routes/DepartmentRoutes';
import serviceRoutes from './src/routes/ServicesRoutes';
import userRoutes from './src/routes/UserRoutes';
import {
  seedDummyUser,
  seedDummyDepartmentsAndServices,
} from './src/infrastructure/database/seed';
import logger from './src/shared/logger';
import sseRoutes from './src/routes/SSERoutes';

const app = express();

app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/events', sseRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/departments', departmentRoutes);
app.use('/services', serviceRoutes);
app.use('/user', userRoutes);

const PORT = 3000;

async function startServer() {
  try {
    //await seedDummyDepartmentsAndServices();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Error during server startup:', error);
    console.error('Failed to start server', error);
  }
}

startServer();
