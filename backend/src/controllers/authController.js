const User = require('../models/User');
const Profile = require('../models/Profile');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');
const sendEmail = require('../services/emailService');

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

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, experienceLevel, termsAccepted, privacyAccepted } = req.body;

  // Validation
  if (!name || !email || !password) {
    return next(new ErrorResponse('Please provide name, email and password', 400));
  }

  if (!termsAccepted || !privacyAccepted) {
    return next(new ErrorResponse('Please accept terms and privacy policy', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  try {
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      agreements: {
        termsAccepted: true,
        termsAcceptedDate: new Date(),
        privacyAccepted: true,
        privacyAcceptedDate: new Date()
      }
    });

    // Create basic profile
    const profile = await Profile.create({
      user: user._id,
      experienceLevel: experienceLevel || 'entry'
    });

    // Generate verification token
    const verificationToken = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
      
      await sendEmail({
        email: user.email,
        subject: 'Welcome to SkillSync - Verify Your Account',
        template: 'welcome',
        data: {
          name: user.name,
          verifyUrl
        }
      });

      logger.logAuth('user_registered', user._id, req.ip, { email: user.email });
    } catch (err) {
      logger.error('Email sending failed:', err);
      // Don't fail registration if email fails
    }

    sendTokenResponse(user, 201, res, 'Registration successful! Please check your email to verify your account.');
  } catch (error) {
    logger.error('Registration error:', error);
    return next(new ErrorResponse('Registration failed', 500));
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password, rememberMe } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    // Check for user and include password in select
    const user = await User.findByCredentials(email, password);

    // Check if user is verified (optional, based on business logic)
    if (!user.isVerified && config.FEATURES.EMAIL_VERIFICATION) {
      return next(new ErrorResponse('Please verify your email before logging in', 401));
    }

    // Log successful login
    logger.logAuth('user_login', user._id, req.ip, { 
      email: user.email,
      rememberMe: !!rememberMe 
    });

    // Update user analytics
    await user.updateAnalytics('loginCount');

    sendTokenResponse(user, 200, res, 'Login successful', rememberMe);
  } catch (error) {
    logger.logSecurity('failed_login_attempt', {
      email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      error: error.message
    });
    
    return next(new ErrorResponse(error.message, 401));
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
  // Log logout
  logger.logAuth('user_logout', req.user.id, req.ip);

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new ErrorResponse('Please provide current password, new password, and confirmation', 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorResponse('New passwords do not match', 400));
  }

  if (newPassword.length < 6) {
    return next(new ErrorResponse('New password must be at least 6 characters', 400));
  }

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  logger.logAuth('password_updated', user._id, req.ip);

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide an email', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${config.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'SkillSync Password Reset',
      template: 'resetPassword',
      data: {
        name: user.name,
        resetUrl,
        resetToken
      }
    });

    logger.logAuth('password_reset_requested', user._id, req.ip);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (err) {
    logger.error('Password reset email failed:', err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new ErrorResponse('Please provide password and confirmation', 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorResponse('Passwords do not match', 400));
  }

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  logger.logAuth('password_reset_completed', user._id, req.ip);

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const verificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    verificationToken
  });

  if (!user) {
    return next(new ErrorResponse('Invalid verification token', 400));
  }

  // Update user verification status
  user.isVerified = true;
  user.verificationToken = undefined;
  user.status = 'active';
  await user.save();

  logger.logAuth('email_verified', user._id, req.ip);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide an email', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (user.isVerified) {
    return next(new ErrorResponse('Email already verified', 400));
  }

  // Generate new verification token
  const verificationToken = user.generateVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
    
    await sendEmail({
      email: user.email,
      subject: 'SkillSync - Verify Your Account',
      template: 'verification',
      data: {
        name: user.name,
        verifyUrl
      }
    });

    logger.logAuth('verification_email_resent', user._id, req.ip);

    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (err) {
    logger.error('Verification email failed:', err);
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ErrorResponse('Refresh token required', 401));
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('Invalid refresh token', 401));
    }

    if (user.status !== 'active') {
      return next(new ErrorResponse('Account is not active', 401));
    }

    logger.logAuth('token_refreshed', user._id, req.ip);

    sendTokenResponse(user, 200, res, 'Token refreshed');
  } catch (error) {
    logger.logSecurity('invalid_refresh_token', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      error: error.message
    });
    
    return next(new ErrorResponse('Invalid refresh token', 401));
  }
});

// @desc    Get user preferences
// @route   GET /api/auth/preferences
// @access  Private
const getPreferences = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('preferences');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user.preferences
  });
});

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
const updatePreferences = asyncHandler(async (req, res, next) => {
  const { preferences } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { preferences },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  logger.logAuth('preferences_updated', user._id, req.ip);

  res.status(200).json({
    success: true,
    data: user.preferences,
    message: 'Preferences updated successfully'
  });
});

// @desc    Change user role (Admin only)
// @route   PUT /api/auth/change-role/:userId
// @access  Private (Admin)
const changeUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  const { userId } = req.params;

  if (!['user', 'premium', 'admin'].includes(role)) {
    return next(new ErrorResponse('Invalid role', 400));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  logger.logAuth('role_changed', userId, req.ip, { 
    newRole: role, 
    changedBy: req.user.id 
  });

  res.status(200).json({
    success: true,
    data: user,
    message: `User role changed to ${role}`
  });
});

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res, next) => {
  const { password, confirmation } = req.body;

  if (!password || confirmation !== 'DELETE') {
    return next(new ErrorResponse('Please provide password and type DELETE to confirm', 400));
  }

  const user = await User.findById(req.user.id).select('+password');

  // Verify password
  if (!(await user.comparePassword(password))) {
    return next(new ErrorResponse('Incorrect password', 401));
  }

  // Delete user profile
  await Profile.deleteOne({ user: user._id });

  // Delete user account
  await User.deleteOne({ _id: user._id });

  logger.logAuth('account_deleted', user._id, req.ip);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message, rememberMe = false) => {
  // Create token
  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  const options = {
    expires: new Date(
      Date.now() + (rememberMe ? 30 : config.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        subscription: user.subscription,
        preferences: user.preferences,
        lastLogin: user.lastLogin
      }
    });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'profile',
    select: 'headline experienceLevel location completionPercentage'
  });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  logger.logAuth('user_details_updated', user._id, req.ip);

    res.status(200).json({
      success: true,
      data: user,
      message: 'User details updated successfully'
    });
  });
  
  module.exports = {
    register,
    login,
    logout,
    updatePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    refreshToken,
    getPreferences,
    updatePreferences,
    changeUserRole,
    deleteAccount,
    getMe,
    updateDetails
  };