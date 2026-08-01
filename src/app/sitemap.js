import { SITE_URL } from "@/lib/seo";

// SITE_URL is a placeholder domain — see lib/seo.js. Update it once deployed.
export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
