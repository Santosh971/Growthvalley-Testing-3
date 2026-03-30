import { getApiUrl, getMediaUrl } from './api-config';

// Utility function to generate slugs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

// Get full URL for images/media
export const getImageUrl = (path?: string) => {
  return getMediaUrl(path);
};

export async function fetchAPI(endpoint: string) {
  const apiUrl = getApiUrl();
  if (!apiUrl) throw new Error('API URL not configured');

  const res = await fetch(`${apiUrl}${endpoint}`);

  if (!res.ok) throw new Error('API Error');

  return res.json();
}

// Fetch page content from API
export async function getPageContent(page: string) {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.error('API URL not configured');
    return null;
  }

  const res = await fetch(`${apiUrl}/api/content/${page}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch page content");
  }

  const data = await res.json();
  return data.data;
}

// Fetch case studies from backend
export async function getCaseStudies() {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.error('API URL not configured');
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/api/case-studies?status=active`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching case studies:', err);
    return [];
  }
}