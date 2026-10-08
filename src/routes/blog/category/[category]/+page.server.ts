import type { EntryGenerator, PageServerLoad } from "./$types";

import { error } from "@sveltejs/kit";

import { getAllPosts, getCategories } from "$lib/server/content";
import { buildSeo } from "$lib/utils/seo";

export const entries: EntryGenerator = () =>
  getCategories().map((category) => ({ category: category.slug }));

export const load: PageServerLoad = ({ params }) => {
  const slug = params.category.toLowerCase();
  const category = getCategories().find((entry) => entry.slug === slug);
  if (!category) error(404, `No entries in category: ${params.category}`);

  return {
    category,
    categories: getCategories(),
    posts: getAllPosts().filter((post) => post.category.toLowerCase() === slug),
    seo: buildSeo({
      title: `${category.name} — Journal`,
      description: `Entries filed under ${category.name} in the Mk.01 studio journal.`,
      path: `/blog/category/${category.slug}`,
    }),
  };
};
