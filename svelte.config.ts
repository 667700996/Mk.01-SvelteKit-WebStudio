import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import type { Config } from "@sveltejs/kit";

const mdsvexConfig = {
  extensions: [".md", ".mdx"],
};

const config: Config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],

  kit: {
    adapter: adapter(),
    alias: {
      $modules: "src/modules",
      $config: "src/config",
      $content: "src/content",
    },
    prerender: {
      // Every internal link is crawled at build time; a broken one fails the build.
      handleHttpError: "fail",
      handleMissingId: "fail",
    },
  },

  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
};

export default config;
