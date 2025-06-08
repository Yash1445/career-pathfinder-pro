const express = require('express');
const router = express.Router();
const { protect, authorize, checkOwnership, requireCompleteProfile } = require('../middleware/auth');
const { 
  validateProfile, 
  validateExperience, 
  validateEducation, 
  validateProject,
  validatePagination,
  validateObjectId,
  validateFileType,
  validateFileSize
} = require('../middleware/validation');
const profileController = require('../controllers/profileController');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// All routes are protected (require authentication)
router.use(protect);

// @desc    Get current user's profile
// @route   GET /api/profiles/me
// @access  Private
router.get('/me', profileController.getMyProfile);

// @desc    Create or update current user's profile
// @route   PUT /api/profiles/me
// @access  Private
router.put('/me', 
  validateProfile,
  profileController.updateMyProfile
);

// @desc    Get profile by user ID
// @route   GET /api/profiles/user/:userId
// @access  Private
router.get('/user/:userId',
  validateObjectId,
  profileController.getProfileByUserId
);

// @desc    Upload resume
// @route   POST /api/profiles/me/resume
// @access  Private
router.post('/me/resume',
  upload.single('resume'),
  validateFileType(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  validateFileSize(10 * 1024 * 1024), // 10MB
  profileController.uploadResume
);

// @desc    Upload avatar
// @route   POST /api/profiles/me/avatar
// @access  Private
router.post('/me/avatar',
  upload.single('avatar'),
  validateFileType(['image/jpeg', 'image/png', 'image/gif']),
  validateFileSize(5 * 1024 * 1024), // 5MB
  profileController.uploadAvatar
);

// Experience routes
// @desc    Add work experience
// @route   POST /api/profiles/me/experience
// @access  Private
router.post('/me/experience',
  validateExperience,
  profileController.addExperience
);

// @desc    Update work experience
// @route   PUT /api/profiles/me/experience/:id
// @access  Private
router.put('/me/experience/:id',
  validateObjectId,
  validateExperience,
  profileController.updateExperience
);

// @desc    Delete work experience
// @route   DELETE /api/profiles/me/experience/:id
// @access  Private
router.delete('/me/experience/:id',
  validateObjectId,
  profileController.deleteExperience
);

// Education routes
// @desc    Add education
// @route   POST /api/profiles/me/education
// @access  Private
router.post('/me/education',
  validateEducation,
  profileController.addEducation
);

// @desc    Update education
// @route   PUT /api/profiles/me/education/:id
// @access  Private
router.put('/me/education/:id',
  validateObjectId,
  validateEducation,
  profileController.updateEducation
);

// @desc    Delete education
// @route   DELETE /api/profiles/me/education/:id
// @access  Private
router.delete('/me/education/:id',
  validateObjectId,
  profileController.deleteEducation
);

// Project routes
// @desc    Add project
// @route   POST /api/profiles/me/projects
// @access  Private
router.post('/me/projects',
  validateProject,
  profileController.addProject
);

// @desc    Update project
// @route   PUT /api/profiles/me/projects/:id
// @access  Private
router.put('/me/projects/:id',
  validateObjectId,
  validateProject,
  profileController.updateProject
);

// @desc    Delete project
// @route   DELETE /api/profiles/me/projects/:id
// @access  Private
router.delete('/me/projects/:id',
  validateObjectId,
  profileController.deleteProject
);

// Skills routes
// @desc    Add skill
// @route   POST /api/profiles/me/skills
// @access  Private
router.post('/me/skills',
  profileController.addSkill
);

// @desc    Update skill
// @route   PUT /api/profiles/me/skills/:id
// @access  Private
router.put('/me/skills/:id',
  validateObjectId,
  profileController.updateSkill
);

// @desc    Delete skill
// @route   DELETE /api/profiles/me/skills/:id
// @access  Private
router.delete('/me/skills/:id',
  validateObjectId,
  profileController.deleteSkill
);

// @desc    Search profiles (Public profiles only)
// @route   GET /api/profiles/search
// @access  Private
router.get('/search',
  validatePagination,
  profileController.searchProfiles
);

// @desc    Get profile analytics
// @route   GET /api/profiles/me/analytics
// @access  Private
router.get('/me/analytics',
  requireCompleteProfile,
  profileController.getProfileAnalytics
);

// @desc    Get profile completion status
// @route   GET /api/profiles/me/completion
// @access  Private
router.get('/me/completion',
  profileController.getProfileCompletion
);

module.exports = router;