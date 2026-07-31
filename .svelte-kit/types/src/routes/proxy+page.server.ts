// @ts-nocheck
import type { PageServerLoad } from "./$types";

import { buildSeo } from "$lib/utils/seo";

export const load = async () => {
  return {
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