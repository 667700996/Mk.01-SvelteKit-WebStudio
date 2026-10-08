import { VERSION as kitVersion } from "@sveltejs/kit";
import { VERSION as svelteVersion } from "svelte/compiler";

import pkg from "../../../package.json";
import { buildSeo } from "$lib/utils/seo";

// Facts about the build, read from source at prerender time — never typed by hand.
export const load = () => {
  const runtime = Object.keys((pkg as { dependencies?: Record<string, string> }).dependencies ?? {});
  const routes = Object.keys(import.meta.glob("/src/routes/**/+page.svelte"));

  return {
    build: {
      svelte: svelteVersion,
      kit: kitVersion,
      runtimeDependencies: runtime.length,
      routes: routes.length,
      builtAt: new Date().toISOString(),
    },
    seo: buildSeo({
      title: "Colophon — How this site is built",
      description:
        "The system behind MK.01, with performance measured live in your browser: Web Vitals, contrast ratios, the fluid type scale, and the grid.",
      path: "/colophon",
    }),
  };
};
