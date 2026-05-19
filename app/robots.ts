import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "./data/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/tools/expert-review/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
