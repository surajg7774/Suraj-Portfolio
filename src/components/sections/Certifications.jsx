"use client";

import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { certifications } from "@/data/certifications";

export default function Certifications() {
  const gridRef = useRef(null);

  useScrollReveal(gridRef, { y: 24, stagger: 0.1 });

  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="relative px-6 py-32"
    >
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="certifications-heading" eyebrow="Credentials" title="Certifications" />

        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-bgAlt p-6"
            >
              <h3 className="font-display text-lg text-text">{cert.title}</h3>
              <p className="font-mono text-xs uppercase tracking-wide text-accent">
                {cert.issuer}
              </p>
              <p className="text-sm leading-relaxed text-textMuted">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
