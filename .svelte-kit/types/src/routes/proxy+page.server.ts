// @ts-nocheck
import type { PageServerLoad } from "./$types";

import { appConfig } from "$config/app.config";
import { loadLandingExperience } from "$modules/landing";
import { sampleProjects } from "$modules/work";
import { getRecentPosts } from "$lib/server/content";
import { buildSeo } from "$lib/utils/seo";

export const load = async () => {
  const [landing, posts] = await Promise.all([
    loadLandingExperience(),
    getRecentPosts(3),
  ]);

  return {
    identity: landing.identity,
    metrics: landing.metrics,
    showcases: landing.showcases,
    projects: sampleProjects.slice(0, 6),
    posts,
    seo: buildSeo({
      title: "Digital matter, engineered",
      description:
        "Mk.01 is an independent creative technology studio crafting digital flagships, interactive systems, and WebGL experiences for ambitious brands.",
      path: "/",
      image: "/og.png",
    }),
  };
};
;null as any as PageServerLoad;