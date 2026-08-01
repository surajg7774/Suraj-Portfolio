"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import { useCountUp } from "@/hooks/useCountUp";
import { stats } from "@/data/stats";

function StatItem({ stat }) {
  const [ref, display] = useCountUp(stat.value, { suffix: stat.suffix });

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <span className="font-display text-4xl text-accent md:text-5xl">{display}</span>
      <span className="max-w-[20ch] text-sm text-textMuted">{stat.label}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <section id="stats" aria-labelledby="stats-heading" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          id="stats-heading"
          eyebrow="By the Numbers"
          title="Stats"
          className="text-center"
        />

        <div className="grid gap-10 sm:grid-cols-3">
          {stats.map((stat) => (
            <StatItem key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
