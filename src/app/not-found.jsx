import Link from "next/link";
import { profile } from "@/data/profile";

export const metadata = {
  title: `Page Not Found — ${profile.name}`,
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">404</p>
      <h1 className="mt-4 font-display text-text">Page not found</h1>
      <p className="mt-4 max-w-md text-textMuted">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you
        back on track.
      </p>
      <Link
        href="/"
        data-cursor="hover"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-sm text-bg transition-transform hover:scale-[1.03]"
      >
        Back to Home
      </Link>
    </main>
  );
}
