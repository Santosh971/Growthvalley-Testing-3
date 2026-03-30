'use client';

import { useEffect, useRef } from 'react';
import { useSettings } from '@/lib/settings-context';
import { getMediaUrl } from '@/lib/api-config';

/**
 * DynamicFavicon component
 * Updates the browser tab favicon dynamically based on settings from the database.
 *
 * IMPORTANT: This component ONLY updates existing favicon link elements.
 * It NEVER removes DOM nodes to avoid conflicts with Next.js App Router head management.
 * This prevents the "Cannot read properties of null (reading 'removeChild')" error.
 */
export default function DynamicFavicon() {
  const { settings, loading } = useSettings();
  const lastAppliedUrl = useRef<string | null>(null);

  useEffect(() => {
    // Wait for settings to load
    if (loading) return;

    const faviconUrl = settings?.favicon;

    // If no favicon in settings, don't change anything (keep existing)
    if (!faviconUrl) return;

    // Get full URL using the safe helper
    const fullUrl = getMediaUrl(faviconUrl);
    if (!fullUrl) return;

    // Skip if same URL already applied (prevents unnecessary DOM updates)
    if (lastAppliedUrl.current === fullUrl) return;

    // Helper to determine MIME type based on file extension
    const getMimeType = (url: string): string => {
      if (url.endsWith('.svg')) return 'image/svg+xml';
      if (url.endsWith('.png')) return 'image/png';
      if (url.endsWith('.ico')) return 'image/x-icon';
      return 'image/x-icon'; // default
    };

    const mimeType = getMimeType(fullUrl);

    // Helper to find or create a link element safely
    const getOrCreateLink = (rel: string, type?: string): HTMLLinkElement => {
      // First, try to find existing element
      let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

      if (!link) {
        // Only create if it doesn't exist - NEVER remove existing elements
        link = document.createElement('link');
        link.rel = rel;
        if (type) link.type = type;
        document.head.appendChild(link);
      }

      return link;
    };

    // Update main favicon (rel="icon")
    const mainIcon = getOrCreateLink('icon', mimeType);
    mainIcon.href = fullUrl;

    // Update shortcut icon (for legacy browsers)
    const shortcutIcon = getOrCreateLink('shortcut icon', mimeType);
    shortcutIcon.href = fullUrl;

    // Update apple touch icon
    const appleIcon = getOrCreateLink('apple-touch-icon');
    appleIcon.href = fullUrl;

    // Store the applied URL to prevent re-application
    lastAppliedUrl.current = fullUrl;

  }, [settings?.favicon, loading]);

  return null;
}