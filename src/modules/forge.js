/* ──────────────────────────────────────────────────────────────
   forge.js — §IV motion.

   6c step (vii) — feature-complete: pin + crossfade + ember +
   micro-motion + caption SplitText reveals + stage-6 film-cut
   hold, all wrapped in three short-circuit branches that yield a
   legible contact-sheet layout whenever the pin shouldn't run.
     • Pin .forge__inner for ~3 viewport heights.
     • Map normalized pin progress to a per-stage opacity via
       centered-transition bands (0.08 wide, centered on the
       nominal stage boundary): at progress 0.16, 0.32, 0.48,
       0.64, 0.80 the adjacent stages sit mid-crossfade at
       opacity 0.5 each — a deliberate "pause and see the
       previous and next stage together" beat.
     • Stage 1 has no ramp-in (starts fully visible at pin-engage);
       stage 6 has no ramp-out (film-cut plateau extends from
       0.84 to 1.00 for the finished-blade hold).
     • Counter stays discrete — it's a mono tell, not a scrub.
       It flips to stage N at the midpoint of each transition
       (the moment stage N becomes more opaque than stage N-1).
     • Ember (step iii): stages 2 and 3 carry an absolutely-
       positioned span with the stage's own SVG used as CSS mask
       (forge.css). Their opacity = emberPeak(N) × stageOpacity(N),
       so the warmth rides the same crossfade curve as the plate
       — when a hot stage is 50% visible during a transition, its
       ember is also at 50% of its peak. Peaks are 1.0 for stage 2
       (forging at 1450°C) and 0.55 for stage 3 (rough-forged, still
       radiating). Stage 4's quench gets no ember by design — the
       absence of heat is the moment's meaning.
     • Micro-motion (step iv): one dominant motion per hot stage,
       three stages deliberately still.
         · Stage 2: hammering vibration (±2.5px, ~90ms rhythm).
         · Stage 4: quench drift (slow sine y-bob, 6s period).
         · Stage 5: polish highlight sweep (bright band traverses
           the silhouette at ~3.5s per pass, 2.5s dwell between).
         · Stages 1, 3, 6: still. Raw mass, cooling piece, and
           the finished blade each earn stillness.
       Timelines run always, repeat: -1. They compose with
       stageOpacity: when a plate is at opacity 0, its transforms
       and backgroundPosition updates composite invisibly — no
       gating logic needed.
     • Caption reveal (step v): each stage's .forge__caption-line
       is SplitText'd into words at init. Stages 2–6 carry a
       paused timeline that lifts the words in (opacity 0→1, y
       6→0, stagger 55ms, ease power2.out) and fades the mono
       note in on the tail. applyCounter plays the timeline when
       the monotonic counter flips INTO that stage — one-shot per
       session, so a caption "earned" on first scroll-through is
       simply present on any return visit (the container-level
       crossfade from applyOpacities handles re-appearance).
       Stage 1 has no timeline — its caption is already visible
       at pin engage, matching editorial intent for the landing
       frame.
     • Film-cut hold (step vi): stage 6 is the narrative climax,
       and three things converge to mark it as the held final
       frame:
         1. Budget. Stage 6's plateau is width 0.16 (0.84–1.00),
            doubled from the 0.08 other plateaus occupy. That's
            the actual "hold" — roughly twice the dwell time a
            mid-sequence frame receives.
         2. Stillness. No micro-motion lives on stage 6; unlike
            the hot stages (2 vibration, 4 drift, 5 sweep), the
            finished blade sits completely quiet. The knife has
            been made; it does not need to perform.
         3. Counter signoff. 0.9s after the counter flips INTO 6
            (long enough for the caption reveal to complete),
            the mono counter fades from opacity 1 → 0.4 over
            0.6s. It has been announcing stages for the whole
            pin range; on the final frame it quietly steps back,
            like the legend on a film's closing still. Reversed
            on scroll-back so the counter is whole again whenever
            the user moves off stage 6.
     • Reduced-motion (step vii): initForge returns at the very
       first branch — no pin, no triggers, no SplitText, no
       tweens, no inline hidden styles, no .forge--pinned class.
       The CSS gate carries an @media (prefers-reduced-motion)
       exemption so stages 2–6 paint visible at first paint; the
       contact-sheet grid becomes the final state with every
       stage legible at once. The trace string matches the
       convention used by threshold/place/lineage so the global
       a11y audit (learning #16) is a single grep.

   The pin is only created when ScrollSmoother is live AND the
   viewport is ≥ 721px. Reduced-motion, ScrollSmoother-failed, and
   narrow-viewport paths all short-circuit and let the contact-sheet
   CSS render the section. This keeps the progressive-enhancement
   promise: any failure in the motion stack still yields a legible
   page (learning #1).

   FOUC coordination (learning #24): stages 2–6 must carry an inline
   opacity:0 BEFORE main.js releaseRevealGate() after initThreshold
   of its synchronous init. main.js calls initForge immediately
   before initThreshold; the synchronous gsap.set below satisfies
   that constraint.
   ────────────────────────────────────────────────────────── */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motion, registerTrigger } from "./motion.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

// ─── Stage budget (normalized pin progress) ────────────────────
//
// Transitions are 0.08 wide, CENTERED on the nominal stage
// boundary at N × 0.16 for N ∈ {1, 2, 3, 4, 5}. This places
// mid-crossfade exactly at progress 0.16, 0.32, 0.48, 0.64, 0.80.
// Plateaus fill the gaps between transitions; stage 6's plateau
// is doubled to hold the finished blade before pin release.
//
//   [0.00, 0.12] stage 1 plateau   (extended — no ramp-in)
//   [0.12, 0.20] transition 1→2    (centered on 0.16)
//   [0.20, 0.28] stage 2 plateau
//   [0.28, 0.36] transition 2→3    (centered on 0.32)
//   [0.36, 0.44] stage 3 plateau
//   [0.44, 0.52] transition 3→4    (centered on 0.48)
//   [0.52, 0.60] stage 4 plateau
//   [0.60, 0.68] transition 4→5    (centered on 0.64)
//   [0.68, 0.76] stage 5 plateau
//   [0.76, 0.84] transition 5→6    (centered on 0.80)
//   [0.84, 1.00] stage 6 plateau   (width 0.16 = film-cut hold)
//
// The counter flips to stage N at each transition's midpoint
// (progress N × 0.16) — which is when stage N becomes more
// opaque than stage N-1. That maps cleanly to the same simple
// formula step (i) used for discrete stage detection.
const STAGE_COUNT = 6;
const STAGE_UNIT = 0.16;
const RAMP_HALFWIDTH = 0.04;
const FILMCUT_START = 0.80;

/**
 * Map normalized scroll progress (0..1) to a stage index (1..6).
 * Used to drive the discrete counter. Monotonic, so the counter
 * never dithers backwards as the user scrubs slowly across a
 * transition midpoint.
 */
function stageForProgress(progress) {
  if (progress >= FILMCUT_START) return STAGE_COUNT;
  return Math.min(STAGE_COUNT - 1, Math.floor(progress / STAGE_UNIT)) + 1;
}

/**
 * Compute the opacity (0..1) for stage N at the given scroll
 * progress. Linear ramp inside each transition; clamped to 0/1
 * outside. Stage 1 has no ramp-in; stage 6 has no ramp-out.
 *
 * Mid-transition check: at progress N × 0.16, stages N and N+1
 * both return 0.5 — the 50/50 crossfade beat.
 */
function stageOpacity(N, progress) {
  const rampInCenter = (N - 1) * STAGE_UNIT;
  const rampOutCenter = N * STAGE_UNIT;
  const rampInStart = rampInCenter - RAMP_HALFWIDTH;
  const rampInEnd = rampInCenter + RAMP_HALFWIDTH;
  const rampOutStart = rampOutCenter - RAMP_HALFWIDTH;
  const rampOutEnd = rampOutCenter + RAMP_HALFWIDTH;

  if (N === 1) {
    // Plateau from 0, then fade out centered on 0.16.
    if (progress <= rampOutStart) return 1;
    if (progress >= rampOutEnd) return 0;
    return 1 - (progress - rampOutStart) / (2 * RAMP_HALFWIDTH);
  }

  if (N === STAGE_COUNT) {
    // Fade in centered on 0.80, then plateau to 1.0 (film cut).
    if (progress <= rampInStart) return 0;
    if (progress >= rampInEnd) return 1;
    return (progress - rampInStart) / (2 * RAMP_HALFWIDTH);
  }

  // Middle stages: 0 → ramp in → plateau → ramp out → 0.
  if (progress <= rampInStart) return 0;
  if (progress < rampInEnd) {
    return (progress - rampInStart) / (2 * RAMP_HALFWIDTH);
  }
  if (progress <= rampOutStart) return 1;
  if (progress < rampOutEnd) {
    return 1 - (progress - rampOutStart) / (2 * RAMP_HALFWIDTH);
  }
  return 0;
}

/**
 * Peak ember opacity for stage N — the maximum value the masked
 * warmth reaches on that stage's plateau. Cooling curve across
 * the hot stages: 1.0 at stage 2 (folded at 1450°C), 0.55 at
 * stage 3 (rough-forged, still radiating). Every other stage
 * returns 0 — raw tamahagane is cold, the quench is defined by
 * the absence of heat, and polished / handled stages are well
 * past any glow. Stages without ember also have no ember span
 * in markup, so this return of 0 is a belt-and-braces guard.
 */
function emberPeak(N) {
  if (N === 2) return 1.0;
  if (N === 3) return 0.55;
  return 0;
}

/**
 * Ember opacity for the ember span attached to stage N at the
 * given scroll progress. Equals peak × stage-visibility, so the
 * warmth fades IN with its plate (during the ramp-in) and fades
 * OUT with its plate (during the ramp-out) — there's never a
 * moment where the ember is glowing on a silhouette that isn't
 * yet fully visible, and never a moment where residual warmth
 * clings to a stage that's already crossfaded out.
 */
function emberOpacity(N, progress) {
  const peak = emberPeak(N);
  if (peak === 0) return 0;
  return peak * stageOpacity(N, progress);
}

export function initForge() {
  const section = document.querySelector("#forge");
  if (!section) return;

  const isDev = import.meta.env && import.meta.env.DEV;
  const trace = (...args) => {
    if (isDev) console.info("[forge]", ...args);
  };

  // ─── Short-circuit branches (step vii) ───────────────────────
  //
  // All three branches yield the same visual outcome: contact-
  // sheet grid, every stage visible, no pin, no triggers. What
  // differs is WHY we took the path, which matters for the a11y
  // audit + for debugging production user reports. Each branch
  // must return BEFORE any of the following runs:
  //   • ScrollTrigger.create / registerTrigger
  //   • SplitText instantiation
  //   • gsap.set that writes inline hidden state
  //   • gsap.to micro-motion timelines
  //   • section.classList.add("forge--pinned")
  // The order below is deliberate — cheapest check (OS-level
  // preference) first, framework check (smoother) next, viewport
  // check last. No branch falls through.

  // Reduced-motion — honor the OS/browser signal. The CSS gate
  // carries a matching @media exemption (see forge.css), so
  // stages 2–6 paint visible at first paint regardless of what
  // happens in JS below. Trace string matches the convention in
  // threshold.js / place.js / lineage.js so learning #16's audit
  // is a single grep.
  if (motion.prefersReducedMotion) {
    trace("reduced-motion → final state");
    return;
  }

  // Smoother-inactive — ScrollSmoother either skipped init
  // (shouldn't happen here; reduced-motion was already handled)
  // or threw during create(). Either way html[data-smoother] is
  // unset and the page is on native scroll. Pinned layout CSS is
  // keyed off .forge--pinned (not the smoother attribute), so
  // leaving that class unset is all it takes to fall through to
  // the contact sheet. main.js releaseRevealGate() follows initThreshold.
  // at the end of its sync init; stages 2–6 have no inline hidden
  // styles from us, so they paint at their natural opacity 1 the
  // moment the gate lifts.
  const smootherActive =
    document.documentElement.dataset.smoother === "on";
  if (!smootherActive) {
    trace("no smoother → final state");
    return;
  }

  // Narrow viewport — pinning on phones fights native scroll
  // chrome, and the CSS collapses to a stacked interleaved layout
  // below 720px. Read at init time only; a live cross-breakpoint
  // resize is a Step 7 concern.
  const isNarrow = window.matchMedia("(max-width: 720px)").matches;
  if (isNarrow) {
    trace("narrow viewport → final state");
    return;
  }

  // ─── Query markup ────────────────────────────────────────────
  const inner = section.querySelector(".forge__inner");
  const plates = Array.from(section.querySelectorAll(".forge__plate"));
  const captions = Array.from(section.querySelectorAll(".forge__caption"));
  const counterNum = section.querySelector("[data-counter-num]");
  // The counter parent element is the target for the step (vi)
  // film-cut signoff fade. We dim the whole meta block, not just
  // the number, so the "/ 06" total reads as quieted too.
  const counter = section.querySelector(".forge__counter");

  // Embers are sparse by design — only stages 2 and 3 carry a
  // span in markup. Each ember's closest ancestor .forge__plate
  // tells us which stage's opacity curve to drive it with.
  const embers = Array.from(
    section.querySelectorAll(".forge__plate-ember")
  ).map((el) => ({
    el,
    N: parseInt(
      el.closest(".forge__plate").dataset.stage,
      10
    ),
  }));

  if (
    !inner ||
    plates.length !== STAGE_COUNT ||
    captions.length !== STAGE_COUNT
  ) {
    trace("markup mismatch, bailing", {
      inner: !!inner,
      plates: plates.length,
      captions: captions.length,
    });
    return;
  }

  // ─── Commit to pinned layout ─────────────────────────────────
  // All short-circuit branches are behind us; from here down we
  // own the visual state of §IV. Flip the CSS to pinned layout
  // via a class on the section — NOT on the documentElement —
  // so the layout toggle is coupled 1:1 to the JS that drives
  // the pin. See forge.css header for the rationale.
  section.classList.add("forge--pinned");

  // ─── Synchronous initial state ───────────────────────────────
  // Write inline opacity:0 on stages 2–6 BEFORE releaseRevealGate()
  // (learning #24). Stage 1 keeps the
  // natural opacity 1 — it's the first visible stage at pin
  // engage. The CSS gate already hid these at first paint; the
  // inline set extends that state past the gate removal.
  const nonFirst = (el) => el.dataset.stage !== "1";
  gsap.set(plates.filter(nonFirst), { opacity: 0 });
  gsap.set(captions.filter(nonFirst), { opacity: 0 });
  // Embers all start cold. CSS already defaults them to opacity 0
  // under .forge--pinned, but the inline set is consistent with
  // how we treat plates and captions, and it survives any later
  // cascade surprise from the gate-removal.
  if (embers.length > 0) {
    gsap.set(
      embers.map((e) => e.el),
      { opacity: 0 }
    );
  }

  // ─── Caption reveals (step v) ────────────────────────────────
  // Split each caption-line into words, then build a paused entry
  // timeline per non-stage-1 caption. The timeline plays once when
  // the monotonic counter flips INTO that stage — a one-shot lift
  // that earns the phrase, not a scrubbed crossfade. Subsequent
  // return visits rely on the container-level opacity handled by
  // applyOpacities below: once earned, the words are simply there.
  //
  // Stage 1 is exempt. Its caption ("Tamahagane, smelted in
  // Shimane.") is visible from the first pin-engage frame — a
  // reveal here would re-animate content the user has already
  // been given by §I/§III's tempo, and conflict with the
  // "landing" intent of stage 1's extended plateau.
  const captionLines = Array.from(
    section.querySelectorAll(".forge__caption-line")
  );
  const captionNotes = Array.from(
    section.querySelectorAll(".forge__caption-note")
  );
  // One SplitText per line, in stage order (1..6). We keep the
  // instances around so nothing garbage-collects the word spans
  // mid-session.
  const captionSplits = captionLines.map(
    (line) =>
      new SplitText(line, {
        type: "words",
        wordsClass: "forge__caption-word",
      })
  );

  // Initial state for stages 2–6: words lifted and hidden, note
  // hidden. Done synchronously so it lands before releaseRevealGate()
  // (learning #24). Stage 1's words/note
  // stay at their natural CSS defaults — fully visible.
  for (let N = 2; N <= STAGE_COUNT; N += 1) {
    const idx = N - 1;
    gsap.set(captionSplits[idx].words, { opacity: 0, y: 6 });
    if (captionNotes[idx]) {
      gsap.set(captionNotes[idx], { opacity: 0 });
    }
  }

  // Paused timelines, indexed by stage number (captionTimelines[1]
  // is intentionally null — stage 1 never animates a reveal). The
  // word tween is the dominant beat (stagger 55ms × up to 5 words
  // ≈ 800ms end-to-end); the note fades in overlapping the tail
  // so the two reads converge rather than sequence.
  const captionTimelines = new Array(STAGE_COUNT + 1).fill(null);
  for (let N = 2; N <= STAGE_COUNT; N += 1) {
    const idx = N - 1;
    const words = captionSplits[idx].words;
    const note = captionNotes[idx];
    const tl = gsap.timeline({ paused: true });
    tl.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.055,
      ease: "power2.out",
    });
    if (note) {
      tl.to(
        note,
        {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
        },
        // Overlap: note starts fading in while the last word of
        // the phrase is still arriving, so the two reads braid
        // instead of stacking as two separate events.
        "-=0.25"
      );
    }
    captionTimelines[N] = tl;
  }

  // ─── Per-frame writers ───────────────────────────────────────
  // applyOpacities runs every scroll frame: cheap math + at most
  // 12 gsap.set calls (6 plates + 6 captions). Outside transition
  // windows all but one stage return exactly 0 or 1, so the DOM
  // writes are idempotent for most of the scroll range.
  //
  // applyCounter is discrete — early-returns unless the integer
  // stage index changed. Keeps the mono counter from flickering
  // during scrubbing (it's a tell, not an animation).
  let currentCounterStage = 1;

  // Step (vi) film-cut signoff tween tracker. Holds the most
  // recent counter dim/restore tween so a fast scrub in or out
  // of stage 6 can kill a pending animation before starting its
  // inverse — no stacked tweens, no overshoot into 0.4 and back.
  let counterDimTween = null;

  const applyOpacities = (progress) => {
    for (let i = 0; i < plates.length; i += 1) {
      const plate = plates[i];
      const N = parseInt(plate.dataset.stage, 10);
      gsap.set(plate, { opacity: stageOpacity(N, progress) });
    }
    for (let i = 0; i < captions.length; i += 1) {
      const caption = captions[i];
      const N = parseInt(caption.dataset.stage, 10);
      gsap.set(caption, { opacity: stageOpacity(N, progress) });
    }
    // Embers: two writes max (stages 2 and 3). Outside their
    // active range emberOpacity returns 0 — idempotent for the
    // long stretches of scroll where neither is visible.
    for (let i = 0; i < embers.length; i += 1) {
      const { el, N } = embers[i];
      gsap.set(el, { opacity: emberOpacity(N, progress) });
    }
  };

  const applyCounter = (progress) => {
    const stage = stageForProgress(progress);
    if (stage === currentCounterStage) return;
    if (counterNum) {
      counterNum.textContent = String(stage).padStart(2, "0");
    }
    trace(`stage ${currentCounterStage} → ${stage}`);
    const prevStage = currentCounterStage;
    currentCounterStage = stage;
    // Play this stage's caption reveal (step v). gsap.play() on a
    // completed timeline is a no-op, and resumes from current
    // progress on a partially-played one — so rapid scrubs don't
    // replay, and the "earn it once" contract holds.
    const captionTl = captionTimelines[stage];
    if (captionTl) captionTl.play();
    // Step (vi) counter signoff. Scheduled on flips INTO the
    // final stage, reversed on flips OUT of it. Any in-flight
    // tween is killed first so scrubbing back and forth across
    // the stage-5/6 boundary doesn't stack opacity targets.
    if (counter) {
      if (counterDimTween) counterDimTween.kill();
      if (stage === STAGE_COUNT) {
        // Delay 0.9s so the caption's word build (step v, ≈0.8s
        // end-to-end) can finish before the mono tell quiets.
        // Duration 0.6s, power2.out so the fade reads as a slow
        // step-back rather than a curtain drop.
        counterDimTween = gsap.to(counter, {
          opacity: 0.4,
          duration: 0.6,
          delay: 0.9,
          ease: "power2.out",
        });
      } else if (prevStage === STAGE_COUNT) {
        // Coming off the final frame — restore quickly (0.35s)
        // so the counter is fully present before the user reads
        // the penultimate stage's tell.
        counterDimTween = gsap.to(counter, {
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    }
  };

  registerTrigger(
    ScrollTrigger.create({
      // trigger: the section's top defines WHERE the pin engages.
      // pin: the element that stays fixed during the pinned range.
      // We pin .forge__inner (the 100vh container) rather than the
      // section itself so ScrollTrigger's pinSpacing spacer lands
      // outside the visual stage, downstream of the section — a
      // cleaner exit into §V.
      trigger: section,
      pin: inner,
      // start: pin engages when the section's top hits the viewport
      //        top. Because .forge__inner is 100vh and the section
      //        has zero padding in pinned mode, the inner already
      //        fills the viewport at that moment.
      start: "top top",
      // end: 300% of the viewport after start — three viewport-
      //      heights of scroll runway during the pin. With six
      //      stages that's ≈50vh per stage, enough to feel
      //      deliberate without dragging.
      end: "+=300%",
      pinSpacing: true,
      // anticipatePin pre-promotes the pinned element onto its own
      // layer a frame before engagement, preventing a jitter on
      // the first pinned frame as the browser allocates the layer.
      anticipatePin: 1,
      // scrub: true ties our onUpdate directly to scroll position
      //        — no lag, no easing. The user drives the stage
      //        counter with their wheel/trackpad/touch.
      scrub: true,
      onUpdate: (self) => {
        applyOpacities(self.progress);
        applyCounter(self.progress);
      },
      onEnter: () => trace("pin engaged"),
      onLeave: () => trace("pin released (entering §V range)"),
      onEnterBack: () => trace("pin re-engaged (scrolling back up)"),
    })
  );

  // ─── Micro-motions (step iv) ─────────────────────────────────
  // Independent always-running timelines, one per "hot" stage.
  // They don't coordinate with the pin ScrollTrigger — they just
  // run. Transform/backgroundPosition writes don't collide with
  // the per-frame opacity writes above (GSAP keeps property
  // records separate), so no ordering constraints.
  const plate2 = plates.find((p) => p.dataset.stage === "2");
  const plate4 = plates.find((p) => p.dataset.stage === "4");
  const sweep5 = section.querySelector(
    ".forge__plate[data-stage='5'] .forge__plate-sweep"
  );
  const microMotions = [];

  // Stage 2 — hammering vibration.
  //
  // The amplitude (±2.5 / ±2 px) is deliberately below what the
  // eye can read as displacement; what sells the beat is the
  // rhythm. 90ms per step ≈ 11 updates/second, the cadence of a
  // steady hammer. `repeatRefresh: true` re-rolls the random()
  // targets each cycle so the motion never cycles visibly.
  //
  // The ember span is a descendant of the plate, so it inherits
  // the same transform — the glow jostles with the billet for
  // free, without a second dominant motion.
  if (plate2) {
    gsap.to(plate2, {
      x: "random(-2.5, 2.5)",
      y: "random(-2, 2)",
      duration: 0.09,
      ease: "power1.inOut",
      repeat: -1,
      repeatRefresh: true,
    });
    microMotions.push("stage 2 vibration");
  }

  // Stage 4 — quench drift.
  //
  // Pure sine bob on y, yoyo-looped. 3s half-cycle makes the
  // total period 6s — unmistakably slow, reads as water current
  // rather than shiver. Amplitude 8px is enough to perceive at
  // the pinned scale, small enough to stay ambient.
  if (plate4) {
    gsap.to(plate4, {
      y: 8,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    microMotions.push("stage 4 drift");
  }

  // Stage 5 — polish highlight sweep.
  //
  // The gradient is painted at 200% of element width; moving
  // backgroundPosition from 150% to -50% traverses the band
  // across the blade once. 3.5s per pass ≈ stone-polishing
  // speed — slow enough to watch, fast enough to register as
  // motion. repeatDelay: 2.5 gives a long dwell between passes
  // so the sweep reads as "turn blade, observe, turn blade"
  // rather than a strobe. power1.inOut eases the band onto and
  // off of the silhouette so the first/last frame of each pass
  // doesn't pop.
  if (sweep5) {
    gsap.fromTo(
      sweep5,
      { backgroundPosition: "150% 50%" },
      {
        backgroundPosition: "-50% 50%",
        duration: 3.5,
        ease: "power1.inOut",
        repeat: -1,
        repeatDelay: 2.5,
      }
    );
    microMotions.push("stage 5 sweep");
  }

  const revealCount = captionTimelines.filter(Boolean).length;
  trace(
    `init — step (vii) pin + crossfade + ember (${embers.length}) + micro-motion (${microMotions.join(" · ") || "none"}) + caption reveals (${revealCount}) + film-cut hold`
  );
}
