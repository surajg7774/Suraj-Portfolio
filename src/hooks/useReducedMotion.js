"use client";

import { useMediaQuery } from "./useMediaQuery";

const QUERY = "(prefers-reduced-motion: reduce)";

// Reactive to OS-level changes, not just a one-time check — some users
// toggle "reduce motion" while the page is open (e.g. via a11y settings).
export function useReducedMotion() {
  return useMediaQuery(QUERY);
}
