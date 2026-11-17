import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["/", "/menu", "/cart", "/checkout", "/track", "/contact", "/terms", "/privacy"];

  return routes.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/menu" || path === "/" ? "weekly" : "monthly",
    priority: path === "/" || path === "/menu" ? 1 : 0.6,
  }));
}
