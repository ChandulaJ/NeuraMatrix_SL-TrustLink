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
import swaggerUi from 'swagger-ui-express';
import profileRoutes from './routes/profile.routes.js';
import { openapiSpec } from './docs/openapi.js';

export const app = express();

app.use(helmet());
app.use(cors({
	origin: (origin, callback) => {
		console.log('CORS request from origin:', origin);
		if (!origin) return callback(null, true);
		const normalize = (url: string) => url.replace(/\/$/, '').trim().toLowerCase();
		const allowed = env.CORS_ORIGIN.split(',').map(normalize);
		const incoming = normalize(origin);
		if (allowed.includes(incoming)) {
			return callback(null, true);
		}
		// Also allow if only protocol differs (e.g., http vs https in dev)
		const incomingNoProto = incoming.replace(/^https?:\/\//, '');
		if (allowed.some(a => a.replace(/^https?:\/\//, '') === incomingNoProto)) {
			return callback(null, true);
		}
		console.error('Not allowed by CORS:', origin);
		return callback(new Error('Not allowed by CORS'));
	},
	credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { explorer: true }));
app.get('/docs.json', (_req, res) => res.json(openapiSpec));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/me', profileRoutes);
app.use('/applications', applicationRoutes);
app.use('/admin-schedule', scheduleRoutes);
app.use('/reports', reportRoutes);
app.use('/integrity-flags', flagRoutes);
app.use('/notifications', notificationRoutes);

app.use(errorHandler);
