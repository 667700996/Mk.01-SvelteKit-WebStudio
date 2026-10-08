import type { PageLoad } from "./$types";

import { studioTimeline, team } from "$modules/about";
import { buildSeo } from "$lib/utils/seo";

export const load: PageLoad = () => {
  return {
    team,
    timeline: studioTimeline,
    seo: buildSeo({
      title: "Team – Meet the Mk.01 constellation",
      description:
        "Meet the strategists, designers, and engineers behind Mk.01. Distributed team across Seoul, Busan, Tokyo, and global collaborators.",
      path: "/team",
    }),
  };
};
