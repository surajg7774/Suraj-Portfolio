// Single source of truth for design tokens. Mirrored into the Tailwind v4
// `@theme` block in globals.css so the same values are usable both as
// Tailwind classes (bg-accent, text-textMuted, font-mono) and in JS/GSAP.
export const COLORS = {
  bg: "#0A0A0F", // near-black base
  bgAlt: "#12121A", // slightly lighter surface (cards, sections)
  text: "#F2F1ED", // off-white
  textMuted: "#8A8A94", // secondary text
  accent: "#FFB020", // warm amber
  accentMuted: "#FFB02033", // amber at low opacity, for glows/borders
};

export const FONTS = {
  display: "var(--font-display)",
  mono: "var(--font-mono)",
};

export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 };

export const TIMING = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
  ease: "power3.out",
};
