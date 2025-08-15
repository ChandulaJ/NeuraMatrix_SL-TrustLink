import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { PrismaUserRepository } from '../infrastructure/database/PrismaUserRepository';
import { authenticateToken, requireRole } from '../middleware/auth';

// Create instances
// Note: In a real application, you would use dependency injection
const prismaUser = new PrismaUserRepository();
const userService = new UserService(prismaUser);
const userController = new UserController(userService);

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
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
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
router.post('/register', validateRegistration, userController.register);
router.post('/login', validateLogin, userController.login);
router.post('/logout', userController.logout);
router.post('/forgot-password', validateForgotPassword, userController.forgotPassword);
router.post('/reset-password', validateResetPassword, userController.resetPassword);
router.get('/verify-email/:token', userController.verifyEmail);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, validateUpdateProfile, userController.updateProfile);
router.post('/change-password', authenticateToken, validateChangePassword, userController.changePassword);

// Admin-only routes
router.get('/:id', authenticateToken, requireRole(['ADMIN']), userController.getUserById);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), validateUpdateProfile, userController.updateUser);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), userController.deleteUser);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
