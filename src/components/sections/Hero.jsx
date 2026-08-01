"use client";

import { Fragment, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import NodeGraphBackground from "@/components/effects/NodeGraphBackground";
import { profile } from "@/data/profile";
import { TIMING } from "@/lib/constants";

const nameWords = profile.name.split(" ");
const titleWords = profile.title.split(" ");

function WordLine({ words, className = "" }) {
  return (
    <span className={`block ${className}`}>
      {words.map((word, i) => (
        // The space is a sibling text node, not trailing content inside the
        // inline-block span — nesting it inside is what caused adjacent
        // words on the same wrapped line to render with no visible gap
        // (browsers can collapse a trailing space sitting at an
        // inline-block's own boundary).
        <Fragment key={word + i}>
          <span className="inline-block" data-word>
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}

function ScrollIndicator({ reducedMotion }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-textMuted">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
      <span className="relative h-10 w-px overflow-hidden bg-white/15">
        <span
          className={`absolute inset-x-0 top-0 h-3 bg-accent ${
            reducedMotion ? "" : "animate-scroll-indicator"
          }`}
        />
      </span>
    </div>
  );
}

export default function Hero() {
  const headlineRef = useRef(null);
  const taglineRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const primaryCtaRef = useMagneticButton();
  const secondaryCtaRef = useMagneticButton();
  const resumeCtaRef = useMagneticButton();

  useEffect(() => {
    const words = headlineRef.current?.querySelectorAll("[data-word]");
    const tagline = taglineRef.current;
    if (!words || !tagline) return undefined;

    if (reducedMotion) {
      gsap.set(words, { opacity: 1, y: 0 });
      gsap.set(tagline, { opacity: 1, y: 0 });
      return undefined;
    }

    // No artificial delay here — the headline/tagline are the LCP
    // candidate on this page, and hydration itself already costs real time
    // under CPU throttling before this timeline can even start.
    const tl = gsap.timeline();
    tl.fromTo(
      words,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: TIMING.base, ease: TIMING.ease, stagger: 0.06 }
    ).fromTo(
      tagline,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: TIMING.base, ease: TIMING.ease },
      // Chained on the same timeline (not a setTimeout) — overlaps the tail
      // of the headline stagger so the tagline lands ~100ms after it.
      "-=0.35"
    );

    return () => tl.kill();
  }, [reducedMotion]);

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6"
    >
      <NodeGraphBackground />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start gap-8 py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
          {profile.status}
        </span>

        <h1
          id="home-heading"
          ref={headlineRef}
          className="font-display leading-[1.05] tracking-tight text-text"
        >
          <WordLine words={nameWords} />
          <WordLine words={titleWords} className="text-textMuted" />
        </h1>

        <p ref={taglineRef} className="max-w-xl text-lg text-textMuted">
          {profile.heroHeadline}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <a
            ref={primaryCtaRef}
            href="#projects"
            data-cursor="hover"
            className="rounded-full bg-accent px-6 py-3 font-mono text-sm text-bg transition-transform hover:scale-[1.03]"
          >
            View Work
          </a>
          <a
            ref={secondaryCtaRef}
            href="#contact"
            data-cursor="hover"
            className="rounded-full border border-white/15 px-6 py-3 font-mono text-sm text-text transition-colors hover:border-accent hover:text-accent"
          >
            Get in Touch
          </a>
          <a
            ref={resumeCtaRef}
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="hover"
            className="inline-flex items-center gap-2 px-2 py-3 font-mono text-sm text-textMuted transition-colors hover:text-accent"
          >
            <Download size={16} />
            Resume
          </a>
        </div>
      </div>

      <ScrollIndicator reducedMotion={reducedMotion} />
    </section>
  );
}
