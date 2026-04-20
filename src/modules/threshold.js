/* ──────────────────────────────────────────────────────────────
   threshold.js — §I motion.
   Four concerns, kept isolated:
     1. Initial state (everything hidden / clipped / filtered)
     2. Entry timeline (meta → headline, ~2.2s total)
     3. Idle-reactive opsz breathing (NOT a loop; gated by scroll idle)
     4. Exit scrub (headline drifts out as §II approaches)
   Reduced-motion collapses everything to the final static state.
   ────────────────────────────────────────────────────────────── */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motion, registerTrigger } from "./motion.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

// opsz bounds for idle breathing. Tokened locally because these are
// specific to this section's headline and nowhere else on the page.
const OPSZ_NEUTRAL = 144;
const OPSZ_AMPLITUDE = 3;     // ±3 axis units around neutral
const BREATH_HALF_PERIOD = 6; // seconds; full yoyo cycle = 12s
const IDLE_THRESHOLD_MS = 1500;

// Static wght for the colossus. Token-mirrored from typography.css so
// font-variation-settings can be rebuilt each frame during breathing.
const WGHT_STATIC = 320;

const setFvs = (el, opsz, wght = WGHT_STATIC) => {
  el.style.fontVariationSettings = `"opsz" ${opsz}, "wght" ${wght}`;
};

export function initThreshold() {
  const section = document.querySelector("#threshold");
  if (!section) return;

  const isDev = import.meta.env && import.meta.env.DEV;
  const trace = (...args) => {
    if (isDev) console.info("[threshold]", ...args);
  };

  trace("init");

  const headline = section.querySelector(".threshold__headline");
  const lines = section.querySelectorAll(".threshold__line");
  const meta = section.querySelectorAll(".meta");

  // SplitText wraps each word in a span. We animate those spans.
  // type:"words" preserves whitespace so layout is unchanged.
  const split = new SplitText(lines, {
    type: "words",
    wordsClass: "threshold__word",
  });

  trace("SplitText produced", split.words.length, "words");

  // ─── Reduced-motion path ─────────────────────────────────────
  // No timeline, no scrub, no breathing. Just final state.
  if (motion.prefersReducedMotion) {
    // Release the CSS pre-reveal gate so content is visible immediately.
    document.documentElement.classList.remove("js-pending");
    gsap.set(meta, { opacity: 1, y: 0 });
    gsap.set(split.words, {
      opacity: 1,
      yPercent: 0,
      clearProps: "clipPath,filter",
    });
    trace("reduced-motion → final state");
    return;
  }

  // ─── Initial state ───────────────────────────────────────────
  // Words: clipped from the right, nudged down, blurred, bleed-filtered.
  // The clip-path reveal is the real mechanism — the filter + blur just
  // make the advancing clip edge read as inky rather than mechanical.
  //
  // The vertical clip values are negative (-0.5em) on purpose: they
  // extend the clip region beyond the element's box so descenders
  // (the 'g' loop, the 'p' tail) are never clipped by the reveal
  // itself. Only the horizontal edge does visible work.
  gsap.set(meta, { opacity: 0, y: 6 });
  gsap.set(split.words, {
    opacity: 0,
    yPercent: 18,
    clipPath: "inset(-0.5em 100% -0.5em 0)",
    filter: "url(#ink-bleed) blur(5px)",
    // Promote to its own layer during the transition; removed on complete.
    willChange: "clip-path, filter, transform, opacity",
  });

  // ─── Release the pre-reveal CSS gate ─────────────────────────
  // html.js-pending kept the animation targets at opacity 0 from the
  // very first paint. Now that gsap.set has written the true initial
  // state as inline styles (same opacity 0, but with transform + clip
  // + filter baked in), releasing the gate is safe — inline styles
  // outrank the CSS rule, so there's no visual change.
  document.documentElement.classList.remove("js-pending");

  // ─── Entry timeline ──────────────────────────────────────────
  const tl = gsap.timeline({
    // Small pre-roll so the first frame isn't the reveal; lets the
    // page settle + fonts lock before anything moves.
    delay: 0.15,
    onStart: () => trace("timeline started"),
    onComplete: () => trace("timeline complete"),
  });

  // Meta labels arrive first — "the plaque attaches." 0.6s total across
  // all four corners with a tiny 80ms stagger so they don't snap in unison.
  tl.to(meta, {
    opacity: 1,       // 0 → 1, driven by the tween, not a fade class
    y: 0,             // 6px → 0, a quarter-em lift
    duration: 0.6,    // total envelope per corner
    ease: "power2.out", // decelerates — arrives, doesn't coast
    stagger: 0.08,    // 80ms between corners; reads as "settling" not "sequenced"
  });

  // Words bleed through left-to-right. TWO length-scaled quantities:
  //
  //   envelope(len) = clamp(0.55 + len * 0.08, 0.6, 1.6)
  //   nextOnset     = currentOnset + currentEnvelope * 0.45
  //
  // Envelope is how long a word takes to bleed in; onset overlap is how
  // much the next word starts BEFORE the current finishes. A 12-glyph
  // word like "generations." gets 1.51s of bleed time — long enough for
  // the eye to follow the clip edge all the way across. Because the gap
  // to the next word is a fraction of the CURRENT envelope, long words
  // also leave a longer wake before the next word starts (the "spoken"
  // cadence feel of the prior attempt). Two axes scale, one rule.
  //
  // This intentionally overrides learning #17's "~0.95s ceiling" guideline
  // after live feedback that uniform pacing read as rushed on the long
  // word. If 1.5s+ reads as slow-motion instead of lingering in practice,
  // tune OVERLAP up toward 0.6 or lower the env_slope toward 0.06.
  const ENV_BASE = 0.55;
  const ENV_SLOPE = 0.08;
  const ENV_MIN = 0.6;
  const ENV_MAX = 1.6;
  const OVERLAP = 0.45;

  const wordsAnchor = "wordsStart";
  // "-=0.5" keeps the original braid: words start 0.1s into the 0.6s
  // meta tween so the two phases overlap rather than sequence.
  tl.addLabel(wordsAnchor, "-=0.5");

  const envelopes = [];
  const onsets = [];
  let cursor = 0;
  split.words.forEach((word, i) => {
    const len = word.textContent.length;
    const env = Math.min(ENV_MAX, Math.max(ENV_MIN, ENV_BASE + len * ENV_SLOPE));
    envelopes.push(env);
    if (i === 0) {
      onsets.push(0);
    } else {
      cursor += envelopes[i - 1] * OVERLAP;
      onsets.push(cursor);
    }
  });

  const lastIndex = split.words.length - 1;
  split.words.forEach((word, i) => {
    tl.to(
      word,
      {
        opacity: 1,                                      // word becomes visible
        yPercent: 0,                                     // lift from 18% below baseline
        clipPath: "inset(-0.5em -8% -0.5em -8%)",        // reveal advances; final clip extends past type so ascenders/descenders are untouched
        filter: "url(#ink-bleed) blur(0px)",             // blur fades; turbulence stays until onComplete
        duration: envelopes[i],                          // per-word envelope; longer for longer words so the eye can follow the clip edge across all glyphs
        ease: "power2.out",                              // decelerating; arrives, no overshoot
        onComplete:
          i === lastIndex
            // clearProps (vs literal "none") removes the inline style
            // entirely so the static state is CSS-driven. Runs on the
            // last word only — onsets are monotonic and overlap is a
            // positive fraction, so word[n-1] is also last to end.
            ? () => {
                gsap.set(split.words, {
                  clearProps: "clipPath,filter,willChange,transform,opacity",
                });
              }
            : undefined,
      },
      `${wordsAnchor}+=${onsets[i]}`
    );
  });

  trace(
    "word timing:",
    split.words
      .map(
        (w, i) =>
          `${w.textContent}[env=${envelopes[i].toFixed(2)}s @${onsets[i].toFixed(2)}s]`
      )
      .join(" · ")
  );

  // ─── Idle-reactive breathing ─────────────────────────────────
  // When the user hasn't scrolled/pointered in IDLE_THRESHOLD_MS, the
  // opsz axis gently oscillates. Any input kills the tween and snaps
  // back to neutral. This is responsiveness to stillness, not a loop.
  //
  // Gated by viewport: if §I isn't visible, we don't install listeners,
  // so breathing never starts from elsewhere on the page.
  const breathState = { opsz: OPSZ_NEUTRAL };
  let breathTween = null;
  let snapTween = null;
  let idleTimer = null;
  let listenersInstalled = false;

  const sectionInView = () => {
    const rect = section.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  const startBreathing = () => {
    if (breathTween || !sectionInView()) return;
    if (snapTween) {
      snapTween.kill();
      snapTween = null;
    }
    breathTween = gsap.to(breathState, {
      opsz: OPSZ_NEUTRAL + OPSZ_AMPLITUDE, // 144 → 147
      duration: BREATH_HALF_PERIOD,         // half a full cycle
      ease: "sine.inOut",                   // matches lung-curve, not linear
      yoyo: true,                           // reverses back to 141 → repeat
      repeat: -1,                           // forever, until killed by input
      onUpdate: () => setFvs(headline, breathState.opsz),
    });
  };

  const snapToNeutral = () => {
    if (breathTween) {
      breathTween.kill();
      breathTween = null;
    }
    if (snapTween) snapTween.kill();
    snapTween = gsap.to(breathState, {
      opsz: OPSZ_NEUTRAL,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => setFvs(headline, breathState.opsz),
    });
  };

  const onInput = () => {
    window.clearTimeout(idleTimer);
    snapToNeutral();
    if (sectionInView()) {
      idleTimer = window.setTimeout(startBreathing, IDLE_THRESHOLD_MS);
    }
  };

  const installListeners = () => {
    if (listenersInstalled) return;
    listenersInstalled = true;
    window.addEventListener("scroll", onInput, { passive: true });
    window.addEventListener("pointermove", onInput, { passive: true });
    window.addEventListener("keydown", onInput);
    // First idle countdown starts after the entry timeline has finished.
    idleTimer = window.setTimeout(startBreathing, IDLE_THRESHOLD_MS);
  };

  const removeListeners = () => {
    if (!listenersInstalled) return;
    listenersInstalled = false;
    window.removeEventListener("scroll", onInput);
    window.removeEventListener("pointermove", onInput);
    window.removeEventListener("keydown", onInput);
    window.clearTimeout(idleTimer);
    if (breathTween) {
      breathTween.kill();
      breathTween = null;
    }
    if (snapTween) {
      snapTween.kill();
      snapTween = null;
    }
    setFvs(headline, OPSZ_NEUTRAL);
  };

  // Install breathing listeners only when the section is on stage.
  registerTrigger(
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",  // as soon as the section edge enters
      end: "bottom top",     // until the section has fully left
      onEnter: installListeners,
      onEnterBack: installListeners,
      onLeave: removeListeners,
      onLeaveBack: removeListeners,
    })
  );

  // Wait for the entry timeline to finish before starting breathing the
  // first time. Before that, listeners are not armed — the reveal can't
  // be interrupted by a mid-reveal breath.
  tl.call(() => {
    if (sectionInView()) installListeners();
  });

  // ─── Exit scrub ──────────────────────────────────────────────
  // scrub: true ties the tween value 1:1 to scroll position — the user
  // drives the motion directly. No ease, no inertia. Starts when the
  // section's bottom hits the viewport bottom (section about to exit)
  // and ends when the section's bottom leaves the top (fully gone).
  registerTrigger(
    ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
      animation: gsap.to(headline, {
        yPercent: -14,            // drifts slightly up, not a full exit
        filter: "blur(6px)",      // softens as it leaves — ink receding
        opacity: 0.3,             // fades but never disappears fully in range
        ease: "none",             // scrub ignores ease, but explicit is honest
      }),
    })
  );
}
