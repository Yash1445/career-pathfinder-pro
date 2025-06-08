const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const logger = require('../utils/logger');

// Error response class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Protect routes - check if user is authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } 
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Access denied. No token provided.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new ErrorResponse('No user found with this token', 401));
    }

    // Check if user account is active
    if (user.status !== 'active' && user.status !== 'pending') {
      return next(new ErrorResponse('User account is not active', 401));
    }

    // Check if user is locked
    if (user.isLocked) {
      return next(new ErrorResponse('User account is temporarily locked', 401));
    }

    // Check if email verification is required and user is not verified
    if (config.FEATURES.EMAIL_VERIFICATION && !user.isVerified && user.status === 'pending') {
      return next(new ErrorResponse('Please verify your email to access this resource', 401));
    }

    // Add user to request object
    req.user = user;
    
    // Log API access
    logger.logAPI(req.originalUrl, req.method, null, null, user._id);
    
    next();
  } catch (error) {
    logger.logSecurity('invalid_token_attempt', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      token: token.substring(0, 10) + '...',
      error: error.message
    });

    if (error.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token expired', 401));
    } else {
      return next(new ErrorResponse('Token verification failed', 401));
    }
  }
});

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Access denied. No user found.', 401));
    }

    if (!roles.includes(req.user.role)) {
      logger.logSecurity('unauthorized_access_attempt', {
        userId: req.user._id,
        userRole: req.user.role,
        requiredRoles: roles,
        ip: req.ip,
        endpoint: req.originalUrl
      });

      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
    }

    next();
  };
};

// Check subscription permissions
const checkSubscription = (requiredPlan = 'premium') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Access denied. No user found.', 401));
    }

    const user = req.user;
    const userPlan = user.subscription.plan;

    // Admin always has access
    if (user.role === 'admin') {
      return next();
    }

    // Check if user has required subscription
    const planHierarchy = ['free', 'premium', 'enterprise'];
    const userPlanIndex = planHierarchy.indexOf(userPlan);
    const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);

    if (userPlanIndex < requiredPlanIndex) {
      return next(new ErrorResponse(`This feature requires a ${requiredPlan} subscription`, 403));
    }

    // Check if subscription is active
    if (!user.isSubscriptionActive && userPlan !== 'free') {
      return next(new ErrorResponse('Your subscription has expired. Please renew to access this feature.', 403));
    }

    next();
  };
};

// Check specific permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Access denied. No user found.', 401));
    }

    if (!req.user.hasPermission(permission)) {
      logger.logSecurity('permission_denied', {
        userId: req.user._id,
        permission,
        userRole: req.user.role,
        ip: req.ip,
        endpoint: req.originalUrl
      });

      return next(new ErrorResponse('You do not have permission to access this resource', 403));
    }

    next();
  };
};

// Optional authentication - adds user to request if token is valid, but doesn't fail if no token
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token, continue without user
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (user && user.status === 'active') {
      req.user = user;
    }
  } catch (error) {
    // Log but don't fail - optional auth
    logger.warn('Optional auth token verification failed:', error.message);
  }

  next();
});

// Rate limiting based on user tier
const tierBasedRateLimit = (freeLimit = 10, premiumLimit = 50, enterpriseLimit = 200) => {
  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userPlan = req.user.subscription.plan;
    let limit;

    switch (userPlan) {
      case 'enterprise':
        limit = enterpriseLimit;
        break;
      case 'premium':
        limit = premiumLimit;
        break;
      default:
        limit = freeLimit;
    }

    // Store limit info for other middleware
    req.rateLimit = {
      limit,
      userPlan
    };

    next();
  };
};

// Check if user owns resource
const checkOwnership = (resourceField = 'user') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Access denied. No user found.', 401));
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Get resource ID from params or body
    const resourceId = req.params.id || req.params.userId || req.body.id;
    
    if (!resourceId) {
      return next(new ErrorResponse('Resource ID is required', 400));
    }

    // Check if user owns the resource
    if (resourceField === 'user' && resourceId !== req.user._id.toString()) {
      return next(new ErrorResponse('Access denied. You can only access your own resources.', 403));
    }

    next();
  });
};

// Middleware to check if user account is complete
const requireCompleteProfile = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Access denied. No user found.', 401));
  }

  // Check if user has a profile
  const Profile = require('../models/Profile');
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    return next(new ErrorResponse('Please complete your profile to access this feature', 400));
  }

  if (profile.completionPercentage < 50) {
    return next(new ErrorResponse('Please complete at least 50% of your profile to access this feature', 400));
  }

  req.profile = profile;
  next();
});

// Middleware to log user activity
const logActivity = (activity) => {
  return (req, res, next) => {
    if (req.user) {
      logger.info(`User activity: ${activity}`, {
        userId: req.user._id,
        email: req.user.email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
        method: req.method
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
  checkSubscription,
  checkPermission,
  optionalAuth,
  tierBasedRateLimit,
  checkOwnership,
  requireCompleteProfile,
  logActivity
};