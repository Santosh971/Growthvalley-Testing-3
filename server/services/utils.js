/**
 * Generate a URL-friendly slug from a string
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
};

/**
 * Generate a unique slug by checking against existing slugs
 * @param {string} baseSlug - The base slug to use
 * @param {Function} checkExists - Async function that checks if a slug exists
 * @returns {Promise<string>} - Unique slug
 */
const generateUniqueSlug = async (baseSlug, checkExists) => {
  let slug = generateSlug(baseSlug);
  let counter = 1;
  let uniqueSlug = slug;

  while (await checkExists(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;

    // Safety limit
    if (counter > 1000) {
      uniqueSlug = `${slug}-${Date.now()}`;
      break;
    }
  }

  return uniqueSlug;
};

/**
 * Truncate text to specified length
 */
const truncate = (text, length = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length - suffix.length).trim() + suffix;
};

/**
 * Strip HTML tags from text
 */
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Calculate read time in minutes
 */
const calculateReadTime = (content, wordsPerMinute = 200) => {
  if (!content) return 1;
  const wordCount = stripHtml(content).split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

/**
 * Format date for display
 */
const formatDate = (date, format = 'long') => {
  if (!date) return '';

  const d = new Date(date);

  if (format === 'short') {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  if (format === 'iso') {
    return d.toISOString().split('T')[0];
  }

  return d.toString();
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
const formatRelativeTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDate(date, 'short');
};

/**
 * Generate excerpt from content
 */
const generateExcerpt = (content, length = 160) => {
  if (!content) return '';
  const text = stripHtml(content).replace(/\s+/g, ' ').trim();
  return truncate(text, length);
};

/**
 * Parse pagination options from query
 */
const parsePagination = (query, defaults = {}) => {
  const page = parseInt(query.page, 10) || defaults.page || 1;
  const limit = Math.min(
    parseInt(query.limit, 10) || defaults.limit || 10,
    defaults.maxLimit || 100
  );
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    sortBy: query.sortBy || defaults.sortBy || 'createdAt',
    sortOrder: query.sortOrder === 'asc' ? 1 : -1,
    search: query.search || ''
  };
};

/**
 * Build search filter for MongoDB
 */
const buildSearchFilter = (search, fields) => {
  if (!search || !fields.length) return {};

  return {
    $or: fields.map(field => ({
      [field]: { $regex: search, $options: 'i' }
    }))
  };
};

/**
 * Generate CSV from data
 */
const generateCSV = (data, fields) => {
  if (!data.length) return '';

  // Header row
  const header = fields.map(f => `"${f.label}"`).join(',');

  // Data rows
  const rows = data.map(item => {
    return fields.map(f => {
      let value = f.getValue ? f.getValue(item) : item[f.key];
      if (value === null || value === undefined) value = '';
      if (typeof value === 'object') value = JSON.stringify(value);
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });

  return [header, ...rows].join('\n');
};

/**
 * Deep clone object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove undefined/null values from object
 */
const removeNullish = (obj) => {
  const result = {};
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        result[key] = removeNullish(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
  truncate,
  stripHtml,
  calculateReadTime,
  formatDate,
  formatRelativeTime,
  parsePagination,
  buildSearchFilter,
  generateCSV,
  deepClone,
  removeNullish
};