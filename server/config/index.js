require('dotenv').config();

module.exports = {
  // Server
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database - Set MONGODB_URI in .env file (required for production)
  // Falls back to localhost for development only
  mongodbUri: process.env.MONGODB_URI || (process.env.NODE_ENV === 'production'
    ? 'mongodb+srv://doctor_management:Tejas@mycluster.qetrmfc.mongodb.net/growthvalley'  // Will throw error in production if not set
    : 'mongodb://localhost:27017/growthvalley'),

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Admin
  adminEmail: process.env.ADMIN_EMAIL || 'admin@growthvalley.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!',

  // Email/SMTP Configuration - Uses environment variables
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || 'abhishekgangurde046@gmail.com',
    pass: process.env.SMTP_PASS || 'yehx pbja nawo qpye',
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'abhishekgangurde046@gmail.com'
  },

  // Password Reset
  resetPasswordUrl: process.env.RESET_PASSWORD_URL || 'http://localhost:3000/admin/reset-password',
  resetTokenExpires: parseInt(process.env.RESET_TOKEN_EXPIRES, 10) || 3600000,

  // Upload
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',')
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    contactMax: parseInt(process.env.CONTACT_RATE_LIMIT_MAX, 10) || 5
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dzdhygptt',
    apiKey: process.env.CLOUDINARY_API_KEY || '135615561516453',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'CvNoNy1VzRTaGmjKmWj_2iWCUj8'
  }
};