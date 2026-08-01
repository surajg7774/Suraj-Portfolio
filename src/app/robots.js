import { SITE_URL } from "@/lib/seo";

// SITE_URL is a placeholder domain — see lib/seo.js. Update it once deployed
// so this sitemap reference actually resolves.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
