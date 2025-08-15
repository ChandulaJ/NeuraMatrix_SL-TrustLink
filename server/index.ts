import express, { NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import appointmentRoutes from './src/routes/AppointmentRoutes';
import departmentRoutes from './src/routes/DepartmentRoutes';
import serviceRoutes from './src/routes/ServicesRoutes';
import userRoutes from './src/routes/UserRoutes';
import sseRoutes from './src/routes/SSERoutes';
import {
  seedDummyUser,
  seedDummyDepartmentsAndServices,
} from './src/infrastructure/database/seed';
import logger from './src/shared/logger';
import { notificationService } from './src/services/NotificationService';

const app = express();

app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for SSE
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Cache-Control');
  next();
});

// Routes
app.use('/events', sseRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/departments', departmentRoutes);
app.use('/services', serviceRoutes);
app.use('/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      notification: 'running',
    },
  });
});

const PORT = 3000;

async function startServer() {
  try {
    // Seed database
    logger.info('Seeding database...');
    //await seedDummyUser();
    //await seedDummyDepartmentsAndServices();
    logger.info('Database seeded successfully');

    // Start notification service
    logger.info('Starting notification service...');
    await notificationService.start();
    logger.info('Notification service started successfully');

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(
        `SSE endpoint: http://localhost:${PORT}/events/admin/appointments`
      );
      logger.info(`Server started on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error during server startup:', error);
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  try {
    await notificationService.stop();
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  try {
    await notificationService.stop();
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

startServer();
