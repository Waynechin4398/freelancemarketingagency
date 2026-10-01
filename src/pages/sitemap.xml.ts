import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

const staticPaths = [
  "/",
  "/about/",
  "/contact/",
  "/insights/",
  "/services/",
  "/work/",
];

interface SitemapEntry {
  path: string;
  lastModified?: Date;
}

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] ?? character);

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response("Sitemap unavailable until PUBLIC_SITE_URL is configured.\n", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const [services, caseStudies, insights] = await Promise.all([
    getCollection("services", ({ data }) => !data.draft),
    getCollection("caseStudies", ({ data }) => !data.draft),
    getCollection("insights", ({ data }) => !data.draft),
  ]);

  const entries: SitemapEntry[] = [
    ...staticPaths.map((path) => ({ path })),
    ...services.map((entry) => ({ path: `/services/${entry.id}/` })),
    ...caseStudies.map((entry) => ({ path: `/work/${entry.id}/` })),
    ...insights.map((entry) => ({
      path: `/insights/${entry.id}/`,
      lastModified: entry.data.updatedDate ?? entry.data.publishDate,
    })),
  ].sort((a, b) => a.path.localeCompare(b.path));

  const urls = entries.map(({ path, lastModified }) => {
    const location = escapeXml(new URL(path, site).toString());
    const lastmod = lastModified
      ? `<lastmod>${lastModified.toISOString().slice(0, 10)}</lastmod>`
      : "";
    return `<url><loc>${location}</loc>${lastmod}</url>`;
  }).join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
