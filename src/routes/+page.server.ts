import type { PageServerLoad } from "./$types";

import { buildSeo } from "$lib/utils/seo";

export const load: PageServerLoad = async () => {
  return {
    seo: buildSeo({
      title: "Creative Technologist & Product Engineer",
      description:
        "MK.01 is a design engineering portfolio for expressive digital products, interactive systems, WebGL, and motion built with production-grade rigor.",
      path: "/",
      image: "/og.png",
    }),
  };
};
