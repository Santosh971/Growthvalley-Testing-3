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

const resultSchema = new mongoose.Schema({
  metric: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  designation: {
    type: String
  },
  avatar: {
    type: String
  }
}, { _id: false });

const caseStudySchema = new mongoose.Schema({
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
  industry: {
    type: String,
    enum: ['SaaS', 'E-commerce', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Real Estate', 'Technology', 'Other'],
    required: false,       // <-- optional now
    default: undefined     // <-- optional, no default
  },
  clientName: {
    type: String,
    trim: true,
    // required: false,       // <-- optional now
    // default: undefined     // <-- optional, no default
  },
  clientLogo: {
    type: String,
    default: null
  },
  featuredImage: {
    type: String,
    default: null
  },
  challenge: {
    type: String,
    required: [true, 'Challenge description is required']
  },
  solution: {
    type: String,
    required: [true, 'Solution description is required']
  },
  results: [resultSchema],
  timeline: {
    type: String,
    default: null
  },
  technologies: [{
    type: String,
    trim: true
  }],
  testimonial: testimonialSchema,
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  publishDate: {
    type: Date,
    default: Date.now
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
caseStudySchema.index({ status: 1, publishDate: -1 });
caseStudySchema.index({ industry: 1 });
caseStudySchema.index({ featured: 1 });
caseStudySchema.index({ createdAt: -1 });

// Transform output
caseStudySchema.methods.toJSON = function () {
  const caseStudy = this.toObject();
  delete caseStudy.__v;
  return caseStudy;
};

// Static to find published case studies
caseStudySchema.statics.findPublished = function () {
  return this.find({ status: 'published', publishDate: { $lte: new Date() } })
    .sort({ publishDate: -1 });
};

// Static to find featured case studies
caseStudySchema.statics.findFeatured = function () {
  return this.find({ status: 'published', featured: true })
    .sort({ publishDate: -1 });
};

module.exports = mongoose.model('CaseStudy', caseStudySchema);