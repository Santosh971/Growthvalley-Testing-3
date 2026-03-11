const { Media } = require('../models');
const { deleteByPublicId } = require('../middleware/upload');

// @desc    Upload media file
// @route   POST /api/admin/media
// @access  Private (Admin)
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const { folder = 'general', alt = '', caption = '' } = req.body;

    // Cloudinary returns the file info in req.file
    // req.file.path contains the secure_url
    // req.file.filename contains the public_id
    const fileUrl = req.file.path; // Cloudinary secure_url
    const publicId = req.file.filename; // Cloudinary public_id

    const media = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      publicId: publicId,
      path: fileUrl, // Store Cloudinary URL as path for backward compatibility
      url: fileUrl,
      mimeType: req.file.mimetype,
      size: req.file.size,
      alt,
      caption,
      uploadedBy: req.admin.id,
      folder,
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: media,
    });
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
    });
  }
};

// @desc    Get all media files
// @route   GET /api/admin/media
// @access  Private (Admin)
exports.getMedia = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 30,
      folder,
      mimeType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    if (folder) query.folder = folder;
    if (mimeType) query.mimeType = new RegExp(mimeType, 'i');
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { alt: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const media = await Media.find(query)
      .populate('uploadedBy', 'name email')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Media.countDocuments(query);

    res.json({
      success: true,
      data: media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch media',
    });
  }
};

// @desc    Get media by ID
// @route   GET /api/admin/media/:id
// @access  Private (Admin)
exports.getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
      });
    }

    res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error('Get media by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch media',
    });
  }
};

// @desc    Update media metadata
// @route   PUT /api/admin/media/:id
// @access  Private (Admin)
exports.updateMedia = async (req, res) => {
  try {
    const { alt, caption, folder, tags } = req.body;

    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { alt, caption, folder, tags },
      { new: true, runValidators: true }
    );

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
      });
    }

    res.json({
      success: true,
      message: 'Media updated successfully',
      data: media,
    });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update media',
    });
  }
};

// @desc    Delete media
// @route   DELETE /api/admin/media/:id
// @access  Private (Admin)
exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
      });
    }

    // Delete from Cloudinary using publicId
    if (media.publicId) {
      try {
        await deleteByPublicId(media.publicId);
      } catch (cloudinaryError) {
        console.error('Failed to delete from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    await media.deleteOne();

    res.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete media',
    });
  }
};

// @desc    Get media storage stats
// @route   GET /api/admin/media/stats
// @access  Private (Admin)
exports.getMediaStats = async (req, res) => {
  try {
    const stats = await Media.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get media stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch media stats',
    });
  }
};

// @desc    Get folders list
// @route   GET /api/admin/media/folders
// @access  Private (Admin)
exports.getFolders = async (req, res) => {
  try {
    const folders = await Media.distinct('folder');

    res.json({
      success: true,
      data: folders,
    });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch folders',
    });
  }
};