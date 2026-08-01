"use client";

import { useSyncExternalStore } from "react";

// useSyncExternalStore (rather than useState+useEffect) is the React-
// recommended way to read a browser-only value like matchMedia without
// causing a hydration mismatch: React renders `serverSnapshot` for the SSR
// pass, then reconciles with the real client value before paint.
export function useMediaQuery(query, serverSnapshot = false) {
  const subscribe = (callback) => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  };

  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => serverSnapshot;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
