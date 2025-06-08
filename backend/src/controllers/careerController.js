const Profile = require('../models/Profile');
const User = require('../models/User');
const careerAnalyzer = require('../services/ai/careerAnalyzer');
const skillMatcher = require('../services/ai/skillMatcher');
const jobRecommender = require('../services/ai/jobRecommender');
const salaryPredictor = require('../services/ai/salaryPredictor');
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

// @desc    Analyze user career path
// @route   POST /api/careers/analyze
// @access  Private
const analyzeCareer = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  
  // Get user profile
  const profile = await Profile.findOne({ user: userId }).populate('user', 'name email subscription');
  
  if (!profile) {
    return next(new ErrorResponse('Profile not found. Please complete your profile first.', 404));
  }

  // Check if user has enough profile data for analysis
  if (profile.completionPercentage < 30) {
    return next(new ErrorResponse('Please complete at least 30% of your profile for career analysis.', 400));
  }

  try {
    // Check subscription limits
    const user = await User.findById(userId);
    if (user.subscription.plan === 'free' && user.analytics.careerAnalysisCount >= 3) {
      return next(new ErrorResponse('Free users are limited to 3 career analyses. Please upgrade to premium.', 403));
    }

    // Analyze career using AI service
    const analysisResult = await careerAnalyzer.analyzeProfile(profile);
    
    // Update user analytics
    await user.updateAnalytics('careerAnalysisCount');
    await profile.updateAnalytics('profileViews');
    
    // Update AI insights in profile
    profile.aiInsights = {
      careerStage: analysisResult.careerStage,
      strengthAreas: analysisResult.strengthAreas,
      improvementAreas: analysisResult.improvementAreas,
      recommendedSkills: analysisResult.recommendedSkills,
      careerPathSuggestions: analysisResult.careerPathSuggestions,
      lastAnalyzed: new Date()
    };
    
    await profile.save();

    logger.info(`Career analysis completed for user ${userId}`, {
      userId,
      confidenceScore: analysisResult.confidenceScore,
      primaryPath: analysisResult.primaryPath?.title
    });

    res.status(200).json({
      success: true,
      message: 'Career analysis completed successfully',
      data: {
        careerPath: analysisResult.primaryPath,
        alternativePaths: analysisResult.alternativePaths,
        progressionSteps: analysisResult.progressionSteps,
        recommendations: analysisResult.recommendations,
        confidenceScore: analysisResult.confidenceScore,
        analysis: analysisResult.analysis,
        nextSteps: analysisResult.nextSteps,
        aiInsights: profile.aiInsights
      }
    });

  } catch (error) {
    logger.error('Career analysis error:', error);
    return next(new ErrorResponse('Failed to analyze career path. Please try again.', 500));
  }
});

// @desc    Get career recommendations
// @route   GET /api/careers/recommendations
// @access  Private
const getCareerRecommendations = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { type = 'all', limit = 10 } = req.query;
  
  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  try {
    let recommendations = {};

    if (type === 'all' || type === 'jobs') {
      recommendations.jobs = await jobRecommender.getJobRecommendations(profile, parseInt(limit));
    }

    if (type === 'all' || type === 'skills') {
      recommendations.skills = await skillMatcher.getSkillRecommendations(profile, parseInt(limit));
    }

    if (type === 'all' || type === 'courses') {
      recommendations.courses = await careerAnalyzer.getCourseRecommendations(profile, parseInt(limit));
    }

    if (type === 'all' || type === 'salary') {
      recommendations.salary = await salaryPredictor.predictSalary(profile);
    }

    if (type === 'all' || type === 'networking') {
      recommendations.networking = await careerAnalyzer.getNetworkingRecommendations(profile);
    }

    // Update analytics
    await profile.updateAnalytics('recommendationsViewed');

    res.status(200).json({
      success: true,
      data: recommendations
    });

  } catch (error) {
    logger.error('Recommendations error:', error);
    return next(new ErrorResponse('Failed to get recommendations', 500));
  }
});

// @desc    Get career paths by industry
// @route   GET /api/careers/paths/:industry
// @access  Public
const getCareerPathsByIndustry = asyncHandler(async (req, res, next) => {
  const { industry } = req.params;
  const { experienceLevel, skills, location } = req.query;

  try {
    const careerPaths = await careerAnalyzer.getCareerPathsByIndustry(industry, {
      experienceLevel,
      skills: skills ? skills.split(',') : undefined,
      location
    });

    res.status(200).json({
      success: true,
      data: {
        industry,
        totalPaths: careerPaths.length,
        paths: careerPaths
      }
    });

  } catch (error) {
    logger.error('Career paths error:', error);
    return next(new ErrorResponse('Failed to get career paths', 500));
  }
});

// @desc    Get skill gap analysis
// @route   POST /api/careers/skill-gap
// @access  Private
const getSkillGapAnalysis = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { targetRole, targetIndustry, targetLevel } = req.body;

  if (!targetRole) {
    return next(new ErrorResponse('Target role is required', 400));
  }

  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  try {
    const skillGapAnalysis = await skillMatcher.analyzeSkillGap(
      profile,
      targetRole,
      targetIndustry,
      targetLevel
    );

    // Update analytics
    await profile.updateAnalytics('skillGapAnalysisCount');

    res.status(200).json({
      success: true,
      data: {
        targetRole,
        targetIndustry,
        targetLevel,
        ...skillGapAnalysis
      }
    });

  } catch (error) {
    logger.error('Skill gap analysis error:', error);
    return next(new ErrorResponse('Failed to analyze skill gap', 500));
  }
});

// @desc    Get market trends
// @route   GET /api/careers/trends
// @access  Public
const getMarketTrends = asyncHandler(async (req, res, next) => {
  const { industry, role, location, timeframe = '12months' } = req.query;

  try {
    const trends = await careerAnalyzer.getMarketTrends({
      industry,
      role,
      location,
      timeframe
    });

    res.status(200).json({
      success: true,
      data: {
        timeframe,
        location,
        industry,
        role,
        trends
      }
    });

  } catch (error) {
    logger.error('Market trends error:', error);
    return next(new ErrorResponse('Failed to get market trends', 500));
  }
});

// @desc    Get salary insights
// @route   POST /api/careers/salary-insights
// @access  Private
const getSalaryInsights = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { role, location, experienceLevel, skills, companySize } = req.body;

  try {
    const profile = await Profile.findOne({ user: userId });
    
    const salaryInsights = await salaryPredictor.getSalaryInsights({
      role,
      location,
      experienceLevel,
      skills,
      companySize,
      currentProfile: profile
    });

    // Update analytics
    if (profile) {
      await profile.updateAnalytics('salaryInsightsViewed');
    }

    res.status(200).json({
      success: true,
      data: salaryInsights
    });

  } catch (error) {
    logger.error('Salary insights error:', error);
    return next(new ErrorResponse('Failed to get salary insights', 500));
  }
});

// @desc    Get learning path
// @route   POST /api/careers/learning-path
// @access  Private
const getLearningPath = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { targetRole, timeframe = '6months', learningStyle = 'mixed', budget = 'free' } = req.body;

  if (!targetRole) {
    return next(new ErrorResponse('Target role is required', 400));
  }

  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  try {
    const learningPath = await careerAnalyzer.generateLearningPath(profile, {
      targetRole,
      timeframe,
      learningStyle,
      budget
    });

    // Update analytics
    await profile.updateAnalytics('learningPathsGenerated');

    res.status(200).json({
      success: true,
      data: learningPath
    });

  } catch (error) {
    logger.error('Learning path error:', error);
    return next(new ErrorResponse('Failed to generate learning path', 500));
  }
});

// @desc    Save career goal
// @route   POST /api/careers/goals
// @access  Private
const saveCareerGoal = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { shortTerm, longTerm, targetRoles, targetIndustries, salaryExpectation, workType } = req.body;

  try {
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          'careerGoals.shortTerm': shortTerm,
          'careerGoals.longTerm': longTerm,
          'careerGoals.targetRoles': targetRoles,
          'careerGoals.targetIndustries': targetIndustries,
          'careerGoals.salaryExpectation': salaryExpectation,
          'careerGoals.workType': workType,
          lastUpdated: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return next(new ErrorResponse('Profile not found', 404));
    }

    logger.info(`Career goals updated for user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Career goals saved successfully',
      data: profile.careerGoals
    });

  } catch (error) {
    logger.error('Save career goal error:', error);
    return next(new ErrorResponse('Failed to save career goals', 500));
  }
});

// @desc    Get career comparison
// @route   POST /api/careers/compare
// @access  Private
const compareCareerPaths = asyncHandler(async (req, res, next) => {
  const { paths, criteria = ['salary', 'growth', 'demand', 'satisfaction'] } = req.body;

  if (!paths || !Array.isArray(paths) || paths.length < 2) {
    return next(new ErrorResponse('At least 2 career paths required for comparison', 400));
  }

  if (paths.length > 5) {
    return next(new ErrorResponse('Maximum 5 career paths can be compared at once', 400));
  }

  try {
    const comparison = await careerAnalyzer.compareCareerPaths(paths, criteria);

    res.status(200).json({
      success: true,
      data: {
        comparedPaths: paths,
        criteria,
        comparison
      }
    });

  } catch (error) {
    logger.error('Career comparison error:', error);
    return next(new ErrorResponse('Failed to compare career paths', 500));
  }
});

// @desc    Get skill assessment
// @route   POST /api/careers/skill-assessment
// @access  Private
const getSkillAssessment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return next(new ErrorResponse('Skills array is required', 400));
  }

  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  try {
    const assessment = await skillMatcher.assessSkills(profile, skills);

    // Update analytics
    await profile.updateAnalytics('skillAssessmentsCompleted');
    await User.findByIdAndUpdate(userId, {
      $inc: { 'analytics.skillsAssessed': skills.length }
    });

    res.status(200).json({
      success: true,
      data: assessment
    });

  } catch (error) {
    logger.error('Skill assessment error:', error);
    return next(new ErrorResponse('Failed to assess skills', 500));
  }
});

// @desc    Get industry insights
// @route   GET /api/careers/industry-insights/:industry
// @access  Public
const getIndustryInsights = asyncHandler(async (req, res, next) => {
  const { industry } = req.params;
  const { region = 'global' } = req.query;

  try {
    const insights = await careerAnalyzer.getIndustryInsights(industry, region);

    res.status(200).json({
      success: true,
      data: {
        industry,
        region,
        insights
      }
    });

  } catch (error) {
    logger.error('Industry insights error:', error);
    return next(new ErrorResponse('Failed to get industry insights', 500));
  }
});

// @desc    Get career roadmap
// @route   POST /api/careers/roadmap
// @access  Private
const getCareerRoadmap = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { targetRole, timeline = '5years' } = req.body;

  if (!targetRole) {
    return next(new ErrorResponse('Target role is required', 400));
  }

  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  try {
    const roadmap = await careerAnalyzer.generateCareerRoadmap(profile, {
      targetRole,
      timeline
    });

    // Update analytics
    await profile.updateAnalytics('roadmapsGenerated');

    res.status(200).json({
      success: true,
      data: roadmap
    });

  } catch (error) {
    logger.error('Career roadmap error:', error);
    return next(new ErrorResponse('Failed to generate career roadmap', 500));
  }
});

module.exports = {
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
};