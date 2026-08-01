"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TIMING } from "@/lib/constants";
import Badge from "@/components/ui/Badge";

const STAGE_LABELS = ["Problem", "Solution", "Tech Stack", "Impact"];
const STAGE_PANEL_CLASS =
  "py-8 md:absolute md:inset-0 md:flex md:flex-col md:justify-center md:py-0";

export default function ProjectCaseStudy({ project }) {
  const containerRef = useRef(null);
  const stageRefs = useRef([]);
  const labelRefs = useRef([]);
  const reducedMotion = useReducedMotion();
  // Pinning/scrubbing is desktop-only — below `md` it degrades to a normal
  // stacked, scroll-reveal layout (see the `else` branch below).
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const stages = stageRefs.current.filter(Boolean);
    if (!containerRef.current || stages.length !== 4) return undefined;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // Fully static: no pin, no reveal-on-scroll, everything visible.
        gsap.set(stages, { autoAlpha: 1, y: 0 });
        return;
      }

      const badges = stages[2].querySelectorAll("[data-badge]");

      if (isDesktop) {
        gsap.set(stages, { autoAlpha: 0, y: 24 });
        gsap.set(stages[0], { autoAlpha: 1, y: 0 });
        gsap.set(badges, { autoAlpha: 0, y: 8 });

        const setActiveLabel = (index) => {
          labelRefs.current.forEach((label, i) => {
            if (!label) return;
            label.classList.toggle("text-accent", i === index);
            label.classList.toggle("text-textMuted", i !== index);
          });
        };
        setActiveLabel(0);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * 3.2,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setActiveLabel(Math.min(3, Math.floor(self.progress * 4)));
            },
          },
        });

        // Crossfade each stage into the next: stage i fades out while
        // stage i+1 fades in, at the same timeline position.
        for (let i = 0; i < stages.length - 1; i++) {
          tl.to(stages[i], { autoAlpha: 0, y: -24, duration: 0.4 }, i + 0.6).to(
            stages[i + 1],
            { autoAlpha: 1, y: 0, duration: 0.4 },
            i + 0.6
          );
        }

        // Tech-stack badges stagger in while that stage is active.
        tl.to(badges, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.3 }, 2.2);
      } else {
        gsap.set(stages, { autoAlpha: 0, y: 32 });
        gsap.set(badges, { autoAlpha: 0, y: 8 });

        stages.forEach((stage) => {
          gsap.to(stage, {
            autoAlpha: 1,
            y: 0,
            duration: TIMING.base,
            ease: TIMING.ease,
            scrollTrigger: { trigger: stage, start: "top 85%" },
          });
        });

        gsap.to(badges, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.3,
          scrollTrigger: { trigger: stages[2], start: "top 85%" },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isDesktop, reducedMotion]);

  return (
    <div
      id={`case-study-${project.id}`}
      ref={containerRef}
      className="relative border-y border-white/5 bg-bgAlt/40 md:flex md:h-screen md:flex-col md:overflow-hidden md:pt-24"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:flex-none md:px-12 md:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl text-text md:text-3xl">{project.title}</h3>
          <span className="font-mono text-xs text-textMuted">{project.duration}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest">
          {STAGE_LABELS.map((label, i) => (
            <span
              key={label}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className={i === 0 ? "text-accent" : "text-textMuted"}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-5xl flex-1 px-6 pb-16 md:px-12 md:pb-0">
        <div
          ref={(el) => {
            stageRefs.current[0] = el;
          }}
          className={STAGE_PANEL_CLASS}
        >
          <p className="max-w-2xl text-lg leading-relaxed text-textMuted">{project.problem}</p>
        </div>

        <div
          ref={(el) => {
            stageRefs.current[1] = el;
          }}
          className={STAGE_PANEL_CLASS}
        >
          <p className="max-w-2xl text-lg leading-relaxed text-textMuted">{project.solution}</p>
        </div>

        <div
          ref={(el) => {
            stageRefs.current[2] = el;
          }}
          className={STAGE_PANEL_CLASS}
        >
          <div className="flex flex-wrap gap-2.5">
            {project.stack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>

        <div
          ref={(el) => {
            stageRefs.current[3] = el;
          }}
          className={STAGE_PANEL_CLASS}
        >
          <p className="max-w-2xl text-lg leading-relaxed text-text">{project.impact}</p>
        </div>
      </div>
    </div>
  );
}
