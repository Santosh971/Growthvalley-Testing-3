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
// frontend/utils/getImageUrl.ts
export const getImageUrl = (path?: string) => {
  if (!path) return ''; // fallback if no image
  if (path.startsWith('http')) return path; // full URL already
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`; // prepend backend URL
};