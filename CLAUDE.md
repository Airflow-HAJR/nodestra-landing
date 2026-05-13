# Nodestra Landing

## What this is

Marketing homepage for Nodestra — an AI voice and messaging platform for airport passenger navigation. This is one of four repos split from the original monorepo:

- **nodestra-landing** (this repo) — public marketing site
- **nodestra-signin** — auth / sign-in flows
- **nodestra-mapbuilder** — indoor map editor
- **nodestra-gategetter** — live gate / flight info service

## Stack

- **Framework:** React 19 + TypeScript + Vite 8
- **Routing:** React Router 7 (single route: `/`)
- **Styling:** Tailwind CSS 4 + shadcn/ui + Radix UI
- **Animation:** Motion 12 (framer-motion successor) + Lenis (smooth scroll)
- **3D:** Cobe (animated globe)
- **Infra:** Railway (see `railway.json`). Supabase creds in `.env.local` (not used by landing directly — kept for future analytics).

## Routes

```
/    → LandingPage  (only route — pure marketing, no auth)
```

External links (configured in `src/lib/appConfig.ts`):
- Sign-in: `VITE_SIGN_IN_PAGE` env var (defaults to `https://signin.nodestra.com`)
- Demo booking: Calendly — `https://calendly.com/patra-ritvik/30min`
- Contact: `mailto:hello@nodestra.com`

## Source layout

```
src/
  pages/LandingPage.tsx          # Top-level page — wires all sections
  features/landing/
    components/                  # All landing UI components (see below)
    hooks/                       # useScrollStory, useLenisScroll, useReducedMotion
    content.ts                   # ALL copy lives here — edit text here, not in components
    types.ts                     # LandingChapter, ProofCard, FaqItem, ChapterMoment, etc.
  components/ui/                 # Shared UI primitives (button, dialog, globe, text-flipping-board)
  lib/
    appConfig.ts                 # Sign-in URL + other runtime config
    utils.ts                     # cn() and other helpers
  styles/                        # CSS files
```

## Landing components

| File | Section |
|------|---------|
| `LandingNav.tsx` | Floating pill nav — logo + links + CTA |
| `HeroStage.tsx` | Animated departure board hero |
| `ProductIntro.tsx` | What is Nodestra + sample conversation |
| `VoiceFeaturesSection.tsx` | Feature highlights (32 languages, 0 apps, <4s) |
| `StoryChapter.tsx` + `ChapterVisual.tsx` | 4 scroll-driven story chapters |
| `CurveCarousel.tsx` | 3D curved carousel of 9 passenger personas |
| `ProofGrid.tsx` | Proof-point cards |
| `FaqAccordion.tsx` | 3-step FAQ |
| `AccessibilitySection.tsx` | Accessibility callout |
| `BookDemoDialog.tsx` | Calendly demo dialog |
| `VoiceOrb.tsx` | Animated orb visual |

## Brand & design tokens

**Color palette** (CSS vars defined in `src/styles/landing.css` `:root`):

| Token | Value | Role |
|-------|-------|------|
| `--lp-bg` | `#F5F0E8` | Warm cream page background |
| `--lp-surface` | `#FAFAF8` | Slightly cooler cream |
| `--lp-ink` | `#0F1423` | Near-black navy |
| `--lp-ink-soft` | `#4A5278` | Muted blue-violet |
| `--lp-muted` | `#9299B8` | Muted text |
| `--lp-muted-soft` | `#C1C7D8` | Faint / disabled |
| `--lp-accent` | `#4A5278` | Brand accent |
| `--lp-accent-deep` | `#0F1423` | Deep accent |
| `--lp-accent-soft` | `rgba(74,82,120,0.08)` | Accent tint |

**Typography** (fonts in `public/fonts/`):
- Logo wordmark: `"Migra"` Extrabold 800 — `Migra-Extrabold.otf`
- Display/headings: `"PP Neue York"` NormalExtrabold 800 — `PPNeueYork-NormalExtrabold.otf` (+ NormalMedium 500, NormalLight, italic variants)
- Body/UI: `"Clash Grotesk"` Variable — `ClashGrotesk-Variable.ttf`

**Texture:** `public/fern-pattern.jpg` — Maori koru pattern. Use at 5–8% opacity on pill nav and footer only. Never overlay full page sections.

**Brand assets** (`/public`): `logo.svg`, `favicon.svg`, `elevenlabs-logo.png`, `vapi-logo.svg`.

## Styling rules

All landing styles are in `src/styles/landing.css` (~3k+ lines), scoped under `.lp`. Add new landing styles there, not inline.

shadcn hijacks `--accent` to near-white in `index.css`. If you add map-builder or dashboard components to this repo, scope any accent override under a wrapper class — do not apply globally.

## Copy / content

Edit all user-facing text in `src/features/landing/content.ts`. Exceptions:
- Hero opening title and statement live in `HeroStage.tsx` (tightly coupled to animation)
- Chapter visuals with embedded labels live in `ChapterVisual.tsx`

## Local dev

```bash
npm install
npm run dev      # → http://localhost:5173
```

`.env.local` must exist with `VITE_SIGN_IN_PAGE` (or the default kicks in). Supabase vars are present but not actively used by the landing page.

## QA

Run `/qa` gstack skill against `http://localhost:5173` for visual/interaction QA.

## Common mistakes to avoid

- Do not put `.claude` in `.gitignore`.
- Do not edit copy directly in components — use `content.ts`.
- Do not use `var(--accent)` without a scoped override; shadcn sets it to near-white globally.
- Do not add auth/session logic here — this repo has no protected routes.
