export const siteConfig = {
  name: "MK.01 — Creative Technology Studio",
  shortName: "MK.01",
  description:
    "An independent creative technology studio building digital flagships, interactive systems, and WebGL experiences.",
  url: {
    origin: "https://mk1.studio",
    basePath: "",
  },
  keywords: [
    "creative technology studio",
    "interactive design",
    "WebGL studio",
    "SvelteKit",
    "creative technology",
    "digital storytelling",
  ],
  social: {
    twitter: "mk1studio",
    github: "mk1-lab",
    dribbble: "mk1studio",
    linkedin: "company/mk1-studio",
  },
  contactEmail: "studio@mk1.dev",
  language: "en",
  locale: "en_US",
};

export function absoluteUrl(path = "/") {
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url.origin}${siteConfig.url.basePath}${trimmed}`;
}
