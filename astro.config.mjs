// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed to GitHub Pages with the custom domain from public/CNAME.
export default defineConfig({
  site: 'https://christa-jarisch.at',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
});
