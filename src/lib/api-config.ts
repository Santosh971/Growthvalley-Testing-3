/**
 * Centralized API URL Configuration
 *
 * This module provides safe, environment-aware API URL handling.
 * - Uses NEXT_PUBLIC_API_URL as primary source
 * - Only allows localhost fallback in development mode
 * - Prevents localhost usage in production
 */

/**
 * Get the API URL with safe fallback handling
 * @returns The API URL (throws in production if not configured)
 */
export function getApiUrl(): string | null {
  const base_url = "https://growthvalley-testing-3.onrender.com"
  const envUrl = base_url || process.env.API_URL;

  if (envUrl) {
    return envUrl;
  }

  // Check if we're on Vercel/production
  const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
  const nodeEnv = process.env.NODE_ENV;

  // In development, allow localhost fallback
  if (nodeEnv === 'development' && !isVercel) {
    return 'http://localhost:3001';
  }

  // Production without configured URL - this is a configuration error
  console.error(
    '❌ CRITICAL: NEXT_PUBLIC_API_URL environment variable is not configured!',
    '\n   Set it to your backend API URL (e.g., https://growthvalley-testing-3.onrender.com)',
    '\n   Environment:', nodeEnv,
    '\n   VERCEL:', isVercel
  );

  // Return null - calling code should handle this gracefully
  return null;
}

/**
 * Get API URL with fallback to empty string (for components that need a string)
 * Use this for image URLs and other non-critical paths
 */
export function getApiUrlOrEmpty(): string {
  return getApiUrl() || '';
}

/**
 * Safe fetch wrapper with API URL handling
 * @param endpoint - API endpoint (e.g., '/api/blog')
 * @param options - Fetch options
 * @returns Response or null if API URL not configured
 */
export async function safeFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response | null> {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    console.error(`Cannot fetch ${endpoint}: API URL not configured`);
    return null;
  }

  const url = `${apiUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      cache: options.cache || 'no-store',
    });

    if (!response.ok) {
      console.error(`API request failed: ${response.status} ${response.statusText} for ${endpoint}`);
    }

    return response;
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fetch JSON data with safe error handling
 * @param endpoint - API endpoint
 * @param fallback - Fallback value if fetch fails
 * @returns Parsed JSON data or fallback
 */
export async function fetchJson<T>(
  endpoint: string,
  fallback: T
): Promise<T> {
  const response = await safeFetch(endpoint);

  if (!response || !response.ok) {
    return fallback;
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`JSON parse error for ${endpoint}:`, error);
    return fallback;
  }
}

/**
 * Get full URL for media/images (handles relative and absolute paths)
 */
export function getMediaUrl(path: string | undefined | null): string {
  if (!path) {
    return '';
  }

  // Already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const apiUrl = getApiUrl();

  if (!apiUrl) {
    console.warn('Cannot resolve media URL: API URL not configured');
    return '';
  }

  // Prepend API URL to relative path
  return `${apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Export a constant for backward compatibility
 * Note: This will be empty string in production if NEXT_PUBLIC_API_URL is not set
 */
export const API_BASE_URL = getApiUrlOrEmpty();