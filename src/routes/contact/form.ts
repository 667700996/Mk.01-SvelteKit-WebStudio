export const projectTypes = [
  "Product experience overhaul",
  "Cinematic launch website",
  "Design system + component library",
  "Labs collaboration",
] as const;

export type ContactField = "name" | "email" | "projectType" | "brief";
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const BRIEF_MIN = 20;
export const BRIEF_MAX = 4000;

export function readValues(data: FormData): ContactValues {
  const get = (key: ContactField) => String(data.get(key) ?? "").trim();
  return {
    name: get("name"),
    email: get("email"),
    projectType: get("projectType"),
    brief: get("brief"),
  };
}

/** Shared by the server action; every message is written for a human. */
export function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  if (!values.name) errors.name = "Tell us who we’re talking to.";
  else if (values.name.length > 120) errors.name = "Keep the name under 120 characters.";

  if (!values.email) errors.email = "Add an email so we can reply.";
  else if (!EMAIL.test(values.email)) errors.email = "That email doesn’t look complete — check for typos.";

  if (!projectTypes.includes(values.projectType as (typeof projectTypes)[number]))
    errors.projectType = "Choose the closest project type.";

  if (values.brief.length < BRIEF_MIN)
    errors.brief = `A sentence or two helps — at least ${BRIEF_MIN} characters.`;
  else if (values.brief.length > BRIEF_MAX)
    errors.brief = `Keep the brief under ${BRIEF_MAX} characters; we can go deeper on a call.`;

  return errors;
}

export function composeMailto(to: string, values: ContactValues) {
  const subject = `${values.projectType} — ${values.name}`;
  const body = [
    "Hi Mk.01,",
    "",
    values.brief,
    "",
    "—",
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Project type: ${values.projectType}`,
  ].join("\n");

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
