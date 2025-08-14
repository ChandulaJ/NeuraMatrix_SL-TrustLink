import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import applicationRoutes from './routes/application.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import reportRoutes from './routes/report.routes.js';
import flagRoutes from './routes/flag.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { errorHandler } from './middlewares/error.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/applications', applicationRoutes);
app.use('/admin-schedule', scheduleRoutes);
app.use('/reports', reportRoutes);
app.use('/integrity-flags', flagRoutes);
app.use('/notifications', notificationRoutes);

app.use(errorHandler);
