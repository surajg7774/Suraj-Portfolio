"use client";

import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getLenis } from "@/hooks/useLenis";
import { TIMING } from "@/lib/constants";
import Badge from "@/components/ui/Badge";

// The absolute-stacked, pinned-crossfade treatment only applies when we're
// actually going to pin+scrub (desktop AND motion allowed). `md:absolute`
// alone is a pure viewport-width media query with no awareness of
// prefers-reduced-motion — gating it behind `motion-safe:` too means
// reduced-motion desktop visitors get plain stacked-in-flow panels (like
// mobile) instead of every stage rendering on top of every other stage at
// once, which is what happened before: the reduced-motion JS path skips
// creating the pin entirely (no ScrollTrigger to show one stage at a time),
// but this CSS still stacked them all absolutely at inset-0.
const STAGE_PANEL_CLASS =
  "py-8 md:motion-safe:absolute md:motion-safe:inset-0 md:motion-safe:flex md:motion-safe:flex-col md:motion-safe:justify-center md:motion-safe:py-0";

// Shared with the crossfade loop below so click-to-jump targets stay in
// sync with the actual animation instead of duplicating its numbers.
// Stage i's crossfade to i+1 starts at timeline position `i + CROSSFADE_START`
// and finishes CROSSFADE_DURATION later — i.e. stage i+1 is fully settled at
// position `i + 1`.
const CROSSFADE_START = 0.6;
const CROSSFADE_DURATION = 0.4;
const SETTLE_MARGIN = 0.05; // stay just short of the next crossfade kicking off
// Original tuning was 4 stages (tl duration 3.0) mapped to a scroll range of
// innerHeight*3.2 — kept as a per-timeline-unit ratio so projects with more
// or fewer stages (e.g. a solo case study with Architecture/Features/
// Challenges added) still pace each stage transition the same regardless of
// how many stages there are in total.
const SCROLL_PER_TL_UNIT = 3.2 / 3;

// Builds the ordered list of stages this project actually has content for.
// Every project gets Problem/Solution/Tech Stack/Impact; Architecture,
// Features, and Challenges only appear when the project data includes them,
// so older, simpler case studies render exactly as before.
function getStageDefs(project) {
  return [
    { key: "problem", label: "Problem", type: "text", content: project.problem },
    { key: "solution", label: "Solution", type: "text", content: project.solution },
    project.architecture && {
      key: "architecture",
      label: "Architecture",
      type: "text",
      content: project.architecture,
    },
    { key: "stack", label: "Tech Stack", type: "badges", content: project.stack },
    project.features?.length && {
      key: "features",
      label: "Features",
      type: "list",
      content: project.features,
    },
    project.challenges?.length && {
      key: "challenges",
      label: "Challenges",
      type: "list",
      content: project.challenges,
    },
    { key: "impact", label: "Impact", type: "text", content: project.impact, emphasis: true },
  ].filter(Boolean);
}

// The tl position where stage `index` is fully visible and done animating
// (all of it, including the tech-stack badge stagger which lands inside
// that stage's window well before its crossfade-out begins).
function stageSettlePosition(index, stageCount, tlDuration) {
  if (index === stageCount - 1) return tlDuration;
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

  const stageDefs = getStageDefs(project);
  const stackIndex = stageDefs.findIndex((stage) => stage.type === "badges");

  useEffect(() => {
    const stages = stageRefs.current.filter(Boolean);
    if (!containerRef.current || stages.length !== stageDefs.length) return undefined;

    scrollTriggerRef.current = null;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // Fully static: no pin, no reveal-on-scroll, everything visible.
        gsap.set(stages, { autoAlpha: 1, y: 0 });
        return;
      }

      const badges = stackIndex >= 0 ? stages[stackIndex].querySelectorAll("[data-badge]") : [];

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
            end: () => "+=" + window.innerHeight * SCROLL_PER_TL_UNIT * (stages.length - 1),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setActiveLabel(Math.min(stages.length - 1, Math.floor(self.progress * stages.length)));
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

        // Tech-stack badges stagger in right as that stage finishes settling.
        // `stagger: { amount }` spreads across the whole group regardless of
        // how many badges a project has, so the total reveal span stays
        // fixed instead of growing with stack.length — with a plain
        // per-item stagger, a long stack could push the last badge past the
        // stage's own crossfade-out, so it was still fading in while the
        // whole stage was already fading away.
        if (badges.length) {
          tl.to(badges, { autoAlpha: 1, y: 0, stagger: { amount: 0.15 }, duration: 0.25 }, stackIndex);
        }

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

        if (badges.length) {
          gsap.to(badges, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.3,
            scrollTrigger: { trigger: stages[stackIndex], start: "top 85%" },
          });
        }
      }
    }, containerRef);

    return () => {
      ctx.revert();
      scrollTriggerRef.current = null;
      tlDurationRef.current = 0;
    };
  }, [isDesktop, reducedMotion, stageDefs.length, stackIndex]);

  // Jumps to a stage on click. On the pinned desktop layout the stages are
  // stacked in place, not spaced out in the document, so a plain
  // scrollIntoView can't reach an individual one — instead we jump to the
  // point within the pinned scroll range whose scrub progress lands on that
  // stage, fully settled (crossfade finished, badges done animating), using
  // the exact same timeline positions the crossfade loop above was built
  // with. Off desktop (or reduced motion, where no pin/scrub exists at all)
  // each stage is a normal block in the flow, so a direct scroll works.
  const handleStageClick = (index) => {
    const lenis = getLenis();
    const st = scrollTriggerRef.current;

    if (st && tlDurationRef.current > 0) {
      const progress =
        stageSettlePosition(index, stageDefs.length, tlDurationRef.current) / tlDurationRef.current;
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
      className="relative border-y border-white/5 bg-bgAlt/40 md:pt-24 md:motion-safe:flex md:motion-safe:h-screen md:motion-safe:flex-col md:motion-safe:overflow-hidden"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:flex-none md:px-12 md:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl text-text md:text-3xl">{project.title}</h3>
          <span className="font-mono text-xs text-textMuted">{project.duration}</span>
        </div>

        {(project.role || project.liveUrl) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            {project.role && (
              <span className="font-mono text-xs uppercase tracking-widest text-textMuted">
                {project.role}
              </span>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="hover"
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent/20"
              >
                <ExternalLink size={13} /> View Live Site
              </a>
            )}
          </div>
        )}

        <nav
          aria-label={`${project.title} case study sections`}
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest"
        >
          {stageDefs.map((stage, i) => (
            <button
              key={stage.key}
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
              {stage.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="relative mx-auto w-full max-w-5xl flex-1 px-6 pb-16 md:px-12 md:pb-0">
        {stageDefs.map((stage, i) => (
          <div
            key={stage.key}
            ref={(el) => {
              stageRefs.current[i] = el;
            }}
            className={STAGE_PANEL_CLASS}
          >
            {stage.type === "badges" && (
              <div className="flex flex-wrap gap-2.5">
                {stage.content.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            )}

            {stage.type === "list" && (
              <ul className="max-w-2xl space-y-3">
                {stage.content.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-lg leading-relaxed text-textMuted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {stage.type === "text" && (
              <p
                className={`max-w-2xl text-lg leading-relaxed ${
                  stage.emphasis ? "text-text" : "text-textMuted"
                }`}
              >
                {stage.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
