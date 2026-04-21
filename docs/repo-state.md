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
  - `#smooth-wrapper > #smooth-content > <main id="page">` with §I (threshold) through §VII (colophon) markup.
  - §VII colophon: centered block — `svg.colophon__rule` with two `<path>` segments + inline `<defs><filter id="colophon-wash">` (local thin-stroke filter; **not** global `#ink-wash` — see learning #47), two-line copy, `終` mark. Verbatim copy per `architecture.md` §VII.
  - §VI's markup includes its OWN local `<filter id="invitation-baseline-ink">` inside the section's baseline SVG (NOT in the top-level defs) — `filterUnits="userSpaceOnUse"` with explicit viewBox bounds (learning #44). Kept local so the error-path `baseFrequency` ramp animates freely without disturbing §II/§III references to the global `#ink-wash` / `#ink-bleed`. §VI's hanko DOES reuse the global `<symbol id="hanko-frame">` and global `#ink-wash` / `#ink-wash-echo` filters.
  - §II kanji SVG has its own `<defs>` with a `radialGradient` + mask; mask circle default `r="900"` (progressive enhancement).
  - §III brush SVG has local `<defs>` with a `<path id>` silhouette reused by two `<use>`, a `linearGradient`, and a mask with a rect that scrubs its `y` attribute for the density band (learning #29).
  - §IV markup is six `<article class="forge__plate">` blocks, each containing a stage index, an `<img>` loading its `/public/*.svg`, a caption, and a note.

### `/public/`

- `blob1.svg` — Stage 1 (raw tamahagane chunk). User-supplied AI-traced SVG. Background rect stripped; viewBox tightened to `280 270 970 485`; all detail paths preserved. 30KB.
- `blob2.svg` — Stage 2 (elongated hot billet). User-supplied. Background stripped; viewBox `190 365 1160 285`. 26KB.
- `s3.svg … s6.svg` — Stages 3–6 (rough-forged → quenched → polished → handled). User-supplied. All share source canvas 1024×501 (≈2:1). Background rect stripped; `viewBox="0 0 1024 501"` set on each. Detail paths preserved exactly as traced — that's what gives each stage its 3D read. See learning #36 for the cleanup pipeline.

### `/src/`

- `main.js` — entry; section init ORDER is `initPlace → initLineage → initForge → initPhilosophy → initInvitation → initColophon → initChrome → initThreshold`, then `releaseRevealGate()` from `reveal-gate.js` (learning #24 — drops `html.js-pending` once every section has queued synchronous hidden state). `initThreshold` must stay last among section inits. `initChrome` registers persistent UI (wordmark, chapter, cursor) via `ScrollTrigger` `onUpdate` + `scrollEnd` + `refresh` (ScrollSmoother-safe when `scroller` is set); chapter label picks the **last** section whose effective rect contains the viewport midline (§IV pin uses `.forge__inner` while `.forge--pinned` — fixes stuck “IV — The Forge”). `ScrollTrigger.refresh()` at end of `initThreshold` (and reduced-motion early return) updates chrome after §I SplitText. `atelier-dust.js` (Three.js fullscreen fragment shader, `#atelier-dust`; **CSS** `mix-blend-mode: soft-light`, host opacity ~0.88; skipped when `prefers-reduced-motion`) is dynamically imported after `initMotion` so the main chunk stays smaller. `initColophon` runs before `initThreshold` so synchronous `gsap.set` on the colophon rule segments (DrawSVG hidden state + opacity release) runs before the gate lifts. §VI does not write FOUC-gated targets; slot placement is consistency + future-proofing.

### `/src/styles/`

- `main.css` — imports `tokens → reset → typography → layout → atelier-dust.css → chrome.css → sections/threshold.css → … → colophon.css`. Order matters (learning #5).
- `tokens.css` — full Design Constitution as CSS vars (READ THIS FIRST — source of truth). §V adds `--philosophy-offset`. Post–grain: `--ink-meta` (darker than `--ink-ash` for ~11px mono on multiplied paper) and `--shadow-fine-on-washi` (micro halo for `.meta` legibility — learning #46).
- `reset.css` — modern reset, headings non-bold by default.
- `typography.css` — base type, utility classes (`.colossus`, `.display`, `.prose`, `.quote`, `.meta`, `.ja`).
- `layout.css` — page structural rules; `html[data-smoother="on"]` scoping for fixed `#smooth-wrapper`; `#smooth-wrapper { position: relative; z-index: 1 }` stacks content above the grain. **Page-wide paper grain:** `body` uses `background-image` (SVG noise, base64 from `scripts/grain.svg`), `background-blend-mode: multiply` with `background-color: var(--ink-washi)` from typography, `background-attachment: fixed`, `background-repeat: repeat` (learning #45). Not implemented via `body::before`.
- `sections/threshold.css` — §I layout + typography + the `html.js-pending` pre-reveal CSS gate.
- `sections/place.css` — §II layout + typography + extended `html.js-pending` gate for §II targets + `.place__line` rules for SplitText line mode.
- `sections/lineage.css` — §III layout + typography + hanko stamp rules + brush base/dense styles + `.lineage__quote-line` rules for SplitText + `html.js-pending` gate for §III targets + narrow-viewport overrides. Brush silhouette height is explicit via `calc()`.
- `sections/forge.css` — §IV layout + typography + plate sizing rules. Three size variants — `.forge__plate-img--chunky` (stage 1: max-height 260 / max-width 600), `.forge__plate-img--billet` (stage 2: max-height 180 / max-width 100%), `.forge__plate-img--blade` (stages 3–6: max-height 360 / max-width 100%). Mobile breakpoint at ≤720px (180 / 130 / 240 respectively). Rationale in CSS comments and learning #37. Pinned layout is keyed to `.forge--pinned` (learning #39), NOT to `html[data-smoother]`.
- `sections/philosophy.css` — §V layout + typography + asymmetric second-line rules. `min-height: 100svh`, `display: grid`, `grid-template-rows: 40fr auto 60fr` for optical-centre-at-42vh. `.philosophy__sentence` at `--type-display` w/ `opsz 96 / wght 320 / line-height 1.1 / ls --ls-tight`. `.philosophy__line--second` offsets via `margin-inline-start: var(--philosophy-offset)`, tighter `letter-spacing: -0.02em`, `margin-block-start: 0.12em`. FOUC gate: `html.js-pending .philosophy__sentence { opacity: 0 }`, overridden inside `prefers-reduced-motion`. Narrow viewport ≤720px steps type to `--type-h2` and shrinks offset to 60%.
- `sections/invitation.css` — §VI layout + typography + baseline-as-input rules + hanko confirmation rules. `min-height: 80svh`, narrow-column left-aligned composition. **Local `::before` paper grain removed** — page-wide body grain applies; earlier `isolation: isolate` removed so multiply grain reaches §VI. Baseline SVG `height: 4px` / viewBox match (learning #44). `.invitation__email` bare input; baseline darkens via `:focus-within` + `:has(:not(:placeholder-shown))`. Submit `.invitation__submit` — no box; focus-visible ink underline. Error `.invitation__error` — `.meta` + `var(--ink-sumi-60)`. `.invitation--sent` keys form→confirmation flip (learning #39). Confirmation CSS-hidden, not `html.js-pending` (learning #23).
- `sections/colophon.css` — §VII centered colophon; rule segments FOUC-gated via `html.js-pending .colophon__rule-seg`; copy at reading scale; `终` via `.ja`; local rule filter reference in markup (`#colophon-wash`).

### `/src/modules/`

- `motion.js` — GSAP + ScrollSmoother only (`ScrollTrigger`, `ScrollSmoother` registered here). **DrawSVGPlugin is NOT imported here** — it is imported and registered alongside ScrollTrigger in `colophon.js` only (§VII sole consumer; learning #47). Exports `registerTrigger(trigger)` (learning #13). Debounced `window.resize` → `ScrollTrigger.refresh(true)` (§IV 6c).
- `threshold.js` — §I motion: entry timeline (variable-envelope per-word reveal), idle-reactive opsz breathing, exit scrub, reduced-motion short-circuit. Does **not** remove `html.js-pending` — `reveal-gate.js` does, from `main.js` after this init returns.
- `place.js` — §II motion: radial-mask kanji reveal, line-by-line prose bleed, ambient blob rotation (gated by section-in-view, learning #27), exit scrub, reduced-motion short-circuit. Font-ready gated SplitText (learning #26).
- `lineage.js` — §III motion: per-generation reveal timelines (head + hanko settle + name bleed + role fade + quote lines hybrid A+B), brush density scrub (mask rect `y`-attribute tween), reduced-motion short-circuit. Font-ready gated SplitText. Synchronous initial state written BEFORE `releaseRevealGate()`.
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
- `philosophy.js` — §V motion: single-sentence scroll-triggered word-by-word reveal with scroll-interruptible fast-forward. Reduced-motion short-circuit returns before any side effects. Synchronous `gsap.set(sentence, { opacity: 0 })` runs in the FOUC gate window; SplitText + per-word hidden state are written inside `document.fonts.ready` (learning #26). Hybrid A+B pacing with "one-sentence still-held" constants (learning #31): `BASE 0.70s, SLOPE 0.05s/char, MIN 0.80s, MAX 1.80s, OVERLAP 0.50`. ScrollTrigger at `start: "top 65%"`, `end: "bottom top"` (NOT `once: true` — needs `onUpdate` for interrupt detection). `onEnter` plays a paused timeline, guarded by `revealStarted` flag so scroll-back does not replay. `onUpdate` compares sentence midpoint against viewport centre and fires `fastForward()` if crossed while timeline is still running — pauses timeline, kills word tweens, snaps remaining words to final state at 120ms + 40ms stagger, power2.out, then `clearProps` (learning #42). No ambient motion, no exit animation (learning #43). Header comment enumerates the absences explicitly.
- `invitation.js` — §VI motion + interaction. Submit handler (preventDefault, permissive regex validate, idempotent `submitted` flag), confirmation timeline (two-glyph-pass hanko press on the `hanko-frame` symbol + receipt fade-in, paused + played-once per learning #41), error path (baseline `feTurbulence baseFrequency` ramp 0.9 → 2.8 → 0.9 across ~400ms via yoyo + `setAttribute` reset for float-ε safety; mono error line via `aria-live="polite"`). Tunables block at the top: `FROM_SCALE 1.4`, `ROT_FROM -8°`, `HANKO_EASE back.out(2)`, `HANKO_DURATION 0.85s`, `RECEIPT_OFFSET 0.25s`, `SIMULATED_LATENCY 420ms`, `WOBBLE_PEAK 2.8`, `WOBBLE_HALF_DURATION 0.2s` (×2 via yoyo). Each constant differs from §III's hanko constants per learning #33's "smaller stamp → more overshoot" rule (§III: -6° / back.out(1.2) / 0.75s). Reduced-motion branch keeps semantic state changes (`.invitation--sent` flip, error line text) but skips the GSAP tweens. Does NOT participate in the `html.js-pending` FOUC gate — the form + letter are authored visible (learning #23); confirmation is plain-CSS hidden.
- `colophon.js` — §VII only. Registers `ScrollTrigger` + `DrawSVGPlugin`; synchronous `gsap.set` on `.colophon__rule-seg` (`drawSVG: "0% 0%"`, `opacity: 1`) before gate removal; paused timeline to `drawSVG: "0% 100%"` (two paths converging at centre); `ScrollTrigger` `once: true`, `start: "top 78%"`; reduced-motion short-circuit (no tweens); `clearProps` on draw complete. Dev-only `[colophon]` console traces.
- `reveal-gate.js` — `releaseRevealGate()` only; called from `main.js` after `initThreshold()` (learning #24).
- `chrome.js` — Persistent UI: wordmark (fine-pointer hover deepen), chapter label (ScrollTrigger-driven midline pick; §IV uses `.forge__inner` when pinned), ink-dot cursor (fine pointer). No scroll-progress bar.
- `atelier-dust.js` — Dynamically imported from `main.js` after `initMotion`. Three.js fullscreen `ShaderMaterial` on `#atelier-dust`; no init when `motion.prefersReducedMotion`. Pair with `atelier-dust.css` (`z-index: 2`, `soft-light`, below `.app-chrome`).

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

### §V (philosophy)
```
[philosophy] init
[philosophy] fonts ready, splitting sentence
[philosophy] SplitText produced 8 words
[philosophy] word timing: Eighteen[env=1.10s @0.00s] · months[env=1.00s @0.55s] · to[env=0.80s @1.05s] · make.[env=0.95s @1.45s] · A[env=0.80s @1.93s] · lifetime[env=1.10s @2.33s] · to[env=0.80s @2.88s] · keep.[env=0.95s @3.28s]
```
On scroll into §V: `[philosophy] reveal timeline started`. If completed uninterrupted: `[philosophy] reveal timeline complete`. If scroll-interrupted: `[philosophy] reveal interrupted by scroll → fast-forward N remaining words → fast-forward complete`.

Short-circuit: `[philosophy] reduced-motion → final state`.

### §VI (invitation)
```
[invitation] init
[invitation] submit handler wired, confirmation timeline built (paused)
```
(Reduced-motion path logs `[invitation] reduced-motion → handler wired, no timeline` instead of the "confirmation timeline built" line.)

On submit with invalid email: `[invitation] submit invalid → wobble + error` (reduced-motion: `[invitation] reduced-motion → invalid, error announced`).
On submit with valid email: `[invitation] submit valid → success in 420 ms` → `[invitation] confirmation timeline started` → `[invitation] confirmation timeline complete` (reduced-motion: `[invitation] reduced-motion → success snap`).

### §VII (colophon)
```
[colophon] init
[colophon] draw timing: duration=1.00s ease=power2.inOut start=top 78%
```
On scroll into §VII (non–reduced-motion): `[colophon] draw timeline started` → `[colophon] draw timeline complete`. Short-circuit: `[colophon] reduced-motion → final state`. Misconfigured segments: `[colophon] expected 2 rule segments, found N → aborting`.

## Section status + 6d/6e sign-off

- §I: BUILT + APPROVED. Variable-envelope pacing override is deliberate (learning #21). 6d walked through in writing. 6e code-level verified A, B, C; D, E, F, H, I flagged for user-in-browser during Step 7.
- §II: BUILT + APPROVED. 6d + 6e both complete; tests A, B, C code-level verified; D, E, F, H, I flagged for user-in-browser.
- §III: BUILT + APPROVED. Brush height truncation bug fixed. 6d + 6e complete; A, B code-level verified; C, D, E, F, H, I flagged.
- §IV: BUILT + APPROVED (static, motion, 6d, 6e). The path-morph → asset-crossfade pivot landed, shipped, is no longer re-openable. 6c built in seven tight passes (step log in `forge.js` header). A, B code-level verified; C, D, E, F, H, I flagged. Test B (reduced-motion) was verified at code level only — the MCP browser cannot emulate `prefers-reduced-motion` via available tools; user should re-run in DevTools → Rendering when convenient.
- §V: BUILT + APPROVED (static, motion, 6d, 6e). 6c built in three passes (hidden state + SplitText → reveal timeline → scroll-interruptible fast-forward). A, B, C code-level verified; D, E, F, H flagged for user-in-browser during Step 7. G passes trivially (§V has no interactive elements). I deferred per the ritual. Tuning constants (`OVERLAP 0.50`, `FF_STAGGER 0.04`) landed at handoff defaults and may be revisited in Step 7 polish — see architecture.md §V flagged follow-ups.
- §VI: BUILT + APPROVED (static, motion, 6d, 6e). 6c built in two passes (submit + confirmation timeline → error path wobble + message). A, B (rest), C (focus), D (error path), E (error clear), F (success path), G (hanko vocabulary reuse) code-level + automation-verified. Enter-key submission, mobile viewport layout, and `prefers-reduced-motion` branch flagged for in-browser manual verification — automation tool limitations, not code defects. The invisible-baseline debugging during 6e produced learning #44 (`filterUnits="userSpaceOnUse"` required for `<line>` sources).
- §VII: BUILT + APPROVED (static HTML/CSS, DrawSVG rule motion, 6d/6e). Single motion: converging rule segments, `once: true`. No red on 終; local `#colophon-wash` filter (not `#ink-wash` — learning #47). Page-wide grain + `--ink-meta` + `--shadow-fine-on-washi` landed after §VII build to fix fine-type legibility (learnings #45–#46).

## Open infrastructure gaps

### Resize handling — WIRED

A debounced `window.resize` listener in `motion.js` calls `ScrollTrigger.refresh(true)` on all registered triggers. Verified during §IV 6c: live-resizing from 1920 → 720 rebuilds pin positions without ghost scroll offsets. §V/§VI/§VII inherit this for free. Do NOT remove.

Latent gap: SplitText itself does NOT re-split on resize — §I/§II/§III/§V all share this. If type scale jumps across the mobile breakpoint mid-session, word/line metrics used by clip-path math become stale. Low-impact because users rarely resize across the breakpoint after first paint. Document for Step 7; fix (if any) is a single `SplitText.revert()` + re-split inside the resize handler, which would be page-wide rather than per-section.

### FOUC gate removal — LOAD-BEARING ORDER

`releaseRevealGate()` in `reveal-gate.js` runs from `main.js` immediately after `initThreshold()`. Every section init that participates in the gate must queue its synchronous `gsap.set` (and any DrawSVG zero state) before that call. §VII's `initColophon` runs before `initThreshold`; §VI does not use the gate for its form — confirmation is CSS-hidden via `.invitation__confirmation`.

### Page-wide paper grain — APPLIED

Multiply-blended tiled SVG noise on `body` (`layout.css`; source SVG `scripts/grain.svg`, base64 embedded in CSS). §IV ember remains mask-contained to the billet; grain reads as paper beneath the whole page. Step 7 may still tune opacity/tile size or `scripts/grain.svg` matrix — not a greenfield add.

### Fine type on grain — MITIGATED

`--ink-meta` + `--shadow-fine-on-washi` on `.meta` and related meta-scale rules (learning #46). Large ash-toned display copy unchanged unless Step 7 review asks.

### Persistent UI layer + atelier dust — BUILT (Step 7)

- **`index.html`** — `.app-chrome` (wordmark, chapter, cursor shell); `#atelier-dust` host for WebGL canvas (before `#smooth-wrapper`).
- **`chrome.js` / `chrome.css`** — chapter label sync via ScrollTrigger on `#smooth-content` (ScrollSmoother-safe); wordmark hover (fine pointer); cursor on fine pointers.
- **`atelier-dust.js` / `atelier-dust.css`** — Three.js `ShaderMaterial` fullscreen plane; `soft-light` blend; rAF paused when document hidden; no canvas when `prefers-reduced-motion`. Step 7 tuned shader time evolution + host opacity so motion reads against the body grain (automation verified load + no WebGL console errors).

**Still latent:** SplitText does not re-split on resize (page-wide gap, not chrome-specific).
