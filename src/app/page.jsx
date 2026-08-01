import dynamic from "next/dynamic";
import PageTransition from "@/components/layout/PageTransition";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import CurrentlyLearning from "@/components/sections/CurrentlyLearning";
import Projects from "@/components/sections/Projects";
import EducationTimeline from "@/components/sections/EducationTimeline";
import Certifications from "@/components/sections/Certifications";
import Hobbies from "@/components/sections/Hobbies";

// Contact pulls in @emailjs/browser, which the rest of the (above-the-fold-
// heavy) page doesn't need — split it into its own chunk. SSR stays on
// (dynamic's default) so the contact info is still in the server-rendered
// HTML for SEO/no-JS.
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default function Home() {
  return (
    <PageTransition>
      {/* overflow-x-hidden here (not on html/body) clips any off-screen
          pre-animation transform state (e.g. useScrollReveal's x-offset
          chips before they scroll into view) without touching the actual
          scrolling root — html/body's own overflow-x controls what Lenis
          measures, and setting it there breaks Lenis/ScrollTrigger sync
          entirely (verified: it silently stalls every scroll-reveal
          animation site-wide). No `transform` here either, so it doesn't
          reintroduce the position:fixed containing-block bug from Module 5. */}
      <main className="relative overflow-x-hidden">
        <Hero />
        <About />
        <Skills />
        <CurrentlyLearning />
        <Projects />
        <EducationTimeline />
        <Certifications />
        <Hobbies />
        <Contact />
      </main>
    </PageTransition>
  );
}
