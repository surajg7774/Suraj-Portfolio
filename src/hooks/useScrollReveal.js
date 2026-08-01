"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";
import { TIMING } from "@/lib/constants";

const DEFAULTS = {
  x: 0,
  y: 40,
  opacity: 0,
  stagger: 0,
  start: "top 85%",
};

// Generic "reveal on scroll into view" animation for a ref'd element (or a
// container whose direct children should stagger in). Pass `stagger` > 0 to
// animate `ref.current.children` instead of the element itself. `x` defaults
// to 0 (no horizontal offset) so existing callers are unaffected — pass it
// for a directional reveal (e.g. a column sliding in from one side).
export function useScrollReveal(ref, options = {}) {
  const { x, y, opacity, stagger, start } = { ...DEFAULTS, ...options };
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const targets = stagger > 0 ? el.children : el;

    if (reducedMotion) {
      // No-op animation-wise: jump straight to the final visible state.
      gsap.set(targets, { x: 0, y: 0, opacity: 1 });
      return undefined;
    }

    const tween = gsap.fromTo(
      targets,
      { x, y, opacity },
      {
        x: 0,
        y: 0,
        opacity: 1,
        stagger,
        duration: TIMING.base,
        ease: TIMING.ease,
        scrollTrigger: {
          trigger: el,
          start,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, x, y, opacity, stagger, start, reducedMotion]);
}
