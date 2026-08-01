"use client";

import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { profile } from "@/data/profile";

export default function About() {
  const paragraphsRef = useRef(null);
  const credentialsRef = useRef(null);

  // Paragraph-by-paragraph stagger — subtle, this section is about
  // readability, not spectacle.
  useScrollReveal(paragraphsRef, { y: 24, stagger: 0.15 });
  useScrollReveal(credentialsRef, { y: 16, start: "top 90%" });

  return (
    <section id="about" aria-labelledby="about-heading" className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="about-heading" eyebrow="01 · About" title="About Me" />

        <div ref={paragraphsRef} className="space-y-5">
          {profile.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-lg leading-relaxed text-textMuted">
              {paragraph}
            </p>
          ))}
        </div>

        <div
          ref={credentialsRef}
          className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-6 font-mono text-xs uppercase tracking-wider text-textMuted"
        >
          {profile.credentials.map((item, i) => (
            <span key={item.label} className="flex items-center gap-3">
              {i > 0 && <span className="text-accent">/</span>}
              <span className="text-text">{item.label}</span>
              <span>{item.detail}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
