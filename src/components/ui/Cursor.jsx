"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const reducedMotion = useReducedMotion();
  // Touch/coarse-pointer devices get the native cursor — a custom cursor
  // there is both broken (no real pointer to track) and pointless.
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const enabled = !isCoarsePointer && !reducedMotion;

  // Only hide the native cursor once we know a custom one is actually going
  // to render — never hide it globally as a default.
  useEffect(() => {
    if (!enabled) return undefined;
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = "";
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    // Centering via xPercent/yPercent (rather than a Tailwind translate
    // class) so GSAP can merge it into the same transform it drives with
    // quickTo below — mixing an inline GSAP transform with a separate CSS
    // transform utility would just have one clobber the other.
    gsap.set([dot, ring], {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    // quickTo is a performant tween factory purpose-built for continuous
    // pointer-following — far cheaper per-frame than setState + re-render.
    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    // Combining a single "scale" quickTo with the xPercent/yPercent set
    // above pushes GSAP into matrix-decomposition mode, where `scale`
    // itself becomes "not eligible for reset" (GSAP's own suggested fix:
    // split into individual scaleX/scaleY tweens instead).
    const ringScaleX = gsap.quickTo(ring, "scaleX", { duration: 0.3, ease: "power2.out" });
    const ringScaleY = gsap.quickTo(ring, "scaleY", { duration: 0.3, ease: "power2.out" });

    const handlePointerMove = (event) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    // Subtle scale-up (not dramatic) on any element opting in via
    // data-cursor="hover" — the convention later modules build on for
    // buttons/cards.
    const handleOver = (event) => {
      if (event.target.closest?.('[data-cursor="hover"]')) {
        ringScaleX(1.6);
        ringScaleY(1.6);
      }
    };
    const handleOut = (event) => {
      if (event.target.closest?.('[data-cursor="hover"]')) {
        ringScaleX(1);
        ringScaleY(1);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handleOver);
    document.addEventListener("pointerout", handleOut);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] h-8 w-8 rounded-full border border-accent/60"
      />
    </>
  );
}
