"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

// Counts from 0 to `target` once the returned ref's element scrolls into
// view, then never re-triggers — ScrollTrigger's `once: true` kills the
// trigger after it fires, so scrolling back past it doesn't restart it.
export function useCountUp(target, { duration = 1.5, suffix = "" } = {}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(`0${suffix}`);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    // No state update here for the reduced-motion case — the final value is
    // derived directly at render time below instead.
    if (!el || reducedMotion) return undefined;

    const proxy = { value: 0 };
    const tween = gsap.to(proxy, {
      value: target,
      duration,
      ease: "power2.out",
      onUpdate: () => setDisplay(`${Math.round(proxy.value).toLocaleString()}${suffix}`),
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [target, duration, suffix, reducedMotion]);

  const value = reducedMotion ? `${target.toLocaleString()}${suffix}` : display;
  return [ref, value];
}
