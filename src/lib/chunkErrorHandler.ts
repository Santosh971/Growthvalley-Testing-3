/**
 * Chunk Loading Error Handler
 * Automatically reloads the page when chunk loading fails
 * This handles the "ChunkLoadError" that occurs during deployments
 */

if (typeof window !== 'undefined') {
  // Track if we've already attempted a reload
  let hasReloaded = false;

  // Handle chunk loading errors
  window.addEventListener('error', (event) => {
    // Check if it's a chunk loading error
    if (
      event.message?.includes('Loading chunk') ||
      event.message?.includes('Loading CSS chunk') ||
      event.message?.includes('ChunkLoadError') ||
      event.filename?.includes('_next/static/chunks')
    ) {
      console.error('[Chunk Error]', event.message);

      // Only reload once to prevent infinite loop
      if (!hasReloaded) {
        hasReloaded = true;
        console.log('[Chunk Error] Attempting page reload...');

        // Store a flag in sessionStorage to prevent infinite reloads
        const reloadCount = parseInt(sessionStorage.getItem('chunk-reload-count') || '0');

        if (reloadCount < 3) {
          sessionStorage.setItem('chunk-reload-count', String(reloadCount + 1));

          // Reload the page
          window.location.reload();
        } else {
          console.error('[Chunk Error] Max reload attempts reached. Please clear cache.');
          sessionStorage.removeItem('chunk-reload-count');

          // Show user-friendly error message
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #fef2f2;
            color: #991b1b;
            padding: 16px;
            text-align: center;
            font-family: system-ui, sans-serif;
            z-index: 9999;
            border-bottom: 2px solid #fecaca;
          `;
          errorDiv.innerHTML = `
            <strong>Loading Error</strong><br>
            <span style="font-size: 14px;">
              The page failed to load properly.
              <button onclick="window.location.reload()" style="margin-left: 8px; padding: 4px 12px; cursor: pointer;">
                Retry
              </button>
              <button onclick="this.parentElement.parentElement.remove()" style="margin-left: 8px; padding: 4px 12px; cursor: pointer;">
                Dismiss
              </button>
            </span>
          `;
          document.body.prepend(errorDiv);
        }
      }
    }
  });

  // Handle unhandled promise rejections (for dynamic imports)
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = String(event.reason);

    if (
      errorMessage.includes('ChunkLoadError') ||
      errorMessage.includes('Loading chunk') ||
      errorMessage.includes('Loading CSS chunk')
    ) {
      console.error('[Chunk Promise Error]', errorMessage);

      if (!hasReloaded) {
        hasReloaded = true;

        const reloadCount = parseInt(sessionStorage.getItem('chunk-reload-count') || '0');

        if (reloadCount < 3) {
          sessionStorage.setItem('chunk-reload-count', String(reloadCount + 1));
          window.location.reload();
        }
      }
    }
  });

  // Reset reload count on successful page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      sessionStorage.removeItem('chunk-reload-count');
      hasReloaded = false;
    }, 1000);
  });
}

export {}; // Make this a module