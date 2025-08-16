import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
  },
});

router.post(
  '/',
  upload.array('documents', 5),
  AppointmentController.createAppointment
);
router.patch('/:id/status', AppointmentController.updateStatus);
router.get('/user/:userId', AppointmentController.getUserAppointments);
router.delete('/:id', AppointmentController.deleteAppointment);

export default router;
