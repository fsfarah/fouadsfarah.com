import { defineConfig } from 'astro/config';
import securityHeaders from './integrations/security-headers.mjs';

export default defineConfig({
  site: 'https://fouadsfarah.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // Inline the (small) CSS: no render-blocking stylesheet requests before first paint.
    // The security-headers integration adds each inline <style> block's hash to the CSP.
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      // Keep scripts in files too; the only inline script is the theme bootstrap (hashed).
      assetsInlineLimit: 0,
    },
  },
  integrations: [securityHeaders()],
});
