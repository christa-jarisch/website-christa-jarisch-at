// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Defaults target the custom domain. Until its DNS points to GitHub Pages, the deploy
// workflow overrides SITE_URL / BASE_PATH so the site works under
// https://christa-jarisch.github.io/website-christa-jarisch-at/.
const site = process.env.SITE_URL ?? 'https://christa-jarisch.at';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
});
