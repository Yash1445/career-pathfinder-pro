const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['technical', 'soft', 'language', 'tool', 'framework', 'database', 'cloud', 'other'],
    default: 'technical'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  endorsements: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    comment: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    dateObtained: Date,
    expiryDate: Date,
    credentialId: String,
    verificationUrl: String
  }]
});

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  companySize: {
    type: String,
    enum: ['startup', 'small', 'medium', 'large', 'enterprise']
  },
  location: {
    city: String,
    state: String,
    country: String,
    remote: { type: Boolean, default: false }
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    default: 'full-time'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null // null means current job
  },
  description: {
    type: String,
    maxlength: 2000
  },
  responsibilities: [String],
  achievements: [String],
  skills: [String],
  technologies: [String],
  industry: String,
  salary: {
    amount: Number,
    currency: { type: String, default: 'USD' },
    frequency: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' }
  }
});

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  fieldOfStudy: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  grade: String,
  activities: [String],
  description: String,
  coursework: [String]
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  technologies: [String],
  role: String,
  startDate: Date,
  endDate: Date,
  url: String,
  githubUrl: String,
  images: [String],
  teamSize: Number,
  keyFeatures: [String],
  challenges: String,
  results: String
});

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Basic Information
  headline: {
    type: String,
    maxlength: 120,
    trim: true
  },
  summary: {
    type: String,
    maxlength: 2000,
    trim: true
  },
  location: {
    city: String,
    state: String,
    country: String,
    timezone: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Career Information
  currentRole: {
    title: String,
    company: String,
    startDate: Date,
    salary: {
      amount: Number,
      currency: { type: String, default: 'USD' },
      frequency: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' }
    }
  },
  
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    required: true
  },
  
  totalExperience: {
    years: { type: Number, default: 0 },
    months: { type: Number, default: 0 }
  },
  
  // Skills and Experience
  skills: [skillSchema],
  experience: [experienceSchema],
  education: [educationSchema],
  projects: [projectSchema],
  
  // Career Preferences
  careerGoals: {
    shortTerm: String, // 1-2 years
    longTerm: String,  // 5+ years
    targetRoles: [String],
    targetIndustries: [String],
    targetCompanies: [String]
  },
  
  jobPreferences: {
    workType: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid', 'flexible'],
      default: 'flexible'
    },
    salaryExpectation: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' },
      frequency: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' }
    },
    willingToRelocate: {
      type: Boolean,
      default: false
    },
    preferredLocations: [String],
    availability: {
      type: String,
      enum: ['immediate', '2weeks', '1month', '3months'],
      default: 'immediate'
    }
  },
  
  // Learning & Development
  learningGoals: [String],
  completedCourses: [{
    name: String,
    provider: String,
    completionDate: Date,
    certificateUrl: String,
    skills: [String]
  }],
  
  // Social and Professional Links
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
    website: String,
    twitter: String,
    stackoverflow: String,
    behance: String,
    dribbble: String
  },
  
  // Profile Analytics
  analytics: {
    profileViews: { type: Number, default: 0 },
    searchAppearances: { type: Number, default: 0 },
    contactRequests: { type: Number, default: 0 },
    profileCompleteness: { type: Number, default: 0 }
  },
  
  // Resume/CV
  resume: {
    filename: String,
    url: String,
    uploadDate: { type: Date, default: Date.now },
    parsed: {
      text: String,
      sections: mongoose.Schema.Types.Mixed
    }
  },
  
  // Visibility and Privacy
  visibility: {
    type: String,
    enum: ['public', 'private', 'connections'],
    default: 'private'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
profileSchema.index({ user: 1 });
profileSchema.index({ 'skills.name': 1 });
profileSchema.index({ experienceLevel: 1 });
profileSchema.index({ 'currentRole.title': 1 });
profileSchema.index({ 'location.city': 1, 'location.country': 1 });
profileSchema.index({ createdAt: -1 });

// Virtual for total years of experience
profileSchema.virtual('totalExperienceYears').get(function() {
  const totalMonths = this.totalExperience.years * 12 + this.totalExperience.months;
  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
});

// Virtual for profile completion percentage
profileSchema.virtual('completionPercentage').get(function() {
  let score = 0;
  const maxScore = 100;
  
  // Basic info (20 points)
  if (this.headline) score += 5;
  if (this.summary) score += 10;
  if (this.location && this.location.city) score += 5;
  
  // Experience (30 points)
  if (this.experience && this.experience.length > 0) score += 15;
  if (this.currentRole && this.currentRole.title) score += 10;
  if (this.experienceLevel) score += 5;
  
  // Skills (20 points)
  if (this.skills && this.skills.length >= 5) score += 15;
  if (this.skills && this.skills.length >= 10) score += 5;
  
  // Education (15 points)
  if (this.education && this.education.length > 0) score += 15;
  
  // Additional (15 points)
  if (this.projects && this.projects.length > 0) score += 5;
  if (this.careerGoals && this.careerGoals.shortTerm) score += 5;
  if (this.socialLinks && (this.socialLinks.linkedin || this.socialLinks.github)) score += 5;
  
  return Math.min(score, maxScore);
});

// Pre-save middleware to update profile completeness
profileSchema.pre('save', function(next) {
  this.analytics.profileCompleteness = this.completionPercentage;
  this.lastUpdated = new Date();
  next();
});

// Method to calculate total experience
profileSchema.methods.calculateTotalExperience = function() {
  let totalMonths = 0;
  
  this.experience.forEach(exp => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
    
    const diffTime = Math.abs(endDate - startDate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average month length
    
    totalMonths += diffMonths;
  });
  
  this.totalExperience.years = Math.floor(totalMonths / 12);
  this.totalExperience.months = totalMonths % 12;
  
  return this.totalExperience;
};

// Method to get skills by category
profileSchema.methods.getSkillsByCategory = function(category) {
  return this.skills.filter(skill => skill.category === category);
};

// Method to get current position
profileSchema.methods.getCurrentPosition = function() {
  return this.experience
    .filter(exp => !exp.endDate)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
};

// Static method to find profiles by skill
profileSchema.statics.findBySkill = function(skillName, level = null) {
  const query = { 'skills.name': new RegExp(skillName, 'i') };
  if (level) {
    query['skills.level'] = level;
  }
  return this.find(query);
};

module.exports = mongoose.model('Profile', profileSchema);