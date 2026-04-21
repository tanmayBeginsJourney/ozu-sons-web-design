# STEP 6 RITUAL

Per section. Never skip. Never merge.

## 6a — PRE-CODE REVIEW

Restate what the section should look like AND feel like per the architecture. If the user's feedback in earlier sections implies a revision, name it explicitly (this is where the hybrid A+B pacing rule keeps getting carried forward).

## 6b — STATIC HTML/CSS FIRST

Write ONLY the markup and typography/layout CSS — no motion, no JS, no SVG filter timelines beyond static declarations. Show the code. Ask literally:

> Does this match the direction? Approve static version before I add motion.

Wait for approval.

## 6c — ADD MOTION

Write GSAP/ScrollTrigger code. EXPLAIN EVERY PROPERTY — duration, ease, stagger, scrub, pin — one sentence per property so the user understands WHAT EACH DOES. Every ScrollTrigger instance must be passed through `motion.js`'s `registerTrigger()` helper so it can be batch-killed on resize.

## 6d — QUALITY CHECKPOINT

Answer each honestly:

- Does this look like it could have been made by a component library? (If yes, redesign.)
- Is there at least one element a user has never seen on a generic website?
- Does typography have deliberate hierarchy and contrast?
- Is there depth (layers, z-index play, parallax, shadow, grain)?
- Does the section have personality on mobile, not just desktop?

## 6e — NON-TRIVIAL TESTS

Do these, not just "does it look right." Run each applicable test before declaring the section done.

### TEST A — FAILURE-MODE TEST
Temporarily break `ScrollSmoother.create` (pass a bogus wrapper selector). Verify: page still scrolls natively. Verify: `html[data-smoother]` attribute is NOT set. Verify: no black screen, no trapped viewport. Restore after.

### TEST B — REDUCED-MOTION TEST
DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Reload. Verify: ScrollSmoother doesn't init (no smooth scroll). Verify: section reveals snap to final state (do NOT play). Verify: no infinite loops or idle animations run. Verify: page is fully usable with keyboard scroll alone.

### TEST C — FONT-LOADING TEST
DevTools → Network → Throttle to Slow 3G. Reload. Verify: no FOUT flash of system font. Verify: ScrollTrigger positions are correct after fonts arrive (refresh fires via `document.fonts.ready`). Verify: no cumulative layout shift as Fraunces loads. Verify (§II onward): SplitText line splits occur AGAINST FINAL font metrics, not fallback (learning #26).

### TEST D — MOBILE VIEWPORT TEST
DevTools device emulation → iPhone 12 Pro. Reload. Verify: `smoothTouch: 0.1` behaves (momentum feels native-ish, not overly smoothed). Verify: address-bar show/hide doesn't jank pinned sections. Verify: negative space doesn't feel empty (specific WASHI & ASH risk).

### TEST E — CPU THROTTLE TEST
DevTools Performance → CPU 6× throttle. Scroll through the whole section. Verify: 60fps or degrades to a STABLE 30fps, no stutter. Verify: no paint storm from grain/filter overlays. Verify (§II onward): ambient rotations gated by section-in-view are paused when off-screen (learning #27). If section has pin+scrub: verify no jitter on slow CPU.

### TEST F — RESIZE TEST
Open page, resize viewport from 1920 → 320 live while scrolled to the current section. Verify: ScrollTrigger refreshes and positions are correct at target width. Verify: no ghost scroll positions. Verify: text re-wraps cleanly, nothing overflows. Resize handling is wired as of §IV 6c — a debounced `window.resize` listener in `motion.js` calls `ScrollTrigger.refresh(true)` on all registered triggers.

### TEST G — KEYBOARD/A11Y TEST (§VI especially)
Unplug/ignore mouse. Tab through the page. Verify: focus is always visible. Verify: form submits via Enter. Verify: errors are announced (`aria-live="polite"` on the error line).

### TEST H — FIREFOX SVG FILTER TEST
Load in Firefox if available. Verify: paper grain renders (Firefox has historically had slower/different `feTurbulence` behavior). Verify: ink-bleed reveals don't flicker. Verify (§II onward): radial-gradient-based soft-edged masks render the soft falloff consistently between browsers; if Firefox hardens the edge, widen the gradient's falloff band.

### TEST I — LONG-SESSION MEMORY TEST (do once after §IV and once after §VI)
DevTools Performance → record a Memory profile. Scroll top-to-bottom, then bottom-to-top, 5 times. Verify: heap does not grow unboundedly (each ScrollTrigger should reuse the same Tween, not create new ones).

---

Only move to the next section when the section passes this checkpoint.

**Status:** §I–§VII have each been built under this ritual. Cross-section polish is **Step 7** (`handoff.md`), not another §6 pass per section.
