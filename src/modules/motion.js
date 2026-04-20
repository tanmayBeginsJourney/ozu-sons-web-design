/* ──────────────────────────────────────────────────────────────
   motion.js — single source of truth for the motion stack.
   Registers GSAP plugins, boots ScrollSmoother with values tuned
   to the "Washi & Ash" aesthetic, and exposes helpers that other
   modules use to register ScrollTriggers so they can all be
   refreshed or killed together (e.g. on resize).
   ────────────────────────────────────────────────────────────── */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/**
 * The motion registry. Other modules push their ScrollTrigger
 * instances here via registerTrigger() so we can kill/refresh
 * the whole set on resize or route change.
 */
export const motion = {
  smoother: null,
  triggers: [],
  prefersReducedMotion: false,
};

/**
 * Boot the motion stack. Call exactly once from main.js.
 *
 *   smooth: 1.4          — long smoothing curve, "hushed" feel.
 *                          Lower values (0.6-0.8) feel snappy;
 *                          this site wants deliberate.
 *   smoothTouch: 0.1     — minimal on touch to preserve native
 *                          momentum. Higher values feel broken.
 *   normalizeScroll      — fixes mobile browser-chrome jank.
 *   effects: true        — enables data-speed attributes for
 *                          declarative parallax on descendants.
 */
export function initMotion() {
  motion.prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (motion.prefersReducedMotion) {
    // Reduced-motion path: no smooth scroll. ScrollTrigger still
    // works against native scroll. Individual animations check
    // motion.prefersReducedMotion and collapse to final state.
    // We do NOT set html[data-smoother] so CSS keeps natural flow.
    return;
  }

  try {
    motion.smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.4,
      smoothTouch: 0.1,
      normalizeScroll: true,
      effects: true,
      ignoreMobileResize: true,
    });
  } catch (err) {
    // If ScrollSmoother fails for any reason, fall back to native
    // scroll. Do NOT flip the data-smoother attribute; the CSS
    // scoping keeps #smooth-wrapper in natural flow.
    console.warn("ScrollSmoother failed to initialize:", err);
    return;
  }

  // Activate the fixed-position wrapper styles now that ScrollSmoother
  // is confirmed live. Any failure above leaves the page scrollable.
  document.documentElement.dataset.smoother = "on";

  // Refresh after fonts load so layout-sensitive triggers use
  // final metrics, not pre-font-load metrics.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  // Also refresh on full window load as a safety net.
  window.addEventListener("load", () => ScrollTrigger.refresh());

  // Debounced resize → hard refresh. ScrollTrigger has its own
  // resize listener (~200ms delayedCall), but with ScrollSmoother
  // wrapping the scroller, pinned sections can end up with stale
  // start/end positions after a viewport change. An explicit
  // refresh(true) bypasses the internal lock and recomputes all
  // triggers deterministically.
  //
  // 150ms debounce: below ~100ms thrashes on continuous drag-resize
  // (refresh storm on slow CPU); above ~250ms feels visibly sluggish
  // when a user snaps from a sidebar-collapsed layout back out.
  //
  // This listener is §IV's pin-readiness prerequisite (handoff Open
  // Infrastructure Gaps). Installed inside the successful-init path
  // because under reduced-motion we skipped ScrollSmoother.create
  // entirely; ScrollTrigger's own auto-refresh is already correct
  // for that case.
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 150);
  });
}

/**
 * Register a ScrollTrigger so it can be batch-killed/refreshed.
 * Return value is the same trigger (pass-through) for ergonomic
 * usage in section modules:
 *
 *   registerTrigger(ScrollTrigger.create({ ... }));
 */
export function registerTrigger(trigger) {
  motion.triggers.push(trigger);
  return trigger;
}

/**
 * Kill every registered trigger and the smoother instance.
 * Useful for HMR during dev and for cleanup if we ever move
 * to a multi-page setup.
 */
export function teardownMotion() {
  motion.triggers.forEach((t) => t.kill());
  motion.triggers.length = 0;
  if (motion.smoother) {
    motion.smoother.kill();
    motion.smoother = null;
  }
}
