import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/sections/ProjectCard";
import ProjectCaseStudy from "@/components/sections/ProjectCaseStudy";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative">
      <div className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-5xl">
          <SectionHeading id="projects-heading" eyebrow="Selected Work" title="Projects" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>

      {/* Plain block wrapper, not flex: GSAP's ScrollTrigger disables its
          padding-based pin-spacing reservation when a pinned element's
          direct parent is `display: flex`, which silently breaks the pin
          distance for every case study below. */}
      <div>
        {projects.map((project) => (
          <ProjectCaseStudy key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
