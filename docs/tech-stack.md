# TECH STACK — locked

Do not revisit.

| Layer      | Choice                                                                                                                                                                                       |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Build      | Vite 5 (dev server runs on `:5173`)                                                                                                                                                          |
| Language   | Vanilla JavaScript (ES modules). Hand-authored CSS — NO Tailwind.                                                                                                                            |
| Motion     | GSAP 3.15 — ScrollTrigger + ScrollSmoother + SplitText + MorphSVGPlugin + DrawSVGPlugin. All FREE in 3.13+ under the standard `gsap` npm package. See learning #3 — do not hunt for private registries. |
| Smoothing  | ScrollSmoother (NOT Lenis). Chose it because it pins + scrubs cleaner inside GSAP's own tick loop.                                                                                           |
| Fonts      | `@fontsource-variable/fraunces`, `@fontsource/shippori-mincho-b1`, `@fontsource-variable/jetbrains-mono`. See learning #4 for variable vs non-variable import-path differences.              |
| Texture    | SVG filters — multi-layer `feTurbulence` + `feDisplacementMap` + `feMorphology` composites. NOT single-layer Perlin (reads as "CSS noise").                                                  |
| 3D         | None. Six SVG plates crossfaded for the knife (see `architecture.md` §IV). Path-morph was the original plan; pivot documented in learnings #35–#38.                                         |
| Cursor     | Small ink-dot with slight trailing lag. NO morph-on-hover. NO scale on interactive. De-scoped after critique about over-determination (learning #7) — respect that.                           |
| A11y       | `prefers-reduced-motion` honored at two layers: CSS tokens collapse to 1ms + `motion.js` skips `ScrollSmoother` init + leaves `html[data-smoother]` unset.                                   |

## Plugin import notes

- `MorphSVGPlugin` and `DrawSVGPlugin` are imported in `motion.js` but currently unused by §I–§IV. They stay imported for §VII (DrawSVG draws the final hair-thin rule). Do NOT rip them out to "clean up."

## Non-negotiable patterns

- **ScrollSmoother progressive enhancement** — `#smooth-wrapper`'s `position: fixed; inset: 0; overflow: hidden` is SCOPED to `html[data-smoother="on"]`. That attribute is set only when `ScrollSmoother.create` succeeds inside a try/catch. See learning #1.
- **FOUC gate** — `html.js-pending` class is added synchronously in `<head>` before first paint, and removed at the end of `threshold.js` init. See learnings #15 and #24.
- **Register every ScrollTrigger** — `motion.js` exports `registerTrigger(trigger)`. Every ScrollTrigger MUST go through it. Resize handling depends on the registry. See learning #13.
