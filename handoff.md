═══════════════════════════════════════════════════════════════
  HANDOFF — OZU & SONS · §V (NEXT TASK)
═══════════════════════════════════════════════════════════════

You are inheriting a single-page website build in progress. §I–§IV are built + approved. §V is next.

This handoff is DELIBERATELY TIGHT. Deeper context lives in `./docs/` and is indexed at the bottom. Do NOT read all docs linearly at session start — the handoff gives you everything needed to start §V. Consult docs when a specific question arises.

═══════════════════════════════════════════════════════════════
  PROJECT
═══════════════════════════════════════════════════════════════
Ozu & Sons — fictional 4th-generation Sakai knife-maker, 18-month waitlist. A single scroll page that tells the business's story. A monograph, not a landing page.

═══════════════════════════════════════════════════════════════
  ROLE + COMMUNICATION (non-negotiable)
═══════════════════════════════════════════════════════════════
You are a senior creative director and frontend engineer with strong opinions. You teach the user to make decisions, explain WHY, and only write code once direction is agreed. The user is not a frontend engineer — they copy-paste and run. They understand CSS/HTML but do not author from scratch.

Rules:
• One question at a time — never a bulleted list of five.
• When you need design input, present 2 SPECIFIC options, not an open-ended question.
• When the user says "make it better," first ask "better in what direction — impact, elegance, motion, or personality?" before changing anything.
• Never say "Would you like me to make this change?" — just do it.
• Never use emojis unless explicitly requested.
• Don't refer to tool names when speaking to the user.
• The user will critique hard. Respond point-by-point: accept / accept-with-refinement / push-back-with-reason. Genuine disagreement is respected; capitulation is not.

═══════════════════════════════════════════════════════════════
  STATUS
═══════════════════════════════════════════════════════════════
§I   THRESHOLD      BUILT + APPROVED  (static, motion, 6d, 6e)
§II  PLACE          BUILT + APPROVED  (static, motion, 6d, 6e)
§III LINEAGE        BUILT + APPROVED  (static, motion, 6d, 6e)
§IV  FORGE          BUILT + APPROVED  (full motion + film-cut hold, 6d, 6e)
§V   PHILOSOPHY     ◄ NEXT TASK — not yet built
§VI  INVITATION     not yet built
§VII COLOPHON       not yet built
Step 7 (polish)     deferred
Step 8 (critique)   deferred

Non-negotiable locked decisions — DO NOT re-open:
• Aesthetic: WASHI & ASH — quiet, editorial, patient monograph.            → docs/design-constitution.md
• Stack: Vite 5 + Vanilla JS + GSAP 3.15 + ScrollSmoother + @fontsource.   → docs/tech-stack.md
  NO Tailwind. NO 3D. NO canvas.
• §IV path-morph → asset-crossfade pivot — shipped, not re-openable.       → docs/architecture.md §IV, docs/learnings.md #35–#38
• Hybrid A+B pacing for all text reveals.                                  → docs/learnings.md #21 + #31
• ScrollSmoother progressive enhancement via html[data-smoother="on"].     → docs/learnings.md #1
• FOUC gate via html.js-pending class.                                     → docs/learnings.md #15 + #24
• Register every ScrollTrigger via motion.js `registerTrigger()`.          → docs/learnings.md #13

═══════════════════════════════════════════════════════════════
  §V — THE PHILOSOPHY (the task)
═══════════════════════════════════════════════════════════════
The exhale after §IV's cinema. One sentence, two lines, held in full viewport:

    "Eighteen months to make.
     A lifetime to keep."

Typographic disruption: second line is −2% tracking and offset ~40px right of first line's left edge. Asymmetric — NOT symmetric. Composed to feel inevitable, not pretty. The offset is the point — it keeps the sentence from reading as a symmetrical poster couplet.

Vertical composition: section is 100vh tall, sentence sits mid-viewport with generous negative space above and below. Do NOT centre the sentence block vertically on its own bounding box — the optical centre should be ≈42% from the top (classical book-page asymmetry).

Entry: SplitText word-by-word, ink-bleed mask reveal per the §I pattern. CRITICAL: the reveal is SCROLL-INTERRUPTIBLE — if the user keeps scrolling while words are still bleeding in, remaining words snap to visible via a short power2.out (≈120ms each, staggered ~40ms). The user retains control. This is the only section with this interruption affordance — §I's headline is short enough to always complete, §II/§III editorial reveals gate behind "top 78%" triggers. §V is held in full-viewport, so a user who has already read ahead must not be punished with a slow tail.

Ambient: NOTHING. This is the one section with zero ambient motion. No idle-reactive breathing (unlike §I), no rotation (unlike §II), no gated-continuous anything. The absence IS the motion. §IV ended with the counter dimming and the blade held still; §V deepens that stillness into the frame itself.

Exit: the sentence does NOT animate out. Scroll just moves the section off-screen. No scrub, no blur, no fade. Treat the block as a printed page — turn past it, do not animate past it.

Unique: deliberate stillness after the drama of §IV. The narrative justification: the knife has been made; what's left is the meaning, held as a single line.

Pacing: apply hybrid A+B (learning #21) using the "one-sentence still-held" starting constants from learning #31 (BASE 0.70s, SLOPE 0.05s/char, MIN 0.80s, MAX 1.80s, OVERLAP 0.50). These constants were never live-tuned — expect to adjust after the first reveal, especially OVERLAP (0.50 may feel too packed for a held sentence; try 0.55–0.60 first).

Reduced-motion: sentence renders at final opacity, no reveal. Progressive enhancement per learning #23 — HTML carries the final visible state; JS writes the hidden initial.

Do NOT: add a scroll-progress bar under the sentence, add a tiny mono tell, add ambient grain that moves, add anything that pretends "§V is doing something." The page has been asking the viewer for 4 scroll-lengths of attention already. §V gives it back to them.

═══════════════════════════════════════════════════════════════
  FIRST ACTION
═══════════════════════════════════════════════════════════════
§V is a DELIBERATELY MINIMAL section. The single most dangerous failure mode is adding motion because the canvas feels empty. Read learning #7 before writing §V 6c. The silence is the craft.

1. Read these six learnings from `./docs/learnings.md` BEFORE writing any §V code:
   • #7  — over-determination is the biggest risk (directly cited for §V)
   • #21 — hybrid A+B pacing formula (§V's reveal uses this)
   • #23 — progressive enhancement (HTML carries final visible state)
   • #24 — FOUC gate coordination (§V's init must slot in correctly)
   • #26 — SplitText + fonts.ready (§V's reveal uses SplitText)
   • #31 — hybrid A+B constants per type scale (§V's starting constants)

2. Restate §V's character in your own words, ONE paragraph:
   (a) why §V has zero ambient motion and no exit animation (what narrative job the stillness does, directly off §IV's film-cut hold),
   (b) what "scroll-interruptible reveal" means at the GSAP level and why §V uniquely earns it (§I–§IV do not),
   (c) what the asymmetric second-line disruption does and why it's offset rather than centred.
   Sanity check — if this doesn't come out cleanly, re-read the §V brief above.

3. §V 6a PRE-CODE REVIEW — name every constraint:
   • Sentence verbatim, line break preserved: "Eighteen months to make. / A lifetime to keep."
   • Asymmetric composition — second line offset ~40px right of first line's left edge, −2% tracking on the second line; NOT centred. Explain the optical rationale.
   • Vertical composition — sentence at ≈42% from viewport top, NOT centred on its own bounding box.
   • Hybrid A+B pacing with learning #31 "one-sentence still-held" constants (BASE 0.70s, SLOPE 0.05s/char, MIN 0.80s, MAX 1.80s, OVERLAP 0.50). Flag OVERLAP as untested — expect to tune live.
   • Scroll-interruptible reveal — paused timeline, played onEnter via ScrollTrigger, onUpdate watches for "user past sentence-block midpoint while timeline still running" → fast-forward remaining words (~120ms each, ~40ms stagger, power2.out).
   • The absence list — no ambient motion, no idle-reactive breathing, no exit scrub, no blur, no scroll-progress tell, no mono counter, no parallax. Name these explicitly so you don't drift.
   • Reduced-motion — sentence renders at final opacity immediately, no reveal. HTML carries final state.
   • FOUC gate participation — §V's section module must register its init in main.js BEFORE initThreshold, write synchronous hidden-state gsap.set on the sentence words, let threshold.js's end-of-init gate removal be the authoritative moment.
   • Init order implication — main.js currently orders initPlace → initLineage → initForge → initThreshold. §V's init must slot BEFORE initThreshold, keeping initThreshold last.

   No open execution QUESTION for §V 6a — the architecture is locked. The only open tuning is the hybrid A+B constants, and those get tuned live after 6c. If you find yourself wanting to add motion "to fill the silence," stop and re-read learning #7.

4. Propose §V 6c implementation order (or confirm the recommended order below). Get user confirmation before writing any §V motion code:
   (i)   SplitText word split + synchronous hidden-state gsap.set (words at opacity 0, small y, clipPath-inset for ink-bleed mask — same vocabulary as §I words).
   (ii)  Paused reveal timeline built from the hybrid A+B constants; trigger at "top 65%" or similar sensible mid-viewport threshold.
   (iii) Scroll-interruptible fast-forward — onUpdate watches for the "user scrolled past the trigger end while reveal is mid-flight" case and fast-forwards remaining words.
   (iv)  Reduced-motion short-circuit — returns before any SplitText, trigger, or gsap.set; HTML final-state is authoritative.
   (v)   No ambient, no exit. If this step feels empty, that's correct.

   Do NOT build (i) and (ii) in the same pass. Get hidden-state + split stable first, then add the timeline. Verify on reload that there's no FOUC flash of the full sentence before the reveal starts.

5. §V 6b STATIC first — markup + typography/layout CSS (asymmetric offset, vertical composition, reduced-motion CSS fallback). Wait for user approval. THEN write 6c.

6. After 6c approval → 6d → 6e. Then §VI, then §VII, following the same Step 6 ritual (docs/step-6-ritual.md).

═══════════════════════════════════════════════════════════════
  DOCS INDEX — consult on demand, do NOT pre-read linearly
═══════════════════════════════════════════════════════════════
./docs/design-constitution.md  — Aesthetic, palette, typography, motion philosophy, forbidden list.
./docs/tech-stack.md           — Build tools, libraries, plugins, imports. All locked.
./docs/architecture.md         — All 7 sections in detail. §I–§IV (built, with full execution notes),
                                 §VI + §VII (upcoming briefs), Step 7 + Step 8 notes.
./docs/learnings.md            — 41 numbered learnings from predecessor agents. For §V: read
                                 #7, #21, #23, #24, #26, #31 up front. Grep others on demand.
./docs/repo-state.md           — File manifest, init order, console traces, open infrastructure
                                 gaps. Consult before editing any file you haven't touched.
./docs/step-6-ritual.md        — 6a / 6b / 6c / 6d / 6e + Tests A–I.

Rules for doc consultation:
• Before editing a file you haven't touched, glance at its description in `repo-state.md`.
• If you find yourself wondering "why was this decision made," the answer is in `learnings.md`.
• If you're about to type a magic number (color, size, duration), check `design-constitution.md`
  / `tokens.css` first (learning #12).

Handoff maintenance (for whoever finishes §V):
• When §V is BUILT + APPROVED, move its brief out of the §V block above and into
  `docs/architecture.md` under its `[NOT YET BUILT]` placeholder, following the same
  format §IV uses (execution notes, flagged follow-ups, section status + console trace).
• Then rewrite THIS handoff's §V block + FIRST ACTION + BEGIN to target §VI.
• Add a "§V motion agent" learnings block to `docs/learnings.md` if new patterns emerged.
• Update `repo-state.md`'s file manifest + console traces + §V status line.
• Update `main.js` description in `repo-state.md` to reflect that `initPhilosophy` (or
  whatever you named it) is no longer "hypothetical" — it slots before initThreshold.
• Goal: keep `handoff.md` under ~200 lines and scoped to the CURRENT task only.

═══════════════════════════════════════════════════════════════
  BEGIN
═══════════════════════════════════════════════════════════════
Your first message should:

1. Briefly confirm you've read this handoff. Confirm §I–§IV are NOT up for re-opening — especially §IV's crossfade-vs-morph pivot and the "one dominant micro-motion per stage" rule. If you find yourself wanting to re-tune §IV after loading the page, resist; §IV tuning is Step 7's job, not yours.

2. Read the six flagged learnings (#7, #21, #23, #24, #26, #31) from `./docs/learnings.md`.

3. Execute FIRST ACTION steps 2–4:
   • Restate §V's character in your own words (one paragraph, three points).
   • Walk §V 6a pre-code review — name every constraint.
   • Propose (or confirm) the §V 6c implementation order.
   Get user confirmation before writing any §V motion code.

4. §V 6b STATIC first. Wait for approval. Only then write 6c.

5. 6c → 6d → 6e → then §VI, then §VII.

Do not re-pitch the aesthetic. Do not re-decide the stack. Do not re-architect the page. Do not re-open the §IV pivot or any prior §-section decision. Those are locked. Your job is to build §V → §VI → §VII on top of the four built sections, following the Step 6 ritual for each.

SINGLE MOST DANGEROUS FAILURE MODE FOR §V: adding motion because the canvas feels empty. Re-read learning #7 before writing §V 6c.

═══════════════════════════════════════════════════════════════
  SANITY-CHECK QUESTION
═══════════════════════════════════════════════════════════════
Answer this so the user can verify §V has landed in your head:

**What narrative job does §V's stillness do — coming directly off the back of §IV's stage-6 film-cut hold — and what two mechanisms (one typographic, one motion-behavioural) make §V feel like a held thought rather than a pitch-deck couplet?**
