# PAGE ARCHITECTURE — 7 sections

LOCKED. Do not re-architect. Each section's specific refinements are captured below exactly as the user approved them.

## Persistent UI layer — NOT YET BUILT (Step 7)

Above all sections, OUTSIDE `#smooth-wrapper`:

- Top-left: "Ozu & Sons" wordmark, 10px mono, always visible.
- Top-right: current chapter indicator ("II — The Place"), crossfades on section change.
- Bottom: hair-thin sumi-ink scroll-progress rule, 1px, full width.
- Ink-dot custom cursor (hidden on touch devices).

Deferred to Step 7 polish — do NOT build inline during sections.

## §I — THRESHOLD   [BUILT + APPROVED]

Variable-envelope pacing refinement in place.

- Massive colossus headline: "Four generations. One blade at a time."
- Meta top-left: "Ozu & Sons"; top-right: "No. 042"
- Bottom meta: "Sakai, Japan · since 1912" / "scroll ↓"
- Entry: meta fades in, then SplitText word-by-word reveal through ink-bleed mask. Per-word envelope and onset are BOTH length-scaled (learning #21).
- Current formula: `envelope = clamp(0.55 + len * 0.08, 0.6, 1.6)`, `nextOnset = currentOnset + currentEnvelope * 0.45`.
- For the hero line this yields: Four=0.87s @0.00, generations.=1.51s @0.39, One=0.79s @1.07, blade=0.95s @1.43, at=0.71s @1.85, a=0.63s @2.17, time.=0.95s @2.46. Total reveal ≈ 3.4s — past the "2.2s budget" the original brief set; override is deliberate per live user feedback.
- Ambient: paper grain barely flickers. Headline BREATHES via variable-font opsz axis — but ONLY when idle (no scroll delta for >1.5s). Any scroll input snaps the axis back to neutral 400. ±3 axis units, 12s period. Idle-reactive, NOT a loop.
- Exit: headline drifts up with slight blur via scrub on scroll.
- Unique: idle-reactive breathing headline.

## §II — THE PLACE   [BUILT + APPROVED]

Static + motion both approved.

- Giant 堺 (Sakai) kanji at ~78vw as watermark, cropped 14% off the left edge, rotated −1.2°.
- Narrow editorial column (`max-width: var(--measure-narrow)`) offset to the right.
- Static prose (locked by user):

    "Sakai sits at the mouth of the Yamato river, south of Ōsaka.
     In 1543, the first matchlocks in Japan came ashore here.
     The smiths who had been forging temple locks turned to gun barrels —
     then, when peace returned, to kitchen knives.
     An Ozu first took hammer to iron in 1912.
     By then the town had been forging blades for nearly four hundred years."

- Kanji execution: Shippori Mincho as SVG `<text>` with two glyph passes (base at opacity 0.92 with filter ink-wash seed A, echo at opacity 0.24 offset 4px/3px with filter ink-wash-echo seed B — "pressed twice" effect). Two hand-authored overlay paths (honest tail extending from right-side stroke, ink fleck above and right). Two-pass filter: low-frequency turbulence + displacement chained into high-frequency turbulence + displacement, for real non-uniform ink density.
- Ambient: sumi ink-wash blob (asymmetric 4-segment cubic path, opacity 0.055, blur 46px) rotates 0.3°/sec infinite, GATED by ScrollTrigger section-in-view (paused off-screen for CPU — learning #27).
- Entry: radial SVG mask with soft 78%–100% falloff, circle r animates 0 → 900 over 2.0s ease power2.out. Prose lines revealed via SplitText "lines" mode, braided to START 0.7s into the kanji reveal (timeline position `"-=1.3"`). Per-line envelope: `clamp(0.45 + len * 0.012, 0.55, 1.0)`. Onset overlap: `0.35 × currentEnvelope`.
- Exit scrub: kanji scales 1.09 (78vw → ~85vw), opacity → 0.35.
- Unique: kanji as watermark + hand-pressed ink irregularity via two-glyph-pass + two-overlay-paths.

Flagged follow-ups (not blocking anything):
- Overlay path coordinates eyeballed; may need nudging after longer preview.
- Echo layer at opacity 0.24 — if it ever reads blurry instead of "pressed twice," lower to 0.14 or remove entirely.
- §II 6d + 6e both complete; user approved.

## §III — THE LINEAGE   [BUILT + APPROVED]

Static + motion both approved.

- Four generations stacked vertically. Each block is a four-part composition: year (mono ash with `tabular-nums`), name (Fraunces Display opsz 48, h1 scale), role (Fraunces italic body, ash-toned caption), pull quote (Fraunces Italic, stepped 18% indent RIGHT of the name's left axis, sumi at 80%). A hair-thin sumi rule at 12% alpha runs under the year-and-hanko caption bar.
- RESOLVED — HANKO EXECUTION: Option F chosen. One reusable `hanko-frame` `<symbol>` in the top-level SVG defs (slightly-irregular carved square, `fill-rule: evenodd` hollow). Each generation renders the symbol twice (base + echo with different filter seeds per learning #28) plus a Shippori Mincho kanji inside (base + echo). `fill: currentColor` inherits from the generation wrapper — ancestors' color is `--ink-sumi`, the current generation's is `--ink-hanko`. First of two earned red moments on the page.
- RESOLVED — GENERATION COPY (locked by user approval):
  1. Ozu Gensuke  (1887–1961)  seal 源 "source"      Founder. Opened the first forge on Tenjin-machi in 1912.
     "I came to Sakai with my father's hammer. The forge was cold for three days before it would take heat."
  2. Ozu Makoto    (1914–1994)  seal 誠 "sincerity"   Second hand. Rebuilt the forge after the war.
     "The old forge was rubble. I set the first stone myself, and the second, and the third."
  3. Ozu Tetsurō   (1949–2018)  seal 鉄 "iron"        Third hand. Taught the current maker.
     "My son asked me how long a blade should be. I said: as long as it takes."
  4. Ozu Haruki    (1982–)      seal 刃 "blade" RED   Current hand. Still at the anvil.
     "I am still learning how my father listened to iron. The blade finishes when it finishes."

  The kanji progression 源 → 誠 → 鉄 → 刃 ("source → sincerity → iron → blade") is the spine. Tetsurō's "as long as it takes" and Haruki's "finishes when it finishes" deliberately braid one generation apart.

- Left-gutter brush-line — EXECUTION (see also learning #29): Variable-width silhouette authored as a filled closed path (NOT a stroke, so width varies along length). viewBox 40×1000, `preserveAspectRatio="none"` so it stretches to section height. Base `<use>` always visible at opacity 0.18 (progressive enhancement per learning #23). Dense `<use>` at opacity 0.7, masked by a rect filled with a vertical linear gradient (transparent-opaque-transparent); the rect's `y` attribute scrubs from -500 to 1000 as the user scrolls through §III, sliding the density band down the line. `#ink-wash` filter on both passes so the edge noise is continuous as density changes.
- Per-generation reveal — EXECUTION: Each generation has its own ScrollTrigger (`start: "top 78%"`, `once: true`) that plays an internal timeline. Timeline ordering: head fade-in (0.55s, power2.out) parallel with hanko settle (scale 1.2→1, rotation −6°→0°, 0.75s, `back.out(1.2)`) → name bleed (at 0.25s, envelope length-scaled via hybrid A+B with `NAME_ENV_BASE 0.5`, `SLOPE 0.04`, `MIN 0.6`, `MAX 1.1`, same clip-path + ink-bleed + blur mechanism as §I words) → role fade (overlaps name tail) → quote lines hybrid A+B reveal with prose values matching §II (`BASE 0.45`, `SLOPE 0.012`, `MIN 0.55`, `MAX 1.0`, `OVERLAP 0.35`).
- Red earns its moment through COLOR alone — the 4th hanko uses the SAME two-pass filter treatment, the SAME `back.out(1.2)` overshoot, the SAME duration as its three ancestors. Do NOT add extra motion or filter craft to it in Step 7 (learning #30).

Flagged follow-ups (resolved or deferred):
- Hanko-frame perimeter vertices are eyeballed (4,3 → 96,4 → 97,97 → 3,96). If the frame reads as mechanical vs carved-stone at small render sizes, widen the deviations. Still open.
- §III 6d + 6e — both complete; user approved. A and B code-level pass; C, D, E, F, H, I flagged for user-in-browser during Step 7 polish (same posture §I/§II were left in).
- Brush density scrub: 0.6 was chosen on a desk-mouse feel test only. Validate on trackpad + touch during Step 7.
- Brush height truncation ("brush ends somewhere in middle of gen 2") — RESOLVED. Root cause: inline SVG's intrinsic height dominated the CSS. Fix: explicit `calc()`-based height in `lineage.css` so the brush silhouette spans the full §III block regardless of copy length. User signed off.

## §IV — THE FORGE   [BUILT + APPROVED]

Full motion + film-cut hold. 6d + 6e complete. ≈3 screen-heights of pinned scroll. The cinematic set piece.

### MAJOR ARCHITECTURAL PIVOT — do not re-open

Original plan: ONE hand-authored SVG knife, six forging-stage PATHS that tween via MorphSVGPlugin under a pinned scrub.
Current plan: SIX self-contained SVG artifacts (user-supplied, one per stage, already in `/public/`) rendered as discrete `<img>` plates, assembled by the scroll into a morph-by-crossfade.
The architecture is different; the narrative beat is identical.

Why the pivot (documented so future agents don't try to "simplify back"):
- Hand-authored silhouettes at this quality bar are beyond both current-agent and current-consumer-LLM capability — AI-traced vectors from an image generator clear the quality bar; hand-authored paths do not (learning #35).
- The six stages are topologically incompatible: chunk of tamahagane → elongated billet → rough blade → clean blade → polished blade → blade-plus-handle-plus-ray-skin-wrap. MorphSVGPlugin interpolates anchor counts; it doesn't invent geometry. "Chunk → knife" under MorphSVG looks like a blob rearranging, not a smith forging (learning #38).
- Inlining ONLY the dominant silhouette path from each AI-traced SVG (keeping them as a single inline SVG with swappable `<g>`s) discarded the ~20–30 highlight/facet paths per trace that carry the 3D read. Stages 1 and 2 tried this and came back as "gooey slop."
- `<img>` with full SVG preserves every path and its fill color exactly as drawn. Trade: we lose path-level morph entirely. Gain: six distinct, beautifully-rendered objects that crossfade with ember, shake, and highlight.
- The quiet-editorial monograph voice PREFERS discrete, well-composed plates over a continuous software morph — see Muji product pages, 37signals detail shots. A morph would have read as "tech demo." A crossfade of six studied artifacts reads as "documentation."

### Stages (caption → visual asset → per-stage motion)

1. "Tamahagane, smelted in Shimane" — `/public/blob1.svg` (raw iron chunk, max-height 260 desktop) — **still**
2. "1450°C, folded over and over" — `/public/blob2.svg` (elongated hot billet, max-height 180 desktop, ~720 wide) — **vibration + ember glow inside silhouette**
3. "Shaped by hand, no mold" — `/public/s3.svg` (rough-forged blade, hammer marks visible) — **still** (ember fading from tip first as it crossfades in)
4. "Quenched in mountain water" — `/public/s4.svg` (cooled dark blade) — **drift only** (no ember by this stage)
5. "Polished on natural stones, seven grades" — `/public/s5.svg` (polished bright edge) — **highlight sweep along edge** (CSS mask)
6. "Handled in magnolia, wrapped in ray skin" — `/public/s6.svg` (finished knife with handle + ferrule) — **still** (film-cut hold)

Bottom: tiny mono counter "stage NN / 06" that updates discretely on stage boundaries — NOT a smooth percentage.

### Scale decision (locked — learning #37)

All six plates are sized so the sheet reads as one continuous series. Raw material (stages 1–2) is SHORT AND WIDE (chunk ≈ 600×260, billet ≈ 720×180). The blade plates (3–6) render at up to 100% column width and ≈360 max-height so the knife earns the largest plate — stage 6 is the narrative climax. "Conservation of mass" was originally going to be "raw material looks visually heavier"; after building it, we chose "finished product looks most present" instead, because the stage-6 knife is where the eye is supposed to land.

### Critical execution notes

- ONE dominant micro-motion per stage STILL HOLDS. Stages 1, 3, 6 are completely STILL. Stage 2: vibration + ember ONLY. Stage 4: drift ONLY. Stage 5: highlight sweep ONLY. Do NOT layer multiple motions per stage.
- Ember (stage 2) is CONTAINED: CSS `mask-image: url(/blob2.svg)` on a warm radial-gradient layer positioned over the billet, so ember warmth only paints within the billet's silhouette. The billet `<img>` renders on top at slightly lower opacity for the warm stages, full opacity for the cool ones. Ember fades to 0 across stages 2→3, gone entirely by stage 4.
- Highlight sweep (stage 5) follows the same mask pattern: a bright 2–6px wide radial blur masked to `/public/s5.svg`'s silhouette, travels from handle-end to tip along the blade's length, single pass during stage 5's scroll range. NOT a loop.
- Crossfade, not morph. Stages are `<img>`s stacked absolute within a shared plate stage; the scroll drives opacity (plus a brief 4% scale-in on the incoming stage to prevent a flat fade). Target transition band ≈0.08 normalized scroll units per stage, plateau of ≈0.08 on-stage held state. Six stages × (plateau + transition) ≈ 0.96 of the pin range; stage-6's plateau is doubled (0.16) for the film-cut hold.
- Caption reveals use the hybrid A+B pacing rule (learning #21 + editorial-prose constants from learning #31). Captions live in the DOM already; the reveals are wired as paused per-stage timelines played once on the first flip INTO each stage (learning #41). Stage 1's caption is authored visible; stages 2–6 reveal word-by-word + note fade on entry.
- Stage counter is THE discrete tell — updated in `onUpdate` based on which stage's plateau-or-transition the scroll progress falls within. No 2.3→2.4→2.5 dithering.
- Film-cut hold (learning #40) is three converging layers, not one animation: (a) BUDGET — stage 6's plateau is twice as wide; (b) STILLNESS — no micro-motion on stage 6; (c) SIGNOFF — counter opacity fades 1 → 0.4 over 0.6s, 0.9s after the flip into 06 (long enough for the caption reveal to complete), reversed on scroll-back.

- Entry: on pin-engage, plate 1 fades in via ink-bleed mask (600ms), counter appears as "01 / 06", caption 1 is authored visible.
- Exit: stage 6 holds still for the extended plateau, then pin releases. Knife stays on screen briefly as the user scrolls into §V.
- Unique: six studied artifacts, one cinematic scroll, no software morph. The morph is in the VIEWER's head. That is better than an interpolation.

### Layout-class pattern (learning #39)

CSS keys its pinned layout to a `.forge--pinned` class that `forge.js` adds ONLY on the happy path — AFTER all its short-circuits have passed. Three short-circuit branches (reduced-motion / no smoother / narrow viewport ≤720px) leave the class off → CSS renders the contact sheet → visible, legible, scrollable. Do NOT scope the pinned layout to `html[data-smoother]` — that attribute tracks only whether ScrollSmoother init succeeded, not whether forge.js actually wired the pin.

### MorphSVG / DrawSVG note

MorphSVGPlugin is NOT USED in §IV. It stays imported in `motion.js` (carries no cost). DrawSVG likewise unused in §IV but remains imported for §VII's final rule draw-in. Do NOT rip them out to "clean up."

## §V — THE PHILOSOPHY   [NOT YET BUILT — NEXT TASK]

See the top-level `handoff.md` for the full §V brief. When §V ships, move its brief into this file.

## §VI — THE INVITATION   [NOT YET BUILT]

Framed as a letter:

    "To commission an Ozu blade, write to us.
     The current waitlist is eighteen months.
     We read every letter."

- Single email input styled as handwritten line on paper:
  - Hair-thin sumi-ink baseline rule with feTurbulence displacement (hand-drawn, not machine-ruled).
  - NO border, NO box.
  - Placeholder "e.g., you@domain" in `--ink-ash`, fades on focus.
  - On focus, baseline darkens from ash to sumi.
- Submit button reads "Send — 送る" (Fraunces + Shippori Mincho, no box, just type).
- Keyboard-accessible (Enter triggers submit, visible focus outline styled as ink underline on button text).
- CRITICAL — two confirmation signals, not one:
  1. Hanko stamp presses down in `--ink-hanko` red (the SECOND and FINAL red moment on the page). Scales 1.4 → 1.0 with `back.out(2)` rotational settle.
  2. Text line below in mono: "received — no. 042 · we will write back within a week".
- Error states (invalid email): baseline ink ruling wobbles ~400ms, mono error message appears.
- Paper grain is slightly heavier in this section.
- Unique: form-submission treated as letter-writing ritual.

Patterns to reuse (from prior sections): two-glyph-pass for the stamp (learning #28), `<use>`-mask for the animated baseline (learning #29 + #34), "earned once" paused timeline for confirmation animation (learning #41), layout-class pattern for success state (learning #39).

## §VII — THE COLOPHON (not a footer)   [NOT YET BUILT]

    "Set in Fraunces and Shippori Mincho B1.
     Composed in 2026 for Ozu & Sons, Sakai, Ōsaka."

- Small 終 character centered below, faint.
- One hair-thin sumi-ink rule above, 30% width, centered, draws in via DrawSVG (left-to-center + right-to-center meeting in middle).
- The "no blade was photographed" meta-wink was CUT after critique — do NOT re-add it.

## Step 7 — polish pass (after all 7 sections built)

- Typography refinement.
- Motion timing audit.
- Atmosphere: page-wide paper grain, persistent UI layer, ink-dot cursor.
- Performance pass.
- Minimum 3 new micro-interactions.
- Refactor FOUC gate removal into `main.js` per learning #24.

Resize handling is already wired (landed during §IV 6c) — not a Step 7 task.

## Step 8 — brutal honest critique

Strongest element. Weakest section. What Pentagram/Fantasy/Superflux would say. 3 specific actionable improvements. The user has committed to running Step 7 and Step 8 — do not skip them.
