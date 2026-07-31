import { buildSeo } from "$lib/utils/seo";

export const load = () => {
  return {
    seo: buildSeo({
      title: "Profile — Creative developer and designer",
      description:
        "The profile, principles, and working range behind MK.01 — a hybrid creative developer and designer based in Seoul.",
      path: "/about",
      image: "/og.png",
    }),
  };
};
