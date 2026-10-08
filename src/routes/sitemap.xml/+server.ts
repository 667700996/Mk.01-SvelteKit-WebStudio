import { absoluteUrl } from "$lib/config/site";
import { footerNav } from "$config/navigation.config";
import { labExperiments } from "$modules/labs";
import { sampleProjects } from "$modules/work";
import { getAllPosts, getCategories } from "$lib/server/content";

export const prerender = true;

export function GET() {
  const pages = footerNav
    .flatMap((group) => group.links.map((link) => link.href))
    .filter((href) => !href.endsWith(".xml"));

  const paths = [
    ...pages,
    ...sampleProjects.map((project) => `/work/${project.slug}`),
    ...labExperiments.map((experiment) => `/labs/${experiment.slug}`),
    ...getAllPosts().map((post) => `/blog/${post.slug}`),
    ...getCategories().map((category) => `/blog/category/${category.slug}`),
  ];

  const urls = [...new Set(paths)]
    .map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`)
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
