═══════════════════════════════════════════════════════════════
  HANDOFF — OZU & SONS · STEP 7 (IN PROGRESS)
═══════════════════════════════════════════════════════════════

All **seven sections** are built and approved (including page-wide paper grain, fine-type legibility fixes, and §VII). **Step 7** (cross-section polish) is **in progress** — not a single-section build.

Deeper context: `./docs/` (index below). Do not read all docs linearly at session start — open them when a specific question arises.

═══════════════════════════════════════════════════════════════
  PROJECT
═══════════════════════════════════════════════════════════════
Ozu & Sons — fictional 4th-generation Sakai knife-maker, 18-month waitlist. A single scroll page, editorial monograph voice.

═══════════════════════════════════════════════════════════════
  ROLE + COMMUNICATION (non-negotiable)
═══════════════════════════════════════════════════════════════
Senior creative director + frontend engineer: teach decisions, explain why, code once direction is clear. User copies/runs commands; they are not expected to author from scratch.

• One question at a time — not a bulleted list of five.  
• Design input: **two specific** options, not open-ended prompts.  
• "Make it better" → clarify: impact, elegance, motion, or personality?  
• Never ask "Would you like me to make this change?" — implement.  
• No emojis unless requested.  
• Don't refer to tool names when speaking to the user.  
• Critique: respond point-by-point — accept / accept-with-refinement / push-back-with-reason.

═══════════════════════════════════════════════════════════════
  STATUS
═══════════════════════════════════════════════════════════════
§I–§VII   BUILT + APPROVED  (static, motion, 6d; grain + meta contrast landed post–§VII)  
**Step 7 (polish)**     IN PROGRESS  
**Step 8 (critique)**   deferred  

**Step 7 landed so far (do not re-pitch as greenfield):**
• **Persistent UI** — fixed wordmark, chapter label (viewport midline + §IV pin-aware), ink-dot cursor on fine pointers — `index.html` `.app-chrome`, `chrome.js`, `chrome.css`. (No bottom scroll-progress bar.)  
• **Atelier dust** — Three.js fullscreen shader (`atelier-dust.js`, `#atelier-dust`), `soft-light` over scroll content, below chrome; dynamically imported after `initMotion`. Skipped when `prefers-reduced-motion` (CSS + JS). Visibility tuned (shader drift + host opacity) so motion reads against body grain — see `docs/repo-state.md`.  

Non-negotiable locked decisions — DO NOT re-open without explicit user charter:
• Aesthetic, stack, §IV crossfade pivot, §V absence discipline, §VI two-signal + red discipline, hybrid A+B pacing, ScrollSmoother/FOUC/`registerTrigger` patterns, **red exactly twice** (`--ink-hanko` only in §III gen 4 + §VI confirmation).  
• **§VII** — colophon copy locked; no footer creep; no red on 終; **only** the rule draw-in moves. Execution notes: `docs/architecture.md` §VII.

═══════════════════════════════════════════════════════════════
  WHAT STEP 7 IS (AND IS NOT)
═══════════════════════════════════════════════════════════════
**Is:** Typography/motion timing audit; performance pass; optional micro-interactions; FOUC gate refactor per learning #24 if undertaken; resize/SplitText follow-ups from `repo-state.md`. (Persistent UI + atmospheric WebGL layer are already shipped — tune and audit, do not rebuild from zero.)

**Is not:** Re-architecting sections, re-deciding the morph→crossfade pivot, adding a third red, or rewriting §VII into a link footer.

**Third micro-interaction (open):** `docs/architecture.md` § Step 7 currently lists **two** shipped micro-interactions (wordmark hover, §VI submit press). The Step 7 polish bar still expects **a third**. **Find and implement that third — it must not be a scroll-progress bar** (or any bottom readout of scroll depth; that pattern is explicitly out of scope).

**Already landed (do not re-pitch as Step 7 greenfield):**
• Page-wide multiply grain on `body` (`layout.css` + `scripts/grain.svg` → base64 in CSS).  
• Fine mono / meta legibility: `--ink-meta`, `--shadow-fine-on-washi` (`tokens.css` + `.meta` + forge/lineage overrides).  
• §VI no longer uses a local `::before` grain layer; `#smooth-wrapper` stacks above the body grain (`z-index` in `layout.css`).  
• Persistent UI + atelier dust — see **STATUS** bullets above.

═══════════════════════════════════════════════════════════════
  DOCS INDEX — consult on demand
═══════════════════════════════════════════════════════════════
`./docs/design-constitution.md`  — Aesthetic, palette, motion philosophy.  
`./docs/tech-stack.md`           — Vite, GSAP, imports (DrawSVG lives in `colophon.js`, not `motion.js`).  
`./docs/architecture.md`         — All 7 sections; execution detail for each.  
`./docs/learnings.md`            — Numbered lessons; grep on demand.  
`./docs/repo-state.md`           — File manifest, init order, console traces, open gaps.  
`./docs/step-6-ritual.md`        — 6a–6e + Tests A–I (historical; all sections complete).

Before editing an unfamiliar file: skim its line in `repo-state.md`. Before a magic number: `tokens.css` / design constitution.

═══════════════════════════════════════════════════════════════
  FIRST ACTION (Step 7 agent)
═══════════════════════════════════════════════════════════════
1. Read `docs/architecture.md` **Step 7** subsection and **Persistent UI layer** (built — wordmark, chapter, cursor; no progress bar).  
2. Read `docs/repo-state.md` **Open infrastructure gaps** — resize is wired; SplitText re-split on resize is still latent; FOUC order is still fragile until refactor.  
3. Skim learnings **#7, #24, #30** plus **#45–#47** (grain + fine type + §VII filter/DrawSVG).  
4. Continue Step 7 from remaining items in `architecture.md` § Step 7 (timing audit, performance, optional FOUC refactor) — **including one additional micro-interaction** beyond the two already listed there, **not** a progress bar (see **Third micro-interaction** above). No need to re-checklist persistent UI vs atelier dust unless regressions appear.

═══════════════════════════════════════════════════════════════
  HANDOFF MAINTENANCE
═══════════════════════════════════════════════════════════════
When Step 7 is **done** and user approves: update `repo-state.md` and `docs/architecture.md`, trim or retarget this file to **Step 8 (critique)**, keep under ~200 lines, scoped to the **current** task only.

═══════════════════════════════════════════════════════════════
  BEGIN
═══════════════════════════════════════════════════════════════
Do not re-pitch aesthetic or stack. Do not re-open §I–§VII narrative locks. Step 7 polishes the whole page; Step 8 is the brutal honest critique pass (`docs/architecture.md`).
