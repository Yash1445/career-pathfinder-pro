const express = require('express');
const router = express.Router();
const { protect, authorize, checkOwnership } = require('../middleware/auth');
const { validatePagination, validateObjectId } = require('../middleware/validation');
const userController = require('../controllers/userController');

// All routes are protected (require authentication)
router.use(protect);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', 
  authorize('admin'), 
  validatePagination,
  userController.getUsers
);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin or own profile)
router.get('/:id', 
  validateObjectId,
  checkOwnership(),
  userController.getUserById
);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin or own profile)
router.put('/:id',
  validateObjectId,
  checkOwnership(),
  userController.updateUser
);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin or own profile)
router.delete('/:id',
  validateObjectId,
  checkOwnership(),
  userController.deleteUser
);

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats/overview
// @access  Private (Admin)
router.get('/stats/overview',
  authorize('admin'),
  userController.getUserStats
);

// @desc    Search users (Admin only)
// @route   GET /api/users/search
// @access  Private (Admin)
router.get('/search',
  authorize('admin'),
  validatePagination,
  userController.searchUsers
);

module.exports = router;