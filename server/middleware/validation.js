const Joi = require('joi');

/**
 * Validation middleware - placeholder for route-level validation
 */
const validate = (schema) => {
  return validateBody(schema);
};

/**
 * Joi validation middleware factory
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Joi validation for query params
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.query = value;
    next();
  };
};

/**
 * Joi validation for URL params
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.params = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // Auth schemas
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    })
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    })
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'Password is required'
      }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    })
  }),

  // Blog schemas
  createBlog: Joi.object({
    title: Joi.string().max(200).required(),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).required(),
    featuredImage: Joi.string().allow(null, ''),
    featuredImageAlt: Joi.string().max(200).allow(''),
    content: Joi.string().allow(''),
    contentBlocks: Joi.array().items(Joi.object({
      id: Joi.string(),
      type: Joi.string().valid('heading', 'paragraph', 'bulletList').required(),
      // level is for heading blocks - optional, defaults to 2 in the model
      level: Joi.number().valid(1, 2, 3).optional(),
      // text is for heading and paragraph blocks
      text: Joi.string().optional(),
      // items is for bulletList blocks
      items: Joi.array().items(Joi.string()).optional()
    })),
    category: Joi.string().valid('Strategy', 'Automation', 'Performance', 'Technology', 'Growth', 'General').required(),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'published', 'archived', 'scheduled'),
    publishDate: Joi.date().allow(null),
    scheduledPublishDate: Joi.date().allow(null),
    featured: Joi.boolean(),
    seo: Joi.object({
      metaTitle: Joi.string().max(60),
      metaDescription: Joi.string().max(160),
      keywords: Joi.array().items(Joi.string()),
      ogImage: Joi.string().allow(null, ''),
      canonicalUrl: Joi.string().allow(null, '')
    })
  }),

  updateBlog: Joi.object({
    title: Joi.string().max(200),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/),
    featuredImage: Joi.string().allow(null, ''),
    featuredImageAlt: Joi.string().max(200).allow(''),
    content: Joi.string().allow(''),
    contentBlocks: Joi.array().items(Joi.object({
      id: Joi.string(),
      type: Joi.string().valid('heading', 'paragraph', 'bulletList').required(),
      // level is for heading blocks - optional, defaults to 2 in the model
      level: Joi.number().valid(1, 2, 3).optional(),
      // text is for heading and paragraph blocks
      text: Joi.string().optional(),
      // items is for bulletList blocks
      items: Joi.array().items(Joi.string()).optional()
    })),
    category: Joi.string().valid('Strategy', 'Automation', 'Performance', 'Technology', 'Growth', 'General'),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'published', 'archived', 'scheduled'),
    publishDate: Joi.date().allow(null),
    scheduledPublishDate: Joi.date().allow(null),
    featured: Joi.boolean(),
    seo: Joi.object({
      metaTitle: Joi.string().max(60),
      metaDescription: Joi.string().max(160),
      keywords: Joi.array().items(Joi.string()),
      ogImage: Joi.string().allow(null, ''),
      canonicalUrl: Joi.string().allow(null, '')
    })
  }),

  // Case Study schemas
  createCaseStudy: Joi.object({
    title: Joi.string().max(200).required(),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).required(),
    industry: Joi.string().valid('SaaS', 'E-commerce', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Real Estate', 'Technology', 'Other').optional(),
    clientName: Joi.string().optional().allow(''),
    clientLogo: Joi.string().allow(null, ''),
    featuredImage: Joi.string().allow(null, ''),
    challenge: Joi.string().required(),
    solution: Joi.string().required(),
    results: Joi.array().items(Joi.object({
      metric: Joi.string().required(),
      value: Joi.string().required(),
      description: Joi.string()
    })),
    timeline: Joi.string().allow(null, ''),
    technologies: Joi.array().items(Joi.string()),
    testimonial: Joi.object({
      quote: Joi.string().required(),
      author: Joi.string().required(),
      designation: Joi.string(),
      avatar: Joi.string().allow(null, '')
    }).allow(null),
    featured: Joi.boolean(),
    status: Joi.string().valid('draft', 'published', 'archived'),
    publishDate: Joi.date().allow(null),
    seo: Joi.object({
      metaTitle: Joi.string().max(60),
      metaDescription: Joi.string().max(160),
      keywords: Joi.array().items(Joi.string()),
      ogImage: Joi.string().allow(null, ''),
      canonicalUrl: Joi.string().allow(null, '')
    })
  }),

  // Contact/Enquiry schemas
  contactForm: Joi.object({
    name: Joi.string()
      .pattern(/^[A-Za-z\s\-'\.]+$/)
      .max(100)
      .required()
      .messages({
        'string.pattern.base': 'Name should contain only letters, spaces, hyphens, and apostrophes',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    phone: Joi.string()
      .allow('')
      .max(50)
      .messages({
        'string.max': 'Phone number cannot exceed 50 characters'
      }),
    company: Joi.string().max(200).allow(''),
    service: Joi.string().valid('Lead Generation', 'Marketing Automation', 'CRM Implementation', 'Sales Funnel Optimization', 'Growth Consulting', 'Other', 'revenue-architecture', 'sales-process', 'revops', 'gtm', 'other').allow(''),
    interest: Joi.string().allow(''),
    message: Joi.string().max(2000).required().messages({
      'string.max': 'Message cannot exceed 2000 characters',
      'any.required': 'Message is required'
    }),
    source: Joi.string().valid('website', 'referral', 'social', 'direct', 'other')
  }),

  updateEnquiry: Joi.object({
    status: Joi.string().valid('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed', 'lost'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    assignedTo: Joi.string().allow(null),
    estimatedValue: Joi.number().min(0).allow(null),
    tags: Joi.array().items(Joi.string()),
    note: Joi.string().max(1000)
  }),

  // Settings schema
  settings: Joi.object({
    siteName: Joi.string(),
    siteTagline: Joi.string(),
    siteDescription: Joi.string(),
    socialLinks: Joi.object({
      linkedin: Joi.string().allow(''),
      twitter: Joi.string().allow(''),
      facebook: Joi.string().allow(''),
      instagram: Joi.string().allow(''),
      youtube: Joi.string().allow('')
    }),
    hero: Joi.object({
      title: Joi.string().allow(''),
      subtitle: Joi.string().allow(''),
      ctaText: Joi.string().allow(''),
      ctaLink: Joi.string().allow(''),
      backgroundImage: Joi.string().allow('')
    }),
    footer: Joi.object({
      copyrightText: Joi.string().allow(''),
      links: Joi.array().items(Joi.object({
        label: Joi.string().required(),
        url: Joi.string().required()
      }))
    }),
    businessInfo: Joi.object({
      legalName: Joi.string().allow(''),
      taxId: Joi.string().allow(''),
      foundedYear: Joi.number().allow(null),
      teamSize: Joi.string().allow(''),
      description: Joi.string().allow(''),
      logo: Joi.string().allow(''),
      logoDark: Joi.string().allow('')
    }),
    tracking: Joi.object({
      googleAnalytics: Joi.string().allow(''),
      googleTagManager: Joi.string().allow(''),
      facebookPixel: Joi.string().allow('')
    }),
    customCss: Joi.string().allow(''),
    customJs: Joi.string().allow(''),
    maintenanceMode: Joi.boolean()
  }),

  // Page SEO schema
  pageSeo: Joi.object({
    pageTitle: Joi.string().max(100).required(),
    seo: Joi.object({
      metaTitle: Joi.string().max(60).required(),
      metaDescription: Joi.string().max(160).required(),
      keywords: Joi.array().items(Joi.string()),
      ogImage: Joi.string().allow(null, ''),
      canonicalUrl: Joi.string().allow(null, '')
    }).required(),
    customFields: Joi.array().items(Joi.object({
      key: Joi.string().required(),
      value: Joi.string()
    })),
    isActive: Joi.boolean()
  }),

  // Pagination schema
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string(),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().allow('')
  }),

  // Slug param schema
  slugParam: Joi.object({
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).required()
  }),

  // ID param schema
  idParam: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
  }),

  // Page param schema
  pageParam: Joi.object({
    page: Joi.string().valid('home', 'solutions', 'industries', 'case-studies', 'company', 'contact', 'blog').required()
  })
};

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  schemas
};