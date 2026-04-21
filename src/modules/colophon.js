/* ──────────────────────────────────────────────────────────────
   colophon.js — §VII motion.

   This file is deliberately short. §VII is the page turning
   closed — a colophon, not a section that animates. One concern
   only:

     1. Rule draw-in — two hair-thin sumi-ink segments converge
        on the midpoint of the rule as the reader arrives at
        §VII. Each segment starts zero-length at its outer edge
        and extends inward via DrawSVGPlugin; both tween on the
        same paused timeline so they resolve simultaneously at
        x=200 (the viewBox midpoint). Plays ONCE on scroll-in
        via a paused-timeline + play-on-enter contract (learning
        #41) — does NOT replay on scroll-back. §VII is the page's
        closing beat; a second arrival of the rule would be a
        stutter where a signoff is required.

   ABSENT BY DESIGN — do not add any of these:
     • No ambient idle motion. None, anywhere, period.
     • No exit animation. §VII is the last thing on the page;
       there is nothing past it to exit toward.
     • No text reveal, no 終 reveal. The rule draw-in is §VII's
       ONE motion (learning #43, governing). Animating the text
       or the 終 character would refuse §V's exhale and trade
       §VII's signature moment for generic texture.
     • No scrub-linked progress. The rule does not respond to
       scroll velocity, position, or direction once it has
       resolved — a completed draw is a fixed visual state.
     • No hover / focus / interaction affordances. §VI owned
       interaction; §VII has none.
     • No red. NOT on the rule, NOT on 終, NOT on anything else
       in this section (learning #30). The page's two red
       moments are earned at §III and §VI; a third red here
       would dilute both and break the through-line.
     • No echo pass on the rule, no secondary filter, no glow,
       no pulse. The rule is ONE line drawn ONCE. If it reads
       thin on review, the lever is stroke-width in colophon.css,
       not a second visual layer.

   If the canvas feels quiet, re-read learning #7. The rule
   arriving is the entire event.
   ────────────────────────────────────────────────────────── */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { motion, registerTrigger } from "./motion.js";

// DrawSVGPlugin ships inside the standard `gsap` package post-
// Webflow acquisition (learning #3). motion.js does NOT pre-
// register it — §VII is the only consumer on this site, so the
// plugin is registered here rather than pay the startup cost
// for sections that never use it.
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

// ─── Tunables ────────────────────────────────────────────────
// Trigger start — §VII's rule begins drawing when the section's
// top is 78% down the viewport (22% into view). Later than §V's
// 65% because §V is held in full viewport and needs its reveal
// to start as the reader arrives; §VII is a short closing beat
// the reader passes through, and firing at 78% puts the draw-in
// comfortably inside the first glance, not too early (so the
// reader isn't greeted mid-draw before the text is read) and
// not too late (so the reader doesn't scroll past a still-blank
// rule). Matches §II/§III's trigger discipline for "reader has
// just entered the section."
const TRIGGER_START = "top 78%";

// Draw duration and ease — 1.0s total for both segments to
// converge on the midpoint. Short enough that the motion is a
// punctuation mark rather than an event; long enough that the
// eye registers "two lines arriving together" rather than a
// flash.
//
// power2.inOut means each segment ACCELERATES off its outer
// edge, cruises, then DECELERATES into the centre. Reads as a
// nib placed, drawn across the page, and lifted — which is what
// the rule is pretending to be. power2.out alone would start
// fast (nib slammed down) and decelerate; power2.in alone would
// start slow and end fast (nib accelerating into a strike).
// inOut is the correct pen-on-paper envelope.
const DRAW_DURATION = 1.0;
const DRAW_EASE = "power2.inOut";

export function initColophon() {
  const section = document.querySelector("#colophon");
  if (!section) return;

  const isDev = import.meta.env && import.meta.env.DEV;
  const trace = (...args) => {
    if (isDev) console.info("[colophon]", ...args);
  };

  trace("init");

  const segs = section.querySelectorAll(".colophon__rule-seg");
  if (segs.length !== 2) {
    // Defensive — the markup in index.html authors exactly two
    // segments. If the count ever drifts (a refactor removes one,
    // a typo adds a third), fail loud in dev rather than
    // animating only part of the rule and leaving the rest
    // invisible-through-the-FOUC-gate.
    trace("expected 2 rule segments, found", segs.length, "→ aborting");
    return;
  }

  // ─── Reduced-motion path ─────────────────────────────────────
  // No gsap.set, no timeline, no trigger. The CSS rule
  // `@media (prefers-reduced-motion) html.js-pending
  // .colophon__rule-seg` overrides the FOUC gate to opacity 1,
  // and HTML authors the rule fully-drawn. Returning here keeps
  // the HTML state authoritative (learning #23) — no inline
  // styles to clean up, no dashoffset residue from a skipped
  // tween. 終 and the text render at their authored typography
  // in both branches.
  if (motion.prefersReducedMotion) {
    trace("reduced-motion → final state");
    return;
  }

  // ─── Synchronous initial state ──────────────────────────────
  // MUST run BEFORE main.js calls releaseRevealGate() after
  // initThreshold (load-bearing, see learning #24). The CSS gate
  // keeps the segments at opacity 0 until
  // this inline gsap.set both:
  //   (a) collapses each segment to zero length via DrawSVG
  //       (the ACTUAL hidden state — a fully-drawn segment at
  //       opacity 0 would pop visible the instant the gate
  //       lifts, so the opacity gate is only a stopgap for the
  //       time between first paint and this line).
  //   (b) releases opacity back to 1, because per-segment
  //       inline styles now outrank the removed CSS rule and
  //       the DrawSVG value is what carries the hide from here
  //       on.
  // Both properties are set together so the flip is atomic in
  // the same frame — no window in which the segments are both
  // fully-drawn AND opacity 1 before the trigger fires.
  gsap.set(segs, {
    drawSVG: "0% 0%",
    opacity: 1,
  });

  // ─── Draw-in timeline ───────────────────────────────────────
  // Paused at construction; the ScrollTrigger below plays it
  // ONCE on section enter (once: true). No yoyo, no repeat, no
  // onReverse — once the rule has drawn, it stays drawn. §VII
  // does not re-stage on scroll-back; the two-pens-meeting
  // gesture is a closing punctuation, not a looping ornament.
  //
  // Both segments tween on the same timeline starting at time 0,
  // so they extend inward simultaneously and resolve at the
  // midpoint together. onComplete clears the DrawSVG-related
  // inline styles (stroke-dasharray, stroke-dashoffset) so the
  // static final state is driven by the HTML `d` attribute +
  // CSS stroke, matching the cleanup discipline in threshold.js
  // and philosophy.js.
  const drawTl = gsap.timeline({
    paused: true,
    onStart: () => trace("draw timeline started"),
    onComplete: () => {
      gsap.set(segs, {
        clearProps: "strokeDasharray,strokeDashoffset,opacity",
      });
      trace("draw timeline complete");
    },
  });

  drawTl.to(
    segs,
    {
      drawSVG: "0% 100%",
      duration: DRAW_DURATION,
      ease: DRAW_EASE,
    },
    0 // both segments share timeline position 0
  );

  trace(
    "draw timing:",
    `duration=${DRAW_DURATION.toFixed(2)}s`,
    `ease=${DRAW_EASE}`,
    `start=${TRIGGER_START}`
  );

  // ─── Trigger ─────────────────────────────────────────────────
  // once: true is the correct "earned once" contract here
  // (learning #41). §V used a non-once trigger because it
  // needed onUpdate for scroll-interruptible fast-forward; §VII
  // has no such affordance (a 1.0s draw is too short to be
  // outpaced by a reader's scroll, and interrupting the final
  // punctuation mark on the page would be wrong anyway). Simple
  // once: true lets ScrollTrigger auto-kill after firing; no
  // revealStarted flag needed.
  registerTrigger(
    ScrollTrigger.create({
      trigger: section,
      start: TRIGGER_START,
      once: true,
      onEnter: () => drawTl.play(),
    })
  );
}
