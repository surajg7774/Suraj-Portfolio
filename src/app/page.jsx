import dynamic from "next/dynamic";
import PageTransition from "@/components/layout/PageTransition";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import EducationTimeline from "@/components/sections/EducationTimeline";
import Certifications from "@/components/sections/Certifications";
import Stats from "@/components/sections/Stats";

// Contact pulls in @emailjs/browser, which the rest of the (above-the-fold-
// heavy) page doesn't need — split it into its own chunk. SSR stays on
// (dynamic's default) so the contact info is still in the server-rendered
// HTML for SEO/no-JS.
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default function Home() {
  return (
    <PageTransition>
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <EducationTimeline />
        <Certifications />
        <Stats />
        <Contact />
      </main>
    </PageTransition>
  );
}
