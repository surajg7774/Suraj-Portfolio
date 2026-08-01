"use client";

import { useRef } from "react";
import NodeGraphBackground from "@/components/effects/NodeGraphBackground";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// A visual breather between Hero and About — reuses NodeGraphBackground
// verbatim (same node/edge pattern, same draw-in + idle-drift + reduced-
// motion handling) rather than building a second particle system. It's a
// transitional section, not a content one: short height, no heavy content.
export default function NetworkDivider() {
  const textRef = useRef(null);

  useScrollReveal(textRef, { y: 12, start: "top 85%" });

  return (
    <section
      id="network-divider"
      aria-labelledby="network-divider-text"
      className="relative flex h-[45vh] min-h-[320px] items-center justify-center overflow-hidden border-y border-white/5"
    >
      <NodeGraphBackground deferUntilVisible />
      <p
        ref={textRef}
        id="network-divider-text"
        className="relative font-mono text-xs uppercase tracking-[0.3em] text-textMuted"
      >
        Where ideas become systems
      </p>
    </section>
  );
}
