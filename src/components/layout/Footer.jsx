import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { profile } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-bgAlt">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-mono text-sm text-textMuted">
          <span className="text-text">{profile.name}</span>
          <span className="mx-2 text-accent">/</span>
          {profile.title}
        </div>

        <div className="flex items-center gap-5">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="hover"
            aria-label="GitHub"
            className="text-textMuted hover:text-accent transition-colors"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="hover"
            aria-label="LinkedIn"
            className="text-textMuted hover:text-accent transition-colors"
          >
            <LinkedinIcon size={18} />
          </a>
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              data-cursor="hover"
              aria-label="Email"
              className="text-textMuted hover:text-accent transition-colors"
            >
              <Mail size={18} />
            </a>
          )}
        </div>

        <p className="font-mono text-xs text-textMuted">
          &copy; {year} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
