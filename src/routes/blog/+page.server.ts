import type { PageServerLoad } from "./$types";

import { getAllPosts, getCategories } from "$lib/server/content";
import { buildSeo } from "$lib/utils/seo";

// Reads search params, so it renders per request rather than at build time.
export const prerender = false;

const PAGE_SIZE = 6;

export const load: PageServerLoad = ({ url }) => {
  const search = url.searchParams.get("search")?.trim() ?? "";
  const category = url.searchParams.get("category")?.trim().toLowerCase() ?? "";
  const tag = url.searchParams.get("tag")?.trim().toLowerCase() ?? "";
  const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);

  const needle = search.toLowerCase();
  const filtered = getAllPosts().filter((post) => {
    const haystack = `${post.title} ${post.description} ${post.category} ${post.tags.join(" ")}`.toLowerCase();
    return (
      (!needle || haystack.includes(needle)) &&
      (!category || post.category.toLowerCase() === category) &&
      (!tag || post.tags.some((entry) => entry.toLowerCase() === tag))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageNumber = Number.isNaN(requestedPage)
    ? 1
    : Math.min(Math.max(requestedPage, 1), totalPages);

  return {
    posts: filtered.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE),
    total: filtered.length,
    pageNumber,
    totalPages,
    search,
    category,
    tag,
    categories: getCategories(),
    seo: buildSeo({
      title: "Journal — insights, experiments, and studio process",
      description:
        "Read the latest writing from Mk.01: design systems strategy, product storytelling, and explorations from the studio lab.",
      path: "/blog",
      noindex: Boolean(search || category || tag || pageNumber > 1),
    }),
  };
};
