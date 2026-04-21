/* ──────────────────────────────────────────────────────────────
   main.js — app entry.
   Order matters:
     1. CSS imports  (so tokens exist before anything renders)
     2. Font imports (self-hosted via @fontsource; Vite injects
        @font-face rules as part of the bundle)
     3. Motion boot  (must run before any scroll-linked anim)
     4. Section/feature modules
   ────────────────────────────────────────────────────────────── */

// ─── Styles ────────────────────────────────────────────────
import "./styles/main.css";

// ─── Fonts ─────────────────────────────────────────────────
// Fraunces ships as variable on opsz + wght axes.
// Shippori Mincho B1 is not variable; load the weights we use.
// JetBrains Mono ships variable (wght).
import "@fontsource-variable/fraunces";
import "@fontsource/shippori-mincho-b1/400.css";
import "@fontsource/shippori-mincho-b1/500.css";
import "@fontsource-variable/jetbrains-mono";

// ─── Motion stack ──────────────────────────────────────────
import { initMotion } from "./modules/motion.js";

// ─── Sections ──────────────────────────────────────────────
import { initThreshold } from "./modules/threshold.js";
import { initPlace } from "./modules/place.js";
import { initLineage } from "./modules/lineage.js";
import { initForge } from "./modules/forge.js";
import { initPhilosophy } from "./modules/philosophy.js";
import { initInvitation } from "./modules/invitation.js";
import { initColophon } from "./modules/colophon.js";
import { initChrome } from "./modules/chrome.js";
import { releaseRevealGate } from "./modules/reveal-gate.js";

initMotion();
// Three.js is ~600kb; load async so first paint stays light.
import("./modules/atelier-dust.js").then((m) => m.initAtelierDust());

// Order matters: every section module EXCEPT initThreshold must
// run BEFORE initThreshold. initChrome runs after colophon (FOUC-
// safe) and before threshold — it registers ScrollTriggers for
// chapter/cursor; threshold ends with ScrollTrigger.refresh()
// so metrics include §I SplitText. Each section module's synchronous gsap.set
// writes inline opacity:0 (and related initial-state styles) on
// its pre-reveal targets. releaseRevealGate() runs immediately after
// initThreshold() so the html.js-pending CSS gate drops only once
// every section has queued its synchronous hidden state (learning #24).
initPlace();
initLineage();
initForge();
initPhilosophy();
initInvitation();
initColophon();
initChrome();
initThreshold();
releaseRevealGate();
