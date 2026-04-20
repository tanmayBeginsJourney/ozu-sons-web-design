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

initMotion();

// Order matters: initPlace, initLineage, and initForge must run
// BEFORE initThreshold. Each section module's synchronous gsap.set
// writes inline opacity:0 (and related initial-state styles) on
// its pre-reveal targets. threshold.js's init removes the
// html.js-pending CSS gate at the end of its synchronous run —
// so by that moment, §II, §III, and §IV targets must already carry
// their inline hidden styles, or they flash at final opacity for
// the frame between "gate removed" and the deferred font-ready
// paths that build per-line SplitText states.
//
// initForge is a no-op during the 6b.1 review phase (contact sheet
// is static) but is wired in the correct position now so 6c doesn't
// have to re-touch this file.
//
// This ordering constraint is load-bearing and fragile; see
// learning #24 for the Step 7 refactor that moves gate removal
// out into main.js so section modules don't need to coordinate.
initPlace();
initLineage();
initForge();
initThreshold();
