import type { EntryGenerator, PageLoad } from "./$types";

import { error } from "@sveltejs/kit";

import { getExperiment } from "$content";
import { labExperiments } from "$modules/labs";
import { buildSeo } from "$lib/utils/seo";

export const entries: EntryGenerator = () =>
  labExperiments.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
  const index = labExperiments.findIndex((item) => item.slug === params.slug);
  const experiment = labExperiments[index];
  const content = getExperiment(params.slug);

  if (!experiment || !content) {
    error(404, `Experiment ${params.slug} not found`);
  }

  const count = labExperiments.length;

  return {
    experiment,
    index,
    count,
    previous: labExperiments[(index - 1 + count) % count],
    next: labExperiments[(index + 1) % count],
    seo: buildSeo({
      title: `${experiment.title} — Labs`,
      description: experiment.summary,
      path: `/labs/${experiment.slug}`,
      type: "article",
      tags: experiment.tech,
    }),
  };
};
