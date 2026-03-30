// Server-side settings fetching
// This file runs on the server only and provides fresh settings
import { getApiUrl } from './api-config';

const API_URL = getApiUrl() || '';

// Default settings (duplicated to avoid circular dependency)
const defaultSettings = {
  siteName: 'Growth Valley',
  siteTagline: 'Accelerate Your Growth',
  siteDescription: 'Predictable Revenue Systems for Scalable Businesses. We help B2B companies transform their revenue operations.',
  socialLinks: {
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
  },
  hero: {
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    backgroundImage: '',
  },
  footer: {
    copyrightText: '',
    links: [],
  },
  businessInfo: {
    legalName: '',
    taxId: '',
    foundedYear: null,
    teamSize: '',
    description: '',
    logo: '',
    logoDark: '',
  },
  tracking: {
    googleAnalytics: '',
    googleTagManager: '',
    facebookPixel: '',
  },
  customCss: '',
  customJs: '',
  maintenanceMode: false,
  favicon: '',
};

// Deep merge utility for nested objects
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T> | undefined): T {
  if (!source) return target;

  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined && source[key] !== null) {
      if (
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key] as any;
      }
    }
  }

  return result;
}

/**
 * Fetch site settings from API - always fresh data
 * This should only be called from server components
 */
export async function getSettings(): Promise<typeof defaultSettings> {
  try {
    const response = await fetch(`${API_URL}/api/settings`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const result = await response.json();

      if (result.success && result.data) {
        return deepMerge(defaultSettings, result.data);
      }
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }

  // Return defaults if API fails
  return defaultSettings;
}