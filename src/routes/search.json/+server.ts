import { json } from "@sveltejs/kit";

import { paletteNav } from "$config/navigation.config";
import { labExperiments } from "$modules/labs";
import { sampleProjects } from "$modules/work";
import { getAllPosts } from "$lib/server/content";
import type { SearchEntry } from "$lib/utils/search";

export const prerender = true;

/** A static index the command palette fetches once, on first open. */
export function GET() {
  const entries: SearchEntry[] = [
    ...paletteNav.map((link) => ({
      id: `page:${link.href}`,
      group: "Pages" as const,
      label: link.label,
      description: link.description,
      href: link.href,
    })),
    ...sampleProjects.map((project) => ({
      id: `work:${project.slug}`,
      group: "Work" as const,
      label: project.title,
      description: project.summary,
      href: `/work/${project.slug}`,
      keywords: [...project.tags, project.industry],
    })),
    ...labExperiments.map((experiment) => ({
      id: `lab:${experiment.slug}`,
      group: "Labs" as const,
      label: experiment.title,
      description: experiment.summary,
      href: `/labs/${experiment.slug}`,
      keywords: experiment.tech,
    })),
    ...getAllPosts().map((post) => ({
      id: `post:${post.slug}`,
      group: "Journal" as const,
      label: post.title,
      description: post.description,
      href: `/blog/${post.slug}`,
      keywords: [...post.tags, post.category],
    })),
  ];

  return json(entries);
}
