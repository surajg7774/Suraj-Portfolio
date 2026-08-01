"use client";

import { useRef } from "react";
import Badge from "@/components/ui/Badge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { currentlyLearning } from "@/data/currentlyLearning";

// Deliberately lighter than SectionHeading/Skills: a supporting signal, not
// a primary section, so no big display-font heading or dramatic reveal —
// just a compact label + pill row.
export default function CurrentlyLearning() {
  const listRef = useRef(null);

  useScrollReveal(listRef, { y: 12, stagger: 0.04, start: "top 90%" });

  return (
    <section
      id="currently-learning"
      aria-labelledby="currently-learning-heading"
      className="relative px-6 py-12"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="currently-learning-heading"
          className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-textMuted"
        >
          Currently Learning
        </h2>
        <div ref={listRef} className="flex flex-wrap gap-2.5">
          {currentlyLearning.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
