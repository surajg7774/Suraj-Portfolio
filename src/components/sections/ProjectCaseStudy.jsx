"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getLenis } from "@/hooks/useLenis";
import { TIMING } from "@/lib/constants";
import Badge from "@/components/ui/Badge";

const STAGE_LABELS = ["Problem", "Solution", "Tech Stack", "Impact"];
const STAGE_PANEL_CLASS =
  "py-8 md:absolute md:inset-0 md:flex md:flex-col md:justify-center md:py-0";

// Shared with the crossfade loop below so click-to-jump targets stay in
// sync with the actual animation instead of duplicating its numbers.
// Stage i's crossfade to i+1 starts at timeline position `i + CROSSFADE_START`
// and finishes CROSSFADE_DURATION later — i.e. stage i+1 is fully settled at
// position `i + 1`.
const CROSSFADE_START = 0.6;
const CROSSFADE_DURATION = 0.4;
const SETTLE_MARGIN = 0.05; // stay just short of the next crossfade kicking off

// The tl position where stage `index` is fully visible and done animating
// (all of it, including the tech-stack badge stagger which lands inside
// stage 2's window well before its crossfade-out begins).
function stageSettlePosition(index, tlDuration) {
  if (index === STAGE_LABELS.length - 1) return tlDuration;
  return index + CROSSFADE_START - SETTLE_MARGIN;
}

export default function ProjectCaseStudy({ project }) {
  const containerRef = useRef(null);
  const stageRefs = useRef([]);
  const labelRefs = useRef([]);
  // Set only on the desktop/pinned path — its presence is how
  // handleStageClick knows whether to jump within the pinned scrub range or
  // just scroll a normally-flowing stage element into view.
  const scrollTriggerRef = useRef(null);
  const tlDurationRef = useRef(0);
  const reducedMotion = useReducedMotion();
  // Pinning/scrubbing is desktop-only — below `md` it degrades to a normal
  // stacked, scroll-reveal layout (see the `else` branch below).
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const stages = stageRefs.current.filter(Boolean);
    if (!containerRef.current || stages.length !== 4) return undefined;

    scrollTriggerRef.current = null;

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
            const active = i === index;
            label.classList.toggle("text-accent", active);
            label.classList.toggle("text-textMuted", !active);
            if (active) {
              label.setAttribute("aria-current", "true");
            } else {
              label.removeAttribute("aria-current");
            }
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
          tl.to(stages[i], { autoAlpha: 0, y: -24, duration: CROSSFADE_DURATION }, i + CROSSFADE_START).to(
            stages[i + 1],
            { autoAlpha: 1, y: 0, duration: CROSSFADE_DURATION },
            i + CROSSFADE_START
          );
        }

        // Tech-stack badges stagger in right as that stage finishes settling
        // (its own crossfade-in ends at tl position 2, i.e. `2 + CROSSFADE_START
        // - CROSSFADE_DURATION`). `stagger: { amount }` spreads across the
        // whole group regardless of how many badges a project has, so the
        // total reveal span stays fixed instead of growing with stack.length
        // — with a plain per-item stagger, 8 badges pushed the last one past
        // tl position 2.6, i.e. into the *next* crossfade-out, so it was
        // still fading in while the whole stage was already fading away.
        tl.to(badges, { autoAlpha: 1, y: 0, stagger: { amount: 0.15 }, duration: 0.25 }, 2);

        scrollTriggerRef.current = tl.scrollTrigger;
        tlDurationRef.current = tl.duration();
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

    return () => {
      ctx.revert();
      scrollTriggerRef.current = null;
      tlDurationRef.current = 0;
    };
  }, [isDesktop, reducedMotion]);

  // Jumps to a stage on click. On the pinned desktop layout the four
  // "stages" are stacked in place, not spaced out in the document, so a
  // plain scrollIntoView can't reach an individual one — instead we jump to
  // the point within the pinned scroll range whose scrub progress lands on
  // that stage, fully settled (crossfade finished, badges done animating),
  // using the exact same timeline positions the crossfade loop above was
  // built with. Off desktop (or reduced motion, where no pin/scrub exists
  // at all) each stage is a normal block in the flow, so a direct scroll
  // works.
  const handleStageClick = (index) => {
    const lenis = getLenis();
    const st = scrollTriggerRef.current;

    if (st && tlDurationRef.current > 0) {
      const progress = stageSettlePosition(index, tlDurationRef.current) / tlDurationRef.current;
      const targetY = st.start + progress * (st.end - st.start);
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 1 });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
      return;
    }

    const target = stageRefs.current[index];
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: -96 });
    } else {
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }
  };

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
        <nav
          aria-label={`${project.title} case study sections`}
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest"
        >
          {STAGE_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              onClick={() => handleStageClick(i)}
              data-cursor="hover"
              aria-current={i === 0 ? "true" : undefined}
              className={`transition-colors hover:text-accent ${
                i === 0 ? "text-accent" : "text-textMuted"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
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
