const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');
const analyticsController = require('../controllers/analyticsController');

// @desc    Track user event
// @route   POST /api/analytics/track
// @access  Public (with optional auth)
router.post('/track',
  optionalAuth,
  analyticsController.trackEvent
);

// @desc    Get user analytics dashboard
// @route   GET /api/analytics/dashboard
// @access  Private
router.get('/dashboard',
  protect,
  analyticsController.getUserDashboard
);

// @desc    Get skill trends
// @route   GET /api/analytics/skills/trends
// @access  Public
router.get('/skills/trends',
  optionalAuth,
  analyticsController.getSkillTrends
);

// @desc    Get popular career paths
// @route   GET /api/analytics/careers/popular
// @access  Public
router.get('/careers/popular',
  optionalAuth,
  analyticsController.getPopularCareerPaths
);

// @desc    Get salary trends
// @route   GET /api/analytics/salary/trends
// @access  Public
router.get('/salary/trends',
  optionalAuth,
  analyticsController.getSalaryTrends
);

// @desc    Get job market insights
// @route   GET /api/analytics/job-market
// @access  Public
router.get('/job-market',
  optionalAuth,
  analyticsController.getJobMarketInsights
);

// @desc    Get user behavior analytics (Admin only)
// @route   GET /api/analytics/users/behavior
// @access  Private (Admin)
router.get('/users/behavior',
  protect,
  authorize('admin'),
  validatePagination,
  analyticsController.getUserBehaviorAnalytics
);

// @desc    Get platform statistics (Admin only)
// @route   GET /api/analytics/platform/stats
// @access  Private (Admin)
router.get('/platform/stats',
  protect,
  authorize('admin'),
  analyticsController.getPlatformStats
);

// @desc    Get revenue analytics (Admin only)
// @route   GET /api/analytics/revenue
// @access  Private (Admin)
router.get('/revenue',
  protect,
  authorize('admin'),
  analyticsController.getRevenueAnalytics
);

// @desc    Get feature usage analytics (Admin only)
// @route   GET /api/analytics/features/usage
// @access  Private (Admin)
router.get('/features/usage',
  protect,
  authorize('admin'),
  analyticsController.getFeatureUsageAnalytics
);

// @desc    Get error analytics (Admin only)
// @route   GET /api/analytics/errors
// @access  Private (Admin)
router.get('/errors',
  protect,
  authorize('admin'),
  validatePagination,
  analyticsController.getErrorAnalytics
);

// @desc    Get conversion funnel (Admin only)
// @route   GET /api/analytics/conversion/funnel
// @access  Private (Admin)
router.get('/conversion/funnel',
  protect,
  authorize('admin'),
  analyticsController.getConversionFunnel
);

// @desc    Get cohort analysis (Admin only)
// @route   GET /api/analytics/cohort
// @access  Private (Admin)
router.get('/cohort',
  protect,
  authorize('admin'),
  analyticsController.getCohortAnalysis
);

// @desc    Export analytics data (Admin only)
// @route   GET /api/analytics/export
// @access  Private (Admin)
router.get('/export',
  protect,
  authorize('admin'),
  analyticsController.exportAnalyticsData
);

module.exports = router;