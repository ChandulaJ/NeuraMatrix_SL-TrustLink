import express from 'express';
import { SSEController } from '../controllers/SSEController';

const router = express.Router();
const sseController = new SSEController();

// SSE endpoint for admin dashboard
router.get(
  '/admin/appointments',
  sseController.adminAppointmentEvents.bind(sseController)
);

// Get SSE connection statistics
router.get('/stats', sseController.getStats.bind(sseController));

export default router;
