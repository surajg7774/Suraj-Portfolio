"use client";

import { useLenis } from "@/hooks/useLenis";

// Renders nothing — Lenis operates directly on window/document scroll, so
// this component's only job is to mount the hook once at the app root
// (rendered from the server layout, same pattern as Navbar/Footer/Cursor).
export default function SmoothScroll() {
  useLenis();
  return null;
}
