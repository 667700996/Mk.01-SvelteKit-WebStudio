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
      // Every internal link is crawled at build time. A broken page link fails
      // the build; media referenced by content but not yet added only warns.
      handleHttpError: ({ path, referrer, message }) => {
        if (/^\/images\//.test(path)) {
          console.warn(`Missing media ${path} (referenced by ${referrer})`);
          return;
        }
        throw new Error(message);
      },
      handleMissingId: "fail",
    },
  },

  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
};

export default config;
