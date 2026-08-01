"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const MIN_DISPLAY_MS = 400; // floor so the loader never flickers on fast loads
const MAX_DISPLAY_MS = 1500; // hard cap regardless of how slow readiness is
const FADE_MS = 500;

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [mounted, setMounted] = useState(true);
  const reducedMotion = useReducedMotion();
  const climbTween = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(() => setFadingOut(true), MIN_DISPLAY_MS);
      return () => clearTimeout(timer);
    }

    const proxy = { value: 0 };

    // Climb toward 90% while we wait on the real readiness signals below —
    // it never claims 100% until the app is actually ready (or the hard cap
    // forces it).
    climbTween.current = gsap.to(proxy, {
      value: 90,
      duration: MAX_DISPLAY_MS / 1000,
      ease: "power1.out",
      onUpdate: () => setProgress(proxy.value),
    });

    const minFloor = new Promise((resolve) => setTimeout(resolve, MIN_DISPLAY_MS));
    const fontsReady =
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve();
    const hardCap = new Promise((resolve) => setTimeout(resolve, MAX_DISPLAY_MS));

    Promise.race([Promise.all([fontsReady, minFloor]), hardCap]).then(() => {
      climbTween.current?.kill();
      gsap.to(proxy, {
        value: 100,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => setProgress(proxy.value),
        onComplete: () => setFadingOut(true),
      });
    });

    return () => {
      climbTween.current?.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!fadingOut) return undefined;
    // Actually remove from the DOM once the fade transition has finished,
    // rather than leaving an invisible-but-present overlay behind.
    const timer = setTimeout(() => setMounted(false), reducedMotion ? 50 : FADE_MS);
    return () => clearTimeout(timer);
  }, [fadingOut, reducedMotion]);

  if (!mounted) return null;

  // Reduced motion never depends on the animated `progress` state — it just
  // renders the completed state immediately.
  const displayProgress = reducedMotion ? 100 : progress;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-bg transition-opacity ${
        reducedMotion ? "duration-75" : "duration-500"
      } ${fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="font-mono text-4xl text-text tabular-nums">
        {Math.round(displayProgress)}%
      </div>
      <div className="h-px w-40 overflow-hidden bg-white/10">
        <div className="h-full bg-accent" style={{ width: `${displayProgress}%` }} />
      </div>
    </div>
  );
}
