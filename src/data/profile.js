// Centralized profile/content data — single source of truth so copy and
// URLs never get hardcoded/duplicated across components.
export const profile = {
  name: "Suraj Gupta",
  title: "AI Engineer & Full-Stack Developer",
  status: "🟢 Available for Full-Time Opportunities",
  // Hero's supporting mission-statement line, shown below the Name/title
  // h1 — distinct from `title`, which is the short label used everywhere
  // else (Navbar/Footer/metadata).
  heroHeadline:
    "Building production-ready AI applications and scalable full-stack software that solve real-world problems through modern engineering.",
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
