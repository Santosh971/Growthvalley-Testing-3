const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const config = require('../config');
const { extractPublicId, deleteImage } = require('../config/cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true
});

// Helper to determine folder based on mimetype
const getFolderByMimeType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('video/')) return 'videos';
  if (mimetype.includes('pdf')) return 'documents';
  return 'general';
};

// Storage configuration for Cloudinary
const createCloudinaryStorage = (folder = 'growth-valley/media') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'mp4', 'webm'],
      resource_type: 'auto'
    }
  });
};

// Default storage
const storage = createCloudinaryStorage('growth-valley/media');

// File filter
const fileFilter = (req, file, cb) => {
  // Check allowed file types
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${config.upload.allowedTypes.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize
  }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${config.upload.maxSize / 1024 / 1024}MB`
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};

// Single file upload with custom folder support
const uploadSingle = (fieldName, folder = 'growth-valley/media') => {
  const customStorage = createCloudinaryStorage(folder);
  const customUpload = multer({
    storage: customStorage,
    fileFilter,
    limits: {
      fileSize: config.upload.maxSize
    }
  });
  return [customUpload.single(fieldName), handleUploadError];
};

// Multiple files upload with custom folder support
const uploadMultiple = (fieldName, maxCount = 10, folder = 'growth-valley/media') => {
  const customStorage = createCloudinaryStorage(folder);
  const customUpload = multer({
    storage: customStorage,
    fileFilter,
    limits: {
      fileSize: config.upload.maxSize
    }
  });
  return [customUpload.array(fieldName, maxCount), handleUploadError];
};

// Mixed fields upload with custom folder support
const uploadFields = (fields, folder = 'growth-valley/media') => {
  const customStorage = createCloudinaryStorage(folder);
  const customUpload = multer({
    storage: customStorage,
    fileFilter,
    limits: {
      fileSize: config.upload.maxSize
    }
  });
  return [customUpload.fields(fields), handleUploadError];
};

// Delete file helper (for Cloudinary)
const deleteFile = async (fileUrl) => {
  try {
    if (!fileUrl) return false;

    // Extract public_id from Cloudinary URL
    const publicId = extractPublicId(fileUrl);

    if (!publicId) {
      // Not a Cloudinary URL, might be a local file (backward compatibility)
      console.log('Not a Cloudinary URL, skipping delete:', fileUrl);
      return false;
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok' || result.result === 'not found';
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return false;
  }
};

// Delete file by public_id directly
const deleteByPublicId = async (publicId) => {
  try {
    if (!publicId) return false;

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok' || result.result === 'not found';
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return false;
  }
};

// Get file URL from Cloudinary response
const getFileUrl = (req, file) => {
  // For Cloudinary, the URL is in file.path (returned by multer-storage-cloudinary)
  if (file && file.path) {
    return file.path;
  }
  return null;
};

// Get full file URL (same as getFileUrl for Cloudinary since URLs are already absolute)
const getFullFileUrl = (req, file) => {
  return getFileUrl(req, file);
};

// Get public_id from Cloudinary response
const getPublicId = (file) => {
  // For multer-storage-cloudinary, the public_id is stored in file.filename
  if (file && file.filename) {
    return file.filename;
  }
  return null;
};

// Get storage instance for specific type
const getStorageForType = (type) => {
  const folders = {
    media: 'growth-valley/media',
    blog: 'growth-valley/blogs',
    team: 'growth-valley/team',
    testimonial: 'growth-valley/testimonials',
    caseStudy: 'growth-valley/case-studies',
    client: 'growth-valley/clients',
    icon: 'growth-valley/icons'
  };

  return createCloudinaryStorage(folders[type] || folders.media);
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleUploadError,
  deleteFile,
  deleteByPublicId,
  getFileUrl,
  getFullFileUrl,
  getPublicId,
  extractPublicId,
  getStorageForType,
  cloudinary
};