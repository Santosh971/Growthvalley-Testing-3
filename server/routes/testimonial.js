const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getTestimonial,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials
} = require('../controllers/testimonialController');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Admin routes
router.get('/admin/all', protect, authorize('admin', 'editor'), getAdminTestimonials);


router.post(
  '/',
  protect,
  authorize('admin', 'editor'),
  uploadSingle('avatar'), // 🔥 upload image here
  createTestimonial
);
router.put('/reorder', protect, authorize('admin', 'editor'), reorderTestimonials);
router.put(
  '/:id',
  protect,
  authorize('admin', 'editor'),
  uploadSingle('avatar'), // ⭐ REQUIRED
  updateTestimonial
);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteTestimonial);

module.exports = router;