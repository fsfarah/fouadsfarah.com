import { defineConfig } from 'astro/config';
import securityHeaders from './integrations/security-headers.mjs';

export default defineConfig({
  site: 'https://fouadsfarah.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // Keep CSS in files so the Content-Security-Policy needs no inline-style hashes.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Keep scripts in files too; the only inline script is the theme bootstrap (hashed).
      assetsInlineLimit: 0,
    },
  },
  integrations: [securityHeaders()],
});
