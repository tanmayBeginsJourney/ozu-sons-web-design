/* ──────────────────────────────────────────────────────────────
   philosophy.js — §V motion.

   This file is deliberately short. §V is the exhale after §IV's
   cinema — one sentence, two lines, held in full viewport. One
   concern only:

     1. Entry reveal — SplitText word-by-word ink-bleed mask
        reveal, same vocabulary as §I's headline words. Trigger
        is scroll-interruptible: if the user scrolls past the
        sentence midpoint while the timeline is still playing,
        remaining words fast-forward so the viewer retains
        control of pace. §I-§IV do not earn this affordance
        (see handoff + learning #7 for the rationale).

   ABSENT BY DESIGN — do not add any of these:
     • No ambient idle-reactive breathing (that was §I's).
     • No rotation or blob motion (that was §II's).
     • No scrub-based entry or exit. §V does not animate out.
     • No scroll-progress tell, no mono counter, no parallax.

   If the canvas feels empty, re-read learning #7 before adding
   anything. The silence IS the craft.

   BUILD PROGRESS: Pass 3 — scroll-interruptible fast-forward
   added. If the user scrolls past the sentence midpoint while
   the reveal timeline is still running, remaining un-revealed
   words snap to visible via a short power2.out chain (120ms
   each, 40ms stagger). The timeline is paused, per-word tweens
   killed, and the fast-forward takes over. Guard flags prevent
   double-fire and replay.
   ────────────────────────────────────────────────────────── */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motion, registerTrigger } from "./motion.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

// ─── Tunables ────────────────────────────────────────────────
// Hybrid A+B pacing constants for "one-sentence still-held" type
// scale (learning #31). Per-word envelope scales with length;
// onset-to-next advance is a fraction of the CURRENT word's
// envelope, so long words both take longer AND leave a
// proportionally larger wake before the next word begins.
//
//   envelope(len) = clamp(ENV_BASE + len * ENV_SLOPE, ENV_MIN, ENV_MAX)
//   nextOnset     = currentOnset + currentEnvelope * OVERLAP
//
// These constants were never live-tuned before §V. Expect to
// adjust — OVERLAP is the most likely first lever. A higher
// OVERLAP (0.55-0.60) spaces words further apart, which reads as
// MORE patient; a lower OVERLAP (0.35-0.45) packs them closer
// and reads as more rushed. The handoff flagged 0.50 as possibly
// too packed for a held sentence.
const ENV_BASE = 0.70;
const ENV_SLOPE = 0.05;
const ENV_MIN = 0.80;
const ENV_MAX = 1.80;
const OVERLAP = 0.50;

// Trigger start — §V's reveal begins when the section's top is
// 65% down the viewport (35% into view). Earlier than §II's 75%
// because §V is held in full-viewport and the reader arrives at
// the sentence deliberately; a late trigger would mean the
// sentence is already mid-screen before reveal starts, which
// fights the held-thought editorial logic.
const TRIGGER_START = "top 65%";

// Fast-forward parameters for the scroll-interruptible reveal.
// When the user scrolls past the sentence's vertical midpoint
// while words are still bleeding in, the remaining words snap
// to final state at this tempo. 120ms is fast enough to feel
// like a deliberate acknowledgment of the scroll gesture, not
// a separate animation. 40ms stagger preserves the left-to-
// right reading order so the sweep still reads as ONE sentence
// arriving quickly, not as a chaotic flash.
const FF_DURATION = 0.12;
const FF_STAGGER = 0.04;

export function initPhilosophy() {
  const section = document.querySelector("#philosophy");
  if (!section) return;

  const isDev = import.meta.env && import.meta.env.DEV;
  const trace = (...args) => {
    if (isDev) console.info("[philosophy]", ...args);
  };

  trace("init");

  const sentence = section.querySelector(".philosophy__sentence");
  const lines = section.querySelectorAll(".philosophy__line");

  // ─── Reduced-motion path ─────────────────────────────────────
  // No SplitText, no trigger, no gsap.set. The CSS rule
  // `@media (prefers-reduced-motion) html.js-pending .philosophy__sentence`
  // already overrides the FOUC gate to opacity 1, and HTML
  // authors the final visible typography. Returning here keeps
  // the HTML state authoritative (learning #23) — no inline
  // styles to clean up, no split spans to unwind.
  if (motion.prefersReducedMotion) {
    trace("reduced-motion → final state");
    return;
  }

  // ─── Synchronous initial state ──────────────────────────────
  // Must run BEFORE main.js calls releaseRevealGate() after initThreshold.
  // The CSS gate keeps .philosophy__sentence at opacity 0 until
  // this inline gsap.set writes the same opacity as an inline
  // style; inline styles outrank the removed CSS rule, so
  // gate release causes no visible
  // change here. The sentence stays hidden while we wait for
  // fonts.ready — same pattern as §II's .place__prose container
  // (learning #24).
  gsap.set(sentence, { opacity: 0 });

  // ─── Entry reveal (gated on fonts.ready) ─────────────────────
  // SplitText in "words" mode is less sensitive to font metrics
  // than "lines" mode, but still relies on accurate glyph
  // widths to compute span bounds. Waiting for fonts.ready
  // guarantees the split runs against final metrics — matches
  // the §II/§III pattern (learning #26).
  const fontsReady =
    (document.fonts && document.fonts.ready) || Promise.resolve();

  fontsReady.then(() => {
    trace("fonts ready, splitting sentence");

    // Split both lines together so SplitText produces one
    // ordered `words` array across the couplet. Reveal order
    // follows DOM order: "Eighteen", "months", "to", "make.",
    // "A", "lifetime", "to", "keep." — reading left-to-right,
    // top-to-bottom, as the sentence wants to be read.
    const split = new SplitText(lines, {
      type: "words",
      wordsClass: "philosophy__word",
    });

    trace("SplitText produced", split.words.length, "words");

    // ─── Per-word hidden state ──────────────────────────────
    // Vocabulary matches §I's threshold words exactly:
    //   - opacity 0
    //   - yPercent 18 (lifts from below baseline on reveal)
    //   - clipPath inset fully clipped from the right; vertical
    //     insets negative (-0.5em) so descenders are never
    //     clipped by the horizontal reveal edge (learning #19)
    //   - ink-bleed filter + 5px blur so the advancing clip
    //     edge reads as ink seeping into paper fibres, not a
    //     clean vector wipe. The blur fades on reveal; the
    //     turbulence is cleared on completion.
    //   - willChange promotes each word to its own compositor
    //     layer during the transition; Pass 2 will clear this
    //     on the final-word onComplete.
    gsap.set(split.words, {
      opacity: 0,
      yPercent: 18,
      clipPath: "inset(-0.5em 100% -0.5em 0)",
      filter: "url(#ink-bleed) blur(5px)",
      willChange: "clip-path, filter, transform, opacity",
    });

    // Per-word inline styles now carry the hidden state. The
    // sentence container can return to opacity 1 — each word
    // is individually hidden, so no frame of full-sentence
    // paints through. Same ordering discipline as place.js's
    // lines → container unhide sequence.
    gsap.set(sentence, { clearProps: "opacity" });

    // ─── Per-word envelope + onset computation ─────────────
    // Same hybrid A+B approach as §I's words and §II's lines,
    // with the "still-held" constants tuned for §V's scale.
    // Longer words bleed longer AND leave proportionally
    // larger wakes before the next word begins.
    const envelopes = [];
    const onsets = [];
    let cursor = 0;
    split.words.forEach((word, i) => {
      const len = word.textContent.length;
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

    // ─── Reveal timeline ───────────────────────────────────
    // Paused at construction; the ScrollTrigger below plays it
    // on section enter. No yoyo, no repeat, no onReverse —
    // once the sentence has revealed, it stays revealed. §V
    // does not re-stage on scroll-back (guarded by the
    // revealStarted flag on the trigger), matching §II's
    // museum-not-slideshow posture.
    const revealTl = gsap.timeline({
      paused: true,
      onStart: () => trace("reveal timeline started"),
      onComplete: () => trace("reveal timeline complete"),
    });

    const lastIndex = split.words.length - 1;
    split.words.forEach((word, i) => {
      revealTl.to(
        word,
        {
          opacity: 1,                                  // word becomes visible
          yPercent: 0,                                 // lifts from 18% below baseline
          clipPath: "inset(-0.5em -8% -0.5em -8%)",    // clip extends past type so ascenders/descenders survive
          filter: "url(#ink-bleed) blur(0px)",         // blur fades; turbulence stays until onComplete
          duration: envelopes[i],                      // per-word envelope, length-scaled
          ease: "power2.out",                          // decelerating; arrives, no overshoot
          onComplete:
            i === lastIndex
              // clearProps on ALL words once the last lands.
              // Removes inline filter/clip/transform/opacity so
              // static state is CSS-driven and type renders
              // crisply. willChange dropped too — the
              // compositor layer is no longer needed after the
              // reveal.
              ? () => {
                  gsap.set(split.words, {
                    clearProps:
                      "clipPath,filter,willChange,transform,opacity",
                  });
                }
              : undefined,
        },
        onsets[i]
      );
    });

    trace(
      "word timing:",
      split.words
        .map(
          (w, i) =>
            `${w.textContent}[env=${envelopes[i].toFixed(
              2
            )}s @${onsets[i].toFixed(2)}s]`
        )
        .join(" · ")
    );

    // ─── Fast-forward (scroll-interruptible) ─────────────────
    // Fired by onUpdate when the user has scrolled past the
    // sentence's visual midpoint while the reveal timeline is
    // still running. Pauses the timeline, kills in-flight
    // per-word tweens, and snaps remaining words to final state
    // at the FF tempo. Idempotent via the `interrupted` flag.
    //
    // Why this is unique to §V (not §I/§II/§III/§IV):
    // §V is held in full viewport and a reader can easily
    // scroll past it before the patient 4.2s reveal completes.
    // Punishing that reader with a slow tail bleeding in behind
    // them would break the "the reader is in control" editorial
    // logic of this section. The interruption says: you've
    // read it, we acknowledge that, moving on.
    let revealStarted = false;
    let interrupted = false;

    const fastForward = () => {
      if (interrupted || !revealStarted) return;
      if (revealTl.progress() >= 1) return;
      interrupted = true;

      // Freeze the timeline + cancel any currently-running
      // per-word tween so the fast-forward doesn't fight them.
      revealTl.pause();
      gsap.killTweensOf(split.words);

      // A word is "remaining" if its natural reveal window has
      // not yet closed at the current timeline time. Already-
      // completed words are excluded so we don't no-op-tween
      // them (which would otherwise clip the sentence into the
      // FF stagger rhythm needlessly).
      const revealTime = revealTl.time();
      const remaining = [];
      split.words.forEach((w, i) => {
        if (revealTime < onsets[i] + envelopes[i]) remaining.push(w);
      });

      trace(
        "fast-forward",
        remaining.length,
        "of",
        split.words.length,
        "words"
      );

      // Edge case: if progress crossed the threshold on the
      // same frame the last word's onComplete fired, `remaining`
      // could be empty. Just cleanup and bail.
      if (remaining.length === 0) {
        gsap.set(split.words, {
          clearProps: "clipPath,filter,willChange,transform,opacity",
        });
        return;
      }

      gsap.to(remaining, {
        opacity: 1,
        yPercent: 0,
        clipPath: "inset(-0.5em -8% -0.5em -8%)",
        filter: "url(#ink-bleed) blur(0px)",
        duration: FF_DURATION,
        stagger: FF_STAGGER,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(split.words, {
            clearProps:
              "clipPath,filter,willChange,transform,opacity",
          });
          trace("fast-forward complete");
        },
      });
    };

    // ─── Trigger ─────────────────────────────────────────────
    // Full-range trigger (NOT once:true) so onUpdate keeps
    // firing while §V is on screen. Replay is prevented via the
    // revealStarted flag rather than ScrollTrigger's once — we
    // need onUpdate to live for the duration of the reveal.
    // end: "bottom top" keeps the trigger active until §V has
    // fully left the viewport; the interrupted flag guarantees
    // fastForward fires at most once per page load.
    registerTrigger(
      ScrollTrigger.create({
        trigger: section,
        start: TRIGGER_START,
        end: "bottom top",
        onEnter: () => {
          if (revealStarted) return;
          revealStarted = true;
          revealTl.play();
        },
        onUpdate: () => {
          if (interrupted || !revealStarted) return;
          if (revealTl.progress() >= 1) return;

          // "User past sentence-block midpoint" is expressed
          // against the DOM directly rather than the trigger's
          // progress, because the trigger's progress depends on
          // §V's overall height (svh/dvh variance, mobile
          // address-bar resize) while the sentence's screen
          // position is precisely what the editorial intent
          // cares about. When the sentence's vertical centre
          // crosses above the viewport centre, the reader has
          // scrolled past it.
          const rect = sentence.getBoundingClientRect();
          const sentenceMid = rect.top + rect.height / 2;
          const viewportMid = window.innerHeight / 2;
          if (sentenceMid < viewportMid) fastForward();
        },
      })
    );

    // SplitText re-wraps the DOM; trigger pixel positions for
    // anything below §V may have shifted. Refresh recomputes
    // against post-split layout.
    ScrollTrigger.refresh();
  });
}
