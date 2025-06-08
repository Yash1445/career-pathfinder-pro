const Joi = require('joi');

// Error response class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new ErrorResponse(errorMessage, 400));
    }
    next();
  };
};

// Registration validation schema
const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),
  
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    }),
  
  experienceLevel: Joi.string()
    .valid('entry', 'mid', 'senior', 'lead', 'executive')
    .optional(),
  
  termsAccepted: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept the terms and conditions',
      'any.required': 'Terms acceptance is required'
    }),
  
  privacyAccepted: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept the privacy policy',
      'any.required': 'Privacy policy acceptance is required'
    })
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    }),
  
  rememberMe: Joi.boolean().optional()
});

// Password update validation schema
const passwordUpdateSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  
  newPassword: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
    .required()
    .messages({
      'string.min': 'New password must be at least 6 characters',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'New password is required'
    }),
  
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Password confirmation does not match',
      'any.required': 'Password confirmation is required'
    })
});

// Profile validation schema
const profileSchema = Joi.object({
  headline: Joi.string()
    .max(120)
    .optional(),
  
  summary: Joi.string()
    .max(2000)
    .optional(),
  
  experienceLevel: Joi.string()
    .valid('entry', 'mid', 'senior', 'lead', 'executive')
    .required(),
  
  location: Joi.object({
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    timezone: Joi.string().optional()
  }).optional(),
  
  skills: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
      category: Joi.string().valid('technical', 'soft', 'language', 'tool', 'framework', 'database', 'cloud', 'other').optional(),
      yearsOfExperience: Joi.number().min(0).max(50).optional()
    })
  ).optional(),
  
  careerGoals: Joi.object({
    shortTerm: Joi.string().max(500).optional(),
    longTerm: Joi.string().max(500).optional(),
    targetRoles: Joi.array().items(Joi.string()).optional(),
    targetIndustries: Joi.array().items(Joi.string()).optional()
  }).optional()
});

// Experience validation schema
const experienceSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({
      'any.required': 'Job title is required'
    }),
  
  company: Joi.string()
    .required()
    .messages({
      'any.required': 'Company name is required'
    }),
  
  startDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Start date is required'
    }),
  
  endDate: Joi.date()
    .optional()
    .greater(Joi.ref('startDate'))
    .messages({
      'date.greater': 'End date must be after start date'
    }),
  
  isCurrent: Joi.boolean().optional(),
  
  location: Joi.object({
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    remote: Joi.boolean().optional()
  }).optional(),
  
  description: Joi.string()
    .max(2000)
    .optional(),
  
  skills: Joi.array().items(Joi.string()).optional(),
  
  employmentType: Joi.string()
    .valid('full-time', 'part-time', 'contract', 'freelance', 'internship')
    .optional()
});

// Education validation schema
const educationSchema = Joi.object({
  institution: Joi.string()
    .required()
    .messages({
      'any.required': 'Institution name is required'
    }),
  
  degree: Joi.string()
    .required()
    .messages({
      'any.required': 'Degree is required'
    }),
  
  fieldOfStudy: Joi.string()
    .required()
    .messages({
      'any.required': 'Field of study is required'
    }),
  
  startDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Start date is required'
    }),
  
  endDate: Joi.date()
    .optional()
    .greater(Joi.ref('startDate'))
    .messages({
      'date.greater': 'End date must be after start date'
    }),
  
  isCurrent: Joi.boolean().optional(),
  
  grade: Joi.string().optional(),
  
  description: Joi.string()
    .max(1000)
    .optional()
});

// Project validation schema
const projectSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Project name is required'
    }),
  
  description: Joi.string()
    .max(1000)
    .required()
    .messages({
      'any.required': 'Project description is required',
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  
  technologies: Joi.array().items(Joi.string()).optional(),
  
  skills: Joi.array().items(Joi.string()).optional(),
  
  url: Joi.string().uri().optional(),
  
  githubUrl: Joi.string().uri().optional(),
  
  startDate: Joi.date().optional(),
  
  endDate: Joi.date()
    .optional()
    .greater(Joi.ref('startDate'))
    .messages({
      'date.greater': 'End date must be after start date'
    })
});

// Career goal validation schema
const careerGoalSchema = Joi.object({
  shortTerm: Joi.string()
    .max(500)
    .optional(),
  
  longTerm: Joi.string()
    .max(500)
    .optional(),
  
  targetRoles: Joi.array().items(Joi.string()).optional(),
  
  targetIndustries: Joi.array().items(Joi.string()).optional(),
  
  salaryExpectation: Joi.object({
    min: Joi.number().min(0).optional(),
    max: Joi.number().min(0).optional(),
    currency: Joi.string().optional(),
    frequency: Joi.string().valid('hourly', 'monthly', 'yearly').optional()
  }).optional(),
  
  workType: Joi.string()
    .valid('remote', 'onsite', 'hybrid', 'flexible')
    .optional()
});

// Skill gap analysis validation schema
const skillGapSchema = Joi.object({
  targetRole: Joi.string()
    .required()
    .messages({
      'any.required': 'Target role is required'
    }),
  
  targetIndustry: Joi.string().optional(),
  
  targetLevel: Joi.string()
    .valid('entry', 'mid', 'senior', 'lead', 'executive')
    .optional()
});

// Learning path validation schema
const learningPathSchema = Joi.object({
  targetRole: Joi.string()
    .required()
    .messages({
      'any.required': 'Target role is required'
    }),
  
  timeframe: Joi.string()
    .valid('3months', '6months', '12months', '18months')
    .optional(),
  
  learningStyle: Joi.string()
    .valid('visual', 'auditory', 'reading', 'kinesthetic', 'mixed')
    .optional(),
  
  budget: Joi.string()
    .valid('free', 'budget', 'premium')
    .optional()
});

// Salary insights validation schema
const salaryInsightsSchema = Joi.object({
  role: Joi.string()
    .required()
    .messages({
      'any.required': 'Role is required'
    }),
  
  location: Joi.string().optional(),
  
  experienceLevel: Joi.string()
    .valid('entry', 'mid', 'senior', 'lead', 'executive')
    .optional(),
  
  skills: Joi.array().items(Joi.string()).optional(),
  
  companySize: Joi.string()
    .valid('startup', 'small', 'medium', 'large', 'enterprise')
    .optional()
});

// File upload validation
const fileUploadSchema = Joi.object({
  fileType: Joi.string()
    .valid('resume', 'avatar', 'portfolio')
    .required(),
  
  fileName: Joi.string()
    .required(),
  
  fileSize: Joi.number()
    .max(10485760) // 10MB
    .required()
    .messages({
      'number.max': 'File size cannot exceed 10MB'
    })
});

// Contact/feedback validation schema
const contactSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  subject: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Subject must be at least 5 characters',
      'string.max': 'Subject cannot exceed 200 characters',
      'any.required': 'Subject is required'
    }),
  
  message: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Message must be at least 10 characters',
      'string.max': 'Message cannot exceed 2000 characters',
      'any.required': 'Message is required'
    }),
  
  category: Joi.string()
    .valid('general', 'technical', 'billing', 'feature-request', 'bug-report')
    .optional()
});

// Preferences validation schema
const preferencesSchema = Joi.object({
  notifications: Joi.object({
    email: Joi.boolean().optional(),
    push: Joi.boolean().optional(),
    sms: Joi.boolean().optional(),
    jobAlerts: Joi.boolean().optional(),
    learningReminders: Joi.boolean().optional()
  }).optional(),
  
  privacy: Joi.object({
    profileVisibility: Joi.string()
      .valid('public', 'private', 'connections')
      .optional(),
    dataSharing: Joi.boolean().optional(),
    showSalaryInfo: Joi.boolean().optional()
  }).optional(),
  
  theme: Joi.string()
    .valid('light', 'dark', 'auto')
    .optional(),
  
  language: Joi.string()
    .min(2)
    .max(5)
    .optional()
});

// Query parameter validation schemas
const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10),
  
  sortBy: Joi.string().optional(),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .optional()
    .default('desc')
});

const searchSchema = Joi.object({
  query: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Search query must be at least 2 characters',
      'string.max': 'Search query cannot exceed 100 characters',
      'any.required': 'Search query is required'
    }),
  
  filters: Joi.object({
    experienceLevel: Joi.array().items(
      Joi.string().valid('entry', 'mid', 'senior', 'lead', 'executive')
    ).optional(),
    
    location: Joi.string().optional(),
    
    skills: Joi.array().items(Joi.string()).optional(),
    
    industry: Joi.array().items(Joi.string()).optional(),
    
    jobType: Joi.array().items(
      Joi.string().valid('full-time', 'part-time', 'contract', 'freelance', 'internship')
    ).optional(),
    
    remote: Joi.boolean().optional(),
    
    salaryRange: Joi.object({
      min: Joi.number().min(0).optional(),
      max: Joi.number().min(0).optional()
    }).optional()
  }).optional()
});

// Validation middleware functions
const validateRegister = validate(registerSchema);
const validateLogin = validate(loginSchema);
const validatePasswordUpdate = validate(passwordUpdateSchema);
const validateProfile = validate(profileSchema);
const validateExperience = validate(experienceSchema);
const validateEducation = validate(educationSchema);
const validateProject = validate(projectSchema);
const validateCareerGoal = validate(careerGoalSchema);
const validateSkillGap = validate(skillGapSchema);
const validateLearningPath = validate(learningPathSchema);
const validateSalaryInsights = validate(salaryInsightsSchema);
const validateFileUpload = validate(fileUploadSchema);
const validateContact = validate(contactSchema);
const validatePreferences = validate(preferencesSchema);

// Query validation middleware
const validatePagination = (req, res, next) => {
  const { error, value } = paginationSchema.validate(req.query);
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new ErrorResponse(errorMessage, 400));
  }
  req.query = { ...req.query, ...value };
  next();
};

const validateSearch = (req, res, next) => {
  const { error } = searchSchema.validate(req.query);
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new ErrorResponse(errorMessage, 400));
  }
  next();
};

// Custom validation functions
const validateObjectId = (req, res, next) => {
  const mongoose = require('mongoose');
  const { id, userId } = req.params;
  
  const idToValidate = id || userId;
  
  if (idToValidate && !mongoose.Types.ObjectId.isValid(idToValidate)) {
    return next(new ErrorResponse('Invalid ID format', 400));
  }
  
  next();
};

const validateDateRange = (startField = 'startDate', endField = 'endDate') => {
  return (req, res, next) => {
    const startDate = req.body[startField];
    const endDate = req.body[endField];
    
    if (startDate && endDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        return next(new ErrorResponse(`${endField} must be after ${startField}`, 400));
      }
    }
    
    next();
  };
};

const validateFileType = (allowedTypes = []) => {
  return (req, res, next) => {
    if (!req.file) {
      return next(new ErrorResponse('No file uploaded', 400));
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(req.file.mimetype)) {
      return next(new ErrorResponse(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`, 400));
    }
    
    next();
  };
};

const validateFileSize = (maxSize = 10485760) => { // Default 10MB
  return (req, res, next) => {
    if (!req.file) {
      return next(new ErrorResponse('No file uploaded', 400));
    }
    
    if (req.file.size > maxSize) {
      return next(new ErrorResponse(`File size too large. Maximum size: ${maxSize / 1048576}MB`, 400));
    }
    
    next();
  };
};

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  req.body = sanitizeObject(req.body);
  next();
};

// Rate limiting validation
const validateRateLimit = (req, res, next) => {
  const rateLimitInfo = req.rateLimit;
  
  if (rateLimitInfo && req.requestCount > rateLimitInfo.limit) {
    return next(new ErrorResponse(`Rate limit exceeded. Maximum ${rateLimitInfo.limit} requests per hour for ${rateLimitInfo.userPlan} plan.`, 429));
  }
  
  next();
};

module.exports = {
  // Schema validators
  validateRegister,
  validateLogin,
  validatePasswordUpdate,
  validateProfile,
  validateExperience,
  validateEducation,
  validateProject,
  validateCareerGoal,
  validateSkillGap,
  validateLearningPath,
  validateSalaryInsights,
  validateFileUpload,
  validateContact,
  validatePreferences,
  
  // Query validators
  validatePagination,
  validateSearch,
  
  // Custom validators
  validateObjectId,
  validateDateRange,
  validateFileType,
  validateFileSize,
  sanitizeInput,
  validateRateLimit,
  
  // Generic validator
  validate,
  
  // Export schemas for testing
  schemas: {
    registerSchema,
    loginSchema,
    passwordUpdateSchema,
    profileSchema,
    experienceSchema,
    educationSchema,
    projectSchema,
    careerGoalSchema,
    skillGapSchema,
    learningPathSchema,
    salaryInsightsSchema,
    contactSchema,
    preferencesSchema,
    paginationSchema,
    searchSchema
  }
};