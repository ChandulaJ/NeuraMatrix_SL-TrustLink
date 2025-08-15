import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('phoneNumber')
    .optional(),
  body('gender')
    .optional()
    .isIn(['MALE', 'FEMALE', 'OTHER'])
    .withMessage('Gender must be MALE, FEMALE, or OTHER'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('role')
    .isIn(['CITIZEN', 'FOREIGNER', 'BUSINESS_OWNER'])
    .withMessage('Role must be CITIZEN, FOREIGNER, or BUSINESS_OWNER'),
  body('nationalId')
    .optional()
    .isLength({ min: 10, max: 12 })
    .withMessage('National ID must be between 10 and 12 characters'),
  body('passportNo')
    .if(body('role').equals('FOREIGNER'))
    .isLength({ min: 6, max: 20 })
    .withMessage('Passport number is required for FOREIGNER and must be between 6 and 20 characters'),
  body('businessRegNo')
    .if(body('role').equals('BUSINESS_OWNER'))
    .isLength({ min: 5, max: 20 })
    .withMessage('Business registration number is required for BUSINESS_OWNER and must be between 5 and 20 characters')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

const validateUpdateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phoneNumber')
    .optional(),
  body('gender')
    .optional()
    .isIn(['MALE', 'FEMALE', 'OTHER'])
    .withMessage('Gender must be MALE, FEMALE, or OTHER'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
];

// Public routes
router.post('/register', validateRegistration, UserController.register);
router.post('/login', validateLogin, UserController.login);
router.post('/logout', UserController.logout);
router.post('/forgot-password', validateForgotPassword, UserController.forgotPassword);
router.post('/reset-password', validateResetPassword, UserController.resetPassword);
router.get('/verify-email/:token', UserController.verifyEmail);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, validateUpdateProfile, UserController.updateProfile);
router.post('/change-password', authenticateToken, validateChangePassword, UserController.changePassword);

// Admin-only routes
router.get('/:id', authenticateToken, requireRole(['ADMIN']), UserController.getUserById);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), validateUpdateProfile, UserController.updateUser);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), UserController.deleteUser);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
