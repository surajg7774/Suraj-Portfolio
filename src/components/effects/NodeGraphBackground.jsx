"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const VIEW_W = 1000;
const VIEW_H = 700;

const NODES = [
  { x: 120, y: 140 },
  { x: 340, y: 80 },
  { x: 560, y: 180 },
  { x: 780, y: 100 },
  { x: 900, y: 260 },
  { x: 220, y: 340 },
  { x: 480, y: 380 },
  { x: 700, y: 400 },
  { x: 140, y: 560 },
  { x: 400, y: 600 },
  { x: 640, y: 580 },
  { x: 860, y: 520 },
];

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 6], [2, 7], [3, 7],
  [4, 7], [5, 6], [6, 7], [5, 8], [6, 9], [7, 10], [7, 11], [8, 9], [9, 10],
  [10, 11], [4, 8],
];

// Self-contained, absolutely-positioned background layer — sits behind
// whatever section content is rendered on top of it (currently just Hero),
// with no coupling to that markup.
export default function NodeGraphBackground() {
  const groupRef = useRef(null);
  const lineRefs = useRef([]);
  const reducedMotion = useReducedMotion();

  // Draw-in: animate each edge's stroke-dashoffset from its own length to 0.
  useEffect(() => {
    const lines = lineRefs.current.filter(Boolean);

    if (reducedMotion) {
      lines.forEach((line) => {
        line.style.strokeDasharray = "none";
        line.style.strokeDashoffset = "0";
      });
      return undefined;
    }

    lines.forEach((line) => {
      const length = Number(line.dataset.length);
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
    });

    const tween = gsap.to(lines, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: "power2.inOut",
      stagger: 0.06,
      delay: 0.2,
    });

    return () => tween.kill();
  }, [reducedMotion]);

  // Idle drift: a barely-there parallax tied to pointer position, heavily
  // damped via a long quickTo duration so it reads as ambient motion, not a
  // tracked cursor effect.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const group = groupRef.current;
    if (!group) return undefined;

    const moveX = gsap.quickTo(group, "x", { duration: 1.2, ease: "power3.out", immediateRender: true });
    const moveY = gsap.quickTo(group, "y", { duration: 1.2, ease: "power3.out", immediateRender: true });

    const handlePointerMove = (event) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      moveX(nx * 12);
      moveY(ny * 12);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reducedMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g ref={groupRef} opacity="0.35">
          {EDGES.map(([a, b], i) => {
            const from = NODES[a];
            const to = NODES[b];
            const length = Math.hypot(to.x - from.x, to.y - from.y);
            return (
              <line
                key={`${a}-${b}`}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                data-length={length}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#FFB020"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
            );
          })}
          {NODES.map((node, i) => (
            <circle
              key={i}
              cx={node.x}
              cy={node.y}
              r="3"
              fill="#FFB020"
              fillOpacity="0.7"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
