// @ts-nocheck
import type { PageServerLoad } from "./$types";

import { loadProject } from "$content";
import { labExperiments } from "$modules/labs";
import { sampleProjects } from "$modules/work";
import { buildSeo } from "$lib/utils/seo";

export const load = () => {
  const enrichedProjects = sampleProjects.map((project) => ({
    ...project,
    content: loadProject(project.slug),
  }));

  return {
    projects: enrichedProjects,
    labs: labExperiments.slice(0, 3),
    seo: buildSeo({
      title: "Selected systems — Case studies",
      description:
        "Selected MK.01 case studies across spatial identity, product narrative, motion systems, and creative technology.",
      path: "/work",
      image: "/og.png",
    }),
  };
};
;null as any as PageServerLoad;