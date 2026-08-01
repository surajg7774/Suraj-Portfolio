import { COLORS, FONTS } from "./src/lib/constants.js";

// Loaded into Tailwind v4 via the `@config` directive in globals.css so the
// design tokens in lib/constants.js stay the single source of truth for both
// JS/GSAP usage and Tailwind utility classes (bg-accent, text-textMuted, ...).
/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        bg: COLORS.bg,
        bgAlt: COLORS.bgAlt,
        text: COLORS.text,
        textMuted: COLORS.textMuted,
        accent: COLORS.accent,
        accentMuted: COLORS.accentMuted,
      },
      fontFamily: {
        display: [FONTS.display, "sans-serif"],
        mono: [FONTS.mono, "monospace"],
      },
    },
  },
};

export default config;
