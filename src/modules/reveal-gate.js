/* ──────────────────────────────────────────────────────────────
   reveal-gate.js — single release of html.js-pending after every
   section module has run its synchronous gsap.set (learning #24).
   Called from main.js immediately after initThreshold() returns.
   ────────────────────────────────────────────────────────────── */

export function releaseRevealGate() {
  document.documentElement.classList.remove("js-pending");
}
