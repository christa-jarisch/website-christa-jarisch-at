# christa-jarisch.at

Personal website of Christa Jarisch, Vienna. Built with [Astro](https://astro.build), GSAP and Lenis; deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Editing content

All page text lives in [`src/data/site.ts`](src/data/site.ts). Texts marked `ENTWURF` are drafts that still need Christa's review.

## Deployment

Every push to `main` deploys via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
The site currently runs at <https://christa-jarisch.github.io/website-christa-jarisch-at/>.

To switch to the custom domain `christa-jarisch.at`:

1. Point the domain's DNS to GitHub Pages (A records `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`; optionally `www` CNAME → `christa-jarisch.github.io`).
2. Set the custom domain under **Settings → Pages** and enable *Enforce HTTPS*.
3. Remove the `env:` block (`SITE_URL`, `BASE_PATH`) from the deploy workflow.

## `legacy/`

The HTML pages of the previous WordPress site, kept for reference. Licensed third-party assets (stock photos, the commercial theme's CSS/JS, icon fonts, agency logo) have been removed from this public repository.

Portrait photos: © Daniel Eberharter, WisR GmbH Wien.
