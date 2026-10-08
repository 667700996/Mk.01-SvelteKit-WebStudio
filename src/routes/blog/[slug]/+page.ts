import type { Component } from "svelte";
import type { PageLoad } from "./$types";

import { error } from "@sveltejs/kit";

// Lazily resolve the rendered body from either collection. The server load
// supplies metadata; this universal load adds the component, which cannot be
// serialised across the server boundary.
const bodies = {
  ...import.meta.glob<{ default: Component }>("/src/posts/*.md"),
  ...import.meta.glob<{ default: Component }>("/src/content/articles/*.mdx"),
};

export const load: PageLoad = async ({ data, params }) => {
  const resolve =
    bodies[`/src/posts/${params.slug}.md`] ?? bodies[`/src/content/articles/${params.slug}.mdx`];
  if (!resolve) error(404, `Could not find ${params.slug}`);

  const { default: Body } = await resolve();
  return { ...data, Body };
};
