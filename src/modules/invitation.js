/* ──────────────────────────────────────────────────────────────
   invitation.js — §VI motion.

   §VI is the only section on the page with meaningful user
   interaction. The contract this file implements:

     1. SUBMIT HANDLER — preventDefault, validate email, on
        success simulate a short latency and then add the
        .invitation--sent layout class + play the confirmation
        timeline. Idempotent: once submitted, further submit
        attempts are no-ops (paused-timeline "earned once"
        contract, learning #41).

     2. CONFIRMATION TIMELINE — paused, built once, played
        once. Hanko presses in (scale 1.4 → 1.0, rotate −8° → 0°,
        back.out(2)) on two glyph passes simultaneously; the
        receipt line fades in a beat after the stamp lands.
        Learning #30 governs the whole motion vocabulary —
        SAME motion as §III's hankos, NOT something new. Red is
        doing all the narrative work; the motion doesn't need
        to carry it too. DO NOT add a glow, a longer settle, or
        an extra pulse during Step 7.

     3. ERROR PATH — on invalid submit the baseline wobbles
        (~400ms feTurbulence baseFrequency ramp) and a mono
        error message appears below the submit button. The
        error clears on the next input event — correction is
        the reset, not another button. Only the baseline
        wobbles, NOT the whole form — the ink "recoils" rather
        than a banner popping in. Keeps the ink metaphor that
        the baseline has been the field's voice all along.

   Reduced-motion path: the submit handler stays wired, but no
   GSAP timelines are built. The flip to .invitation--sent still
   happens on success; the CSS transitions collapse to 1ms via
   tokens.css's prefers-reduced-motion block, so the success
   state snaps in without the back.out settle. The error path
   still announces "please check the email address…" via
   aria-live; only the baseline wobble is skipped. Semantic
   confirmation and semantic error both reach the user; the
   "press" and "recoil" ceremonies do not.

   FOUC gate: §VI does NOT participate. The form and letter are
   authored visible; the confirmation is hidden by CSS
   (visibility: hidden + opacity: 0 on .invitation__confirmation)
   not by html.js-pending. Nothing for threshold.js's gate
   removal to coordinate with here.
   ────────────────────────────────────────────────────────── */

import { gsap } from "gsap";
import { motion } from "./motion.js";

const isDev = import.meta.env && import.meta.env.DEV;
const trace = (...args) => {
  if (isDev) console.info("[invitation]", ...args);
};

// ─── Tunables ───────────────────────────────────────────────
// Permissive email check. Mirrors HTML's type="email" rigor —
// intentionally NOT RFC-compliant (a complete regex would be
// hundreds of characters and still fail on valid addresses).
// The goal is to reject obvious typos (no @, no TLD dot), not
// to be a deliverability service.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Hanko press tunables. Reuse §III's vocabulary per learning
// #30 — same shape of motion, only the overshoot+duration are
// retuned for the smaller render size per learning #33 (smaller
// stamps want MORE overshoot because the absolute rocking
// distance is smaller; the eye needs a proportional amount of
// return to feel the settle as a landing).
//
//   FROM_SCALE 1.4     — handoff-specified; 40% larger than final
//                        so the impact reads as a descending
//                        press, not a reveal.
//   ROT_FROM -8        — §III uses -6 with back.out(1.2); bumped
//                        to -8 here so the larger overshoot has
//                        a proportional return arc to rock back
//                        through. Without this, back.out(2) lands
//                        with visible overshoot but no return
//                        weight — reads as a bounce, not a stamp.
//   HANKO_EASE back.out(2)
//                      — handoff-specified. Matches learning #33's
//                        "smaller stamp → more overshoot" rule
//                        against §III's back.out(1.2).
//   HANKO_DURATION 0.85
//                      — §III uses 0.75. A touch longer here
//                        because the higher overshoot needs more
//                        time to resolve before the rocking
//                        reads as frantic.
const FROM_SCALE = 1.4;
const ROT_FROM = -8;
const HANKO_EASE = "back.out(2)";
const HANKO_DURATION = 0.85;

// Echo layer's static CSS offset (matches .invitation__hanko-
// frame--echo and .invitation__hanko-char--echo). The echo
// settles to these values during the tween so its "pressed
// twice, slightly misaligned" read is preserved through the
// landing frame. If these ever drift from the CSS values the
// echo will snap on timeline complete when clearProps fires.
const ECHO_X = 1.2;
const ECHO_Y = 0.8;

// Receipt line timing — enters a beat AFTER the stamp lands.
// The order (stamp, then words) is what separates this from a
// toast notification: the press is the acknowledgement, the
// mono line is the contract-in-words. Parallelizing them would
// collapse the two signals into one visual event, exactly what
// the handoff's two-signal rule guards against.
const RECEIPT_OFFSET = 0.25;
const RECEIPT_DURATION = 0.6;
const RECEIPT_Y_FROM = 4;

// Simulated network latency before the confirmation fires. The
// form is narrative — no real endpoint. A synchronous resolve
// reads as a UI toy; a real wait reads as "my letter went
// somewhere." 420ms is the sweet spot: long enough to feel like
// the studio "received" the letter, short enough not to feel
// broken on a fast input. If Step 7 wires a real endpoint, the
// timeout call becomes the fetch's .then.
const SIMULATED_LATENCY = 420;

// Error message voice: lowercase mono, matching .meta elsewhere
// on the page. A deliberate choice — an angry red banner would
// break the monograph voice. "please check…" reads as a quiet
// correction from the studio, not an alarm from a form library.
const ERROR_MSG = "please check the email address and try again";

// Baseline wobble tunables. The handoff's mechanism is a
// feTurbulence baseFrequency ramp — we animate the <feTurbulence>
// node's baseFrequency attribute from its static 0.9 up to 2.8
// and back across ~400ms total. Higher baseFrequency produces
// finer, more chaotic noise; the pattern SHIFTS as the value
// changes each frame, which reads visually as the line jittering
// and then settling. yoyo + repeat: 1 does the up-and-down in a
// single tween (200ms out, 200ms back).
//
// Why 2.8 as the peak: 0.9 is the resting jitter (hand-drawn,
// but stable). 1.5 barely reads as a change. 4+ goes from "ink
// recoil" into "TV static" — too violent for a monograph's
// error state. 2.8 lands in the "the line was startled" zone.
//
// If the wobble reads under-powered in 6d (baseFrequency alone
// may not land as punchy as the handoff's "recoils" implies),
// the next lever is the feDisplacementMap's scale attribute
// (1.4 → ~4 → 1.4 in a concurrent tween). Left off for now —
// the handoff specifies the frequency ramp as the mechanism,
// and adding amplitude motion alongside would be a second
// mechanism to tune. One dial, tune first, add second only if
// needed.
const WOBBLE_REST = 0.9;
const WOBBLE_PEAK = 2.8;
const WOBBLE_HALF_DURATION = 0.2; // yoyo + repeat:1 → 400ms total

export function initInvitation() {
  const section = document.getElementById("invitation");
  if (!section) {
    trace("section not found → skip");
    return;
  }

  const form = section.querySelector(".invitation__form");
  const emailInput = section.querySelector(".invitation__email");
  const errorLine = section.querySelector(".invitation__error");
  const baselineTurbulence = section.querySelector(
    "#invitation-baseline-ink feTurbulence"
  );
  const hankoBase = section.querySelector(
    ".invitation__hanko-frame--base"
  );
  const hankoEchoFrame = section.querySelector(
    ".invitation__hanko-frame--echo"
  );
  const hankoCharBase = section.querySelector(
    ".invitation__hanko-char--base"
  );
  const hankoCharEcho = section.querySelector(
    ".invitation__hanko-char--echo"
  );
  const receipt = section.querySelector(".invitation__receipt");

  if (
    !form ||
    !emailInput ||
    !errorLine ||
    !baselineTurbulence ||
    !hankoBase ||
    !hankoEchoFrame ||
    !hankoCharBase ||
    !hankoCharEcho ||
    !receipt
  ) {
    trace("required elements missing → skip");
    return;
  }

  trace("init");

  // Idempotent submit guard. Once accepted, subsequent submit
  // attempts do nothing — the stamp can only be pressed once.
  // Guard lives in JS; the layout class is the only observable
  // success signal.
  let submitted = false;

  // ─── Error helpers ────────────────────────────────────────
  // Shared between reduced-motion and full-motion paths. The
  // aria-live="polite" on .invitation__error means any
  // textContent change announces to AT — so writing the same
  // ERROR_MSG on consecutive invalid submits still re-announces
  // when the text is cleared by input then re-set by submit.
  const showError = () => {
    errorLine.textContent = ERROR_MSG;
  };

  const clearError = () => {
    if (errorLine.textContent === "") return;
    errorLine.textContent = "";
  };

  // Track the in-flight wobble so rapid re-submits (invalid →
  // invalid → invalid) don't stack overlapping tweens on the
  // same attribute — the last one wins, but the earlier tweens
  // would otherwise fight with it mid-ramp. killTweensOf on the
  // turbulence node is the simplest correct invalidation.
  let wobbleTween = null;
  const wobbleBaseline = () => {
    if (motion.prefersReducedMotion) return;
    if (wobbleTween) wobbleTween.kill();
    wobbleTween = gsap.to(baselineTurbulence, {
      attr: { baseFrequency: WOBBLE_PEAK },
      duration: WOBBLE_HALF_DURATION,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        // Belt-and-braces: snap baseFrequency back to its exact
        // resting value. GSAP's yoyo ramps to-peak-and-back, but
        // floating-point arithmetic on the return leg can leave
        // baseFrequency at e.g. 0.8999998 — inaudible visually,
        // but a second wobble would start from that off-by-ε
        // value. setAttribute restores the literal "0.9".
        baselineTurbulence.setAttribute(
          "baseFrequency",
          String(WOBBLE_REST)
        );
      },
    });
  };

  // Clear the error on any input. The wobble was a recoil to a
  // bad submit; once the reader starts correcting, the error
  // shouldn't linger and guilt-trip them. An input event also
  // fires on paste, autofill, and programmatic clears — all
  // correct triggers for error clearance. Listener lives here
  // (outside either branch) so it's wired regardless of motion
  // preference.
  emailInput.addEventListener("input", clearError);

  // Shared submit logic between reduced-motion and full-motion
  // paths. Returns "invalid" / "rejected" / "accepted" so the
  // caller knows whether to play a timeline.
  const attemptSubmit = (event) => {
    event.preventDefault();
    if (submitted) return "rejected";
    const value = emailInput.value.trim();
    if (!EMAIL_RE.test(value)) return "invalid";
    submitted = true;
    return "accepted";
  };

  // ─── Reduced-motion branch ────────────────────────────────
  // Wire a submit handler that flips the layout class on
  // success and nothing else. CSS transitions collapse to 1ms
  // in reduced-motion mode via the duration tokens, so the
  // form→confirmation flip is effectively instant. The stamp
  // appears at its natural scale (1.0, 0deg) because we never
  // tweened it away from final state.
  if (motion.prefersReducedMotion) {
    form.addEventListener("submit", (event) => {
      const result = attemptSubmit(event);
      if (result === "invalid") {
        // Error text announces via aria-live; no wobble here.
        // The mono line IS the entire error signal in
        // reduced-motion mode.
        showError();
        trace("reduced-motion → invalid, error announced");
        return;
      }
      if (result === "accepted") {
        section.classList.add("invitation--sent");
        trace("reduced-motion → success snap");
      }
    });
    trace("reduced-motion → handler wired, no timeline");
    return;
  }

  // ─── Full motion branch ───────────────────────────────────
  // Initial hidden state for the stamp. Scale 0 rather than
  // scale(FROM_SCALE) so the pre-press stamp is invisible; the
  // scale 0 → 1 motion IS the press, with overshoot to 1 (not
  // to FROM_SCALE as a floor) so the press reads as descending.
  // To get the 1.4 → 1.0 read specified by the handoff, we
  // tween FROM scale: FROM_SCALE with a fromTo so the starting
  // frame is scale 1.4 and the ease lands at 1.0 via back.out.
  //
  // We do this in a fromTo inside the timeline rather than a
  // gsap.set + .to, because a gsap.set to scale 1.4 before the
  // timeline plays would flash a pre-scaled stamp at the
  // moment the confirmation block becomes visible (visibility
  // flips before the timeline starts). fromTo keeps the
  // initial state implicit and applied at the first tick.

  // Receipt starts hidden; the y offset is hair-small so the
  // line doesn't "fly in" — it appears with an almost
  // imperceptible settle. Minimal on purpose; the stamp is the
  // ceremony, the receipt is the signoff.
  gsap.set(receipt, { opacity: 0, y: RECEIPT_Y_FROM });

  const confirmationTl = gsap.timeline({
    paused: true,
    onComplete: () => {
      // Clear inline transforms so the static hanko returns to
      // its CSS-driven state (the echo's 1.2px translate comes
      // back via .invitation__hanko-*--echo rules). clearProps
      // also lifts the stamp off its compositor layer (learning
      // #33) so it doesn't hurt post-landing scroll perf.
      gsap.set(
        [hankoBase, hankoCharBase, hankoEchoFrame, hankoCharEcho],
        { clearProps: "transform" }
      );
      gsap.set(receipt, { clearProps: "opacity,transform" });
      trace("confirmation timeline complete");
    },
  });

  // Base stamp settle. scale(FROM_SCALE → 1.0) is the "press
  // and land"; rotate(ROT_FROM → 0) is the rocking settle.
  // back.out(2) overshoots past 1.0/0° and rocks back — that
  // overshoot is what makes the press read as physical, not a
  // mechanical ease.
  confirmationTl.fromTo(
    [hankoBase, hankoCharBase],
    {
      scale: FROM_SCALE,
      rotate: ROT_FROM,
      transformOrigin: "50% 50%",
    },
    {
      scale: 1,
      rotate: 0,
      duration: HANKO_DURATION,
      ease: HANKO_EASE,
    },
    0
  );

  // Echo layer settles on the SAME curve to the SAME final,
  // PLUS the static CSS translate (ECHO_X, ECHO_Y) — we
  // re-assert it in the target so clearProps at the end lifts
  // back cleanly to CSS. Timing locks with the base so the
  // two-glyph-pass reads as one press with imperfect
  // re-inking (learning #28), not two separate stamps.
  confirmationTl.fromTo(
    [hankoEchoFrame, hankoCharEcho],
    {
      scale: FROM_SCALE,
      rotate: ROT_FROM,
      x: ECHO_X,
      y: ECHO_Y,
      transformOrigin: "50% 50%",
    },
    {
      scale: 1,
      rotate: 0,
      x: ECHO_X,
      y: ECHO_Y,
      duration: HANKO_DURATION,
      ease: HANKO_EASE,
    },
    0
  );

  // Receipt line arrives a beat after the stamp lands. Not a
  // parallel fade: the order (stamp, then words) is what
  // separates this from a toast notification.
  confirmationTl.to(
    receipt,
    {
      opacity: 1,
      y: 0,
      duration: RECEIPT_DURATION,
      ease: "power2.out",
    },
    RECEIPT_OFFSET
  );

  form.addEventListener("submit", (event) => {
    const result = attemptSubmit(event);
    if (result === "invalid") {
      // Two simultaneous error signals: the baseline ink
      // recoils (motion), the mono line announces (semantic).
      // Order matters only conceptually — both fire the same
      // frame. aria-live="polite" on the error line defers the
      // AT announcement until the reader pauses, so it doesn't
      // compete with the visual recoil for attention.
      showError();
      wobbleBaseline();
      trace("submit invalid → wobble + error");
      return;
    }
    if (result !== "accepted") return;
    trace("submit valid → success in", SIMULATED_LATENCY, "ms");
    // Simulated latency. The layout class flip AND the timeline
    // play are intentionally inside the same setTimeout so the
    // form-fade and stamp-press are visually simultaneous — if
    // they were desynchronized the form would blink out before
    // the stamp arrived, which reads as a loading artifact.
    window.setTimeout(() => {
      section.classList.add("invitation--sent");
      confirmationTl.play();
      trace("confirmation timeline started");
    }, SIMULATED_LATENCY);
  });

  trace("submit handler wired, confirmation timeline built (paused)");
}
