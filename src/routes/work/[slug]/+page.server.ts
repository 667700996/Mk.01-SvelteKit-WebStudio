import type { EntryGenerator, PageServerLoad } from "./$types";

import { error } from "@sveltejs/kit";

import { loadProject } from "$content";
import { sampleProjects } from "$modules/work";
import { buildSeo } from "$lib/utils/seo";

export const entries: EntryGenerator = () =>
  sampleProjects.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
  const index = sampleProjects.findIndex((item) => item.slug === params.slug);
  const project = sampleProjects[index];
  const content = loadProject(params.slug);

  if (!project || !content) {
    error(404, `Project not found: ${params.slug}`);
  }

  const next = sampleProjects[(index + 1) % sampleProjects.length];

  return {
    project: { ...project, content },
    index,
    next,
    seo: buildSeo({
      title: `${project.title} — Case study`,
      description: project.summary,
      path: `/work/${project.slug}`,
      type: "article",
      tags: project.tags,
    }),
  };
};
