const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [{
    type: String,
    trim: true
  }],
  ogImage: {
    type: String
  },
  canonicalUrl: {
    type: String
  }
}, { _id: false });

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  featuredImage: {
    type: String,
    default: null
  },
  featuredImageAlt: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  // Content blocks - structured content array
  contentBlocks: [{
    _id: false,
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    type: {
      type: String,
      enum: ['heading', 'paragraph', 'bulletList'],
      required: true
    },
    // For heading type
    level: {
      type: Number,
      enum: [1, 2, 3],
      default: 2
    },
    // For heading and paragraph types
    text: {
      type: String,
      default: ''
    },
    // For bulletList type
    items: [{
      type: String
    }]
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Strategy', 'Automation', 'Performance', 'Technology', 'Growth', 'General']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Author is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'scheduled'],
    default: 'draft'
  },
  publishDate: {
    type: Date,
    default: null
  },
  scheduledPublishDate: {
    type: Date,
    default: null
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  featured: {
    type: Boolean,
    default: false
  },
  seo: {
    type: seoSchema,
    default: () => ({})
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
// Note: 'slug' index is already created by unique: true in schema definition
blogSchema.index({ status: 1, publishDate: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ createdAt: -1 });

// Calculate read time before saving
blogSchema.pre('save', function(next) {
  // Calculate read time from contentBlocks or content
  if (this.isModified('content') || this.isModified('contentBlocks')) {
    let totalText = '';

    // Extract text from contentBlocks if available
    if (this.contentBlocks && this.contentBlocks.length > 0) {
      for (const block of this.contentBlocks) {
        if (block.type === 'heading' || block.type === 'paragraph') {
          totalText += ' ' + (block.text || '');
        } else if (block.type === 'bulletList' && block.items) {
          totalText += ' ' + block.items.join(' ');
        }
      }
    } else if (this.content) {
      totalText = this.content;
    }

    const wordCount = totalText.split(/\s+/).filter(w => w.length > 0).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200)); // ~200 words per minute
  }

  // Set publishDate when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishDate) {
    this.publishDate = new Date();
  }

  // For scheduled posts, ensure scheduledPublishDate is set
  if (this.isModified('status') && this.status === 'scheduled') {
    // scheduledPublishDate should be set by the admin
    // If not set, default to 24 hours from now
    if (!this.scheduledPublishDate) {
      this.scheduledPublishDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
  }

  next();
});

// Virtual for formatted date
blogSchema.virtual('formattedDate').get(function() {
  return this.publishDate ? this.publishDate.toISOString().split('T')[0] : null;
});

// Transform output
blogSchema.methods.toJSON = function() {
  const blog = this.toObject();
  delete blog.__v;
  return blog;
};

// Static to find published posts
blogSchema.statics.findPublished = function() {
  return this.find({ status: 'published', publishDate: { $lte: new Date() } })
    .sort({ publishDate: -1 })
    .populate('author', 'name email avatar');
};

module.exports = mongoose.model('Blog', blogSchema);