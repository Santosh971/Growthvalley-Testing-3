// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const dashboardController = require('../controllers/dashboardController');
// const { protect, authorize } = require('../middleware/auth');
// const { validation, rateLimiter } = require('../middleware');

// // @route   POST /api/admin/login
// // @desc    Admin login
// // @access  Public
// router.post('/login', rateLimiter.loginLimiter, validation.validateBody(validation.schemas.login), authController.login);

// // @route   POST /api/admin/init
// // @desc    Initialize default admin (for setup)
// // @access  Public (should be disabled in production)
// router.post('/init', authController.initAdmin);

// // @route   POST /api/admin/forgot-password
// // @desc    Request password reset
// // @access  Public
// router.post('/forgot-password', rateLimiter.passwordResetLimiter, authController.forgotPassword);

// // @route   POST /api/admin/reset-password
// // @desc    Reset password with token
// // @access  Public
// router.post('/reset-password', rateLimiter.passwordResetLimiter, validation.validateBody(validation.schemas.resetPassword), authController.resetPassword);

// // @route   POST /api/admin/verify-reset-token
// // @desc    Verify reset token
// // @access  Public
// router.post('/verify-reset-token', authController.verifyResetToken);

// // @route   POST /api/admin/refresh-token
// // @desc    Refresh access token
// // @access  Public
// router.post('/refresh-token', authController.refreshToken);

// // Protected routes
// router.use(protect);

// // @route   GET /api/admin/me
// // @desc    Get current admin profile
// // @access  Private
// router.get('/me', authController.getProfile);

// // @route   PUT /api/admin/me
// // @desc    Update admin profile
// // @access  Private
// router.put('/me', authController.updateProfile);

// // @route   PUT /api/admin/password
// // @desc    Change password
// // @access  Private
// router.put('/password', authController.changePassword);

// // @route   POST /admin/register
// // @desc    Register new admin
// // @access  Private (Admin only)
// router.post('/register', authorize('admin'), authController.register);

// // @route   POST /api/admin/logout
// // @desc    Logout admin
// // @access  Private
// router.post('/logout', authController.logout);

// // Dashboard routes
// // @route   GET /api/admin/dashboard
// // @desc    Get dashboard stats
// router.get('/dashboard', dashboardController.getDashboardStats);

// // @route   GET /api/admin/activity
// // @desc    Get activity log
// router.get('/activity', dashboardController.getActivityLog);

// module.exports = router;


const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');
const { validation, rateLimiter } = require('../middleware');

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', rateLimiter.loginLimiter, validation.validateBody(validation.schemas.login), authController.login);

// @route   POST /api/admin/init
// @desc    Initialize default admin (for setup)
// @access  Public (should be disabled in production)
router.post('/init', authController.initAdmin);


// @route   POST /api/admin/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', rateLimiter.passwordResetLimiter, authController.forgotPassword);

// @route   POST /api/admin/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', rateLimiter.passwordResetLimiter, validation.validateBody(validation.schemas.resetPassword), authController.resetPassword);

// @route   POST /api/admin/verify-reset-token
// @desc    Verify reset token
// @access  Public
router.post('/verify-reset-token', authController.verifyResetToken);

// @route   POST /api/admin/refresh-token
// @desc    Refresh access token
// @access  Public
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.use(protect);

// @route   GET /api/admin/me
// @desc    Get current admin profile
// @access  Private
router.get('/me', authController.getProfile);

// @route   PUT /api/admin/me
// @desc    Update admin profile
// @access  Private
router.put('/me', authController.updateProfile);

// @route   PUT /api/admin/password
// @desc    Change password
// @access  Private
router.put('/password', authController.changePassword);

// @route   POST /admin/register
// @desc    Register new admin
// @access  Private (Admin only)
router.post('/register', authorize('admin'), authController.register);

// @route   POST /api/admin/logout
// @desc    Logout admin
// @access  Private
router.post('/logout', authController.logout);

// Dashboard routes
// @route   GET /api/admin/dashboard
// @desc    Get dashboard stats
router.get('/dashboard', dashboardController.getDashboardStats);

// @route   GET /api/admin/activity
// @desc    Get activity log
router.get('/activity', dashboardController.getActivityLog);

module.exports = router;