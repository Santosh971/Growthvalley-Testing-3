const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const config = require('./index');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || config.cloudinary.cloudName,
  api_key: process.env.CLOUDINARY_API_KEY || config.cloudinary.apiKey,
  api_secret: process.env.CLOUDINARY_API_SECRET || config.cloudinary.apiSecret,
  secure: true
});

/**
 * Create a Cloudinary storage instance for multer
 * @param {string} folder - Folder name in Cloudinary (e.g., 'growth-valley/blogs')
 * @param {Object} options - Additional options for Cloudinary upload
 * @returns {CloudinaryStorage} Configured storage instance
 */
const createStorage = (folder = 'growth-valley/general', options = {}) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      transformation: options.transformation || undefined,
      resource_type: 'auto',
      ...options.params
    }
  });
};

/**
 * Default storage for general uploads
 */
const defaultStorage = createStorage('growth-valley/media');

/**
 * Storage instances for different upload types
 */
const storageInstances = {
  media: createStorage('growth-valley/media'),
  blog: createStorage('growth-valley/blogs'),
  team: createStorage('growth-valley/team'),
  testimonial: createStorage('growth-valley/testimonials'),
  caseStudy: createStorage('growth-valley/case-studies'),
  client: createStorage('growth-valley/clients'),
  icon: createStorage('growth-valley/icons')
};

/**
 * Delete an image from Cloudinary by public_id
 * @param {string} publicId - The public_id of the image to delete
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      return { success: false, message: 'No public_id provided' };
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of public_ids to delete
 * @returns {Promise<Object>} Deletion result
 */
const deleteImages = async (publicIds) => {
  try {
    if (!publicIds || publicIds.length === 0) {
      return { success: true, deleted: 0 };
    }

    const result = await cloudinary.api.delete_resources(publicIds);
    return { success: true, result };
  } catch (error) {
    console.error('Cloudinary bulk delete error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} The public_id or null if not a Cloudinary URL
 */
const extractPublicId = (url) => {
  if (!url) return null;

  // Check if it's a Cloudinary URL
  if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
    return null;
  }

  try {
    // Extract public_id from URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
    // Or: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{format}
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');

    if (uploadIndex === -1) return null;

    // Skip version if present (v123456789)
    let pathParts = urlParts.slice(uploadIndex + 1);
    if (pathParts[0] && pathParts[0].startsWith('v')) {
      pathParts = pathParts.slice(1);
    }

    // Join and remove file extension
    const fullPath = pathParts.join('/');
    const lastDot = fullPath.lastIndexOf('.');
    const publicId = lastDot !== -1 ? fullPath.substring(0, lastDot) : fullPath;

    return publicId || null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

/**
 * Get Cloudinary instance for direct API calls
 */
const getCloudinary = () => cloudinary;

/**
 * Get storage instance for a specific upload type
 * @param {string} type - Type of upload (media, blog, team, etc.)
 * @returns {CloudinaryStorage} Storage instance
 */
const getStorage = (type = 'media') => {
  return storageInstances[type] || defaultStorage;
};

module.exports = {
  cloudinary,
  createStorage,
  defaultStorage,
  storageInstances,
  deleteImage,
  deleteImages,
  extractPublicId,
  getCloudinary,
  getStorage
};