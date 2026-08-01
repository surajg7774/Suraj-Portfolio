"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getLenis } from "@/hooks/useLenis";
import Badge from "@/components/ui/Badge";

const MAX_TILT = 7; // degrees — kept subtle per spec (5-8deg max), not exaggerated
const VISIBLE_STACK_COUNT = 5;

export default function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");

  useEffect(() => {
    const el = cardRef.current;
    if (!el || reducedMotion || isCoarsePointer) return undefined;

    gsap.set(el, { transformPerspective: 800, rotateX: 0, rotateY: 0 });

    // Plain gsap.to() rather than quickTo: combining rotateX + rotateY
    // forces GSAP into 3D matrix decomposition, where quickTo's resetTo()
    // path logs a benign but noisy "not eligible for reset" warning on
    // every update. overwrite:"auto" gives quickTo-equivalent interrupt
    // behavior for this comparatively low-frequency, single-card case.
    const handleMouseMove = (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: px * MAX_TILT * 2,
        rotateX: -py * MAX_TILT * 2,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      gsap.set(el, { rotateX: 0, rotateY: 0 });
    };
  }, [reducedMotion, isCoarsePointer]);

  const handleClick = () => {
    const targetId = `case-study-${project.id}`;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(`#${targetId}`, { offset: -24 });
    } else {
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  const visibleStack = project.stack.slice(0, VISIBLE_STACK_COUNT);
  const remaining = project.stack.length - visibleStack.length;

  return (
    <button
      type="button"
      ref={cardRef}
      onClick={handleClick}
      data-cursor="hover"
      style={{ transformPerspective: 800 }}
      className="group flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-bgAlt p-6 text-left transition-colors will-change-transform hover:border-accent/50"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-xl text-text">{project.title}</h3>
        <span className="shrink-0 font-mono text-xs text-textMuted">{project.duration}</span>
      </div>

      <p className="text-sm leading-relaxed text-textMuted">{project.problem}</p>

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {visibleStack.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
        {remaining > 0 && <Badge>+{remaining}</Badge>}
      </div>
    </button>
  );
}
