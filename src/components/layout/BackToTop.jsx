"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { getLenis } from "@/hooks/useLenis";

const SHOW_THRESHOLD = 600;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > SHOW_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      // Reduced-motion path (Lenis is never instantiated): jump instantly.
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      data-cursor="hover"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-8 right-8 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-bgAlt text-text shadow-lg transition-all duration-300 hover:border-accent hover:text-accent ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
