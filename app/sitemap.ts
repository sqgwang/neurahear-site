import type { MetadataRoute } from "next";
import { absoluteUrl, primarySiteRoutes } from "./data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-20T00:00:00+08:00");

  return primarySiteRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
