const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define format for file logs (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    format: format
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    level: 'info',
    format: fileFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 5,
    tailable: true
  }),
  
  // File transport for error logs
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 5,
    tailable: true
  })
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.File({
    filename: path.join(logsDir, 'exceptions.log'),
    format: fileFormat
  })
);

logger.rejections.handle(
  new winston.transports.File({
    filename: path.join(logsDir, 'rejections.log'),
    format: fileFormat
  })
);

// Export custom logging methods
module.exports = {
  ...logger,
  
  // Custom methods for structured logging
  logRequest: (req, res, responseTime) => {
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTime}ms - ${req.ip}`);
  },
  
  logError: (error, req = null) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      url: req?.originalUrl,
      method: req?.method,
      ip: req?.ip,
      userAgent: req?.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    logger.error('Application Error', errorInfo);
  },
  
  logAuth: (action, userId, ip, details = {}) => {
    logger.info(`Auth: ${action}`, {
      userId,
      ip,
      timestamp: new Date().toISOString(),
      ...details
    });
  },
  
  logDatabase: (operation, collection, duration, details = {}) => {
    logger.debug(`DB: ${operation} on ${collection} - ${duration}ms`, details);
  },
  
  logAPI: (endpoint, method, statusCode, duration, userId = null) => {
    logger.info(`API: ${method} ${endpoint} - ${statusCode} - ${duration}ms`, {
      userId,
      timestamp: new Date().toISOString()
    });
  },
  
  logSecurity: (event, details = {}) => {
    logger.warn(`Security: ${event}`, {
      timestamp: new Date().toISOString(),
      ...details
    });
  }
};