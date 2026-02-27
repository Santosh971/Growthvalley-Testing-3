const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
// Public routes
router.get('/', teamController.getTeamMembers);
router.get('/:id', teamController.getTeamMember);

// Protected admin routes
// router.post('/', protect, authorize('admin'), teamController.createTeamMember);

router.post(
    '/',
    protect,
    authorize('admin'),
    uploadSingle('image'), // ⭐ field name must match frontend
    teamController.createTeamMember
);
router.put('/reorder', protect, authorize('admin'), teamController.reorderTeamMembers);
router.put('/:id', protect, authorize('admin'), teamController.updateTeamMember);
router.delete('/:id', protect, authorize('admin'), teamController.deleteTeamMember);

module.exports = router;