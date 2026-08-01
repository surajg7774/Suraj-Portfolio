"use client";

import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { skillTracks } from "@/data/skills";

function SkillTrack({ track, direction }) {
  const chipsRef = useRef(null);

  // Chip-level stagger with a horizontal offset per track (left track
  // enters from the left, right track from the right) — one animation
  // does both jobs at once, since each chip is offset by its track's
  // direction and staggered against its siblings.
  useScrollReveal(chipsRef, { x: direction * 60, y: 0, stagger: 0.05 });

  return (
    <div>
      <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {track.label}
      </h3>
      <div ref={chipsRef} className="flex flex-wrap gap-3">
        {track.skills.map((skill) => (
          <Badge key={skill} className="text-text">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="skills-heading" eyebrow="What I Work With" title="Skills" />

        {/* Still a 2-column grid, generalized from exactly 2 tracks to N
            categories: left-column entries (even index) slide in from the
            left, right-column entries (odd index) from the right — the same
            alternating two-track reveal, just no longer hardcoded to a
            single pair. */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {skillTracks.map((track, i) => (
            <SkillTrack key={track.id} track={track} direction={i % 2 === 0 ? -1 : 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
