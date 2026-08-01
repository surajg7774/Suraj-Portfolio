"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";
import { useMediaQuery } from "./useMediaQuery";

const STRENGTH = 0.35; // fraction of cursor offset the button follows — kept subtle, not a full 1:1 drag

// Attach the returned ref to a button/link: it'll pull subtly toward the
// cursor within its own bounds and spring back on mouseleave. Inert on
// touch devices (no real hover) and reduced motion.
export function useMagneticButton() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion || isCoarsePointer) return undefined;

    const moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const handleMouseMove = (event) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      moveX(relX * STRENGTH);
      moveY(relY * STRENGTH);
    };

    const handleMouseLeave = () => {
      moveX(0);
      moveY(0);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reducedMotion, isCoarsePointer]);

  return ref;
}
