const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    public_id: String,
    url: String
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Subscription details
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  
  // User preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      jobAlerts: { type: Boolean, default: true },
      learningReminders: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'connections'],
        default: 'private'
      },
      dataSharing: { type: Boolean, default: false },
      showSalaryInfo: { type: Boolean, default: true },
      showLocation: { type: Boolean, default: true }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  
  // Social profiles
  socialProfiles: {
    linkedin: {
      url: String,
      verified: { type: Boolean, default: false }
    },
    github: {
      url: String,
      username: String,
      verified: { type: Boolean, default: false }
    },
    portfolio: String,
    website: String,
    twitter: String,
    stackoverflow: String,
    behance: String,
    dribbble: String
  },
  
  // Analytics and metrics
  analytics: {
    profileViews: { type: Number, default: 0 },
    careerAnalysisCount: { type: Number, default: 0 },
    lastAnalysisDate: Date,
    recommendationsAccepted: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 },
    jobApplications: { type: Number, default: 0 },
    skillsAssessed: { type: Number, default: 0 }
  },
  
  // Security settings
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    lastPasswordChange: { type: Date, default: Date.now },
    securityQuestions: [{
      question: String,
      answer: String // This should be hashed
    }]
  },
  
  // Account status
  status: {
    type: String,
    enum: ['active', 'suspended', 'deactivated', 'pending'],
    default: 'pending'
  },
  
  // Terms and privacy acceptance
  agreements: {
    termsAccepted: { type: Boolean, default: false },
    termsAcceptedDate: Date,
    privacyAccepted: { type: Boolean, default: false },
    privacyAcceptedDate: Date,
    marketingConsent: { type: Boolean, default: false },
    marketingConsentDate: Date
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpire;
      delete ret.verificationToken;
      delete ret.security.twoFactorSecret;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for subscription status
userSchema.virtual('isSubscriptionActive').get(function() {
  return this.subscription.isActive && 
         this.subscription.endDate && 
         this.subscription.endDate > Date.now();
});

// Virtual for profile completion
userSchema.virtual('hasCompleteProfile').get(function() {
  return !!(this.name && this.email && this.isVerified);
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ status: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ role: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(config.SECURITY.BCRYPT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update security settings
userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.security.lastPasswordChange = Date.now();
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to generate JWT
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role,
      plan: this.subscription.plan,
      isVerified: this.isVerified
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

// Instance method to generate refresh token
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id, type: 'refresh' },
    config.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};

// Instance method to generate reset password token
userSchema.methods.generateResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

// Instance method to generate email verification token
userSchema.methods.generateVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  return verificationToken;
};

// Instance method to handle failed login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Instance method to update analytics
userSchema.methods.updateAnalytics = function(field, increment = 1) {
  const update = { $inc: {} };
  update.$inc[`analytics.${field}`] = increment;
  return this.updateOne(update);
};

// Instance method to check permissions
userSchema.methods.hasPermission = function(permission) {
  const permissions = {
    admin: ['all'],
    premium: ['career_analysis', 'advanced_features', 'priority_support'],
    user: ['basic_features']
  };
  
  const userPermissions = permissions[this.role] || permissions.user;
  return userPermissions.includes('all') || userPermissions.includes(permission);
};

// Static method to find by credentials
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid login credentials');
  }
  
  // Check if account is locked
  if (user.isLocked) {
    await user.incLoginAttempts();
    throw new Error('Account temporarily locked due to too many failed login attempts');
  }
  
  // Check if account is suspended
  if (user.status === 'suspended') {
    throw new Error('Account has been suspended. Please contact support.');
  }
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    await user.incLoginAttempts();
    throw new Error('Invalid login credentials');
  }
  
  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }
  
  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  
  return user;
};

// Static method to clean up expired tokens
userSchema.statics.cleanupExpiredTokens = async function() {
  return this.updateMany(
    { 
      $or: [
        { resetPasswordExpire: { $lt: Date.now() } },
        { lockUntil: { $lt: Date.now() } }
      ]
    },
    { 
      $unset: { 
        resetPasswordToken: 1, 
        resetPasswordExpire: 1,
        lockUntil: 1
      } 
    }
  );
};

// Static method to get user statistics
userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        verifiedUsers: {
          $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
        },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        premiumUsers: {
          $sum: { $cond: [{ $eq: ['$subscription.plan', 'premium'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    verifiedUsers: 0,
    activeUsers: 0,
    premiumUsers: 0
  };
};

module.exports = mongoose.model('User', userSchema);