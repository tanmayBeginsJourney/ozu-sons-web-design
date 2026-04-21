/* ──────────────────────────────────────────────────────────────
   place.js — §II motion.
   Four concerns, kept isolated:
     1. Initial hidden state (blob lightly visible, kanji masked
        out, prose container hidden pre-SplitText).
     2. Entry reveal — kanji radial mask outward + prose lines
        bleeding in with length-scaled envelopes. Played once on
        scroll-enter; does not re-play on scroll-up.
     3. Ambient — the sumi ink-wash blob rotates at 0.3°/sec,
        gated by section visibility so the tween is paused when
        §II is off-screen.
     4. Exit scrub — kanji scales slightly up and fades as §II
        leaves, driven 1:1 by scroll position.
   Reduced-motion path collapses everything to final static state.
   ────────────────────────────────────────────────────────────── */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motion, registerTrigger } from "./motion.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

// ─── Tunables ────────────────────────────────────────────────
// Per-line envelope for the prose reveal. Prose lines run ~25-45
// chars, so envelope lands roughly 0.55-1.0s — shorter than §I's
// per-word envelopes because lines are typographically lighter
// units (they carry reading, not display). Same hybrid-A+B
// approach as §I: per-line envelope scales by length, onset
// advance is a fraction of the CURRENT line's envelope, so a
// long line both takes longer AND leaves a proportionally larger
// wake. Tune OVERLAP up toward 0.45 if the paragraph reads as
// dragging.
const ENV_BASE = 0.45;
const ENV_SLOPE = 0.012;
const ENV_MIN = 0.55;
const ENV_MAX = 1.0;
const OVERLAP = 0.35;

// Radial-mask reveal target. r=900 in the 1000×1000 viewBox
// guarantees full coverage including the overlay paths that
// extend to the edges. Duration 2.0s per the architecture spec.
const KANJI_REVEAL_R = 900;
const KANJI_REVEAL_DURATION = 2.0;

// Ambient blob rotation: 0.3°/sec → 1 full turn per 1200s (20
// min). Slow enough that the rotation is only visible on long
// sessions; its job is to NOT be noticed, just to ensure the
// section is never perfectly still.
const BLOB_ROTATION_DURATION = 1200;

export function initPlace() {
  const section = document.querySelector("#place");
  if (!section) return;

  const isDev = import.meta.env && import.meta.env.DEV;
  const trace = (...args) => {
    if (isDev) console.info("[place]", ...args);
  };

  trace("init");

  const kanjiSvg = section.querySelector(".place__kanji");
  const kanjiCircle = section.querySelector(".place__kanji-mask-circle");
  const blob = section.querySelector(".place__blob");
  const prose = section.querySelector(".place__prose");

  // ─── Reduced-motion path ─────────────────────────────────────
  // No reveal, no rotation, no scrub. Everything at final static
  // state. Mask circle stays at its default r=900 (fully revealed)
  // because we never touch it.
  if (motion.prefersReducedMotion) {
    gsap.set([prose, kanjiSvg], { opacity: 1 });
    trace("reduced-motion → final state");
    return;
  }

  // ─── Initial state (synchronous, runs before releaseRevealGate
  // so inline styles take precedence over the CSS gate) ───────
  // Kanji SVG is visible (opacity 1) — its contents are hidden by
  // the mask circle at r=0. The SVG itself being visible prevents
  // a flash when the FOUC gate releases.
  gsap.set(kanjiSvg, { opacity: 1 });
  gsap.set(kanjiCircle, { attr: { r: 0 } });

  // Prose container stays inline-hidden until SplitText has run
  // and the per-line hidden state has been written; otherwise
  // there's a frame where the paragraph is visible at full
  // opacity before its lines are individually masked.
  gsap.set(prose, { opacity: 0 });

  // ─── Ambient blob rotation ───────────────────────────────────
  // Paused at rest; played only while the section is in view.
  // transformOrigin "center center" so the rotation axis sits at
  // the blob's own centroid, not the SVG's bounding box corner.
  const rotationTween = gsap.to(blob, {
    rotation: 360,
    duration: BLOB_ROTATION_DURATION,
    ease: "none",             // linear: rotation is ambient, not paced
    repeat: -1,               // infinite loop
    paused: true,
    transformOrigin: "center center",
  });

  registerTrigger(
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",      // as soon as §II edge enters
      end: "bottom top",         // until §II has fully left
      onEnter: () => rotationTween.play(),
      onEnterBack: () => rotationTween.play(),
      onLeave: () => rotationTween.pause(),
      onLeaveBack: () => rotationTween.pause(),
    })
  );

  // ─── Exit scrub ──────────────────────────────────────────────
  // Kanji scales from 78vw to ~85vw (scale 1.09) and opacity
  // drops to 0.35 as §II exits. scrub: true ties progress 1:1
  // to scroll position — the user drives the motion, not time.
  registerTrigger(
    ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",    // when §II's bottom hits the viewport bottom
      end: "bottom top",          // until §II's bottom leaves the viewport top
      scrub: true,
      animation: gsap.to(kanjiSvg, {
        scale: 1.09,            // 85vw / 78vw — subtle growth, not a pop
        opacity: 0.35,          // fades but not to zero; the character lingers behind §III
        transformOrigin: "center center",
        ease: "none",           // scrub ignores ease but explicit is honest
      }),
    })
  );

  // ─── Entry reveal (gated on font-ready) ──────────────────────
  // SplitText line breaking depends on the final rendered font
  // metrics. If we split before Shippori Mincho / Fraunces have
  // arrived, lines wrap against fallback metrics and re-wrap when
  // the real fonts load, leaving the spans mid-line. Waiting for
  // fonts.ready guarantees SplitText sees final wrap geometry.
  const fontsReady =
    (document.fonts && document.fonts.ready) || Promise.resolve();

  fontsReady.then(() => {
    trace("fonts ready, splitting prose");

    const split = new SplitText(prose, {
      type: "lines",
      linesClass: "place__line",
    });

    trace("SplitText produced", split.lines.length, "lines");

    // Hide each line individually, then un-hide the container.
    // Order matters: container opacity must go to 1 only AFTER
    // lines are at opacity 0, otherwise a frame of full-opacity
    // prose paints through.
    gsap.set(split.lines, {
      opacity: 0,
      yPercent: 12,
      clipPath: "inset(-0.3em 100% -0.3em 0)",     // fully clipped from the right
      filter: "url(#ink-bleed) blur(3px)",          // same ink-bleed filter as §I's word reveal
      willChange: "clip-path, filter, transform, opacity",
    });
    gsap.set(prose, { opacity: 1 });

    // Compute per-line envelope + onset using the same hybrid
    // approach §I's words use. Longer lines bleed longer AND
    // leave proportionally larger wakes before the next line.
    const envelopes = [];
    const onsets = [];
    let cursor = 0;
    split.lines.forEach((line, i) => {
      const len = line.textContent.trim().length;
      const env = Math.min(
        ENV_MAX,
        Math.max(ENV_MIN, ENV_BASE + len * ENV_SLOPE)
      );
      envelopes.push(env);
      if (i === 0) {
        onsets.push(0);
      } else {
        cursor += envelopes[i - 1] * OVERLAP;
        onsets.push(cursor);
      }
    });

    // Reveal timeline. Starts paused; the ScrollTrigger below
    // plays it on section enter.
    const revealTl = gsap.timeline({
      paused: true,
      onStart: () => trace("reveal timeline started"),
      onComplete: () => trace("reveal timeline complete"),
    });

    // 1. Radial mask opens. The glyph strokes and overlay paths
    //    are revealed from the character's visual centre outward.
    revealTl.to(kanjiCircle, {
      attr: { r: KANJI_REVEAL_R },    // 0 → 900; uses GSAP's attr plugin to tween the SVG attribute
      duration: KANJI_REVEAL_DURATION, // 2.0s; matches the architecture spec
      ease: "power2.out",             // decelerates at the edges, which is where the soft falloff does its work
    });

    // 2. Prose lines bleed in. Braided into the kanji reveal at
    //    -1.3s so lines start coming in while the kanji is still
    //    about 35% revealed — the two phases overlap rather than
    //    sequence. Label keeps the relative position stable if
    //    the kanji tween's duration changes later.
    const linesAnchor = "linesStart";
    revealTl.addLabel(linesAnchor, "-=1.3");

    const lastIndex = split.lines.length - 1;
    split.lines.forEach((line, i) => {
      revealTl.to(
        line,
        {
          opacity: 1,                                  // line becomes visible
          yPercent: 0,                                 // lift from 12% below baseline
          clipPath: "inset(-0.3em -4% -0.3em -4%)",    // reveal advances; final clip extends past line box so descenders aren't touched
          filter: "url(#ink-bleed) blur(0px)",         // blur fades; turbulence stays until onComplete
          duration: envelopes[i],                      // per-line envelope, length-scaled
          ease: "power2.out",                          // decelerating; arrives, no overshoot
          onComplete:
            i === lastIndex
              // clearProps on all lines once the last one lands.
              // Removes the inline filter/clip so the static state
              // is CSS-driven and type is rendered crisply.
              ? () => {
                  gsap.set(split.lines, {
                    clearProps:
                      "clipPath,filter,willChange,transform,opacity",
                  });
                }
              : undefined,
        },
        `${linesAnchor}+=${onsets[i]}`
      );
    });

    trace(
      "line timing:",
      split.lines
        .map(
          (l, i) =>
            `[env=${envelopes[i].toFixed(2)}s @${onsets[i].toFixed(
              2
            )}s] ${l.textContent.trim().slice(0, 22)}...`
        )
        .join(" · ")
    );

    // Play timeline on section enter. once:true so scrolling back
    // up doesn't re-stage the reveal; this is a museum, not a
    // slideshow.
    registerTrigger(
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",   // reveal starts when §II's top is 75% down the viewport (25% into view)
        once: true,
        onEnter: () => revealTl.play(),
      })
    );

    // SplitText changed the DOM — line heights and wrap may have
    // shifted the positions of every trigger below §II. Refresh
    // so start/end pixel positions are recomputed against the
    // post-split layout.
    ScrollTrigger.refresh();
  });
}
