# Nodestra Landing Page

## Project
React + TypeScript + Vite landing page for Nodestra — an AI airport voice assistant product.

## Commands
```bash
npm run dev      # start dev server
npm run build    # tsc + vite build
npm run lint     # eslint
```

## Key files
- `src/pages/LandingPage.tsx` — entire page (nav, hero, orb carousel, bento grid, integrations, footer)
- `src/styles/landing.css` — all landing styles, CSS custom properties
- `src/components/ui/globe.tsx` — WebGL globe (cobe library), used in the "Speaks 32+ languages" bento card

## Styling
- **No Tailwind in landing page** — uses plain CSS with custom properties in `landing.css`
- Color palette is black/white/gray only — no purple, no color accents
- CSS variables: `--text-dark: #111111`, `--text-mid: #555555`, `--text-soft: #888888`, `--border: #DDDDDD`, `--paper: #FAFAFA`
- `overflow-x: clip` on `.lp` (not `hidden`) — required to keep `position: sticky` nav working

## Orb carousel
- `ORB_SCENES` array in `LandingPage.tsx` — each scene has `cap`, `q`, `a`, `audioSrc`, `fadeOutSeconds`
- Audio fades out over the last 4 seconds via `ontimeupdate`
- `ORB_VARIANTS`: green, blue, pink, yellow, brown

## Globe (lang bento card)
- Wrapped in a fixed-size div to constrain it — currently `220×220px`
- `GLOBE_MARKERS` in `LandingPage.tsx` — "hello" in 7 languages with lat/lon coordinates
- Speech bubble labels are inline-styled (white pill, gray border, downward tail)

## Branch
Active branch: `3602kiva/landing-page-updates`
