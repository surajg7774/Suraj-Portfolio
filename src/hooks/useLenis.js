"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

// Module-level singleton so components outside the hook's call site (e.g.
// BackToTop) can trigger `.scrollTo()` on the same Lenis instance instead of
// falling back to the native, non-smooth `window.scrollTo`.
let activeLenis = null;

export function getLenis() {
  return activeLenis;
}

export function useLenis() {
  const lenisRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Reduced motion: skip smooth scroll entirely and let the browser's
    // native (instant) scrolling take over.
    if (reducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    activeLenis = lenis;

    // Every Lenis scroll tick must tell ScrollTrigger to re-measure,
    // otherwise pinned/scrubbed animations drift out of sync with the
    // (virtual) scroll position Lenis is actually rendering.
    lenis.on("scroll", ScrollTrigger.update);

    // The reverse sync also matters: Lenis caches its own max-scroll limit
    // at init time, before pinned ScrollTriggers (e.g. the project case
    // studies) have inserted their pin-spacers and grown the document.
    // Without this, Lenis clamps scrolling short of the real page bottom —
    // pinned sections never reach their final scroll-driven stage. Tell
    // Lenis to recompute its limits every time ScrollTrigger recalculates.
    const handleRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    // Drive Lenis's internal raf loop from GSAP's ticker rather than its own
    // requestAnimationFrame call. This guarantees Lenis and every GSAP/
    // ScrollTrigger animation advance on the exact same frame, eliminating
    // the one-frame-behind desync that shows up as jittery pinned sections.
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      lenis.destroy();
      lenisRef.current = null;
      activeLenis = null;
    };
  }, [reducedMotion]);

  return lenisRef;
}
