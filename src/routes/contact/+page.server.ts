import { fail } from "@sveltejs/kit";

import { siteConfig } from "$lib/config/site";
import { buildSeo } from "$lib/utils/seo";
import { composeMailto, readValues, validate } from "./form";
import type { Actions, PageServerLoad } from "./$types";

// Form actions need a server; this route is rendered on demand.
export const prerender = false;

export const load: PageServerLoad = () => ({
  seo: buildSeo({
    title: "Contact Mk.01 Studio",
    description:
      "Share your project vision and collaborate with Mk.01 Studio on experiential web design and development.",
    path: "/contact",
  }),
});

export const actions: Actions = {
  default: async ({ request }) => {
    const values = readValues(await request.formData());
    const errors = validate(values);

    if (Object.keys(errors).length > 0) {
      return fail(400, { values, errors });
    }

    // There is no mail service behind this site. Rather than pretend, hand the
    // visitor a fully composed message to send from their own mail client.
    return {
      ready: true as const,
      values,
      mailto: composeMailto(siteConfig.contactEmail, values),
    };
  },
};
