"use client";

import { useRef } from "react";
import { Mountain, Plane } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { hobbies } from "@/data/hobbies";

// lucide-react has no basketball glyph — a small inline SVG matching
// lucide's own stroke style (24x24 viewBox, strokeWidth 2, round caps) so it
// blends in with the imported icons rather than standing out.
function BasketballIcon({ size = 14, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20" />
      <path d="M12 2a14.5 14.5 0 0 1 0 20" />
      <path d="M2 12h20" />
    </svg>
  );
}

const ICONS = {
  Trekking: Mountain,
  Traveling: Plane,
  Basketball: BasketballIcon,
};

// Deliberately lightweight, matching Currently Learning's treatment: a
// supporting signal, not a primary section — no big display-font heading or
// dramatic reveal, just a compact icon + label pill row.
export default function Hobbies() {
  const listRef = useRef(null);

  useScrollReveal(listRef, { y: 12, stagger: 0.04, start: "top 90%" });

  return (
    <section id="hobbies" aria-labelledby="hobbies-heading" className="relative px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h2
          id="hobbies-heading"
          className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-textMuted"
        >
          Hobbies
        </h2>
        <div ref={listRef} className="flex flex-wrap gap-2.5">
          {hobbies.map((hobby) => {
            const Icon = ICONS[hobby];
            return (
              <Badge key={hobby} className="gap-1.5 text-text">
                <Icon size={14} />
                {hobby}
              </Badge>
            );
          })}
        </div>
      </div>
    </section>
  );
}
