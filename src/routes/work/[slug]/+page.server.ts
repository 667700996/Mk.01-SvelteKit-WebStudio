import type { PageServerLoad } from "./$types";

import { error } from "@sveltejs/kit";

import { loadProject } from "$content";
import { sampleProjects } from "$modules/work";
import { buildSeo } from "$lib/utils/seo";

export const load: PageServerLoad = ({ params }) => {
  const project = sampleProjects.find((item) => item.slug === params.slug);
  const content = loadProject(params.slug);

  if (!project || !content) {
    throw error(404, `Project not found: ${params.slug}`);
  }

  const related = sampleProjects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 2);

  return {
    project: { ...project, content },
    related,
    seo: buildSeo({
      title: `${project.title} — Case study`,
      description: project.summary,
      path: `/work/${project.slug}`,
      image: "/og.png",
      type: "article",
      tags: project.tags,
    }),
  };
};
