/* ──────────────────────────────────────────────────────────────
   chrome.js — persistent UI (Step 7): wordmark, chapter label,
   ink cursor (halo + core).

   Chapter: minimum distance from the viewport midline to each section’s
   effective vertical span, with later sections winning ties. §IV’s
   pin spacer keeps #forge’s getBoundingClientRect() enormous while the
   pin is active — we use .forge__inner’s rect only while .forge--pinned
   so V–VII can win once their copy is on screen.

   ScrollTrigger on `#smooth-content` drives chapter updates only
   (ScrollSmoother-safe `scroller` when smoother is live).
   ────────────────────────────────────────────────────────────── */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, registerTrigger } from "./motion.js";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  { id: "threshold", label: "I — The Threshold" },
  { id: "place", label: "II — The Place" },
  { id: "lineage", label: "III — The Lineage" },
  { id: "forge", label: "IV — The Forge" },
  { id: "philosophy", label: "V — The Philosophy" },
  { id: "invitation", label: "VI — The Invitation" },
  { id: "colophon", label: "VII — Colophon" },
];

export function initChrome() {
  const root = document.querySelector(".app-chrome");
  if (!root) return;

  const chapterInner = root.querySelector(".chrome__chapter-inner");
  const cursorHalo = root.querySelector(".chrome__cursor-halo");
  const cursorGlide = root.querySelector(".chrome__cursor-glide");

  if (!chapterInner) return;

  let currentChapterId = "";

  const viewportMid = () => window.innerHeight * 0.5;

  const effectiveSectionRect = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    if (id === "forge" && el.classList.contains("forge--pinned")) {
      const inner = el.querySelector(".forge__inner");
      if (inner) return inner.getBoundingClientRect();
    }
    return el.getBoundingClientRect();
  };

  /** Smallest vertical distance from viewport centre to a section’s band; ties → later section. */
  const pickChapter = () => {
    const mid = viewportMid();
    let best = CHAPTERS[0];
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < CHAPTERS.length; i++) {
      const c = CHAPTERS[i];
      const r = effectiveSectionRect(c.id);
      if (!r) continue;
      let dist;
      if (mid >= r.top && mid <= r.bottom) {
        dist = 0;
      } else if (mid < r.top) {
        dist = r.top - mid;
      } else {
        dist = mid - r.bottom;
      }
      if (dist < bestDist || (dist === bestDist && i > bestIdx)) {
        bestDist = dist;
        best = c;
        bestIdx = i;
      }
    }
    return best;
  };

  const setChapterLabel = (nextLabel) => {
    if (chapterInner.textContent === nextLabel) return;
    if (motion.prefersReducedMotion) {
      chapterInner.textContent = nextLabel;
      return;
    }
    gsap.to(chapterInner, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        chapterInner.textContent = nextLabel;
        gsap.to(chapterInner, {
          opacity: 1,
          duration: 0.38,
          ease: "power2.out",
        });
      },
    });
  };

  const syncChapter = () => {
    const picked = pickChapter();
    if (!picked || picked.id === currentChapterId) return;
    currentChapterId = picked.id;
    setChapterLabel(picked.label);
  };

  const chapterSt = ScrollTrigger.create({
    trigger: "#smooth-content",
    start: "top top",
    end: "bottom bottom",
    ...(motion.smoother ? { scroller: "#smooth-wrapper" } : {}),
    onUpdate: () => {
      syncChapter();
    },
  });
  registerTrigger(chapterSt);

  ScrollTrigger.addEventListener("refresh", () => {
    syncChapter();
  });

  ScrollTrigger.addEventListener("scrollEnd", () => {
    syncChapter();
  });

  requestAnimationFrame(() => {
    syncChapter();
  });

  const finePointer =
    cursorHalo &&
    cursorGlide &&
    !motion.prefersReducedMotion &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer) {
    document.body.classList.add("chrome-cursor-on");
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    gsap.set([cursorHalo, cursorGlide], {
      x: cx,
      y: cy,
      xPercent: -50,
      yPercent: -50,
    });

    const haloTo = {
      x: gsap.quickTo(cursorHalo, "x", {
        duration: 0.52,
        ease: "power3.out",
      }),
      y: gsap.quickTo(cursorHalo, "y", {
        duration: 0.52,
        ease: "power3.out",
      }),
    };
    const glideTo = {
      x: gsap.quickTo(cursorGlide, "x", {
        duration: 0.2,
        ease: "power3.out",
      }),
      y: gsap.quickTo(cursorGlide, "y", {
        duration: 0.2,
        ease: "power3.out",
      }),
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        haloTo.x(e.clientX);
        haloTo.y(e.clientY);
        glideTo.x(e.clientX);
        glideTo.y(e.clientY);
      },
      { passive: true }
    );

    // Third Step 7 micro-interaction: a tiny "ink tap" pulse on press.
    // Keeps the response typographic/ink-like rather than adding UI chrome.
    const playCursorTap = () => {
      // One-shot pulse per click (no timeline state): deterministic even when
      // selection/drag interactions disrupt pointerup ordering.
      gsap.killTweensOf([cursorHalo, cursorGlide], "scale,opacity");
      gsap.fromTo(
        cursorHalo,
        { scale: 1, opacity: 0.85 },
        {
          scale: 0.8,
          opacity: 1,
          duration: 0.11,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
          overwrite: "auto",
        }
      );
      gsap.fromTo(
        cursorGlide,
        { scale: 1 },
        {
          scale: 1.45,
          duration: 0.11,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
          overwrite: "auto",
        }
      );
    };

    window.addEventListener("pointerdown", playCursorTap, { passive: true });
  }
}
