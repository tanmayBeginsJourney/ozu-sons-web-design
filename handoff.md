═══════════════════════════════════════════════════════════════
  HANDOFF — OZU & SONS · §VI (NEXT TASK)
═══════════════════════════════════════════════════════════════

You are inheriting a single-page website build in progress. §I–§V are built + approved. §VI is next.

This handoff is DELIBERATELY TIGHT. Deeper context lives in `./docs/` and is indexed at the bottom. Do NOT read all docs linearly at session start — the handoff gives you everything needed to start §VI. Consult docs when a specific question arises.

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
§V   PHILOSOPHY     BUILT + APPROVED  (static, motion, scroll-interruptible reveal, 6d, 6e)
§VI  INVITATION     ◄ NEXT TASK — not yet built
§VII COLOPHON       not yet built
Step 7 (polish)     deferred
Step 8 (critique)   deferred

Non-negotiable locked decisions — DO NOT re-open:
• Aesthetic: WASHI & ASH — quiet, editorial, patient monograph.            → docs/design-constitution.md
• Stack: Vite 5 + Vanilla JS + GSAP 3.15 + ScrollSmoother + @fontsource.   → docs/tech-stack.md
  NO Tailwind. NO 3D. NO canvas.
• §IV path-morph → asset-crossfade pivot — shipped, not re-openable.       → docs/architecture.md §IV, docs/learnings.md #35–#38
• §V zero-ambient + no-exit + scroll-interruptible reveal — shipped.        → docs/architecture.md §V, docs/learnings.md #42–#43
• Hybrid A+B pacing for all text reveals.                                  → docs/learnings.md #21 + #31
• ScrollSmoother progressive enhancement via html[data-smoother="on"].     → docs/learnings.md #1
• FOUC gate via html.js-pending class.                                     → docs/learnings.md #15 + #24
• Register every ScrollTrigger via motion.js `registerTrigger()`.          → docs/learnings.md #13
• The red `--ink-hanko` appears EXACTLY twice on the page: §III gen 4
  hanko (first) and §VI confirmation stamp (second + final).               → docs/learnings.md #30

═══════════════════════════════════════════════════════════════
  §VI — THE INVITATION (the task)
═══════════════════════════════════════════════════════════════
The verb. §V was the held thought; §VI is the only interactive section on the page. Framed as a letter to the reader inviting them to commission a blade.

Letter copy (verbatim, line break preserved):

    "To commission an Ozu blade, write to us.
     The current waitlist is eighteen months.
     We read every letter."

Form: a SINGLE email input styled as a handwritten line on paper. No border, no box, no container chrome. The line IS the input.
• Hair-thin sumi-ink baseline rule with feTurbulence displacement — hand-drawn, not machine-ruled.
• Placeholder "e.g., you@domain" in `--ink-ash`, fades on focus.
• On focus, baseline darkens from `--ink-ash` to `--ink-sumi`.

Submit: the button reads "Send — 送る" (Fraunces + Shippori Mincho, no box, just type). Enter key triggers submit. Focus is visible as an ink underline on the button's text, NOT a browser default outline.

CRITICAL — success is TWO signals, not one:
  1. A hanko stamp presses down in `--ink-hanko` red. This is the SECOND and FINAL red moment on the page (first was §III's generation-4 hanko). Scales 1.4 → 1.0 with `back.out(2)` rotational settle. REUSE §III's exact filter vocabulary — two-glyph-pass (base + echo with different filter seeds, learning #28), same `url(#ink-wash)` + `url(#ink-wash-echo)`. Do NOT give it richer filter craft or extra motion beyond §III's — learning #30, "don't reward specialness twice."
  2. Mono text line below: "received — no. 042 · we will write back within a week" — matches the `--meta` mono voice used across the page.

Error state (invalid email): the baseline ink ruling WOBBLES ~400ms via feTurbulence frequency ramp, and a mono error message appears below. Keep the ink metaphor — the line "recoils" rather than a banner popping in. Do NOT shake the whole form; only the baseline itself.

Paper grain: slightly heavier in this section than elsewhere (the letter is meant to read as being on slightly thicker stock). Scope the heavier grain to `.invitation` only — do NOT crank page-wide grain yet. Step 7 owns the page-wide grain decision.

Unique: form-submission treated as letter-writing ritual, not as a UX moment. The hanko press + mono confirmation is the acknowledgement that the letter has been received, not a toast notification.

═══════════════════════════════════════════════════════════════
  PATTERNS TO REUSE (do not re-invent)
═══════════════════════════════════════════════════════════════
• Two-glyph-pass for the stamp                                  → learning #28 + §III's hanko-frame `<symbol>` already in index.html defs. REUSE THE SYMBOL — do not author a second seal shape.
• `<use>`-mask for the animated baseline                        → learnings #29 + #34. The hand-drawn baseline is the same pattern as §III's brush silhouette: one authored path + two `<use>` copies + filter seeds.
• "Earned once" paused timeline for confirmation animation       → learning #41. The stamp + confirmation line play ONCE on submit, do NOT replay on re-focus or re-submit attempts.
• Layout-class pattern for success state                        → learning #39. JS adds `.invitation--sent` on the section AFTER successful submit. CSS keys success-state styling (form hidden, stamp + confirmation visible) to THAT class. Do NOT gate on an ambient attribute or form DOM state.
• Hybrid A+B pacing IF letter prose reveals word/line-by-line    → learnings #21 + #31 (editorial prose constants).

═══════════════════════════════════════════════════════════════
  FIRST ACTION
═══════════════════════════════════════════════════════════════
§VI is the first section on the page with MEANINGFUL INTERACTION. The dangerous failure modes are different from §V's:
  (a) Form chrome creeping in — borders, boxes, shadows, "sharp" focus rings. The line IS the input; the input is not on a line.
  (b) The hanko earning its own filter craft or motion vocabulary. It must reuse §III's verbatim. Red is earned by COLOR alone (learning #30).
  (c) Collapsing success into ONE signal. The stamp AND the mono line is intentional: the press is the acknowledgement, the text is the contract.

1. Read these seven learnings from `./docs/learnings.md` BEFORE writing any §VI code:
   • #7  — over-determination is the biggest risk (still applies)
   • #23 — progressive enhancement (matters MORE for §VI — HTML must deliver a functional form even if JS fails)
   • #24 — FOUC gate coordination (§VI's init must slot BEFORE initThreshold)
   • #28 — two-glyph-pass hand-pressed ink irregularity (THE hanko recipe)
   • #29 + #34 — `<use>`-mask baseline pattern (applies to the form line)
   • #30 — don't reward specialness twice (hanko = COLOR only, no extra craft)
   • #39 — layout-class-driven state (success state keys off `.invitation--sent`, not ambient)
   • #41 — paused-timeline + earned-once (the confirmation sequence)

2. Restate §VI's character in your own words, ONE paragraph, covering:
   (a) Why §VI is framed as a letter rather than a "contact form" — what the voice asks of the copy and the input treatment.
   (b) Why success is TWO signals (press + mono line) and why collapsing to one would be wrong.
   (c) Why the hanko MUST reuse §III's filter vocabulary verbatim and what happens if it doesn't.

3. §VI 6a PRE-CODE REVIEW — name every constraint AND every open decision. §VI has more open 6a questions than prior sections because the letter / form / submit-response interactions aren't fully specified. Surface them:
   • Letter copy verbatim (exactly as above).
   • Form — single email input, no border/box, placeholder "e.g., you@domain" in `--ink-ash`, hand-drawn baseline with feTurbulence displacement (learnings #29/#34), baseline darkens ash→sumi on focus.
   • Submit button — "Send — 送る", Fraunces + Shippori Mincho, no box, Enter key triggers, focus shows as an ink underline on the button text.
   • Success — two signals: (1) hanko stamp `1.4 → 1.0` with `back.out(2)` rotational settle, `--ink-hanko` red, two-glyph-pass (learning #28), REUSE existing `<symbol id="hanko-frame">`; (2) mono text "received — no. 042 · we will write back within a week".
   • Error — baseline wobbles ~400ms via feTurbulence ramp, mono error message appears.
   • Paper grain heavier, scoped to `.invitation`.
   • Reduced-motion — stamp still appears (it's semantic confirmation, not decoration), but without the back.out settle — snap to final scale. Baseline does NOT wobble on error; error message still appears.
   • FOUC gate — `initInvitation` slots BEFORE `initThreshold`. Letter + form are authored VISIBLE (progressive enhancement, learning #23) — the form must function even if JS never runs.
   • State machine — at minimum: idle / focused / submitting / success / error. The success transition must be idempotent (re-submits after success do nothing).
   • Init-order implication — `main.js` order becomes `initPlace → initLineage → initForge → initPhilosophy → initInvitation → initThreshold`.

   OPEN decisions to raise as 6a questions (one at a time, per the communication rules):
   • Does the letter prose reveal on scroll-in (like §II lines) or is it authored visible with no reveal? Argue for ONE — don't ask the user which.
   • Where does focus land on first load? Probably NOT the input (auto-focus would be aggressive for a monograph). Recommend no auto-focus.
   • "no. 042" — is this a fixed number (matches §I's "No. 042") or incremented per submit? Recommend fixed for narrative continuity.
   • What's the submit's network behaviour on a static site? (Recommend: prevent default, simulate success after a short delay — the form is narrative, not transactional. The user may wire a real endpoint in Step 7.)

4. Propose §VI 6c implementation order (or confirm the recommended order below). Get user confirmation before writing any §VI motion/interaction code:
   (i)    Static markup + typography/layout CSS (letter prose, form layout, baseline ruling as inline SVG with filter, submit button, hidden hanko + confirmation markup as final DOM so it's progressive-enhancement ready). REDUCED-MOTION CSS fallback here too.
   (ii)   Focus/blur baseline darkening (pure CSS state driven by `:focus-within`).
   (iii)  Letter prose reveal on scroll-in, if chosen (paused timeline + ScrollTrigger at `top 78%`).
   (iv)   Submit handler — prevent default, validate email, on success add `.invitation--sent` to the section, play the confirmation timeline.
   (v)    Confirmation timeline — hanko stamp press (two-glyph-pass, back.out(2)) + mono line fade. Built paused; played once via the submit handler (learning #41).
   (vi)   Error path — baseline wobble (feTurbulence `baseFrequency` ramp via gsap) + mono error message. Clears on next input event.

   Do NOT build all six in one pass. Minimum splits: (i) alone for 6b; (ii)+(iv)+(v) as one 6c pass; (vi) as a second 6c pass; (iii) as a third if we elect to do it.

5. §VI 6b STATIC first — markup + typography/layout CSS + the reduced-motion CSS fallback. Wait for user approval. THEN write 6c.

6. After 6c approval → 6d → 6e. Then §VII, following the same Step 6 ritual (docs/step-6-ritual.md). After §VII: Step 7 polish, then Step 8 critique.

═══════════════════════════════════════════════════════════════
  DOCS INDEX — consult on demand, do NOT pre-read linearly
═══════════════════════════════════════════════════════════════
./docs/design-constitution.md  — Aesthetic, palette, typography, motion philosophy, forbidden list.
./docs/tech-stack.md           — Build tools, libraries, plugins, imports. All locked.
./docs/architecture.md         — All 7 sections in detail. §I–§V (built, full execution notes).
                                 §VI brief is mirrored here in more depth; §VII brief + Step 7/8.
./docs/learnings.md            — 43 numbered learnings from predecessor agents. For §VI: read
                                 #7, #23, #24, #28, #29, #30, #34, #39, #41 up front.
                                 Grep others on demand. Also #42–#43 (§V's additions) for context.
./docs/repo-state.md           — File manifest, init order, console traces, open infrastructure
                                 gaps. Consult before editing any file you haven't touched.
./docs/step-6-ritual.md        — 6a / 6b / 6c / 6d / 6e + Tests A–I.

Rules for doc consultation:
• Before editing a file you haven't touched, glance at its description in `repo-state.md`.
• If you find yourself wondering "why was this decision made," the answer is in `learnings.md`.
• If you're about to type a magic number (color, size, duration), check `design-constitution.md`
  / `tokens.css` first (learning #12).

Handoff maintenance (for whoever finishes §VI):
• When §VI is BUILT + APPROVED, move its brief out of the §VI block above and into
  `docs/architecture.md` under its `[NOT YET BUILT]` placeholder, following the same format
  §IV and §V use (execution notes, flagged follow-ups, section status + console trace).
• Then rewrite THIS handoff's §VI block + FIRST ACTION + BEGIN to target §VII.
• Add a "§VI motion agent" learnings block to `docs/learnings.md` if new patterns emerged.
• Update `repo-state.md`'s file manifest + console traces + §VI status line.
• Update `main.js` description in `repo-state.md` to reflect that `initInvitation` is wired in.
• Goal: keep `handoff.md` under ~200 lines and scoped to the CURRENT task only.

═══════════════════════════════════════════════════════════════
  BEGIN
═══════════════════════════════════════════════════════════════
Your first message should:

1. Briefly confirm you've read this handoff. Confirm §I–§V are NOT up for re-opening — especially §IV's crossfade-vs-morph pivot, §V's zero-ambient + no-exit discipline (learning #43), and the scroll-interruptible reveal pattern (learning #42). If you find yourself wanting to re-tune §V's OVERLAP or fast-forward timing after loading the page, resist; that's Step 7 polish work.

2. Read the nine flagged learnings (#7, #23, #24, #28, #29, #30, #34, #39, #41) from `./docs/learnings.md`.

3. Execute FIRST ACTION steps 2–4:
   • Restate §VI's character in your own words (one paragraph, three points).
   • Walk §VI 6a pre-code review — name every constraint AND surface the open questions one at a time.
   • Propose (or confirm) the §VI 6c implementation order.
   Get user confirmation before writing any §VI markup or code.

4. §VI 6b STATIC first. Wait for approval. Only then write 6c.

5. 6c → 6d → 6e → then §VII.

Do not re-pitch the aesthetic. Do not re-decide the stack. Do not re-architect the page. Do not re-open §IV's pivot, §V's absence list, or any prior §-section decision. Those are locked. Your job is to build §VI → §VII on top of the five built sections, following the Step 6 ritual for each.

SINGLE MOST DANGEROUS FAILURE MODE FOR §VI: letting form chrome (borders, boxes, shadows, browser-default focus rings) creep in. The line IS the input. The button has no box. The hanko is the only visible container on success.

═══════════════════════════════════════════════════════════════
  SANITY-CHECK QUESTION
═══════════════════════════════════════════════════════════════
Answer this so the user can verify §VI has landed in your head:

**Why is the submit-success state TWO signals (hanko press + mono confirmation line) rather than one, and why must the §VI hanko reuse §III's two-glyph-pass filter treatment + `back.out` motion vocabulary VERBATIM rather than earning a richer treatment of its own as the "final" red moment on the page?**
