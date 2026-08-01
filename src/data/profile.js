// Centralized profile/content data — single source of truth so copy and
// URLs never get hardcoded/duplicated across components.
export const profile = {
  name: "Suraj Gupta",
  initials: "SG",
  title: "AI Engineer & Full-Stack Developer",
  status: "Fresher · Open to Work",
  tagline: "I build systems that ship — not notebooks.",
  about: [
    "I'm an AI Engineer and full-stack developer based in Khargone, India — B.Tech in Computer Science, now deepening the applied-AI side through CDAC's PG-Diploma in Advanced Computing. I build things that run in production, not notebooks that stop at a demo.",
    "On the backend, I work in Spring Boot and React — real auth, real data models, real edge cases, not scaffolding. On the AI side, I build RAG pipelines, NLP systems, and computer vision models that have to hold up outside a curated dataset.",
    "I'm a fresher on paper, not in output — every project here is something I built end-to-end and can defend line by line. Open to work, ready to start now.",
  ],
  credentials: [
    { label: "B.Tech CSE", detail: "2024" },
    { label: "PG-DAI", detail: "CDAC ACTS · Feb '26" },
  ],
  location: "Khargone, Madhya Pradesh, India",
  email: "surajg7774@gmail.com",
  github: "https://github.com/surajg7774",
  linkedin: "https://www.linkedin.com/in/suraj-gupta-493502210/",
  resumeUrl: "/resume.pdf",
};

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
