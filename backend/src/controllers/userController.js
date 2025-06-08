const User = require('../models/User');
const Profile = require('../models/Profile');
const logger = require('../utils/logger');

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Error response class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status, role, subscription } = req.query;

  // Build query
  const query = {};
  
  if (status) query.status = status;
  if (role) query.role = role;
  if (subscription) query['subscription.plan'] = subscription;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  try {
    const users = await User.find(query)
      .select('-password -resetPasswordToken -verificationToken')
      .populate('profile', 'headline experienceLevel location completionPercentage')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    return next(new ErrorResponse('Failed to fetch users', 500));
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin or own profile)
const getUserById = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -verificationToken')
      .populate('profile');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    return next(new ErrorResponse('Failed to fetch user', 500));
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin or own profile)
const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, role, status, preferences } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Only admin can change role and status
    if (req.user.role !== 'admin' && (role || status)) {
      return next(new ErrorResponse('Not authorized to change role or status', 403));
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && req.user.role === 'admin') user.role = role;
    if (status && req.user.role === 'admin') user.status = status;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    logger.info(`User ${user._id} updated by ${req.user._id}`);

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    logger.error('Update user error:', error);
    return next(new ErrorResponse('Failed to update user', 500));
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin or own profile)
const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Delete associated profile
    await Profile.deleteOne({ user: user._id });

    // Delete user
    await User.deleteOne({ _id: user._id });

    logger.info(`User ${user._id} deleted by ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    return next(new ErrorResponse('Failed to delete user', 500));
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats/overview
// @access  Private (Admin only)
const getUserStats = asyncHandler(async (req, res, next) => {
  try {
    const stats = await User.getUserStats();
    
    // Additional statistics
    const monthlyGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const subscriptionStats = await User.aggregate([
      {
        $group: {
          _id: "$subscription.plan",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats,
        monthlyGrowth,
        subscriptionBreakdown: subscriptionStats
      }
    });
  } catch (error) {
    logger.error('Get user stats error:', error);
    return next(new ErrorResponse('Failed to fetch user statistics', 500));
  }
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Private (Admin only)
const searchUsers = asyncHandler(async (req, res, next) => {
  const { query, page = 1, limit = 10 } = req.query;

  if (!query) {
    return next(new ErrorResponse('Search query is required', 400));
  }

  try {
    const searchRegex = new RegExp(query, 'i');
    
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ]
    })
    .select('-password -resetPasswordToken -verificationToken')
    .populate('profile', 'headline experienceLevel location')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const total = await User.countDocuments({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        query,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Search users error:', error);
    return next(new ErrorResponse('Failed to search users', 500));
  }
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  searchUsers
};