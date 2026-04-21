# PAGE ARCHITECTURE — 7 sections

LOCKED. Do not re-architect. Each section's specific refinements are captured below exactly as the user approved them.

## Persistent UI layer — BUILT (Step 7)

Implemented above all sections, OUTSIDE `#smooth-wrapper`, in `index.html` (`.app-chrome`) and `src/modules/chrome.js` / `src/styles/chrome.css`:

- Top-left: "Ozu & Sons" wordmark (`.meta`), always visible.
- Top-right: chapter label (`aria-live="polite"`), updates on scroll — picks the **last** section whose vertical span contains the viewport **midline**; while §IV is pinned, uses `.forge__inner`'s rect so V–VII can win when their copy is on screen (not the pin spacer).
- Ink-dot cursor (halo + core, fine pointer / hover only) — `chrome-cursor-on` on `body` when enabled.

Atmosphere: fullscreen WebGL ink-wash turbulence in `#atelier-dust` (Three.js shader, `atelier-dust.js` + `atelier-dust.css`) — fixed, `z-index: 2` above `#smooth-wrapper` (`z-index: 1`), below chrome (`--z-ui`). `mix-blend-mode: soft-light`; skipped when `prefers-reduced-motion`. Dynamically imported from `main.js` after `initMotion` to keep the main chunk smaller.

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

MorphSVGPlugin is **not** used anywhere on the site and is **not** imported. **DrawSVGPlugin** is imported and registered only in `colophon.js` (with `ScrollTrigger`) for §VII's rule — not in `motion.js`. Do not move DrawSVG to `motion.js` unless multiple sections need it (avoids loading the plugin for pages that never scroll to §VII during dev — marginal, but keeps a single consumer clear).

## §V — THE PHILOSOPHY   [BUILT + APPROVED]

Static + motion both approved. 6d + 6e complete. The exhale after §IV's cinema — one sentence, two lines, held in full viewport. §V is the one section on the page with zero ambient motion and no exit animation. The narrative justification: the knife has been made; what's left is the meaning, held as a single line. The stillness extends §IV's stage-6 film-cut hold (learning #40) from the object to the frame itself.

### Copy

Verbatim, hard line break preserved:

    "Eighteen months to make.
     A lifetime to keep."

### Composition

- Section is 100svh. Sentence's optical centre sits at ≈42vh (classical book-page asymmetry — mathematical centre reads low; the eye weights the upper portion, so we lift above geometric centre). Implemented via `grid-template-rows: 40fr auto 60fr` with the sentence in the middle row.
- Typography: `--type-display` at `font-variation-settings: "opsz" 96, "wght" 320`. Line-height 1.1 (looser than `.display`'s default `--lh-tight` 0.92 so the couplet breathes between lines). First line carries `--ls-tight` (-0.015em) as the sentence base.
- TYPOGRAPHIC DISRUPTION (the whole typographic move): second line offset `--philosophy-offset` (`clamp(1.25rem, 2.5vw, 2.5rem)` ≈ 40px desktop) to the right of the first line's left edge, with `letter-spacing: -0.02em` (tighter than the sentence base), and a `margin-block-start: 0.12em` controlled beat between lines. NOT centred. The asymmetry is what keeps the couplet from reading as a symmetrical poster pull-quote.
- Narrow viewport (≤720px): step type down to `--type-h2` so both lines fit single-line each; shrink offset to 60% of desktop so the asymmetry still reads proportionally. Tracking shift stays verbatim — it's a character trait, not size-dependent.

### Entry reveal — EXECUTION

- SplitText across both lines as one ordered `words` array of 8 elements. Per-word vocabulary matches §I's `threshold__word` exactly: opacity 0→1, yPercent 18→0, clipPath inset from right-clipped `(-0.5em 100% -0.5em 0)` to extended `(-0.5em -8% -0.5em -8%)`, `url(#ink-bleed)` filter + blur 5px→0px, `willChange` during transition. Last word's `onComplete` calls `clearProps` on all words so static state is CSS-driven.
- Hybrid A+B pacing per learning #31's "one-sentence still-held" constants: `BASE 0.70s, SLOPE 0.05s/char, MIN 0.80s, MAX 1.80s, OVERLAP 0.50`. These landed as starting constants without needing live-tune; expect to revisit OVERLAP in Step 7 polish if the cadence reads packed. Total reveal duration ≈ 4.2s — the slowest reveal on the page, §V's patient scale by design.
- Trigger: ScrollTrigger at `start: "top 65%"`, `end: "bottom top"` (full-range, NOT `once: true` — we need `onUpdate` to fire through the reveal). Reveal timeline built `paused: true`; `onEnter` plays it once, guarded by a `revealStarted` flag so re-entry on scroll-back does not replay.
- Fonts-ready gate: SplitText runs inside `document.fonts.ready.then(...)` (learning #26). The sentence container carries inline `opacity: 0` during the async wait — same pattern as §II's prose container, learning #24.

### Scroll-interruptible fast-forward — EXECUTION (unique to §V)

When the user scrolls past the sentence block's midpoint while the reveal timeline is still running, remaining un-revealed words snap to final state at 120ms duration + 40ms stagger, power2.out.

Implementation:

- `onUpdate` on the same trigger computes `sentence.getBoundingClientRect().top + rect.height/2` against `window.innerHeight/2`. When the sentence's vertical midpoint crosses above the viewport centre, `fastForward()` is invoked.
- The interruption condition is expressed against the DOM directly rather than the trigger's progress, because progress depends on §V's overall height (svh/dvh/address-bar variance) while the sentence's screen position is precisely what the editorial intent cares about.
- `fastForward()` pauses the timeline, calls `gsap.killTweensOf(split.words)` to cancel any in-flight per-word tween, filters remaining un-completed words by `revealTime < onsets[i] + envelopes[i]`, and runs a single `gsap.to(remaining, { ...final params, duration: 0.12, stagger: 0.04, ease: "power2.out", onComplete: clearProps })`. Idempotent via an `interrupted` flag.

Why §V uniquely earns this affordance (§I–§IV do NOT):
- §I's headline (3.4s) is short and positioned high in the viewport — readers rarely outpace it.
- §II/§III editorial reveals gate at `top 78%`, which places the reveal near the reader's viewport centre.
- §IV's captions play on discrete stage flips and are pinned inside a 3-viewport scroll range — the reader is always locked with the reveal.
- §V is held in a full viewport; a reader who has already read the sentence would otherwise be punished with a slow tail bleeding in behind them. The interruption is the editorial courtesy: "you're past it; we acknowledge that; moving on."

### Absence list — do NOT add any of these in Step 7

- No ambient motion (no idle-reactive breathing, no rotation, no blob, no grain-drift).
- No exit animation — NO scrub, NO blur, NO fade. The section just leaves the viewport naturally when scrolled past. Treat as turning past a printed page.
- No scroll-progress tell, no mono counter, no parallax, no z-layer depth.
- §V's "depth" is temporal (ink-bleed during reveal) and editorial (stillness after §IV's cinema), NOT visual layering. This is deliberate per learning #7 and extends learning #40's climax-subtraction rule.

### Reduced-motion + progressive enhancement

- `philosophy.js` returns immediately in the reduced-motion branch — no SplitText, no `gsap.set`, no trigger.
- CSS's `@media (prefers-reduced-motion: reduce) html.js-pending .philosophy__sentence { opacity: 1 }` overrides the FOUC gate so HTML's final state renders directly.
- HTML is authoritative (learning #23) — if JS fails entirely, the sentence is visible at its intended typography.

### FOUC gate participation

`initPhilosophy` slots into `main.js` BEFORE `initThreshold`. Its synchronous `gsap.set(sentence, { opacity: 0 })` runs before `releaseRevealGate()`. Per-word hidden state is written inside `fonts.ready`; the sentence container's inline `opacity: 0` covers the async wait window.

- Unique: the scroll-interruptible reveal (new pattern, reusable for §VII or any future full-viewport held-content reveal). Also unique: the absence of everything else — §V is the one section with zero ambient motion and no exit.

Flagged follow-ups (not blocking):
- `OVERLAP 0.50` landed without live-tune. If the cadence reads packed in Step 7 review, raise to 0.55–0.60 (higher spaces words further apart, which reads MORE patient). `ENV_SLOPE 0.05` is the next lever if 8-char words feel dragged (drop to 0.04 shrinks long words by ~0.08s).
- Fast-forward stagger total (40ms × up-to-7 remaining words + 120ms trailing ≈ 400ms) may feel long for a "snap to visible." If Step 7 review flags it, drop `FF_STAGGER` to 0.02 or remove entirely for a parallel snap.
- SplitText does NOT re-split on viewport resize. Shared gap with §I/§II/§III; not §V-specific. Document for Step 7.
- §V 6d + 6e complete. Tests A, B, C code-level verified; D, E, F, H flagged for user-in-browser during Step 7 polish (same posture as prior sections). G (keyboard/a11y) passes trivially — §V has no interactive elements. I deferred per the ritual (after §VI).

## §VI — THE INVITATION   [BUILT + APPROVED]

Static + motion both approved. 6d + 6e complete. The verb. §V was the held thought; §VI is the only section on the page with meaningful user interaction. Framed as a letter to the reader inviting them to commission a blade. Form-submission is treated as letter-writing ritual, not a UX moment — the hanko press + mono confirmation is the acknowledgement that the letter has been received, not a toast notification.

### Copy (locked)

Letter prose — verbatim, hard line breaks preserved:

    "To commission an Ozu blade, write to us.
     The current waitlist is eighteen months.
     We read every letter."

Submit button: "Send — 送る" (Fraunces + Shippori Mincho, no box, just type).
Receipt line (on success): "received — no. 042 · we will write back within a week".
Error line (on invalid submit): "please check the email address and try again".

### Composition

- Vertical, LEFT-aligned, narrow-column (`max-width: var(--measure-normal)`). Centered composition was considered and rejected — it would anchor §VI as a CTA poster, exactly the voice the monograph is avoiding.
- Letter at the top; comfortable gap down to the form; form mid-column. `display: flex; flex-direction: column; gap: clamp(3rem, 8vh, 5rem)`.
- `min-height: 80svh`, `padding-block: clamp(6rem, 14vh, 10rem)` — a breath before §VII, without feeling like a separate screen.
- **No** `isolation: isolate` — page-wide multiply grain on `body` must show through transparent regions; a local isolation stack would make §VI read flat while adjacent sections show fibre (retired with §VI's scoped `::before` grain layer).

### Letter prose — authored visible (no reveal)

The letter renders at full opacity on load. Deliberate decision at 6a: §V earned the page's "held sentence" reveal; §VI's attention must go to the INTERACTION (the field, the press, the receipt), not to another text reveal. Adding a reveal here would over-determine the section — learnings #7 and #30 argued against it.

### The handwritten baseline — EXECUTION (see also learning #44)

The email field has no border, no box, no container chrome. The line IS the input. Implementation:

- Bare `<input type="email">` with no framing, type set to `--type-lede`, transparent background, `color: var(--ink-sumi)`, placeholder in `--ink-ash`.
- Immediately below the input: an inline `<svg class="invitation__baseline">` with viewBox `0 0 600 4`, `preserveAspectRatio="none"`, containing a single `<line>` with `stroke="currentColor"`, `stroke-width="2"` in viewBox units, and a local `filter="url(#invitation-baseline-ink)"`.
- The filter is LOCAL to the §VI SVG — NOT `#ink-wash` from the top-level defs — so the error-path `baseFrequency` ramp (see below) can animate without disturbing §II's kanji or §III's hankos that reference the global filters.
- `filterUnits="userSpaceOnUse"` with explicit viewBox bounds (`x="-5" y="-6" width="610" height="16"`) is LOAD-BEARING. The default `objectBoundingBox` collapses to an empty rect on `<line>` sources because `<line>` has zero geometric height, rendering the filter output invisible. Do NOT switch back to the percentage-based region; see learning #44.
- SVG CSS `height: 4px` matches viewBox height exactly so scaling is 1:1 vertically and `stroke-width: 2` renders as honest 2 CSS pixels. `stroke-width: 1` on a squished viewBox renders sub-pixel and effectively vanishes (also learning #44). Do NOT combine `vector-effect="non-scaling-stroke"` with the displacement filter — the stroke bypasses the filter's coordinate space and disappears.
- `margin-top: -0.22em` pulls the baseline up so its visual line sits approximately at the typographic baseline of the input text. Tuned in 6d with a debug highlight overlay; p/j/y descenders dip correctly below.
- Baseline's `color` is inherited. CSS rule: `.invitation__field:focus-within .invitation__baseline { color: var(--ink-sumi) }` else `var(--ink-ash)`. `.invitation__field:has(.invitation__email:not(:placeholder-shown)) .invitation__baseline { color: var(--ink-sumi) }` keeps the darkened state after content is typed and field blurs.
- `aria-hidden="true"` on the SVG — it's decorative ink; the input's own semantics carry the label.

### Submit button — typography, not a box

"Send — 送る" rendered as `<button type="submit">`. Fraunces for "Send —", Shippori Mincho for "送る", inline. `background: transparent`, no border, no box-shadow. Hover and `:focus-visible` show a thin `border-bottom` on the text itself (the "ink underline" from the brief), NOT a browser default outline. Focus override uses `outline: none` + the underline pseudo-rule. Cursor `pointer`, `color: var(--ink-sumi)`, slight opacity shift on hover.

Enter key from the input submits natively (standard HTML form + `<button type="submit">` — no custom keypress handler). Verified click-submit via automation; Enter-submit is native browser behavior and untestable through the browser MCP tool.

### Hanko stamp — reuses §III's vocabulary verbatim

On success (submit with valid email), the form fades out via the `.invitation--sent` layout class and a hanko stamp presses in. Execution:

- Reuses `<symbol id="hanko-frame">` from the top-level SVG defs. Do NOT author a second seal shape — this is the same symbol §III's four generation hankos reference.
- Two `<use>` passes on the frame (base + echo with different `#ink-wash` / `#ink-wash-echo` filter seeds, learning #28). Plus a Shippori Mincho 受 ("received") kanji inside, also base + echo.
- Kanji choice 受 is the studio's mark of receipt — deliberately different from §III's 源 / 誠 / 鉄 / 刃 per learning #30's "unique per hanko" rule. 受 is a single character, not a signature, consistent with the kanji-as-studio-stamp convention.
- Color via CSS: the hanko wrapper sets `color: var(--ink-hanko)` and the frame + kanji inherit via `fill: currentColor`. This is the SECOND and FINAL red moment on the page.

### Confirmation timeline — EXECUTION (learning #41, paused + earned-once)

Built once in `initInvitation`, played once on successful submit. Idempotent — re-submits after success are silent no-ops.

- Two glyph passes (base + echo frame, base + echo kanji) animate simultaneously from `{ scale: FROM_SCALE, rotation: ROT_FROM, opacity: 0, transformOrigin: "50% 50%" }` to `{ scale: 1, rotation: 0, opacity: 1, ease: HANKO_EASE, duration: HANKO_DURATION }`.
- Echo layer's static CSS offset (`--hanko-echo-x: 1.2`, `--hanko-echo-y: 0.8`) is authored in CSS; the tween lands at those values so the "pressed twice, slightly misaligned" read is preserved through the landing frame. If the echo offset constants ever drift from CSS, `clearProps` on timeline complete will snap the echo back.
- Receipt line (`<p class="invitation__receipt meta">`) fades in and drifts up 4px a beat AFTER the stamp lands (`RECEIPT_OFFSET 0.25s`, `RECEIPT_DURATION 0.6s`). Parallelizing would collapse the two signals into one visual event — exactly what the two-signal rule guards against.
- Tunables retuned from §III per learning #33 ("smaller stamp → more overshoot"): `FROM_SCALE 1.4`, `ROT_FROM -8°` (§III uses -6°), `HANKO_EASE back.out(2)` (§III uses `back.out(1.2)`), `HANKO_DURATION 0.85s` (§III uses 0.75s). The motion SHAPE is §III's vocabulary; only the numeric constants account for the smaller render size so the felt landing is proportional.

### Submit handler — contract and simulated latency

- `preventDefault()`, validate `emailInput.value.trim()` against a permissive regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) — intentionally NOT RFC-compliant. Returns "invalid", "rejected" (already submitted), or "accepted".
- On "accepted": `setTimeout(... SIMULATED_LATENCY 420ms ...)` then inside the same tick: add `.invitation--sent` class AND `confirmationTl.play()`. Both inside one `setTimeout` so the CSS form-fade and the GSAP stamp-press are visually synchronous. Separating them produced a one-frame "loading artifact" blink during 6d.
- 420ms is narrative, not real. The form has no endpoint; this is Step 7's call when / if a real submission target lands. If wired, the `setTimeout` body becomes the `fetch(...).then(...)` body.
- Idempotent `submitted` flag in closure. `gsap.play()` on an already-completed timeline is a no-op, but the early return also prevents the CSS class flip from thrashing.

### Error path — ink recoils, not a banner

On "invalid" submit: the baseline wobbles and a mono error line appears. Execution:

- `gsap.to(baselineTurbulence, { attr: { baseFrequency: 2.8 }, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1, onComplete: () => baselineTurbulence.setAttribute("baseFrequency", "0.9") })` — ~400ms total, ramps frequency from the resting 0.9 up to 2.8 and back. `0.9 → 1.5` barely reads; `0.9 → 4+` tips from "ink recoil" into "TV static." 2.8 is the "line was startled" zone.
- The explicit `setAttribute` on complete restores the literal resting value — GSAP yoyo can leave `baseFrequency` at `0.8999998…` on the return leg, which would have a second wobble start from an off-by-ε value.
- In-flight wobble is killed on rapid re-submits (`killTweensOf(baselineTurbulence)` via a retained `wobbleTween` ref) so overlapping tweens don't fight on the same attribute.
- Error line `<p class="invitation__error meta" aria-live="polite">` uses `.meta` voice (uppercase mono, letter-spaced, `var(--ink-sumi-60)` — NOT red). A red error would be the page's third red appearance and would dilute the hanko's earning. `aria-live="polite"` announces the text change to assistive tech without competing with the visual wobble for attention.
- `emailInput.addEventListener("input", clearError)` — correction is the reset, not another button. Input event fires on paste / autofill / programmatic clears too, all correct triggers.
- Only the baseline wobbles; NOT the whole form. The ink "recoils" rather than chrome popping in — keeps the ink metaphor that the baseline has been the field's voice all along.

### Paper grain — page-wide (historical note)

Earlier builds used `.invitation::before` for a heavier local grain. **Current build:** one multiply grain on `body` site-wide (`layout.css` + `scripts/grain.svg`; learning #45). §VI inherits the same fibre as other sections; no duplicate grain layer.

### Layout class — success state (learning #39)

`.invitation--sent` added to the section by JS on the happy path only. CSS keys:

- `.invitation__form` → `opacity: 0; visibility: hidden; pointer-events: none` (fades out via `transition: opacity var(--dur-breath) var(--ease-washi)`).
- `.invitation__confirmation` → `opacity: 1; visibility: visible` (both stamp and receipt line visible, the timeline having written their final values).

Until `.invitation--sent` is set, `.invitation__confirmation` is `opacity: 0; visibility: hidden` via plain CSS — NOT via `html.js-pending`. The form is authored visible; the confirmation is CSS-hidden. See FOUC gate note below.

### Reduced-motion branch

- Submit handler stays wired. Email validation runs. On "invalid": `showError()` writes the error line; NO baseline wobble (`motion.prefersReducedMotion` short-circuits `wobbleBaseline()` before it builds a tween). On "accepted": `.invitation--sent` flips; CSS transitions are collapsed to 1ms via `tokens.css`'s prefers-reduced-motion block, so the success state SNAPS in without the `back.out` settle.
- Semantic confirmation and semantic error both reach the user; only the "press" and "recoil" ceremonies are skipped.

### FOUC gate participation — NONE

§VI does NOT participate in the `html.js-pending` FOUC gate. The letter and form are authored visible (progressive enhancement, learning #23 — the form functions even if JS never runs). The confirmation block is hidden by plain CSS (`.invitation__confirmation { opacity: 0; visibility: hidden }`), not by the pending-gate. Nothing for `threshold.js`'s gate removal to coordinate with here — but `initInvitation` is still slotted BEFORE `initThreshold` in `main.js` for init-order consistency (any future FOUC-gated targets would need it to be earlier; no cost to adding the call now).

### Progressive enhancement posture (learning #23)

- `<form class="invitation__form" novalidate>` with a real `<input type="email" required>` and `<button type="submit">`. If JS never loads, the browser submits the form natively to the same URL (which Vite serves as the SPA shell); not a functional submission but also not a broken page. `novalidate` disables the browser's native validity bubble so the custom error UX can own the invalid-email path without racing against "please match the requested format" popups.
- The confirmation block is present in the DOM. Without JS, it remains `opacity: 0; visibility: hidden` per CSS — it's authored for the success state but never unhid, which is the correct no-JS state (the form submits natively; the page reloads; the reader is not mid-ritual).

### Flagged follow-ups (for Step 7)

- **Enter-key submission** not verifiable via the browser MCP automation (the tool's `browser_press_key` doesn't trigger implicit form submission — tool limitation, not a code defect). The markup + button type is correct for native Enter submission. User should verify manually: tab to the field, type an email, press Enter. If it fails, investigate at the tool level first before touching code.
- **Mobile viewport layout** (iPhone SE / 375–414px) not verified — `browser_resize` didn't honor the width change in this environment. "Send — 送る" wrap at narrow widths is a concern to confirm manually. If wrap occurs between "Send" and "—", the fix is `white-space: nowrap` on the button; if it occurs between "—" and "送る", accept it or add a `display: inline-block` on the kanji.
- **`prefers-reduced-motion`** branch code-level verified only. User should re-run in DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion" before Step 7 critique to confirm the snap-in success state and the non-wobbling error path both read as intended.
- **Wobble punch** — `WOBBLE_PEAK 2.8` is handoff default; if the recoil reads under-powered in Step 7 review, the next lever is a concurrent `feDisplacementMap` scale tween (`1.4 → 4 → 1.4`). Documented in `invitation.js` tunables block. Do NOT add it now — one dial, tune first.
- **Baseline vertical alignment** `margin-top: -0.22em` landed at the descender baseline. If Step 7 review wants the line at the main baseline instead (letters sitting ON the line rather than descending through it), the value goes toward `-0.30em` to `-0.35em`.
- **§VI 6d + 6e complete.** Tests A, B (rest-state), C (focus), D (error path), E (error clear), F (success path), G (hanko vocabulary reuse) code-level + automation-verified. Tests covering mobile, reduced-motion, Enter-submit flagged above for in-browser manual verification during Step 7.

### Critical execution notes (for future editors)

- **Do NOT add red anywhere else in §VI.** Error text is `--ink-sumi-60`, not red. Learning #30 is the page's red discipline — one instance in §III, one here, total two.
- **Do NOT enrich the hanko press.** No glow, no longer settle, no extra pulse, no different ease. The motion vocabulary matches §III by design (learning #30). `back.out(2)` + 0.85s is the final call.
- **Do NOT remove `filterUnits="userSpaceOnUse"` from the baseline filter.** The whole line will vanish — see learning #44.
- **Do NOT gate the confirmation with `html.js-pending`.** Progressive enhancement (learning #23) requires the form to work without JS; gating confirmation via the JS FOUC class would leave non-JS users at the unhid-confirmation state on a failed submit.

## §VII — THE COLOPHON (not a footer)   [BUILT + APPROVED]

Static + motion approved. Closing typographic note — not a footer. §VI was the verb; §VII is the page turning closed.

### Copy (locked, verbatim)

    "Set in Fraunces and Shippori Mincho B1.
     Composed in 2026 for Ozu & Sons, Sakai, Ōsaka."

### Composition

- **Centered** flex column (`text-align: center`, `align-items: center`). Only section where full centering is correct — printed matter's last page, not a letter (contrast §VI left column).
- **No** `min-height` floor tying to half the viewport — section sizes from content + padding so the closing beat does not read as empty canvas (tuned post-review).
- **Rule** — two `<path>` segments in an inline SVG (`viewBox="0 0 400 2"`), outer edges toward centre, converging at x=200. DrawSVGPlugin tween `drawSVG: "0% 0%"` → `"0% 100%"` per segment (`colophon.js`). **Not** global `#ink-wash`: that filter's displacement scale is tuned for kanji-sized geometry and shredded an early hairline build. Inline `<filter id="colophon-wash">` (`filterUnits="userSpaceOnUse"`, single-pass turbulence, small `scale`) — same ink *vocabulary*, correct magnitude (learning #47).
- **Copy block** — Fraunces at reading scale (not `--type-meta`); two `<span>` lines preserve breaks.
- **終** — `.ja` Shippori Mincho; `--ink-ash`; **no** `--ink-hanko` (learning #30). Larger than first-pass exploratory sizing; still a quiet signoff, not a stamp echo.

### Motion (single event)

- Paused timeline; `ScrollTrigger` `start: "top 78%"`, `once: true` — earned-once, no replay on scroll-back (learning #41).
- FOUC: `html.js-pending .colophon__rule-seg { opacity: 0 }`; synchronous `gsap.set` collapses draw + restores opacity before `releaseRevealGate()` in `main.js` (learning #24). Text and 終 never gated.
- Reduced-motion: no DrawSVG tweens; CSS `@media (prefers-reduced-motion)` + short-circuit in JS show the fully drawn rule.
- **Absent by design:** no text reveal, no 終 reveal, no ambient motion, no exit, no interaction, no red (learning #43).

### Strict exclusions (unchanged)

- No "no blade was photographed" line — cut after critique; do not re-add. No social links, email, copyright, build meta, or footer creep.

## Step 7 — polish pass (all 7 sections built)

**Remaining (in progress):**

- Typography / motion timing audit (section-level flagged follow-ups in §I–§VII above).
- Performance pass (WebGL layer already DPR-capped + visibility-paused; revisit only if profiling flags a hotspot).

**Landed (Step 7, ongoing):**

- FOUC gate release centralized: `src/modules/reveal-gate.js` (`releaseRevealGate()`), invoked from `main.js` immediately after `initThreshold()` — learning #24 refactor; `threshold.js` no longer removes `html.js-pending`.
- Micro-interactions (3, beyond persistent UI + atelier dust): (1) chrome wordmark hover ink deepen (fine pointer / hover), (2) §VI submit `:active` typographic press (`invitation.css`), (3) chrome cursor "ink tap" on pointer press/release (`chrome.js` + `chrome.css`), fine-pointer only and skipped in reduced-motion.

**Already shipped for Step 7 (tune / audit; do not re-build from zero):**

- Persistent UI layer — see **Persistent UI layer** at top of this file (`src/modules/chrome.js`, `.app-chrome`).
- Full-viewport WebGL atmospheric layer — `#atelier-dust` (`src/modules/atelier-dust.js`), soft-light blended; visibility tuned so slow drift reads against the page grain.
- Page-wide multiply paper grain on `body`, `--ink-meta` + `--shadow-fine-on-washi` for fine mono on grain (learnings #45–#46). Step 7 may tune these, not introduce them from zero.

Resize handling is already wired (landed during §IV 6c) — not a Step 7 task.

## Step 8 — brutal honest critique

Strongest element. Weakest section. What Pentagram/Fantasy/Superflux would say. 3 specific actionable improvements. The user has committed to running Step 7 and Step 8 — do not skip them.
