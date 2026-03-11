const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  // Cloudinary public_id for deletion
  publicId: {
    type: String,
    default: null
  },
  path: {
    type: String,
    required: [true, 'File path is required']
  },
  url: {
    type: String,
    required: [true, 'File URL is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  width: {
    type: Number,
    default: null
  },
  height: {
    type: Number,
    default: null
  },
  alt: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  folder: {
    type: String,
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
mediaSchema.index({ filename: 1 });
mediaSchema.index({ mimeType: 1 });
mediaSchema.index({ folder: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ originalName: 'text', alt: 'text', caption: 'text' });

// Virtual for file extension
mediaSchema.virtual('extension').get(function() {
  return this.originalName.split('.').pop().toLowerCase();
});

// Virtual for human-readable size
mediaSchema.virtual('sizeFormatted').get(function() {
  const bytes = this.size;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Transform output
mediaSchema.methods.toJSON = function() {
  const media = this.toObject();
  delete media.__v;
  delete media.path;
  return media;
};

// Static for image types
mediaSchema.statics.findImages = function() {
  return this.find({ mimeType: /^image\// }).sort({ createdAt: -1 });
};

// Static for by folder
mediaSchema.statics.findByFolder = function(folder) {
  return this.find({ folder }).sort({ createdAt: -1 });
};

// Static for storage stats
mediaSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$mimeType',
        count: { $sum: 1 },
        totalSize: { $sum: '$size' }
      }
    }
  ]);
  
  const totalFiles = await this.countDocuments();
  const totalSize = await this.aggregate([
    { $group: { _id: null, total: { $sum: '$size' } } }
  ]);
  
  return {
    byType: stats,
    totalFiles,
    totalSize: totalSize[0]?.total || 0
  };
};

module.exports = mongoose.model('Media', mediaSchema);