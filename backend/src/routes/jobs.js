const express = require('express');
const router = express.Router();
const { protect, optionalAuth, checkSubscription } = require('../middleware/auth');
const { validatePagination, validateObjectId } = require('../middleware/validation');
const jobController = require('../controllers/jobController');

// @desc    Get all jobs with filtering and pagination
// @route   GET /api/jobs
// @access  Public
router.get('/',
  optionalAuth,
  validatePagination,
  jobController.getJobs
);

// @desc    Search jobs
// @route   GET /api/jobs/search
// @access  Public
router.get('/search',
  optionalAuth,
  validatePagination,
  jobController.searchJobs
);

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id',
  validateObjectId,
  optionalAuth,
  jobController.getJobById
);

// @desc    Get recommended jobs for user
// @route   GET /api/jobs/recommendations
// @access  Private
router.get('/recommendations',
  protect,
  jobController.getJobRecommendations
);

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private
router.post('/:id/apply',
  protect,
  validateObjectId,
  jobController.applyToJob
);

// @desc    Get user's job applications
// @route   GET /api/jobs/my-applications
// @access  Private
router.get('/my-applications',
  protect,
  validatePagination,
  jobController.getMyApplications
);

// @desc    Update job application
// @route   PUT /api/jobs/applications/:id
// @access  Private
router.put('/applications/:id',
  protect,
  validateObjectId,
  jobController.updateApplication
);

// @desc    Withdraw job application
// @route   DELETE /api/jobs/applications/:id
// @access  Private
router.delete('/applications/:id',
  protect,
  validateObjectId,
  jobController.withdrawApplication
);

// @desc    Save/bookmark a job
// @route   POST /api/jobs/:id/save
// @access  Private
router.post('/:id/save',
  protect,
  validateObjectId,
  jobController.saveJob
);

// @desc    Get saved jobs
// @route   GET /api/jobs/saved
// @access  Private
router.get('/saved',
  protect,
  validatePagination,
  jobController.getSavedJobs
);

// @desc    Remove saved job
// @route   DELETE /api/jobs/:id/save
// @access  Private
router.delete('/:id/save',
  protect,
  validateObjectId,
  jobController.removeSavedJob
);

// @desc    Get job statistics
// @route   GET /api/jobs/stats/overview
// @access  Public
router.get('/stats/overview',
  jobController.getJobStats
);

// @desc    Get jobs by location
// @route   GET /api/jobs/location/:location
// @access  Public
router.get('/location/:location',
  optionalAuth,
  validatePagination,
  jobController.getJobsByLocation
);

// @desc    Get jobs by company
// @route   GET /api/jobs/company/:company
// @access  Public
router.get('/company/:company',
  optionalAuth,
  validatePagination,
  jobController.getJobsByCompany
);

// @desc    Get similar jobs
// @route   GET /api/jobs/:id/similar
// @access  Public
router.get('/:id/similar',
  validateObjectId,
  optionalAuth,
  jobController.getSimilarJobs
);

// @desc    Get job alerts (Premium feature)
// @route   GET /api/jobs/alerts
// @access  Private (Premium)
router.get('/alerts',
  protect,
  checkSubscription('premium'),
  jobController.getJobAlerts
);

// @desc    Create job alert (Premium feature)
// @route   POST /api/jobs/alerts
// @access  Private (Premium)
router.post('/alerts',
  protect,
  checkSubscription('premium'),
  jobController.createJobAlert
);

// @desc    Update job alert
// @route   PUT /api/jobs/alerts/:id
// @access  Private (Premium)
router.put('/alerts/:id',
  protect,
  checkSubscription('premium'),
  validateObjectId,
  jobController.updateJobAlert
);

// @desc    Delete job alert
// @route   DELETE /api/jobs/alerts/:id
// @access  Private (Premium)
router.delete('/alerts/:id',
  protect,
  checkSubscription('premium'),
  validateObjectId,
  jobController.deleteJobAlert
);

module.exports = router;