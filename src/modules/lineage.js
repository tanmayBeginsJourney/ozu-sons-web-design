/* ──────────────────────────────────────────────────────────────
   lineage.js — §III motion.

   Three concerns, kept isolated:
     1. Synchronous initial hidden state (runs BEFORE main.js
        releaseRevealGate() — learning #24 ordering).
        Each generation's head/name/role/quote are hidden inline;
        the hanko is pre-loaded with its scale:1.2 rotation:-6°
        overshoot start, so the settle animation has somewhere to
        settle FROM.
     2. Per-generation reveal timelines, built AFTER fonts.ready so
        SplitText on pull-quote lines operates on final font
        metrics (learning #26). Each generation plays its timeline
        once on scroll-enter. Hybrid A+B pacing per learning #21:
        name envelope is length-scaled; quote lines are both
        length-scaled (envelope) and length-weighted (onset).
     3. Brush-density scrub — a mask band inside the gutter brush
        SVG slides from above-the-brush to below-the-brush as the
        user scrolls through §III. Ink density "moves along the
        line," not length (constitution + handoff §III execution
        note).

   Reduced-motion path collapses everything to final static state:
   content visible, density band stays above the brush so no
   scroll-driven pressure plays.
   ────────────────────────────────────────────────────────────── */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motion, registerTrigger } from "./motion.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

// ─── Tunables ─────────────────────────────────────────────────

// Name reveal — h1-scale display text, 2-word names of 9-13 chars.
// Sits between §I's colossus values (too dramatic for h1) and §II's
// prose values (too lightweight). Same hybrid-A+B shape; just the
// ceiling is lower because display h1 at 48pt opsz doesn't need
// 1.6s of bleed time.
const NAME_ENV_BASE = 0.5;
const NAME_ENV_SLOPE = 0.04;
const NAME_ENV_MIN = 0.6;
const NAME_ENV_MAX = 1.1;

// Quote reveal — editorial prose, same values as §II's prose lines.
// Per learning #21 the OVERLAP fraction multiplies the CURRENT
// line's envelope, so longer lines also leave proportionally longer
// wakes before the next line starts.
const QUOTE_ENV_BASE = 0.45;
const QUOTE_ENV_SLOPE = 0.012;
const QUOTE_ENV_MIN = 0.55;
const QUOTE_ENV_MAX = 1.0;
const QUOTE_OVERLAP = 0.35;

// Brush density band travel range, in brush viewBox units. The
// band rect is 400 units tall; starting at y=-500 puts its bottom
// edge at y=-100 (entirely above the 0-1000 brush body). Ending
// at y=1000 puts its top edge flush with the brush bottom (no
// overlap at scrub=1). Total travel = 1500.
const BAND_Y_START = -500;
const BAND_Y_END = 1000;

export function initLineage() {
  const section = document.querySelector("#lineage");
  if (!section) return;

  const isDev = import.meta.env && import.meta.env.DEV;
  const trace = (...args) => {
    if (isDev) console.info("[lineage]", ...args);
  };

  trace("init");

  const generations = section.querySelectorAll(".lineage__generation");
  const densityRect = section.querySelector(".lineage__brush-band");

  // ─── Reduced-motion path ─────────────────────────────────────
  // No reveal timelines, no band scrub, no SplitText. All content
  // at final static state (CSS + HTML already describe this — we
  // just don't write the hidden initial styles). The base brush
  // stays at its authored opacity (0.18); the density overlay
  // stays masked-off because its rect stays at its HTML-default
  // y=-500, fully above the brush body.
  if (motion.prefersReducedMotion) {
    trace("reduced-motion → final state");
    return;
  }

  // ─── Synchronous initial state ──────────────────────────────
  // These gsap.set calls MUST run before main.js releaseRevealGate()
  // drops the html.js-pending CSS gate. When we run, the gate is
  // still in force and our inline styles write the real hidden state
  // beneath it. After release, inline styles outrank the removed
  // rule and content stays hidden for the reveal.
  generations.forEach((gen) => {
    const head = gen.querySelector(".lineage__head");
    const hanko = gen.querySelector(".lineage__hanko");
    const name = gen.querySelector(".lineage__name");
    const role = gen.querySelector(".lineage__role");
    const quote = gen.querySelector(".lineage__quote");

    // Head: caption bar (year + hanko + rule) lifts in. 8px of
    // downward offset is small — this is a settle, not a slide.
    gsap.set(head, { opacity: 0, y: 8 });

    // Hanko: pre-load the overshoot start position so back.out's
    // settle animates FROM scale 1.2 and rotation -6° TO 1.0 / 0°.
    // transformOrigin center so rotation pivots about the seal's
    // centroid, not the SVG element's top-left.
    gsap.set(hanko, {
      scale: 1.2,
      rotation: -6,
      transformOrigin: "center center",
    });

    // Name: opacity:0 is sufficient to hide synchronously. The
    // clip-path + filter reveal state is set later inside the
    // font-ready block — it needs final font metrics to avoid
    // mid-line clip seams when Fraunces arrives.
    gsap.set(name, { opacity: 0 });

    // Role: single editorial line; small y offset so it arrives
    // lifting gently from below baseline.
    gsap.set(role, { opacity: 0, y: 6 });

    // Quote: container hidden until SplitText has run and lines
    // are individually hidden. Without this, the font-ready async
    // path would show a frame of full-opacity prose before the
    // per-line clip masks land.
    gsap.set(quote, { opacity: 0 });
  });

  // Density band rect: parked above the brush. The mask renders
  // the dense overlay only where this rect's gradient is opaque —
  // at y=-500 the rect is entirely above y=0, so the dense path
  // is fully hidden at first paint.
  if (densityRect) {
    gsap.set(densityRect, { attr: { y: BAND_Y_START } });
  }

  // ─── Brush density scrub ─────────────────────────────────────
  // The mask band slides from above-brush to below-brush as the
  // user scrolls through §III. Density peaks wherever the band's
  // vertical centre currently sits on the brush path.
  if (densityRect) {
    registerTrigger(
      ScrollTrigger.create({
        trigger: section,
        // "top 75%" — fires when the top of §III hits 75% down
        // the viewport (first generation entering). Earlier than
        // "top center" so the band has already started moving
        // into the brush by the time the first block animates.
        start: "top 75%",
        // "bottom 25%" — ends when the section's bottom edge is
        // 25% down the viewport (last generation fully revealed,
        // section about to exit). The band completes its
        // traverse right as the section hands off to §IV.
        end: "bottom 25%",
        // scrub: 0.6 — half-second of easing between scroll
        // position and rect.y position. 0 (or true=instant) feels
        // jittery on wheel scrolls; >1 feels laggy and breaks
        // "this band is following my eye." 0.6 is the sweet spot
        // on the wheel/trackpad devices I've tested.
        scrub: 0.6,
        animation: gsap.to(densityRect, {
          // attr:{y:...} uses GSAP's attribute plugin to tween
          // the SVG element's y attribute directly. Same
          // technique as place.js's mask circle r.
          attr: { y: BAND_Y_END },
          // ease:"none" — scrub overrides eases anyway; explicit
          // is honest signaling that the band is linearly tied
          // to scroll.
          ease: "none",
        }),
      })
    );
  }

  // ─── Per-generation reveals (font-ready gated) ──────────────
  // SplitText needs final font metrics for the pull quote's
  // lines-mode split (learning #26). We queue the whole
  // per-generation timeline inside fontsReady so each block
  // animates as a coherent unit — head, hanko, name, role, and
  // quote all build from final layout.
  const fontsReady =
    (document.fonts && document.fonts.ready) || Promise.resolve();

  fontsReady.then(() => {
    trace("fonts ready, building per-generation timelines");

    generations.forEach((gen, idx) => {
      const head = gen.querySelector(".lineage__head");
      const hanko = gen.querySelector(".lineage__hanko");
      const name = gen.querySelector(".lineage__name");
      const role = gen.querySelector(".lineage__role");
      const quote = gen.querySelector(".lineage__quote");

      // Name envelope — length-scaled (learning #21 for display
      // text at h1 scale).
      const nameLen = name.textContent.trim().length;
      const nameEnv = Math.min(
        NAME_ENV_MAX,
        Math.max(NAME_ENV_MIN, NAME_ENV_BASE + nameLen * NAME_ENV_SLOPE)
      );

      // SplitText the pull quote. linesClass wraps each rendered
      // line in a span we can animate independently. Lines-mode
      // depends on final font metrics — the fontsReady gate is
      // what makes this split reliable.
      const split = new SplitText(quote, {
        type: "lines",
        linesClass: "lineage__quote-line",
      });

      // Per-line hidden state. yPercent:10 lifts each line 10% of
      // its own height below baseline; clipPath from the right
      // is the real reveal mechanism; the url(#ink-bleed) filter
      // and blur(2.5px) make the advancing clip edge read as ink
      // into paper, not a mechanical wipe. willChange promotes
      // to a compositor layer during tween; cleared onComplete
      // so the static state is plain HTML.
      gsap.set(split.lines, {
        opacity: 0,
        yPercent: 10,
        clipPath: "inset(-0.3em 100% -0.3em 0)",
        filter: "url(#ink-bleed) blur(2.5px)",
        willChange: "clip-path, filter, transform, opacity",
      });
      // Un-hide the container NOW that lines are individually
      // hidden. Order matters: if we un-hid first, a frame of
      // full-opacity prose would paint through.
      gsap.set(quote, { opacity: 1 });

      // Name reveal state — set inside fontsReady because name is
      // also font-metric-sensitive for the clip-path horizontal
      // inset. Heavier blur than quote lines (4px vs 2.5px)
      // because names are display-scale; the denser bleed reads
      // correctly at h1 size.
      gsap.set(name, {
        opacity: 0,
        yPercent: 10,
        clipPath: "inset(-0.3em 100% -0.3em 0)",
        filter: "url(#ink-bleed) blur(4px)",
        willChange: "clip-path, filter, transform, opacity",
      });

      // Quote per-line envelopes + onsets — hybrid A+B prose
      // values from learning #21. Envelope scales with line
      // length; onset advances by a fraction of the CURRENT
      // envelope, so long lines leave proportionally longer
      // wakes.
      const envelopes = [];
      const onsets = [];
      let cursor = 0;
      split.lines.forEach((line, i) => {
        const len = line.textContent.trim().length;
        const env = Math.min(
          QUOTE_ENV_MAX,
          Math.max(QUOTE_ENV_MIN, QUOTE_ENV_BASE + len * QUOTE_ENV_SLOPE)
        );
        envelopes.push(env);
        if (i === 0) {
          onsets.push(0);
        } else {
          cursor += envelopes[i - 1] * QUOTE_OVERLAP;
          onsets.push(cursor);
        }
      });

      trace(
        `gen ${idx + 1}:`,
        `name[len=${nameLen} env=${nameEnv.toFixed(2)}s]`,
        `quote=[${envelopes
          .map((e, i) => `${e.toFixed(2)}s @${onsets[i].toFixed(2)}s`)
          .join(" · ")}]`
      );

      // Build the reveal timeline for this generation. paused so
      // ScrollTrigger's onEnter plays it; start/end traces help
      // diagnose if a generation's trigger positions drift.
      const tl = gsap.timeline({
        paused: true,
        onStart: () => trace(`gen ${idx + 1} reveal started`),
        onComplete: () => trace(`gen ${idx + 1} reveal complete`),
      });

      // 1. Header fade-in.
      //    duration: 0.55 — arrival envelope. A quiet lift; longer
      //      drags the block's tempo, shorter reads as a pop.
      //    ease: power2.out — decelerates into place; arrives,
      //      doesn't coast.
      tl.to(
        head,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        0
      );

      // 2. Hanko settle in parallel with header.
      //    scale 1.2→1 and rotation -6°→0° — the initial
      //      overshoot set synchronously above gives back.out
      //      somewhere to settle FROM.
      //    duration: 0.75 — longer than head (0.55) so the
      //      overshoot has room to breathe; the seal lands a beat
      //      after the caption bar.
      //    ease: back.out(1.2) — 1.2 is a gentle overshoot
      //      (default is 1.7, which reads cartoonish at seal
      //      scale). back.out is the correct ease for "lands,
      //      rocks back into place" — exactly a stamp settling.
      tl.to(
        hanko,
        {
          scale: 1,
          rotation: 0,
          duration: 0.75,
          ease: "back.out(1.2)",
          onComplete: () =>
            gsap.set(hanko, {
              clearProps: "transform",
            }),
        },
        0
      );

      // 3. Name bleed-in.
      //    Starts at 0.25 — by then the head has begun settling
      //      but hasn't finished, so name arrival overlaps rather
      //      than sequences.
      //    duration: nameEnv — length-scaled (hybrid A+B).
      //    clipPath final: inset(-0.3em -4% -0.3em -4%) — negative
      //      vertical insets protect descenders; negative
      //      horizontal insets extend past the element box so the
      //      last glyph's edge clears cleanly.
      //    filter goes from url(#ink-bleed) blur(4px) → blur(0)
      //      — the turbulence stays during bleed, clearProps
      //      removes both filter + clip in onComplete so static
      //      state is plain HTML.
      //    ease: power2.out — matches §I word reveals.
      tl.to(
        name,
        {
          opacity: 1,
          yPercent: 0,
          clipPath: "inset(-0.3em -4% -0.3em -4%)",
          filter: "url(#ink-bleed) blur(0px)",
          duration: nameEnv,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(name, {
              clearProps:
                "clipPath,filter,willChange,transform,opacity",
            });
          },
        },
        0.25
      );

      // 4. Role fade-in.
      //    Position: -=(nameEnv * 0.5, capped at 0.3) — overlap
      //      with the tail of the name reveal so role + name
      //      share a breath. Capped so it doesn't overlap
      //      dramatically when nameEnv is near NAME_ENV_MAX.
      //    duration: 0.5 — one-line caption, quick arrival;
      //      longer would draw attention it doesn't earn.
      //    ease: power2.out — consistent deceleration family.
      tl.to(
        role,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        `-=${Math.min(0.3, nameEnv * 0.5)}`
      );

      // 5. Quote lines — hybrid A+B per-line reveal.
      //    Anchor label at -=0.15 relative to current timeline
      //      cursor; offset onsets are computed from this anchor.
      //    Per-line duration: length-scaled envelope.
      //    Final clipPath inset: -0.3em vertical (descenders),
      //      -4% horizontal (last-glyph clearance).
      //    onComplete on the LAST line only: clearProps across
      //      all lines so the quote settles to plain CSS.
      const quoteAnchor = `q${idx}Start`;
      tl.addLabel(quoteAnchor, "-=0.15");
      const lastQuoteIdx = split.lines.length - 1;
      split.lines.forEach((line, i) => {
        tl.to(
          line,
          {
            opacity: 1,
            yPercent: 0,
            clipPath: "inset(-0.3em -4% -0.3em -4%)",
            filter: "url(#ink-bleed) blur(0px)",
            duration: envelopes[i],
            ease: "power2.out",
            onComplete:
              i === lastQuoteIdx
                ? () => {
                    gsap.set(split.lines, {
                      clearProps:
                        "clipPath,filter,willChange,transform,opacity",
                    });
                  }
                : undefined,
          },
          `${quoteAnchor}+=${onsets[i]}`
        );
      });

      // ScrollTrigger — fires the reveal once per block.
      //   start: "top 78%" — the block's top has just reached
      //     78% down the viewport (block is 22% into view from
      //     the bottom). Reveal plays while the block is moving
      //     into centre, not after it has arrived.
      //   once: true — scrolling back up doesn't re-stage. A
      //     lineage is read in one direction; re-playing the
      //     reveals would break the "museum, not slideshow"
      //     posture (same constraint §II applies).
      registerTrigger(
        ScrollTrigger.create({
          trigger: gen,
          start: "top 78%",
          once: true,
          onEnter: () => tl.play(),
        })
      );
    });

    // SplitText rewrote paragraph layout into per-line spans —
    // heights may have shifted, which means every trigger below
    // §III might be slightly off. Refresh rebuilds start/end
    // pixel positions against post-split layout.
    ScrollTrigger.refresh();
  });
}
