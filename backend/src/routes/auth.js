const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');

// Register route
router.post('/register', register);

// Login route  
router.post('/login', login);

// Get current user route
router.get('/me', getMe);

// Test route
router.get('/', (req, res) => {
  res.json({ 
    message: 'Auth routes working!',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me'
    }
  });
});

module.exports = router;
