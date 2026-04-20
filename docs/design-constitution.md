# DESIGN CONSTITUTION — Washi & Ash

LOCKED. Do not revisit.

## Aesthetic direction

"WASHI & ASH" — the website as a museum monograph. Quiet, editorial, patient. The craft speaks; the design steps back.

## Color palette

All declared as CSS custom properties in `src/styles/tokens.css` (source of truth — consult that file for the canonical values):

| Token          | Hex       | Role                                                             |
|----------------|-----------|------------------------------------------------------------------|
| `--ink-washi`  | `#F2ECDF` | unbleached paper (base; never pure white)                        |
| `--ink-sumi`   | `#1A1613` | sumi ink (text; never pure black)                                |
| `--ink-ash`    | `#6B6259` | stone gray (secondary, hairlines)                                |
| `--ink-hanko`  | `#8B1A1A` | red seal — used EXACTLY TWICE on the page                        |
| `--ink-ember`  | `#7A3A1F` | forge heat, clipped to blade silhouette in §IV, fades by stage 4 |

Red appears twice, both earned:
1. The current generation's hanko in §III
2. The submit stamp in §VI

See learning #30 for why you must NOT add extra craft to the red moments.

## Typography

All self-hosted via `@fontsource`:

- **Display** — Fraunces Variable (opsz + wght axes). USE `font-variation-settings`, never `font-weight` alone.
- **Japanese** — Shippori Mincho B1 (for kanji and Japanese words).
- **Mono** — JetBrains Mono Variable. Meta, numerals, labels — 11px uppercase with ~0.14em tracking.

## Motion philosophy

Hushed, deliberate, scroll-reactive.

- ScrollSmoother at `smooth: 1.4` — long, deliberate, "patient" feel.
- Text reveals via ink-bleed SVG masks, not opacity fades.
- Scroll-driven animations respond to the user; they don't play at them.
- One cinematic moment (the forge) framed as a museum vitrine.
- Duration is not a signal of quality — but see learnings #17 and #21 for the counter-edges. For mixed-length text, per-element duration SHOULD scale with length (hybrid A+B pacing).

## Depth approach

2.5D. Paper grain overlay everywhere (added at Step 7), ink-wash background layers at slow parallax, the knife rendered as six distinct SVG plates that crossfade under a scroll-pin (see `architecture.md` §IV for the pivot from MorphSVGPlugin to asset-crossfade; learnings #35–#38 for why).

NO 3D library. NO canvas particles. NO WebGL.

## Asset strategy

NEAR-ZERO external sourcing. All atmosphere, texture, typography, and kanji/ink-wash work is generated in code (SVG + CSS + fonts). The one exception is §IV's six knife-stage SVGs, which are user-supplied AI-traced vectors cleaned up in `/public/` (learning #36 for the pipeline; learning #35 for why this is the right division of labor).

No stock photography. Nothing we didn't author.

## Forbidden list — what WASHI & ASH CANNOT do

- ✗ Loud color, saturated gradients, SaaS-pricing-page purples
- ✗ Fast or snappy motion — everything breathes
- ✗ Sales energy ("Buy now" timers, FOMO, testimonials)
- ✗ Glassmorphism, kinetic type trends, card grids
- ✗ Stock photography (we don't use any imagery we didn't author)
- ✗ Inter, Roboto, Space Grotesk, system-ui as headline fonts
- ✗ Material Design shadows
- ✗ Generic hero of "headline + subhead + two centered CTAs"
- ✗ Three cards in a row with icon+heading+body
