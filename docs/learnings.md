# LEARNINGS FROM PREDECESSORS

These are mistakes we made that cost time. Avoid them. Numbering is cumulative across all agents. DO NOT renumber.

For §V, read #7, #21, #23, #24, #26, #31 up front. Grep others on demand.

---

## 1. THE SCROLLSMOOTHER FIXED-WRAPPER TRAP

The original builder applied `position: fixed; inset: 0; overflow: hidden` to `#smooth-wrapper` unconditionally. When ScrollSmoother didn't activate (it doesn't in reduced-motion mode, and can fail silently for other reasons), the page became trapped at ONE viewport height with no way to scroll — even though ScrollTrigger markers still rendered, which was misleading.

The fix (now in the repo): `#smooth-wrapper`'s fixed+hidden styles are scoped to `html[data-smoother="on"]`, an attribute `motion.js` only sets AFTER `ScrollSmoother.create` succeeds inside a try/catch. Reduced-motion path skips init entirely and leaves the attribute unset. Progressive enhancement — the page scrolls natively if any layer of the motion stack fails.

DO NOT remove this scoping. Any new CSS that assumes the wrapper is fixed must also scope to this selector.

## 2. SCROLLTRIGGER MARKERS CAN LIE

When debugging, seeing the scroller-start/scroller-end markers does NOT prove the page can actually scroll. The markers are absolutely-positioned by ScrollTrigger based on attached triggers, independent of whether any scroll range exists. If the user says "I see the markers but nothing else," suspect a scroll-range-zero issue before suspecting your animation code.

## 3. GSAP 3.15 HAS EVERYTHING FREE

ScrollSmoother, MorphSVGPlugin, DrawSVGPlugin, SplitText, Physics2D — all included in the standard `gsap` npm package post-Webflow acquisition. Do NOT look for a private registry, a Club GreenSock auth token, or a `@gsap/shockingly` scope. Import from `gsap/ScrollSmoother`, `gsap/MorphSVGPlugin`, etc.

## 4. FONTSOURCE IMPORT PATHS

- Variable packages: `import "@fontsource-variable/fraunces"` (no path suffix — main entry handles it).
- Non-variable packages: weight-specific imports — `import "@fontsource/shippori-mincho-b1/400.css"`. Don't do the bare import for non-variable or you'll silently miss weights.

## 5. CSS IMPORT ORDER MATTERS

`tokens → reset → typography → layout → sections/*`. The reset references tokens (`--ink-sumi` in focus-visible outline). Reversing causes invalid property values on first paint.

## 6. THE USER WILL CRITIQUE HARD — GOOD

The user delivered a sharp 10-point architectural critique after Step 4. Don't be defensive. Respond point-by-point: accept / accept-with-refinement / push-back-with-reason. The user EXPLICITLY stated they do not want performative agreement. If a critique is wrong, say so with reasoning. Genuine disagreement is respected; capitulation is not.

## 7. OVER-DETERMINATION IS THE BIGGEST RISK

The user's most penetrating critique was: "Too many elements are trying to be meaningful at once." Every time you're tempted to add "another meaningful thing" to a section, SUBTRACT INSTEAD. Example from this project: the custom cursor was de-scoped from morph-on-hover to dot-only to remove an interpretive layer. Prefer restraint over accumulation.

## 8. DURATION IS NOT QUALITY (base rule; see also #17 and #21 for the counter-edges)

The original builder was using long animation durations as a shorthand for "this feels deliberate." The user correctly pointed out that compounded latency reads as laggy, not patient. Keep stagger SPACING (rhythm) but cut absolute BLOCKING TIME — UNTIL element length varies. When it does, revert to length-scaled durations (learning #21).

## 9. DO NOT TRUST CLICHÉD EXECUTIONS OF GOOD IDEAS

The giant kanji watermark is a good idea with a bad default execution (centered, clean opacity, vector-perfect). It becomes good only with specific imperfections: non-uniform ink density via two-pass feTurbulence, off-center rotation, cropped 15% off-frame, one brush-stroke with an honest tail, one ink-fleck offset, echo glyph pass at different filter seed. Apply this thinking everywhere: ideas are cheap, execution separates exceptional from generic.

## 10. COLOR DISCIPLINE HAS A DEPENDENCY

Restricting red to "twice on the page" is strong, but required that one appearance be EARNED BEFORE the form submit (otherwise a user who never submits never sees red). Solution: the current generation's hanko in §III is red, ancestors' are sumi. The red is narratively earned, not subliminally seeded. Do not try to add more red later "for balance." Two appearances, both justified: §III (living maker's seal) and §VI (user's own seal-by-proxy on submit). Both are acts of sealing — that's the through-line.

## 11. THE BROWSER AUTOMATION TOOLING IN CURSOR CANNOT EVALUATE JS

If you need runtime DOM state, either (a) ask the user to run a console command and paste output, (b) write a diagnostic block INTO the page DOM that displays state, then screenshot, or (c) use `browser_get_bounding_box` on refs. There is NO `browser_evaluate` tool. Do not rely on browser-use subagents to execute arbitrary scripts.

## 12. USE THE TOKENS, ADD TO THE TOKENS

`tokens.css` is the Design Constitution in CSS form. Any time you're about to type a magic number (color, size, duration, ease), stop and either (a) use an existing token or (b) add a new token with a comment explaining why. Magic numbers scattered through section files become unmaintainable by Step 6 section 5.

## 13. REGISTER EVERY SCROLLTRIGGER

`motion.js` exports `registerTrigger(trigger)`. Every new ScrollTrigger MUST go through it. When resize handling gets added, we'll batch-kill and rebuild, and un-registered triggers become ghosts. Non-negotiable. (Resize handling is NOW wired — debounced `window.resize` listener in `motion.js` calls `ScrollTrigger.refresh(true)` on every registered trigger, landed during §IV 6c.)

## 14. COMMENT WHY, NOT WHAT

The code review discipline from the original brief is strict: no obvious narration comments. Comments explain non-obvious intent, trade-offs, or constraints the code cannot convey. The existing `motion.js` / `threshold.js` / `place.js` comments are the pattern to follow.

## 15. FOUC FROM DEFERRED MODULE SCRIPTS — ALWAYS USE THE GATE

`type="module"` scripts are implicitly deferred. HTML parses and CSS paints FIRST, THEN your JS runs. If you set the animation's "initial hidden" state only inside JS (`gsap.set`), the first paint shows the FINAL content — then JS hides it, then animates it in, and to the user the reveal is invisible because static state looks identical.

The fix (in the repo):
- Inline `<script>document.documentElement.classList.add("js-pending")</script>` in `<head>`, synchronous.
- CSS rule: `html.js-pending <reveal-target> { opacity: 0; }`
- `@media (prefers-reduced-motion: reduce) { html.js-pending <reveal-target> { opacity: 1; } }`
- JS writes inline initial state via `gsap.set` (matching `opacity: 0`), then removes `js-pending`.

EVERY NEW SECTION with an entry reveal must extend this pattern. See learning #24 for how the gate removal coordinates across multiple sections.

## 16. prefers-reduced-motion IS EASILY MISSED — ALWAYS CHECK FIRST

Windows' system-level "Animation effects" toggle causes EVERY browser on the system to report `prefers-reduced-motion: reduce`. If a user has it on for their own reasons, they will NEVER see your reveal animations.

Before debugging any "animation not visible" report:
- (a) Ask the user: "Do you have reduce-motion enabled at the OS level?"
- (b) Check console logs for the reduced-motion branch (each section module logs a `"reduced-motion → final state"` trace).
- (c) Only after both are ruled out, look for code-side bugs.

## 17. LONG-WORD PACING — PRECURSOR TO #21

Original observation: uniform per-word duration + uniform stagger reads as rhythmically flat on text with mixed word lengths. "generations" at the same envelope as "Four" reads as rushed. SUPERSEDED BY LEARNING #21 — the original "~0.95s ceiling" in this entry was overridden by live user feedback and is now wrong; see #21 for the current rule.

## 18. CONSOLE TRACES EARN BACK THEIR LINES OF CODE 100×

Every section module has a `trace()` helper:

```js
const isDev = import.meta.env && import.meta.env.DEV;
const trace = (...args) => { if (isDev) console.info("[<section>]", ...args); };
```

Log: module init, any branch taken (reduced-motion, fonts-ready-done, SplitText results), timeline start, timeline complete, and key tunables (onset/envelope arrays). Stripped by Vite in prod. Non-negotiable for every new section module.

## 19. clip-path INSETS CLIP DESCENDERS BY DEFAULT

`clip-path: inset(0 0 0 0)` clips to the element's box. Tight `line-height` means descenders live outside the box and get clipped.

Fix pattern (used in `threshold.js` AND `place.js`):
- Final clip value uses negative vertical insets: `inset(-0.5em X -0.5em X)` or `inset(-0.3em -4% -0.3em -4%)` so the clip region extends past the box.
- `onComplete` calls `gsap.set(targets, { clearProps: "clipPath,filter,..." })` to remove the inline styles entirely. `clearProps` is SUPERIOR to setting literal "none" — GSAP sometimes keeps literal values in its cache.

## 20. MCP BROWSER VIEWPORT IS NARROWER THAN THE USER'S

The `cursor-ide-browser`'s default viewport is around 1024px or narrower. The `clamp(5rem, 14vw, 13rem)` colossus wraps to 4 visual lines there, even when it cleanly fits as 2 lines at the user's 1440–1920px browser. Do not judge layout correctness from the MCP browser alone. Ask the user for a screenshot at their real viewport.

---

## Additions from the §II agent

## 21. HYBRID A+B PACING — THE ACTUAL RULE FOR MIXED-LENGTH TEXT REVEALS

This supersedes the naive "uniform 0.22s stagger" (early §I) and the "variable stagger only" (Option B, tried and rejected in §I). The rule now is: BOTH the per-element envelope AND the onset overlap scale with the element's length.

```
envelope(len) = clamp(ENV_BASE + len * ENV_SLOPE, ENV_MIN, ENV_MAX)
nextOnset     = currentOnset + currentEnvelope * OVERLAP
```

For display text (§I headline words): `ENV_BASE 0.55, ENV_SLOPE 0.08, ENV_MIN 0.6, ENV_MAX 1.6, OVERLAP 0.45` → "Four" 0.87s, "generations." 1.51s.

For editorial prose (§II paragraph lines): `ENV_BASE 0.45, ENV_SLOPE 0.012, ENV_MIN 0.55, ENV_MAX 1.0, OVERLAP 0.35`.

Why: the user's live feedback on §I was "generations feels rushed." Option B (variable stagger, fixed envelope) does NOT address this — stagger is the gap BEFORE the next element starts, not the duration of the current element's own bleed. The current element's perceived speed IS its envelope. Option A (variable envelope) fixes the long word. A+B fixes both at once and gives proportional wakes.

COROLLARY: the original learning #17 "never exceed 0.95s envelope" is WRONG for 10+ character elements. User explicitly said "forget the rule about less animation time" and authorized 1.5s+ for long words. The new ceiling per-element is `ENV_MAX`, which for display text is 1.6s. If a specific element reads as slow-motion, tune `ENV_SLOPE` down, not `ENV_MAX`.

APPLY THIS RULE IN §III (generation entries + quote), §IV (stage captions), §V (philosophy sentence), §VI (letter + confirmation line), §VII (colophon). Name the rule explicitly in each section's 6a.

## 22. WHEN USER SAYS "ENSURE QUALITY" ON A CHEAP-VS-EXPENSIVE DECISION

In §II the user picked Option T (font-glyph kanji) over Option P (full path trace), then said "ensure we get the quality output." The correct response was NOT to backtrack to Option P. The correct response was to layer quality safeguards on top of T: two-pass filter (not one), two glyph layers with different filter seeds for "pressed twice" effect, two overlay paths instead of one, soft-edged radial-gradient mask (not hard circle).

General rule: when user commits to the cheap option, honor their choice and load it with the refinements that would normally separate it from Option P. The user's question becomes a sanity-check on execution discipline, not a permission slip to switch horses.

## 23. PROGRESSIVE ENHANCEMENT FOR SVG REVEAL MASKS

The §II kanji reveal uses a mask whose circle has default `r="900"` (fully revealed) in the HTML. JS sets `r=0` at init, animates back to 900 on ScrollTrigger. If JS fails entirely, the kanji is VISIBLE, not invisible. This matches the `html[data-smoother="on"]` progressive-enhancement pattern (learning #1).

General rule: ALWAYS author the FINAL VISIBLE state in HTML, let JS write the HIDDEN state as the first thing. This makes every failure mode land on "visible content," not "invisible content." Applies to opacity, clip-path, transforms, mask attributes — everywhere.

## 24. FOUC GATE REMOVAL IS CROSS-SECTION COORDINATED — FRAGILE

`html.js-pending` is currently removed by the FIRST section module's init (`threshold.js`, at the end of its synchronous path). This works for §I and §II because:
- `initPlace` runs BEFORE `initThreshold` in `main.js` (deliberate order; critical).
- `initPlace`'s SYNCHRONOUS `gsap.set` writes inline `opacity: 0` on §II targets.
- Then `initThreshold` does its own `gsap.set` and removes `js-pending`.
- At the removal moment, §II targets already carry inline styles that outrank the removed CSS gate.

For §II specifically there's a secondary subtlety: the SplitText + per-line hide path is ASYNC (waits for `document.fonts.ready`). The prose CONTAINER carries an inline `opacity: 0` during the wait so no frame shows the full paragraph at final opacity. This pattern must be repeated in any section with font-dependent async init.

FOR THE NEXT AGENT (§III onward):
- Keep `initThreshold` as the LAST synchronous init call. All section modules whose init runs BEFORE threshold must set their inline `opacity: 0` synchronously, even if their real async work (font-dependent SplitText, etc.) runs later.
- If §III has ink-line-pressure scroll effects, its synchronous init must also set the initial low-opacity state.
- CONSIDER A STEP 7 REFACTOR: move gate-removal out of `threshold.js` into `main.js` as a final step after all section inits have queued their synchronous `gsap.set`s. This removes the load-bearing ordering constraint. Current approach works but is one-edit-away from a regression.

## 25. SVG RADIAL MASK + ANIMATED `attr:{r:...}` IS A REAL REVEAL PRIMITIVE

For ink-bleed-edge reveals that aren't clip-path-on-text:
- Define `<radialGradient>` in the SVG's `<defs>`. Opaque 0-78%, falloff 78-100%.
- Define `<mask>` containing a `<circle>` filled with the gradient.
- Wrap the content-to-reveal in `<g mask="url(#mask-id)">`.
- GSAP: `gsap.to(circle, { attr: { r: targetRadius }, duration, ease })` — the attr plugin tweens the SVG attribute directly on the DOM.

The falloff band width controls how inky-vs-hard the advancing edge feels. The mask centre point (`cx`, `cy`) controls where the reveal originates — prefer the element's VISUAL mass, not its geometric centre.

## 26. SPLITTEXT MUST WAIT FOR FONTS.READY BEFORE LINE-MODE SPLITS

SplitText in "lines" mode wraps each RENDERED line in a span. Which pixels are on which line is determined by font metrics. If the real font hasn't arrived, SplitText splits against fallback metrics. When the real font lands and causes re-wrap, the line spans remain where SplitText put them — visible glitches mid-line.

Pattern (used in `place.js`, copy for §III editorial quotes, §V philosophy):

```js
const fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();
fontsReady.then(() => {
  const split = new SplitText(target, { type: "lines", linesClass: "place__line" });
  // ... gsap.set on split.lines, register ScrollTrigger, refresh.
  ScrollTrigger.refresh();
});
```

Also applies to "words" mode if line metrics matter for clip-path bounds, but is CRITICAL for lines.

## 27. AMBIENT-CONTINUOUS TWEENS MUST BE GATED BY SECTION-IN-VIEW

§II's blob rotation is `repeat: -1` infinite. Without gating, it chews CPU when the user is looking at §VI. Pattern in `place.js`: create the tween `paused: true`, then a ScrollTrigger with `trigger: section, start: "top bottom", end: "bottom top", onEnter/onEnterBack: play(), onLeave/onLeaveBack: pause()`.

Apply to any continuous ambient motion in §III (ink-line pressure noise), §IV (ember flicker if any), §VI (baseline shimmer if any). The scrub-based exits are fine without this gate — they're only active in their scroll range by design.

## 28. TWO-GLYPH-PASS "PRESSED TWICE" FOR STAMPED CHARACTERS

The §II kanji uses base + echo: same glyph rendered twice, second pass at ~24% opacity with a 3–4px transform offset and a DIFFERENT filter seed (not the same filter). Two different filter seeds are what separate this from a drop-shadow trick — same filter would give a clean offset copy; different seeds give "pressed twice with imperfect re-inking, re-alignment."

Apply pattern elsewhere this project will have seals/characters:
- §III hanko stamps — if the current generation's red hanko feels flat, try a base + echo with offset + different seed filter.
- §VI submit confirmation stamp — same technique; the user's seal is earning its red moment and should feel physically pressed.
- §VII's small 終 character — probably just a single pass, but if it reads thin, a 15%-opacity echo adds weight without adding color.

Do NOT apply to running body prose — it's a stamped-mark technique, not a type-setting one.

## 29. DENSITY-ALONG-THE-LINE VIA SCRUBBED MASK-RECT (the §III brush primitive)

When the brief says "scroll drives density, not length" or "pressure, not a progress bar," the primitive is NOT DrawSVG and NOT opacity sweeps. It is:
- One silhouette path defined once in a local `<defs>` with an id.
- Two `<use href="#id">` elements — "base" always visible at low opacity, "dense" at higher opacity.
- `<mask>` with `maskUnits="userSpaceOnUse"`, filled by a `<rect>` that itself has `fill="url(#linear-gradient)"`.
- The `linearGradient` has `stop-opacity 0 → 1 → 0` down its length — this is the "band."
- Apply `mask="url(#mask-id)"` to the DENSE `<use>` only (learning #34 — masks apply to the USE instance, not the referenced path).
- ScrollTrigger with scrub tweens the rect's `attr: { y: bandStart → bandEnd }`. Range must be wider than the visible path (e.g. viewBox y 0-1000, band y travels -500 to 1000) so the band enters from off-screen and exits off-screen.
- Mask x/width must be WIDER than the path (e.g. path is 40 wide at x=0, mask is 48 wide at x=-4) so filter edge noise on the dense use isn't clipped to a hard rectangular boundary.
- scrub value: 0.6 felt right on a desk mouse. Validate on trackpad + touch before committing.

This pattern is reusable for §IV ember band travelling up the blade, §VI baseline shimmer on the email input underline, §VII final rule fade-in. Keep it in your toolbox.

## 30. "DON'T REWARD SPECIALNESS TWICE" RULE FOR CONSTRAINED DESIGN TOKENS

The §III hanko red is rare (one of two allowed appearances per the constitution). The temptation when rendering the 4th-generation hanko is to ALSO give it extra filter passes, a longer animation, a bigger settle overshoot, a subtle pulse. DO NOT. If you load the rare element with extra craft on top of its rarity, the viewer reads "the designer wanted to make this one pop," not "this one is different because the narrative says it is."

The 4th hanko uses the IDENTICAL two-pass treatment, the IDENTICAL `back.out(1.2)` overshoot, the IDENTICAL duration as the three sumi ones. Red is doing all the work. That's the point.

Applies to: §VI submit-confirmation red stamp (second earned appearance) — same rule; render it with the same motion vocabulary as the ancestor hankos, not something new. Applies to: §IV ember warmth — ember is already the only warm color; don't ALSO give the blade in stage 2 a longer scrub than the other stages.

## 31. HYBRID A+B PACING CONSTANTS TUNED PER TYPE SCALE

Learning #21 established the formula (per-element envelope scales with length; per-element onset-to-next also scales with length). §III calibrated the constants for each type scale so future sections have a reference:

| Scale                                            | BASE    | SLOPE      | MIN    | MAX    | OVERLAP |
|--------------------------------------------------|---------|------------|--------|--------|---------|
| Colossus (§I headline, ~h0)                      | 0.55s   | 0.08s/char | 0.60s  | 1.60s  | 0.45s   |
| H1 display (§III names)                          | 0.50s   | 0.04s/char | 0.60s  | 1.10s  | n/a *   |
| Editorial prose (§II body, §III pull quotes)     | 0.45s   | 0.012s/char| 0.55s  | 1.00s  | 0.35s   |
| One-sentence still-held (§V — not yet tuned)     | 0.70s   | 0.05s/char | 0.80s  | 1.80s  | 0.50s   |

\* H1 display OVERLAP is n/a because there's one element per timeline.

SLOPE is the lever that matters most — display text needs a larger slope per glyph because the reveal edge has more physical distance to travel per character. Prose uses a tiny slope because lines are comfortable reading units; aggressive scaling makes short lines feel rushed relative to long ones, which breaks flow.

## 32. `<symbol>` VS LOCAL `<defs>` + `<use>` — WHEN TO USE WHICH

Two SVG refactor options exist and they are NOT interchangeable:

- **`<symbol>` in the TOP-LEVEL hidden defs SVG** (outside `#smooth-wrapper` in `index.html`):
  Use when the shape is re-used ACROSS multiple SVGs in the page DOM. §III's `hanko-frame` is used 4× in 4 different inline SVGs — correct place is the top-level defs.
  Benefit: one authoritative definition, single source of edit for the carved perimeter.

- **`<path id>` inside the SVG's OWN `<defs>`**:
  Use when the shape is re-used TWICE INSIDE A SINGLE SVG at different render styles. §III's brush silhouette lives in ONE svg, used twice (base + dense) — correct place is that svg's local defs.
  Benefit: lighter DOM, locality of concern, no pollution of the global defs block.

Rule of thumb: cross-SVG reuse → top-level `<symbol>`. Intra-SVG reuse → local `<defs>` with `<path id>`.

## 33. HANKO OVERSHOOT TUNING — back.out(1.2) IS THE RIGHT ANSWER AT THIS RENDER SIZE

For the §III hanko settle: scale 1.2→1.0 and rotation −6°→0° with ease `back.out(1.2)` over 0.75s reads as "stamp pressed and rocking back."

Empirical calibration at 4.75rem max render size:
- overshoot 1.5+ reads cartoonish at small sizes — feels like a pop bubble.
- overshoot 1.0 reads flat — the settle loses physicality.
- overshoot 1.2 is the tuning. Below 1.1 or above 1.4, it's wrong.

If §VI's confirmation stamp renders at a different size (it will — probably 2rem inline with the form), re-tune: for smaller stamps, the eye needs slightly MORE overshoot (1.3–1.4) because the rocking distance is absolutely smaller; for larger stamps the opposite.

Always add `onComplete: () => gsap.set(hanko, { clearProps: "transform" })` — the inline transform becomes a no-op after landing but leaves the element stuck on its own compositor layer, which hurts scroll performance on weaker devices.

## 34. `<use>` MASK INHERITANCE — A MASK ON THE `<use>` APPLIES ONLY TO THAT INSTANCE

When you apply `mask="url(#mask-id)"` directly to a `<use href="#path-id">` element, the mask is applied to the USE instance ONLY — the referenced `<path>` is not touched, and other `<use>` references to the same path render without the mask.

This is what makes the density-along-the-line pattern (learning #29) possible: one silhouette, two `<use>`s, mask on just the dense one.

The corollary: if you MOVE the mask to the referenced `<path id>` itself, it propagates to every `<use>` of that path, which is almost never what you want when one copy is the "always-on" progressive-enhancement fallback.

(This learning was written expecting §IV to inline the blade path. §IV ended up loading its assets as `<img>` from `/public/` instead — see `architecture.md` §IV and learnings #35–#37. The `<use>`-mask pattern is still correct for §VI's email baseline and §VII's final rule, so the learning stays.)

---

## Additions from the §IV agent

## 35. HAND-AUTHORED BLADE SILHOUETTES ARE BEYOND THE CURRENT AGENT-AUTHORING QUALITY BAR

The original plan called for a single hand-authored SVG knife with six stage paths morphing between each other. Three attempts at this in-session landed on distorted "gooey slop" shapes with no emotional read — flat blobs, unconvincing blade curvature, handles that looked like dowels. The user's critique was precise: "how is the raw smelted iron's size so much smaller than the final knife? as a viewer, it is very confusing and offputting" — meaning the shapes also violated conservation of mass.

The corrective was NOT to iterate harder on hand-authored paths. It was to accept that AI-traced vectors from an upstream image generator clear the quality bar by a wide margin, and that consumer-LLM image gen clears the quality bar while current coding agents do not.

General rule: when the artifact being generated is a high-fidelity IMAGE (character silhouette, illustration, stylized illustration), the coding agent's role is to INTEGRATE assets, not to hand-author them. The agent CAN author: typography, layout, color logic, motion, mask/filter composition, grid/rhythm decisions. It CANNOT author, reliably, at this model generation: figurative illustration with weight and emotion. Recognize the boundary and offload.

Offloading workflow (used for §IV stages 1–6): user provides a PNG from an image generator → user converts PNG → AI-traced SVG via an online tracer → hands the SVG to the agent → agent does the cleanup pipeline in learning #36 → agent integrates via `<img>` with the sizing discipline in learning #37.

## 36. AI-TRACED SVG CLEANUP PIPELINE (the §IV integration path — reusable)

AI-traced SVGs from online tracers have two consistent properties the site layer has to clean up:

- (a) A full-canvas cream/white background rectangle that renders as an opaque card instead of transparent — usually the FIRST path in the file, something like `<path d="M0 0 C506.88..."/>` with a visible fill. STRIP IT OUT. Without this, your careful `background: transparent` in CSS does nothing because the SVG itself paints its own background.
- (b) A hard-coded `width="1024" height="501"` on the root `<svg>` element with NO viewBox, which forces the browser to size the element to the raster dimensions regardless of CSS `width: 100%`. REPLACE with `viewBox="0 0 1024 501"` (or a tighter box if you want to crop — `blob1` uses `280 270 970 485` to crop the chunk tightly). Drop the width/height attributes. Now `<img>` + CSS sizing works as expected.

Preserve every other path. AI tracers emit 20–30 highlight/shadow/facet paths per traced object; those paths are what carry the 3D read. An inexperienced hand will extract "just the silhouette" and discard the rest — this was tried once in-session and produced the "gooey slop" shapes the user rejected. DO NOT DO THIS. Keep all paths.

For pages that will host many traced assets, this cleanup is worth scripting. For this project (≤6 stage assets), a manual pass is fine — edit the SVGs in place, check them visually with an `<img>` load, move on. The cleaned files live in `/public/` and are verified working.

## 37. CONSERVATION OF MASS → VISUAL HIERARCHY IS A NARRATIVE DECISION, NOT AN ARITHMETIC ONE

Original §IV framing said raw material must LOOK heavier than the finished product — physically, conservation of mass. When we tried this (stages 1–2 rendered WIDER and TALLER than stages 3–6), it read as "the stones are the point, and the knife is a detail."

The correct framing for this narrative is INVERTED: stage 6, the finished knife, is the climax, so it earns the LARGEST plate. Raw material is present and weighty (stage 1 chunk ≈ 600×260, stage 2 billet ≈ 720×180) but not dominant. The blade stages render at up to 100% column width and max-height 360 (≈ 720×353) — the widest of the six.

General rule: narrative arc beats physical plausibility on a monograph page. "The knife comes from something heavy" is communicated by having the chunk BE BROAD AND SQUAT (short width, tall height relative to the billet), not by making it geometrically larger than the finished product. The billet stretched wide, the blade stages widest — reading left-to-right-to-down-the-page, the eye travels from density to focus to climax.

Tactical: the sizing lives in `/src/styles/sections/forge.css` with three variants (`.forge__plate-img--chunky` / `--billet` / `--blade`), each with desktop + mobile breakpoints. See the CSS comments there for the per-variant rationale. If narrative-hierarchy ever needs to change, edit THAT file only — never set sizes on the plates themselves.

## 38. CROSSFADE IS A LEGITIMATE SUBSTITUTE FOR MORPH ON TOPOLOGICALLY-DIFFERENT SHAPES

MorphSVGPlugin interpolates anchor counts. It is a magnificent tool for "letter A → letter B" or "logo mark 1 → logo mark 2" — shapes with similar topology. It is the WRONG tool for "chunk of iron → knife" — anchor-count interpolation on that gap looks like a blob rearranging, not a smith forging.

For topologically-different frames, scroll-scrubbed CROSSFADE of discrete artifacts reads better in two ways:
- (i)  Each frame is legible as its own object, not as a transient between two poses.
- (ii) The viewer's visual system does the "morph" by filling in the transformation, which is more satisfying than watching a software tween. Same reason comic-book panels work — the reader does the motion.

When the aesthetic is quiet-editorial-monograph (vs. action-motion-heavy), crossfade is often the STRONGER choice even when MorphSVG is technically possible. Muji product pages, 37signals detail shots, Kinfolk photo spreads — none of them morph. They cut.

General rule: when considering a morph for a sequence, ask: "do my frames share topology? does my aesthetic reward visible software interpolation?" If either answer is no, use crossfade. Don't use morph because the plugin is imported.

Caveat: discrete crossfade DOES lose the "watch it happen continuously" affordance. If continuity is the point (a single character animating, a logo evolving), morph is still right.

---

## Additions from the §IV motion agent

## 39. LAYOUT-CLASS-DRIVEN SHORT-CIRCUITS BEAT ATTRIBUTE-DRIVEN ONES

§IV has three short-circuit branches (reduced-motion / no-smoother / narrow-viewport) that ALL need to land on the same fallback: the static contact-sheet layout. The first version keyed the CSS pinned layout to `html[data-smoother="on"]`, which `motion.js` sets whenever ScrollSmoother init succeeds — INDEPENDENT of whether any given section module actually wires its pin. Result: on a narrow viewport, smoother was active, CSS thought "apply the pinned layout," but `forge.js` had short-circuited and never added stage visibility or counter updates. The section rendered as a black hole.

Fix: `forge.js` adds `section.classList.add("forge--pinned")` ONLY on the happy path, AFTER all its short-circuits have passed. CSS keys its pinned layout to `.forge--pinned`, not to `html[data-smoother]`. Any short-circuit branch leaves the class off → CSS renders the contact sheet → visible, legible, scrollable.

General rule: when a CSS layout depends on a JS-driven feature, gate the CSS on a class the JS adds INSIDE its happy path, not on an ambient attribute that tracks a lower-level subsystem. The subsystem being "on" is necessary-but-not-sufficient for the layout to apply correctly.

Reusable for: §VI (form-success state should be a class the JS adds after a successful submit, not an attribute on `<body>`), any future section with multiple early-exit conditions.

## 40. THE FILM-CUT HOLD IS THREE LAYERS, NOT ONE ANIMATION

§IV stage 6 is the narrative climax. The first instinct was "animate something special on stage 6 to mark it." That instinct was wrong — it would have violated learning #30 ("don't reward specialness twice"). The correct construction is to do LESS on stage 6 than on any other stage, with three convergent small moves:

- (a) **BUDGET**. Stage 6's plateau is twice the width of every other stage's (0.16 vs 0.08 normalized). The user dwells there roughly twice as long. Not "an animation on stage 6." Just more time.
- (b) **STILLNESS**. No micro-motion on stage 6. Stage 2 vibrates, 4 drifts, 5 sweeps — 6 is dead still. The finished knife has been made; it does not need to perform.
- (c) **SIGNOFF**. 0.9s after the counter flips INTO 6 (timed to land after the caption reveal completes), the mono counter opacity fades 1 → 0.4 over 0.6s. It's been announcing stages the whole pin range; on the final frame it quietly steps back, like a legend on a film's closing still. Reversed on scroll-back so the counter is whole whenever the user moves off stage 6.

None of these three moves is an animation ON the climax element. The climax element (the knife) does nothing. The three moves alter CONTEXT around it: more time, less competing motion, quieter meta. That's what "held" means editorially.

General rule for any climax frame in a scroll-pinned sequence: subtract from neighbours, don't add to the climax. Applicable to §VII's colophon, any future site's closing beat.

## 41. PAUSED TIMELINE + PLAY-ON-DISCRETE-FLIP = "EARNED ONCE" CONTRACT

§IV's per-stage caption reveals are not scrubbed — they play once, forward, when the user enters that stage for the first time, and do NOT replay on scrub-back-and-forth. The implementation is tight and reusable:

- (a) Build the SplitText + per-word hidden state synchronously in the FOUC gate window.
- (b) Build a paused `gsap.timeline({ paused: true })` for each caption (stages 2–6 here).
- (c) Hold an integer `currentStage` counter. In ScrollTrigger's `onUpdate`, compute the current stage from progress, compare against `currentStage`, and if different, call `timelines[newStage].play()` and update `currentStage`. No other conditions — just the flip.
- (d) `gsap.play()` on a completed timeline is a no-op. So once a caption has played, any number of subsequent scrub-across-the-boundary events are silently ignored. "Earned once" for free.
- (e) For fast-scroll hash-navigation cases where multiple stages get skipped in one frame: because the check runs on every `onUpdate`, whichever stage the user LANDS on gets its reveal played. Earlier stages that were skipped will reveal the first time the user scrolls back to them, which is the correct behavior — don't try to play all skipped stages' reveals immediately, that's a replay festival.

Compare to scrubbed reveals (§I headline words scrub with scroll) and continuous reveals (§II kanji mask animates independently of scroll after the trigger). The paused-timeline pattern is the RIGHT one when reveals are tied to DISCRETE STATE CHANGES (stage flips, tab switches, form steps) rather than continuous scroll.

Reusable for: §VI's form-submission confirmation (stamp + confirmation line animate ONCE on submit, do not replay on re-focus), any future accordion/stepper pattern.
