"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TIMING } from "@/lib/constants";

// Single-page portfolio today, but built route-transition-ready: any future
// route change (pathname changing) replays the same fade-in so adding pages
// later doesn't require touching this component.
export default function PageTransition({ children }) {
  const containerRef = useRef(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (reducedMotion) {
      // No `y` here — setting a transform (even an identity one) would
      // create a new containing block for descendant `position: fixed`
      // elements, breaking every pinned section's ScrollTrigger math.
      gsap.set(el, { opacity: 1 });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: TIMING.slow,
        ease: TIMING.ease,
        // GSAP leaves the (by-then-identity) transform matrix inline once
        // the tween completes. A `transform` on this ancestor — even a
        // no-op one — becomes the containing block for every descendant
        // `position: fixed` element, which silently breaks ScrollTrigger's
        // pin math for every pinned section on the page. Clear it once the
        // animation is done so `position: fixed` stays viewport-relative.
        clearProps: "transform",
        // Pinned sections mount (and take their first ScrollTrigger
        // measurement) while this transform is still present, so clearing
        // it alone isn't enough — force a refresh so already-created
        // triggers recompute against the now-untransformed ancestor chain.
        onComplete: () => ScrollTrigger.refresh(),
      }
    );
  }, [pathname, reducedMotion]);

  return <div ref={containerRef}>{children}</div>;
}
