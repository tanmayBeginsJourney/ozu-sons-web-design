═══════════════════════════════════════════════════════════════
  HANDOFF — OZU & SONS · §VII (NEXT TASK)
═══════════════════════════════════════════════════════════════

You are inheriting a single-page website build in progress. §I–§VI are built + approved. §VII is next — the final section of the monograph.

This handoff is DELIBERATELY TIGHT. Deeper context lives in `./docs/` and is indexed at the bottom. Do NOT read all docs linearly at session start — the handoff gives you everything needed to start §VII. Consult docs when a specific question arises.

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
§VI  INVITATION     BUILT + APPROVED  (static, motion, submit + confirmation + error, 6d, 6e)
§VII COLOPHON       ◄ NEXT TASK — not yet built
Step 7 (polish)     deferred
Step 8 (critique)   deferred

Non-negotiable locked decisions — DO NOT re-open:
• Aesthetic: WASHI & ASH — quiet, editorial, patient monograph.            → docs/design-constitution.md
• Stack: Vite 5 + Vanilla JS + GSAP 3.15 + ScrollSmoother + @fontsource.   → docs/tech-stack.md
  NO Tailwind. NO 3D. NO canvas.
• §IV path-morph → asset-crossfade pivot — shipped, not re-openable.       → docs/architecture.md §IV, docs/learnings.md #35–#38
• §V zero-ambient + no-exit + scroll-interruptible reveal — shipped.        → docs/architecture.md §V, docs/learnings.md #42–#43
• §VI two-signal confirmation + red discipline + hanko vocabulary reuse.   → docs/architecture.md §VI, docs/learnings.md #30, #41, #44
• Hybrid A+B pacing for all text reveals.                                  → docs/learnings.md #21 + #31
• ScrollSmoother progressive enhancement via html[data-smoother="on"].     → docs/learnings.md #1
• FOUC gate via html.js-pending class.                                     → docs/learnings.md #15 + #24
• Register every ScrollTrigger via motion.js `registerTrigger()`.          → docs/learnings.md #13
• The red `--ink-hanko` appears EXACTLY twice on the page: §III gen 4
  hanko (first) and §VI confirmation stamp (second + final). §VII gets
  no red whatsoever.                                                       → docs/learnings.md #30

═══════════════════════════════════════════════════════════════
  §VII — THE COLOPHON (the task)
═══════════════════════════════════════════════════════════════
Not a footer. A colophon — a book's closing typographic note about how the object was made. §VI was the interactive verb; §VII is the page turning closed.

Copy (verbatim, line break preserved):

    "Set in Fraunces and Shippori Mincho B1.
     Composed in 2026 for Ozu & Sons, Sakai, Ōsaka."

Composition:
• Small 終 character centered below the two text lines, faint. 終 means "end" / "finis" — the traditional Japanese cinematic/editorial closing mark. Faint, not emphatic. Shippori Mincho, `--ink-ash` or lighter, small type scale.
• One hair-thin sumi-ink rule ABOVE the text, 30% of the column width, centered. The rule DRAWS IN via DrawSVGPlugin as `<line>` or `<path>` — left-to-centre + right-to-centre meeting in the middle. Exactly ONE draw, once, on scroll-in.
• Composition is centered — this is the one section where centered is correct, because a colophon is a closing gesture, not a letter or a call. §VI was narrow-column left-aligned to read as a hand; §VII reads as printed matter's final page.

Strict EXCLUSIONS — do NOT re-add:
• The "no blade was photographed" meta-wink was CUT after critique. Do NOT re-add it. Not a joke, not an Easter egg, not as hover text. The cut was deliberate.
• No red. The page's two red moments are earned in §III and §VI (learning #30). §VII is pure sumi/ash.
• No interactive affordance. §VI owned interaction. §VII is a closing note; nothing is clickable.
• No social links, no email, no "made by," no build timestamp, no copyright. The copy IS the colophon. Anything else is footer creep.
• No ambient motion. §VII inherits §V's absence discipline (learning #43) — the rule draws in once, full stop.

Unique: §VII is the ONLY section that uses DrawSVGPlugin. It was kept imported in `motion.js` through §I–§VI specifically for this draw-in (repo-state.md already flags this). No other section's vocabulary includes a draw-in — this is §VII's signature, the way §I had the idle-reactive breathing and §V had the scroll-interruptible reveal.

═══════════════════════════════════════════════════════════════
  PATTERNS TO REUSE (do not re-invent)
═══════════════════════════════════════════════════════════════
• DrawSVGPlugin — already imported in `motion.js`, never used in a built section. Documented in repo-state.md. First and only use is §VII's rule. See GSAP docs or `./mcps/plugin-context7-plugin-context7` if you need the DrawSVG API surface.
• "Earned once" paused timeline — learning #41. The rule draws in ONCE on scroll-in, does NOT replay on scroll-back. Same pattern §IV and §VI already use.
• Font-ready gate for any SplitText work — learning #26. Two short lines probably don't need SplitText (the text is authored visible, likely with no reveal animation). Decide in 6a whether any reveal is happening at all.
• ScrollTrigger at `start: "top 78%"` or `"top 85%"` — trigger point for "reader has just started to see the section." Consult §II/§III/§V for prior-art start points before picking a value.
• Absence list as editorial structure — learning #43 (§V's governing rule). If a reveal or micro-motion feels tempting, SUBTRACT INSTEAD (learning #7).
• `html.js-pending` FOUC gate coordination — learning #24. If §VII has any hidden-start targets (e.g. the rule at `drawSVG: "0% 50%"` for the left-to-centre draw), `initColophon` must slot BEFORE `initThreshold` in `main.js`, just like §II–§VI do. If it has NO hidden targets (text authored visible, rule progressively enhanced), it can slot anywhere — though keeping the "everything before initThreshold" pattern is safer.

═══════════════════════════════════════════════════════════════
  FIRST ACTION
═══════════════════════════════════════════════════════════════
§VII is a small section, but the failure modes at "the page's closing beat" are specific:
  (a) Over-determining it — giving the rule multiple motions, or animating the 終 character, or adding a "fade-up" on the text. The rule draw-in is the ONE motion. The text and 終 are authored visible.
  (b) Footer creep — treating §VII as a footer and unconsciously adding links, credits, a year, a sitemap. It is a COLOPHON. The copy is locked.
  (c) Reintroducing red. The page's red is DONE. Even 終 is not red; it's `--ink-ash` or similar.
  (d) Breaking §V's no-exit discipline carried forward — §VII should also have no exit animation. It is the last thing; there is nothing past it.

1. Read these five learnings from `./docs/learnings.md` BEFORE writing any §VII code:
   • #7  — over-determination is the biggest risk (still applies, most relevant here)
   • #23 — progressive enhancement (text authored visible; rule must render in a usable state if JS fails)
   • #24 — FOUC gate coordination (init order if §VII has any hidden targets)
   • #30 — don't reward specialness twice (§VII gets NO red, 終 stays ash)
   • #41 — paused-timeline + earned-once (the rule draw-in plays once)
   • #43 — absence as editorial structure (carry §V's discipline forward)

2. Restate §VII's character in your own words, ONE paragraph, covering:
   (a) Why §VII is a colophon, not a footer — what that asks of the copy, the composition, and the restraint.
   (b) Why the rule draws in (and why nothing else moves) — what the single ink line is doing that justifies its one motion.
   (c) Why §VII gets NO red and what would happen if 終 were rendered in `--ink-hanko`.

3. §VII 6a PRE-CODE REVIEW — name every constraint AND every open decision. §VII has FEWER open questions than §VI, but a few:
   • Copy verbatim (exactly as above).
   • Composition — centered, column-width narrow, rule 30% column width centered above text, 終 below text, small.
   • Rule DRAW-IN — DrawSVGPlugin, two segments meeting at centre, once on scroll-in via paused timeline.
   • Typography — text at a small-to-mid editorial scale (probably `--type-meta` or `--type-small`, NOT lede). 終 smaller still, in Shippori Mincho.
   • FOUC gate — if the rule starts at `drawSVG: "50% 50%"` (zero length), synchronous `gsap.set` in init, and `initColophon` slots before `initThreshold`. If you choose the rule authored visible and then animating from progressive-enhancement perspective, skip the gate.
   • Reduced-motion — no draw-in, rule renders fully drawn immediately. Text and 終 are identical across branches (they're authored visible in all paths).
   • Section status — no interactive elements. No short-circuit branches needed beyond reduced-motion.

   OPEN decisions to raise as 6a questions (one at a time, per the communication rules):
   • Does the text reveal on scroll-in (SplitText word-by-word) or authored visible with NO reveal? Recommend authored visible — §VI's two signals already own "something appears on this page." Adding a text reveal here would be a third micro-reveal moment after the monograph has already closed its argument. The rule draw-in is the only motion §VII needs.
   • Does 終 reveal separately (e.g. fade in after the rule lands)? Recommend authored visible. Animating 終 would add a second motion to a section whose whole job is to be quiet.
   • Does the rule draw left-to-right in a single pass, OR split (left-to-centre + right-to-centre simultaneously)? The handoff brief specifies split; confirm it reads better before coding. Split draw feels more "two pens meeting" / "book-plate rule" than single-direction.
   • Rule ink treatment — plain `stroke` or filtered with `#ink-wash` for the hand-drawn look that §II/§III use? Recommend `#ink-wash`. Plain strokes would be the first machine-ruled line on the page and would visually contradict the ink vocabulary.

4. Propose §VII 6c implementation order (or confirm the recommended order below). Get user confirmation before writing any §VII motion code:
   (i)   Static markup + typography/layout CSS (text, rule SVG, 終 char). REDUCED-MOTION CSS fallback here too — the rule is authored fully-drawn in the reduced-motion path via `stroke-dasharray` or CSS equivalent so the visual hierarchy stays intact.
   (ii)  Rule draw-in — DrawSVGPlugin, paused timeline, ScrollTrigger at `"top 78%"` or similar, `once: true`, plays once on enter, plays from "50% 50%" to "0% 100%" (meaning: from zero-length at centre out to full-length). Verify DrawSVG syntax in the context7 MCP before writing.

   Do NOT build both in one pass. Minimum split: (i) alone for 6b; (ii) as 6c.

5. §VII 6b STATIC first — markup + typography/layout CSS + the reduced-motion CSS fallback. Wait for user approval. THEN write 6c.

6. After 6c approval → 6d → 6e. Then Step 7 polish (all seven sections together), then Step 8 critique.

═══════════════════════════════════════════════════════════════
  DOCS INDEX — consult on demand, do NOT pre-read linearly
═══════════════════════════════════════════════════════════════
./docs/design-constitution.md  — Aesthetic, palette, typography, motion philosophy, forbidden list.
./docs/tech-stack.md           — Build tools, libraries, plugins, imports. All locked.
./docs/architecture.md         — All 7 sections in detail. §I–§VI (built, full execution notes).
                                 §VII brief mirrored here + Step 7/8 briefs.
./docs/learnings.md            — 44 numbered learnings from predecessor agents. For §VII: read
                                 #7, #23, #24, #30, #41, #43 up front. Grep others on demand.
                                 Also #44 (§VI's filterUnits lesson) — may apply if §VII's rule
                                 is a `<line>` with any filter, though it probably uses a `<path>`.
./docs/repo-state.md           — File manifest, init order, console traces, open infrastructure
                                 gaps. Consult before editing any file you haven't touched.
./docs/step-6-ritual.md        — 6a / 6b / 6c / 6d / 6e + Tests A–I.

Rules for doc consultation:
• Before editing a file you haven't touched, glance at its description in `repo-state.md`.
• If you find yourself wondering "why was this decision made," the answer is in `learnings.md`.
• If you're about to type a magic number (color, size, duration), check `design-constitution.md`
  / `tokens.css` first (learning #12).

Handoff maintenance (for whoever finishes §VII):
• When §VII is BUILT + APPROVED, promote its brief into `docs/architecture.md` under its
  `[NOT YET BUILT]` placeholder, following the same format §V and §VI use (execution notes,
  flagged follow-ups, section status + console trace).
• Add new learnings to `docs/learnings.md` if new patterns emerge (e.g. DrawSVG gotchas, rule
  composition rules).
• Update `repo-state.md`'s file manifest + console traces + §VII status line.
• Update `main.js` description in `repo-state.md` to reflect `initColophon` being wired in.
• Then rewrite THIS handoff to target STEP 7 (the polish pass). Step 7 will need a different
  handoff shape — it's a cross-section pass, not a single-section build.
• Goal: keep `handoff.md` under ~200 lines and scoped to the CURRENT task only.

═══════════════════════════════════════════════════════════════
  BEGIN
═══════════════════════════════════════════════════════════════
Your first message should:

1. Briefly confirm you've read this handoff. Confirm §I–§VI are NOT up for re-opening — especially §IV's crossfade-vs-morph pivot, §V's zero-ambient + no-exit discipline, §VI's two-signal confirmation and red discipline, and learning #44's `filterUnits="userSpaceOnUse"` rule. If you find yourself wanting to re-tune any previous section after loading the page, resist; that's Step 7 polish work.

2. Read the six flagged learnings (#7, #23, #24, #30, #41, #43) from `./docs/learnings.md`.

3. Execute FIRST ACTION steps 2–4:
   • Restate §VII's character in your own words (one paragraph, three points).
   • Walk §VII 6a pre-code review — name every constraint AND surface the open questions one at a time.
   • Propose (or confirm) the §VII 6c implementation order.
   Get user confirmation before writing any §VII markup or code.

4. §VII 6b STATIC first. Wait for approval. Only then write 6c.

5. 6c → 6d → 6e → then Step 7 polish.

Do not re-pitch the aesthetic. Do not re-decide the stack. Do not re-architect the page. Do not re-open §IV's pivot, §V's absence list, §VI's two-signal rule, or any prior §-section decision. Those are locked. Your job is to build §VII on top of the six built sections, following the Step 6 ritual, then hand Step 7 off clean.

SINGLE MOST DANGEROUS FAILURE MODE FOR §VII: footer creep. The copy is locked. Do not add links, credits, a year, a sitemap, a social row, or a "no blade was photographed" callback. The colophon IS the copy. The rule draw-in is the motion. 終 is the final mark. Nothing else.

═══════════════════════════════════════════════════════════════
  SANITY-CHECK QUESTION
═══════════════════════════════════════════════════════════════
Answer this so the user can verify §VII has landed in your head:

**Why is the rule draw-in §VII's ONLY motion (with the text and 終 character authored visible and still) rather than earning the text a small reveal of its own to match the "something appears" pattern the rest of the page has established — and what would happen to the monograph's overall shape if §VII accumulated a second or third motion the way §IV did?**
