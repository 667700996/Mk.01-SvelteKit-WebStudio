import type { PageServerLoad } from "./$types";

import { loadProject } from "$content";
import { sampleProjects } from "$modules/work";
import { buildSeo } from "$lib/utils/seo";

export const load: PageServerLoad = () => {
  return {
    projects: sampleProjects.map((project) => {
      const content = loadProject(project.slug);
      return {
        ...project,
        headline: content?.hero.headline ?? project.summary,
        services: content?.services ?? [],
      };
    }),
    seo: buildSeo({
      title: "Selected systems — Case studies",
      description:
        "Selected MK.01 case studies across spatial identity, product narrative, motion systems, and creative technology.",
      path: "/work",
    }),
  };
};
