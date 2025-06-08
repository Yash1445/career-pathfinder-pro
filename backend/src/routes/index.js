const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SkillSync API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'SkillSync API',
    version: '1.0.0',
    description: 'AI-Powered Career Path Recommender API',
    endpoints: {
      authentication: '/api/auth',
      health: '/api/health'
    }
  });
});

// Mount auth routes
router.use('/auth', authRoutes);

module.exports = router;
