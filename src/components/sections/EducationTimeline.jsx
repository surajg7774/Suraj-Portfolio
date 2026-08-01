"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionHeading from "@/components/ui/SectionHeading";
import { educationTimeline } from "@/data/education";

export default function EducationTimeline() {
  const wrapperRef = useRef(null);
  const progressRef = useRef(null);
  const dotRefs = useRef([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const progress = progressRef.current;
    const dots = dotRefs.current.filter(Boolean);
    if (!wrapper || !progress) return undefined;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // Draw the line instantly and show every milestone — no scroll-tied
        // reveal, just skip straight to the finished state.
        gsap.set(progress, { scaleY: 1 });
        gsap.set(dots, { scale: 1 });
        return;
      }

      gsap.set(progress, { scaleY: 0 });
      gsap.set(dots, { scale: 0 });

      // The line's fill is tied directly to scroll position across the
      // timeline's own height (scrub, not pinned) — it draws as the user
      // scrolls past it, rather than on a fixed-duration timer.
      gsap.to(progress, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 75%",
          end: "bottom 70%",
          scrub: true,
        },
      });

      // Each dot scales in independently as the line reaches its
      // milestone — a simple discrete reveal per entry rather than trying
      // to derive exact fractional timing off the scrub above.
      dots.forEach((dot) => {
        gsap.to(dot, {
          scale: 1,
          duration: 0.4,
          ease: "back.out(2)",
          scrollTrigger: { trigger: dot, start: "top 80%" },
        });
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="education" aria-labelledby="education-heading" className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="education-heading" eyebrow="Journey" title="Education" />

        <div ref={wrapperRef} className="relative">
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-white/10" />
          <div
            ref={progressRef}
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px origin-top bg-accent"
          />

          <ul className="space-y-12">
            {educationTimeline.map((item, i) => (
              <li key={item.id} className="relative pl-8">
                <span
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-bg"
                />
                <div className="font-mono text-xs uppercase tracking-widest text-accent">
                  {item.year}
                </div>
                <h3 className="mt-1 font-display text-xl text-text">{item.level}</h3>
                <p className="mt-1 text-sm text-textMuted">
                  {item.institute}
                  {item.board ? ` · ${item.board}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
