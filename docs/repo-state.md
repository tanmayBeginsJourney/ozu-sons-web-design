# REPO STATE

Path: `c:\codeing\learndesign`
Dev server: `npm run dev` → `http://localhost:5173/`

## File manifest (files that exist and are verified working)

### Top-level

- `package.json` — stack locked, 5 deps.
- `index.html` — includes:
  - Inline `<script>` in `<head>` adds `html.js-pending` BEFORE first paint (learning #15).
  - Hidden SVG defs block (outside `#smooth-wrapper`) with THREE filters + ONE symbol:
    - `<filter id="ink-bleed">` — single-pass for §I word reveals, §III name + quote bleed.
    - `<filter id="ink-wash">` — two-pass for §II kanji + overlays, §III hanko frames + kanji, §III brush base + dense.
    - `<filter id="ink-wash-echo">` — two-pass w/ different seeds for §II echo glyph, §III hanko echo layers.
    - `<symbol id="hanko-frame">` — carved-square seal frame, reused 4× in §III.
  - No knife-silhouette paths in the top-level defs. §IV loads its visuals as `<img>` from `/public/` (see `architecture.md` §IV and learning #36). An explanatory comment marks where inlined knife paths used to live.
  - `#smooth-wrapper > #smooth-content > <main id="page">` with §I (threshold), §II (place), §III (lineage), §IV (forge) markup.
  - §II kanji SVG has its own `<defs>` with a `radialGradient` + mask; mask circle default `r="900"` (progressive enhancement).
  - §III brush SVG has local `<defs>` with a `<path id>` silhouette reused by two `<use>`, a `linearGradient`, and a mask with a rect that scrubs its `y` attribute for the density band (learning #29).
  - §IV markup is six `<article class="forge__plate">` blocks, each containing a stage index, an `<img>` loading its `/public/*.svg`, a caption, and a note.

### `/public/`

- `blob1.svg` — Stage 1 (raw tamahagane chunk). User-supplied AI-traced SVG. Background rect stripped; viewBox tightened to `280 270 970 485`; all detail paths preserved. 30KB.
- `blob2.svg` — Stage 2 (elongated hot billet). User-supplied. Background stripped; viewBox `190 365 1160 285`. 26KB.
- `s3.svg … s6.svg` — Stages 3–6 (rough-forged → quenched → polished → handled). User-supplied. All share source canvas 1024×501 (≈2:1). Background rect stripped; `viewBox="0 0 1024 501"` set on each. Detail paths preserved exactly as traced — that's what gives each stage its 3D read. See learning #36 for the cleanup pipeline.

### `/src/`

- `main.js` — entry; section init ORDER is `initPlace → initLineage → initForge → initThreshold`. This ordering is LOAD-BEARING (learning #24). When §V ships, its `initPhilosophy` (or equivalent) must slot BEFORE `initThreshold` — keeping `initThreshold` last — and must write its synchronous hidden-state `gsap.set` in its happy path before control returns. Same for §VI and §VII.

### `/src/styles/`

- `main.css` — imports `tokens → reset → typography → layout → sections/threshold.css → sections/place.css → sections/lineage.css → sections/forge.css`. Order matters (learning #5).
- `tokens.css` — full Design Constitution as CSS vars (READ THIS FIRST — source of truth).
- `reset.css` — modern reset, headings non-bold by default.
- `typography.css` — base type, utility classes (`.colossus`, `.display`, `.prose`, `.quote`, `.meta`, `.ja`).
- `layout.css` — page structural rules; `html[data-smoother="on"]` scoping for the fixed `#smooth-wrapper`.
- `sections/threshold.css` — §I layout + typography + the `html.js-pending` pre-reveal CSS gate.
- `sections/place.css` — §II layout + typography + extended `html.js-pending` gate for §II targets + `.place__line` rules for SplitText line mode.
- `sections/lineage.css` — §III layout + typography + hanko stamp rules + brush base/dense styles + `.lineage__quote-line` rules for SplitText + `html.js-pending` gate for §III targets + narrow-viewport overrides. Brush silhouette height is explicit via `calc()`.
- `sections/forge.css` — §IV layout + typography + plate sizing rules. Three size variants — `.forge__plate-img--chunky` (stage 1: max-height 260 / max-width 600), `.forge__plate-img--billet` (stage 2: max-height 180 / max-width 100%), `.forge__plate-img--blade` (stages 3–6: max-height 360 / max-width 100%). Mobile breakpoint at ≤720px (180 / 130 / 240 respectively). Rationale in CSS comments and learning #37. Pinned layout is keyed to `.forge--pinned` (learning #39), NOT to `html[data-smoother]`.

### `/src/modules/`

- `motion.js` — GSAP + ScrollSmoother with progressive-enhancement scoping. `MorphSVGPlugin` + `DrawSVGPlugin` are imported but currently unused in the built sections; keep them imported (§VII uses DrawSVG). Exports `registerTrigger(trigger)` (learning #13). Also owns the debounced `window.resize` handler that calls `ScrollTrigger.refresh(true)` — landed during §IV 6c.
- `threshold.js` — §I motion: entry timeline (variable-envelope per-word reveal), idle-reactive opsz breathing, exit scrub, reduced-motion short-circuit. Removes the `html.js-pending` FOUC gate at the end of its synchronous init.
- `place.js` — §II motion: radial-mask kanji reveal, line-by-line prose bleed, ambient blob rotation (gated by section-in-view, learning #27), exit scrub, reduced-motion short-circuit. Font-ready gated SplitText (learning #26).
- `lineage.js` — §III motion: per-generation reveal timelines (head + hanko settle + name bleed + role fade + quote lines hybrid A+B), brush density scrub (mask rect `y`-attribute tween), reduced-motion short-circuit. Font-ready gated SplitText. Synchronous initial state written BEFORE threshold.js removes the CSS gate.
- `forge.js` — §IV motion: FULL IMPLEMENTATION.
  - Pin (~3 viewport heights, `pinSpacing: true`, `anticipatePin: 1`) with scrubbed crossfade across six `<img>` plates driven by a shared ScrollTrigger progress.
  - Layers:
    1. Plate opacity tween from normalized stage transitions (0.08 plateau, 0.08 transition, stage-6 plateau doubled to 0.16 for the film-cut hold).
    2. Ember warmth fade for stages 2→3 via a masked radial-gradient overlay with `mix-blend-mode: screen`.
    3. Per-stage micro-motions — vibration on stage 2, drift on stage 4, polish sweep on stage 5 (one dominant motion per stage, never layered).
    4. Monotonic integer stage counter updated only on flip (no dithering during scrub).
    5. SplitText word-by-word caption reveals (stages 2–6) held in paused timelines and played once on first entry (learning #41).
    6. Stage-6 film-cut signoff — counter opacity dims 1 → 0.4 over 0.6s, 0.9s after the flip into 06, reversed on scroll-back (learning #40).
  - Three short-circuit branches (reduced-motion / no smoother / narrow viewport ≤720px) all return BEFORE any pin, trigger, SplitText, or inline-style write, yielding the static contact-sheet fallback.
  - Adds `.forge--pinned` class ONLY on the happy path — CSS layout keys to that class (learning #39).
  - See `forge.js` header comment for the full step (i)–(vii) build log.

## Console traces on reload

### §I (threshold)
```
[threshold] init → SplitText produced 7 words → word timing: Four[env=0.87s @0.00s] · generations.[env=1.51s @0.39s] · ... → timeline started → timeline complete
```

### §II (place)
```
[place] init
[place] fonts ready, splitting prose
[place] SplitText produced N lines
[place] line timing: [env=...] ...
```
On scroll into §II: `[place] reveal timeline started → [place] reveal timeline complete`.

### §III (lineage)
```
[lineage] init
[lineage] fonts ready, building per-generation timelines
[lineage] gen 1: name[len=11 env=0.94s] quote=[0.74s @0.00s · ...]
```
(repeats for gens 2/3/4). On scroll into each generation: `[lineage] gen N reveal started → [lineage] gen N reveal complete`.

### §IV (forge), non-reduced-motion, desktop, smoother active
```
[forge] init — step (vii) pin + crossfade + ember (2) + micro-motion (stage2:vibration · stage4:drift · stage5:sweep) + caption reveals (5) + film-cut hold
```
On scroll into the pin, every stage flip: `[forge] stage N → M`.

### §IV short-circuit branches
```
[forge] reduced-motion → final state
[forge] no smoother → final state
[forge] narrow viewport → final state
```

## Section status + 6d/6e sign-off

- §I: BUILT + APPROVED. Variable-envelope pacing override is deliberate (learning #21). 6d walked through in writing. 6e code-level verified A, B, C; D, E, F, H, I flagged for user-in-browser during Step 7.
- §II: BUILT + APPROVED. 6d + 6e both complete; tests A, B, C code-level verified; D, E, F, H, I flagged for user-in-browser.
- §III: BUILT + APPROVED. Brush height truncation bug fixed. 6d + 6e complete; A, B code-level verified; C, D, E, F, H, I flagged.
- §IV: BUILT + APPROVED (static, motion, 6d, 6e). The path-morph → asset-crossfade pivot landed, shipped, is no longer re-openable. 6c built in seven tight passes (step log in `forge.js` header). A, B code-level verified; C, D, E, F, H, I flagged. Test B (reduced-motion) was verified at code level only — the MCP browser cannot emulate `prefers-reduced-motion` via available tools; user should re-run in DevTools → Rendering when convenient.

## Open infrastructure gaps

### Resize handling — WIRED

A debounced `window.resize` listener in `motion.js` calls `ScrollTrigger.refresh(true)` on all registered triggers. Verified during §IV 6c: live-resizing from 1920 → 720 rebuilds pin positions without ghost scroll offsets. §V/§VI/§VII inherit this for free. Do NOT remove.

### FOUC gate removal — LOAD-BEARING ORDER

Removed inside `threshold.js` at the end of its synchronous init. Current order (`initPlace → initLineage → initForge → initThreshold`) is one-misedit-away from regression — see learning #24 for the suggested Step 7 refactor (move gate removal to `main.js` after all section inits queue their synchronous `gsap.set`s). §V/§VI/§VII section modules must each add their init call BEFORE `initThreshold` and write their synchronous hidden-state `gsap.set` there.

### Paper grain page-wide texture — NOT YET APPLIED (Step 7)

§IV's ember warmth is CONTAINED via CSS mask to the billet silhouette specifically because the page-wide grain isn't there yet. If grain lands in Step 7, re-evaluate whether the mask is still needed (probably still yes — ember against plain washi paper is the whole point).

### Persistent UI layer — NOT YET BUILT (Step 7)

Chapter indicator, wordmark, scroll-progress rule, ink-dot cursor. The chapter indicator will need to register §IV's pin range ("IV — The Forge" displays across ≈3 viewport heights, not just at the section's start) — its implementation should read ScrollTrigger start/end from the registered triggers rather than hard-coding section offsets.
