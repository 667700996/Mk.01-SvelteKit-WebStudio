import type { EntryGenerator, PageServerLoad } from "./$types";

import { error } from "@sveltejs/kit";

import { getAllPosts, getPostBySlug, getRelatedPosts } from "$lib/server/content";
import { buildSeo } from "$lib/utils/seo";

export const entries: EntryGenerator = () =>
  getAllPosts().map((post) => ({ slug: post.slug }));

export const load: PageServerLoad = ({ params }) => {
  const post = getPostBySlug(params.slug);
  if (!post) error(404, `Could not find ${params.slug}`);

  return {
    post,
    related: getRelatedPosts(post),
    seo: buildSeo({
      title: post.title,
      description: post.description || "An entry from the Mk.01 studio journal.",
      path: `/blog/${post.slug}`,
      type: "article",
      tags: post.tags,
      publishedTime: post.date || null,
    }),
  };
};
