const express = require('express');
const router = express.Router();
const { protect, checkSubscription, requireCompleteProfile, optionalAuth } = require('../middleware/auth');
const { 
  validateSkillGap, 
  validateLearningPath, 
  validateSalaryInsights,
  validateCareerGoal,
  validatePagination 
} = require('../middleware/validation');
const {
  analyzeCareer,
  getCareerRecommendations,
  getCareerPathsByIndustry,
  getSkillGapAnalysis,
  getMarketTrends,
  getSalaryInsights,
  getLearningPath,
  saveCareerGoal,
  compareCareerPaths,
  getSkillAssessment,
  getIndustryInsights,
  getCareerRoadmap
} = require('../controllers/careerController');

// @desc    Analyze user career path (AI-powered)
// @route   POST /api/careers/analyze
// @access  Private (requires complete profile)
router.post('/analyze',
  protect,
  requireCompleteProfile,
  checkSubscription('free'), // Free users get limited analyses
  analyzeCareer
);

// @desc    Get career recommendations
// @route   GET /api/careers/recommendations
// @access  Private
router.get('/recommendations',
  protect,
  getCareerRecommendations
);

// @desc    Get career paths by industry
// @route   GET /api/careers/paths/:industry
// @access  Public
router.get('/paths/:industry',
  optionalAuth,
  getCareerPathsByIndustry
);

// @desc    Get skill gap analysis
// @route   POST /api/careers/skill-gap
// @access  Private (Premium feature)
router.post('/skill-gap',
  protect,
  requireCompleteProfile,
  checkSubscription('premium'),
  validateSkillGap,
  getSkillGapAnalysis
);

// @desc    Get market trends
// @route   GET /api/careers/trends
// @access  Public
router.get('/trends',
  optionalAuth,
  validatePagination,
  getMarketTrends
);

// @desc    Get salary insights
// @route   POST /api/careers/salary-insights
// @access  Private (Premium feature)
router.post('/salary-insights',
  protect,
  checkSubscription('premium'),
  validateSalaryInsights,
  getSalaryInsights
);

// @desc    Generate learning path
// @route   POST /api/careers/learning-path
// @access  Private
router.post('/learning-path',
  protect,
  requireCompleteProfile,
  validateLearningPath,
  getLearningPath
);

// @desc    Save career goals
// @route   POST /api/careers/goals
// @access  Private
router.post('/goals',
  protect,
  validateCareerGoal,
  saveCareerGoal
);

// @desc    Compare career paths
// @route   POST /api/careers/compare
// @access  Private (Premium feature)
router.post('/compare',
  protect,
  checkSubscription('premium'),
  compareCareerPaths
);

// @desc    Get skill assessment
// @route   POST /api/careers/skill-assessment
// @access  Private
router.post('/skill-assessment',
  protect,
  requireCompleteProfile,
  getSkillAssessment
);

// @desc    Get industry insights
// @route   GET /api/careers/industry-insights/:industry
// @access  Public
router.get('/industry-insights/:industry',
  optionalAuth,
  getIndustryInsights
);

// @desc    Generate career roadmap
// @route   POST /api/careers/roadmap
// @access  Private (Premium feature)
router.post('/roadmap',
  protect,
  requireCompleteProfile,
  checkSubscription('premium'),
  getCareerRoadmap
);

module.exports = router;