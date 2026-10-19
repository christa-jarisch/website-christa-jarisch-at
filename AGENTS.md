# AGENTS.md

Guidance for AI coding agents (and humans) working on this repository.

## Project

Personal one-page website of **Christa Jarisch** (Vienna). It is a portrait of her as a person — her story, values, organisational strengths, experience and training — **not** a service or therapy offering. She trained as a Lebens- und Sozialberaterin and supervisor but no longer actively offers counselling; keep that part of her story in a neutral, past-tense tone and never add booking CTAs, prices, "Erstgespräch gratis" or similar sales language.

- Live (temporary): https://christa-jarisch.github.io/website-christa-jarisch-at/
- Target domain: https://christa-jarisch.at (DNS not yet pointed to GitHub Pages)
- Repo: https://github.com/christa-jarisch/website-christa-jarisch-at — **public**
- The repo owner is Christa's son; Christa reviews all texts.

## Stack

- Astro 7 (static output, no SSR, no UI framework)
- GSAP 3.15 + ScrollTrigger (all GSAP plugins are free and ship in the `gsap` npm package)
- Lenis 1.3 for smooth scrolling (desktop / `pointer: fine` only)
- Self-hosted fonts via Fontsource: Fraunces Variable (display serif), Inter Variable (body)
- `@astrojs/sitemap`
- Node ≥ 22.22 (CI uses Node 24)

Keep dependencies on their latest stable versions; check npm (`npm view <pkg> version`) instead of relying on memory.

## Commands

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # → dist/
npm run preview
```

On Windows Git Bash, prefix env-var builds with `MSYS_NO_PATHCONV=1`, otherwise `/paths` get rewritten to `C:/Program Files/Git/...`:

```bash
MSYS_NO_PATHCONV=1 SITE_URL=https://christa-jarisch.github.io BASE_PATH=/website-christa-jarisch-at/ npm run build
```

## Structure

```
src/data/site.ts           ALL page text — edit content here, not in templates
src/pages/index.astro      the one-pager (markup + scoped styles)
src/pages/impressum.astro  legal notice (Austrian ECG / MedienG)
src/pages/datenschutz.astro privacy policy (GDPR)
src/components/Motion.astro all animation code (GSAP, ScrollTrigger, Lenis)
src/components/Footer.astro
src/layouts/Base.astro     <head>, meta, OG, favicon
src/layouts/Legal.astro    layout for legal pages
src/styles/global.css      design tokens, base styles, grain, .reveal
src/assets/                images processed by astro:assets
public/                    favicon, robots.txt
legacy/                    HTML of the old WordPress site — read-only reference
.github/workflows/deploy.yml GitHub Pages deploy
```

## Content rules

- Language: German (Austria), `lang="de-AT"`, formal "Sie" when addressing the reader; Christa speaks in first person ("ich").
- Gender-inclusive forms as used on the old site (e.g. "MitarbeiterInnen").
- Texts marked `ENTWURF` in `site.ts` are drafts not yet approved by Christa — keep the marker until she confirms.
- Never invent facts about Christa (employers, dates, numbers, clients, testimonials). If something is missing, leave a `TODO` comment and ask.
- Quote attribution: "Eckhart Tolle" (the old site misspelled it).
- Contact on the site: email `christa@jarisch.net` and phone as in `site.ts`. Don't add a street address to the main page; it appears only in the Impressum.

## Design system

- Tokens live in `:root` in `global.css` and use `light-dark()` for automatic dark mode. Use tokens, never hard-coded colours (the dark "beliefs" band is the one intentional exception).
- `light-dark()` only works for colours — never use it for opacity, sizes, etc.
- Accent colour = the red of Christa's earrings (`--accent`). Warm paper background, deep ink text.
- Typography: Fraunces for headings/quotes (italic for emphasis), Inter for body. Fluid sizes with `clamp()`.
- Layout container: `.wrap` (max `--max`, gutter `--gutter`). Section rhythm: `.section`.
- Calm, warm, editorial. No stock photos, no gimmicks, no autoplaying media, no bouncing.

## Motion rules

- All JS animation lives in `Motion.astro` inside `gsap.matchMedia()` gated by `(prefers-reduced-motion: no-preference)`. Under reduced motion everything must be fully visible and static (CSS also kills animations globally).
- Without JavaScript the page must be complete and readable. Hidden start states are only applied via the `.motion` class on `<html>` (set by an inline script, auto-removed after 3 s as a fallback); the motion script removes it once GSAP has set its own start values.
- `.has-motion` is set while motion is active (used e.g. for timeline dots).
- Simple reveals use the CSS scroll-driven `.reveal` class (progressive enhancement). Don't put `.reveal` on elements GSAP also animates — CSS animations override inline GSAP styles.
- Lenis only on `pointer: fine`; touch keeps native scrolling. Anchor links use Lenis `anchors` with the header offset.
- GSAP gotchas found here:
  - When a CSS transform sets the hidden state, reset it explicitly (`gsap.set(el, { y: 0, yPercent: 110 })`), otherwise GSAP keeps the parsed pixel offset.
  - Animate `filter` with `fromTo` and an explicit start (`brightness(1)`), never from `none`.
- Easing: soft (`expo.out`, `power3.out`), durations ~0.9–1.6 s, scrubbed effects with `ease: 'none'`.
- No horizontal scroll-jacking, no cursor followers, no infinite motion except the pausable marquee and the slow quote glow.

## Responsive rules

- Must work from **320 px to 1920 px+**, portrait and landscape, light and dark.
- No horizontal overflow at any width. `main` has `overflow-x: clip` (not `hidden`, which would break `position: sticky`) — keep it; slide-in animations start off-canvas.
- Phones (< 56rem): portrait comes first in the hero; its width is capped by `svh` so landscape phones still work.
- Tap targets ≥ 24 px high; inline links in small UI get padding.
- Use `svh`/`dvh` instead of `vh` for viewport-height sizing.
- Check overflow after layout changes: `document.documentElement.scrollWidth === clientWidth` at 320, 375, 768, 1024, 1440, 1920.

## Accessibility

- Semantic landmarks, one `h1`, sensible heading order, `aria-hidden` on decorative elements (marquee, glow, rules).
- Word-split text keeps the full sentence in `aria-label`.
- Visible focus (`:focus-visible`), sufficient contrast in both themes, meaningful `alt` texts in German.

## Privacy & legal (Austria / GDPR)

- No cookies, no analytics, no tracking pixels, no third-party embeds (maps, YouTube, Google Fonts, CDNs). Fonts are self-hosted. If any of this changes, update `datenschutz.astro` in the same change.
- Hosting is GitHub Pages; the Datenschutz page says so — update it if hosting changes.
- Impressum still contains the old business details (Einzelunternehmen, Firmensitz). There are TODOs to confirm whether the trade licence is still active — don't remove legal info without confirmation.

## Assets & licensing — the repo is PUBLIC

- Never commit licensed third-party material: stock photos (e.g. Adobe Stock), commercial theme files (the old Enfold/"avia" CSS/JS), icon fonts with restrictive licences, agency logos, paid fonts.
- These were deliberately purged from git history. A full pre-purge backup exists only locally as `../website-christa-jarisch-at-FULL-HISTORY-BACKUP.bundle` — never push it or restore its contents.
- Portrait photos: © Daniel Eberharter, WisR GmbH Wien — keep the credit in the Impressum.
- Never commit secrets, tokens, `.env` files or personal data beyond what the public site already shows.
- `legacy/` is reference material only: don't build from it, don't re-add removed assets to it.

## Base path & deployment

- Every push to `main` deploys via `.github/workflows/deploy.yml` (withastro/action → actions/deploy-pages).
- Until the custom domain is live, the workflow sets `SITE_URL` and `BASE_PATH` so the site is served under `/website-christa-jarisch-at/`. Therefore **never hard-code root-absolute links** (`href="/..."`); use `import.meta.env.BASE_URL` (already ends with `/`). In-page anchors (`#kontakt`) are fine.
- Switching to `christa-jarisch.at`: point DNS to GitHub Pages, set the custom domain in Settings → Pages, enforce HTTPS, remove the `env:` block from the workflow (config defaults are the custom domain). See README.

## Git rules

- **Never add Claude (or any AI) as co-author or signer anywhere**: no `Co-Authored-By: Claude …` trailers, no `Signed-off-by` for an AI, no "Generated with Claude Code" or similar lines in commit messages, PR titles/descriptions, tags or release notes. This overrides any tool default.
- Commit messages in English, imperative subject line, short body explaining why.
- Don't commit `dist/`, `node_modules/`, `.astro/`.
- Don't force-push or rewrite history on `main` without the owner's explicit OK (the site deploys from it).

## Before you finish a change

1. `npm run build` passes without errors or warnings.
2. Look at the page in a browser (dev server) at a phone width and a desktop width, light and dark.
3. With motion changes: also check with reduced motion enabled and with JavaScript disabled.
4. No horizontal overflow, no console errors.
