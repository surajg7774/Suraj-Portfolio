import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Loader from "@/components/ui/Loader";
import Cursor from "@/components/ui/Cursor";
import { profile } from "@/data/profile";
import { SITE_URL, SITE_DESCRIPTION } from "@/lib/seo";

// Space Grotesk stands in for General Sans/Satoshi (grotesk sans) — neither
// of those is distributed via next/font, and this is the closest free
// Google Fonts equivalent for the same geometric-grotesk feel.
const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const titleFull = `${profile.name} — ${profile.title}`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: titleFull,
    template: `%s — ${profile.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    profile.name,
    "AI Engineer",
    "Full-Stack Developer",
    "RAG pipeline",
    "Machine Learning",
    "Spring Boot",
    "React developer",
    "CDAC",
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  openGraph: {
    title: titleFull,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: `${profile.name} Portfolio`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: titleFull,
    description: SITE_DESCRIPTION,
  },
};

// Populated from data/profile.js so this never drifts out of sync with the
// visible page content.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: SITE_URL,
  sameAs: [profile.github, profile.linkedin].filter(Boolean),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${monoFont.variable}`}>
      <body className="min-h-screen bg-bg text-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <div className="grain" aria-hidden="true" />
        <Loader />
        <Cursor />
        <SmoothScroll />
        <Navbar />
        {children}
        <BackToTop />
        <Footer />
      </body>
    </html>
  );
}
