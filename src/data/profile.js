// Centralized profile/content data — single source of truth so copy and
// URLs never get hardcoded/duplicated across components.
export const profile = {
  name: "Suraj Gupta",
  initials: "SG",
  title: "AI Engineer & Full-Stack Developer",
  status: "Fresher · Open to Work",
  // Hero's headline (a mission statement) is distinct from `title` — `title`
  // still powers the Navbar/Footer/metadata's shorter "AI Engineer &
  // Full-Stack Developer" label, this is just the big Hero-only line.
  heroHeadline:
    "Building AI-powered and scalable software that solves real-world problems through intelligent systems and modern engineering.",
  tagline: "I build systems that ship — not notebooks.",
  roles: ["AI Engineer", "Full Stack Developer", "Machine Learning Enthusiast"],
  about: [
    "I'm drawn to problems where intelligence meets engineering — where a model's output has to survive contact with real users, real data, and real edge cases. That's the gap I like working in: turning a research idea into something that actually ships.",
    "I care about clean architecture as much as clever algorithms, because a system nobody can maintain doesn't solve anything for long.",
    "Right now I'm deepening that focus through CDAC ACTS' PGCP-AI program, and I'm looking for a team where I can keep building things that hold up outside a notebook.",
  ],
  credentials: [
    { label: "B.Tech CSE", detail: "2024" },
    { label: "PG-DAC", detail: "CDAC ACTS · 2025" },
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
